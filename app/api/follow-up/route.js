// ═══════════════════════════════════════════════════════════
//  ChurnGuard API - Follow-up Route
//  Generates AI follow-up question using Groq (Llama 3.3)
// ═══════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';
import { followUpRatelimit, getClientIP } from '../../../lib/ratelimit';

// ─── Environment Variables ────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Validate env vars at startup (helps catch config issues)
const envCheck = {
  hasSupabaseUrl: !!SUPABASE_URL,
  hasServiceKey: !!SUPABASE_SERVICE_KEY,
  hasGroqKey: !!GROQ_API_KEY,
};

if (!Object.values(envCheck).every(Boolean)) {
  console.error('[ChurnGuard][follow-up] Missing environment variables:', envCheck);
}

// ─── Supabase Client (Service Role) ───────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ─── CORS Headers ─────────────────────────────────────────
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ─── Response Helpers ─────────────────────────────────────
const jsonResponse = (data, status = 200, extraHeaders = {}) =>
  Response.json(data, {
    status,
    headers: { ...CORS_HEADERS, ...extraHeaders },
  });

const errorResponse = (message, status = 500, code = 'ERROR') =>
  jsonResponse({ success: false, error: message, code }, status);

// ─── Constants ────────────────────────────────────────────
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_TIMEOUT_MS = 5000;
const MAX_REASON_LENGTH = 500;
const MAX_PUBLIC_KEY_LENGTH = 100;

// ═══════════════════════════════════════════════════════════
//  OPTIONS Handler (CORS Preflight)
// ═══════════════════════════════════════════════════════════
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// ═══════════════════════════════════════════════════════════
//  POST Handler
// ═══════════════════════════════════════════════════════════
export async function POST(request) {
  const startTime = Date.now();

  // ─── 1. Rate Limiting ─────────────────────────────────
  const ip = getClientIP(request);
  const { success, limit, remaining, reset } = await followUpRatelimit.limit(ip);

  if (!success) {
    console.warn(`[ChurnGuard][follow-up] Rate limit hit | IP: ${ip}`);
    return jsonResponse(
      {
        success: false,
        error: 'Too many requests. Please try again in a few seconds.',
        code: 'RATE_LIMITED',
      },
      429,
      {
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset': String(reset),
      }
    );
  }

  try {
    // ─── 2. Env Check ───────────────────────────────────
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.error('[ChurnGuard][follow-up] Missing Supabase env vars');
      return errorResponse('Server configuration error', 500, 'CONFIG_ERROR');
    }

    // ─── 3. Parse JSON Body ─────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse('Invalid JSON body', 400, 'INVALID_JSON');
    }

    const { public_key, reason } = body;

    // ─── 4. Input Validation ────────────────────────────
    if (!public_key || typeof public_key !== 'string') {
      return errorResponse('Missing or invalid public_key', 400, 'INVALID_KEY');
    }

    if (!reason || typeof reason !== 'string' || reason.trim().length < 2) {
      return errorResponse('Missing or invalid reason', 400, 'INVALID_REASON');
    }

    // ─── 5. Sanitize Inputs ─────────────────────────────
    const cleanReason = sanitizeInput(reason, MAX_REASON_LENGTH);
    const cleanPublicKey = public_key.trim().slice(0, MAX_PUBLIC_KEY_LENGTH);

    // ─── 6. Lookup Widget by Public Key ─────────────────
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('id')
      .eq('public_key', cleanPublicKey)
      .single();

    if (widgetError || !widget) {
      console.warn(
        `[ChurnGuard][follow-up] Widget not found | Key: ${cleanPublicKey.slice(0, 8)}...`
      );
      return errorResponse('Invalid widget key', 404, 'WIDGET_NOT_FOUND');
    }

    // ─── 7. Generate AI Follow-up Question ──────────────
    const { question, source } = await generateFollowUpQuestion(cleanReason);

    // ─── 8. Save Event to Database ──────────────────────
    const { data: event, error: insertError } = await supabase
      .from('cancellation_events')
      .insert({
        widget_id: widget.id,
        initial_reason: cleanReason,
        ai_follow_up_question: question,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('[ChurnGuard][follow-up] DB insert error:', insertError.message);
      return errorResponse('Could not save event', 500, 'DB_ERROR');
    }

    // ─── 9. Success Response ────────────────────────────
    const duration = Date.now() - startTime;
    console.log(
      `[ChurnGuard][follow-up] ✓ Event ${event.id.slice(0, 8)}... | AI: ${source} | ${duration}ms`
    );

    return jsonResponse({
      success: true,
      event_id: event.id,
      question,
      source,
    });
  } catch (err) {
    console.error('[ChurnGuard][follow-up] Unexpected error:', err);
    return errorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}

// ═══════════════════════════════════════════════════════════
//  AI Generation
// ═══════════════════════════════════════════════════════════

/**
 * Generates a follow-up question via Groq (Llama 3.3).
 * Falls back to keyword-based question if AI fails.
 */
async function generateFollowUpQuestion(reason) {
  const fallback = getFallbackQuestion(reason);

  if (!GROQ_API_KEY) {
    console.warn('[ChurnGuard][follow-up] GROQ_API_KEY missing, using fallback');
    return { question: fallback, source: 'fallback' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: GROQ_MODEL,
        max_tokens: 80,
        temperature: 0.6,
        messages: [
          {
            role: 'system',
            content: buildSystemPrompt(),
          },
          {
            role: 'user',
            content: `Customer cancellation reason: "${reason}". Write one follow-up question.`,
          },
        ],
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(
        `[ChurnGuard][follow-up] Groq error | Status: ${response.status}`
      );
      return { question: fallback, source: 'fallback' };
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content?.trim();

    // Validate the AI response is reasonable
    if (isValidQuestion(text)) {
      return { question: text, source: 'groq' };
    }

    console.warn('[ChurnGuard][follow-up] AI response invalid, using fallback');
    return { question: fallback, source: 'fallback' };
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn('[ChurnGuard][follow-up] Groq timeout, using fallback');
    } else {
      console.error('[ChurnGuard][follow-up] Groq failed:', err.message);
    }
    return { question: fallback, source: 'fallback' };
  }
}

/**
 * Validates that the AI-generated text looks like a real question.
 */
function isValidQuestion(text) {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (trimmed.length < 5 || trimmed.length > 200) return false;
  // Reject if it contains prefixes like "Question:" or wraps in quotes
  if (/^(question|q)[\s:]/i.test(trimmed)) return false;
  return true;
}

// ═══════════════════════════════════════════════════════════
//  Utilities
// ═══════════════════════════════════════════════════════════

/**
 * Removes control characters and HTML brackets from input.
 */
function sanitizeInput(text, maxLength) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * System prompt for the AI.
 */
function buildSystemPrompt() {
  return `You are a UX researcher helping SaaS companies understand churn.
Write ONE short, warm, specific follow-up question.
Rules:
- Maximum 20 words
- No quotes, no prefixes, no explanations
- Reply with ONLY the question text
- Be empathetic and specific to their reason
- Never mention that you are an AI`;
}

/**
 * Keyword-based fallback question (used when AI fails).
 */
function getFallbackQuestion(reason) {
  const r = reason.toLowerCase();

  if (/(price|expensive|cost|pay|money|budget|afford)/.test(r)) {
    return 'What price would have felt fair to you?';
  }
  if (/(feature|missing|need|want|lack|require)/.test(r)) {
    return 'What feature were you hoping we had?';
  }
  if (/(competitor|switch|another|alternative|other tool|better)/.test(r)) {
    return 'What is the other tool doing better?';
  }
  if (/(use|need|time|busy|changed|not enough)/.test(r)) {
    return 'What changed about your needs recently?';
  }
  if (/(bug|error|broken|slow|crash|issue|problem)/.test(r)) {
    return 'What issue were you experiencing exactly?';
  }
  if (/(support|help|service|response|contact)/.test(r)) {
    return 'How could our support have helped you better?';
  }
  if (/(complex|difficult|confusing|hard|complicate)/.test(r)) {
    return 'Which part felt most complicated to use?';
  }
  return 'Anything else that would help us understand your decision?';
}