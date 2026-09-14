// ===========================================
//  ChurnGuard API - Follow-up Route
//  Generates AI follow-up question using Groq
// ===========================================

import { createClient } from '@supabase/supabase-js';
import { followUpRatelimit, getClientIP } from '../../../lib/ratelimit';

// --- Environment Variables ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('[ChurnGuard][follow-up] Missing Supabase env vars');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// --- CORS Headers ---
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// --- Response Helpers ---
const jsonResponse = (data, status = 200, extra = {}) =>
  Response.json(data, { status, headers: { ...CORS_HEADERS, ...extra } });

const errorResponse = (message, status = 500, code = 'ERROR') =>
  jsonResponse({ success: false, error: message, code }, status);

// --- Constants ---
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'openai/gpt-oss-120b';
const GROQ_TIMEOUT_MS = 5000;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// --- System Prompt (Improved) ---
function buildSystemPrompt() {
  return [
    'You are an expert Retention Strategist and UX Researcher specializing in customer churn prevention.',
    'Your goal is to design a psychological framework that uncovers the "why" behind user behavior to drive long-term loyalty.',
    '',
    'CRITICAL RULES:',
    '- Reply with ONLY one question (a single sentence ending with ?).',
    '- NEVER invent offers, discounts, or promises beyond what you are given.',
    '- NEVER use manipulative language, fake urgency, or guilt.',
    '- The question must be empathetic, specific, and non-judgmental.',
    '- The question must uncover the DEEPER, emotional need behind the surface reason.',
    '- Keep it under 20 words.',
    '',
    'EXAMPLES OF GOOD QUESTIONS:',
    '- Reason: "Too expensive" -> "We understand. What price would have felt fair for the value you received?"',
    '- Reason: "Missing a feature" -> "Thank you for the feedback. What specific feature would have made this a must-have for you?"',
    '- Reason: "Switching to another tool" -> "We appreciate your honesty. What is the other tool doing better that we missed?"',
    '- Reason: "Don\'t use it enough" -> "We hear you. What changed about your needs that made this less useful?"',
  ].join('\n');
}

// ===========================================
//  OPTIONS Handler
// ===========================================
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// ===========================================
//  POST Handler
// ===========================================
export async function POST(request) {
  const startTime = Date.now();

  // --- Rate Limiting ---
  const ip = getClientIP(request);
  const { success, limit, remaining, reset } = await followUpRatelimit.limit(ip);

  if (!success) {
    console.warn('[ChurnGuard][follow-up] Rate limit hit | IP:', ip);
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
    // --- Env Check ---
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return errorResponse('Server configuration error', 500, 'CONFIG_ERROR');
    }

    // --- Parse Body ---
    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse('Invalid JSON body', 400, 'INVALID_JSON');
    }

    const { public_key, reason, customer_email } = body;

    // --- Validate Input ---
    if (!public_key || typeof public_key !== 'string') {
      return errorResponse('Missing or invalid public_key', 400, 'INVALID_KEY');
    }

    if (!reason || typeof reason !== 'string' || reason.trim().length < 2) {
      return errorResponse('Missing or invalid reason', 400, 'INVALID_REASON');
    }

    // --- Sanitize ---
    const cleanReason = sanitizeInput(reason, 500);
    const cleanPublicKey = public_key.trim().slice(0, 100);
    const cleanEmail = customer_email && typeof customer_email === 'string'
      ? customer_email.trim().slice(0, 200)
      : null;

    // --- Find Widget ---
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('id')
      .eq('public_key', cleanPublicKey)
      .single();

    if (widgetError || !widget) {
      console.warn('[ChurnGuard][follow-up] Widget not found | Key:', cleanPublicKey.slice(0, 8) + '...');
      return errorResponse('Invalid widget key', 404, 'WIDGET_NOT_FOUND');
    }

    // --- Generate AI Question ---
    let followUpQuestion = getFallbackQuestion(cleanReason);
    let aiSource = 'fallback';

    if (GROQ_API_KEY) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

        const userContent =
          'A customer is cancelling their subscription.' +
          '\nStated reason: "' + cleanReason + '".' +
          '\n\nWrite ONE short, empathetic, and specific follow-up question (under 20 words) that:' +
          '\n1. Shows you care about their experience.' +
          '\n2. Uncovers the deeper, emotional need behind their surface reason.' +
          '\n3. Makes them feel heard, not interrogated.' +
          '\n4. Helps the company improve for future customers.' +
          '\n\nReply with ONLY the question text, no quotes, no prefixes.';

        const groqRes = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + GROQ_API_KEY,
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: GROQ_MODEL,
            max_tokens: 100,
            temperature: 0.6,
            messages: [
              { role: 'system', content: buildSystemPrompt() },
              { role: 'user', content: userContent },
            ],
          }),
        });

        clearTimeout(timeoutId);

        if (groqRes.ok) {
          const data = await groqRes.json();
          const text = data?.choices?.[0]?.message?.content?.trim();
          if (isValidQuestion(text)) {
            followUpQuestion = text;
            aiSource = 'groq';
          }
        } else {
          console.error('[ChurnGuard][follow-up] Groq error | Status:', groqRes.status);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          console.warn('[ChurnGuard][follow-up] Groq timeout, using fallback');
        } else {
          console.error('[ChurnGuard][follow-up] Groq failed:', err.message);
        }
      }
    } else {
      console.warn('[ChurnGuard][follow-up] GROQ_API_KEY missing, using fallback');
    }

    // --- Save Event ---
    const { data: event, error: insertError } = await supabase
      .from('cancellation_events')
      .insert({
        widget_id: widget.id,
        customer_email: cleanEmail,
        initial_reason: cleanReason,
        ai_follow_up_question: followUpQuestion,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('[ChurnGuard][follow-up] DB insert error:', insertError.message);
      return errorResponse('Could not save event', 500, 'DB_ERROR');
    }

    // --- Success ---
    const duration = Date.now() - startTime;
    console.log('[ChurnGuard][follow-up] OK | AI:', aiSource, '|', duration + 'ms');

    return jsonResponse({
      success: true,
      event_id: event.id,
      question: followUpQuestion,
      source: aiSource,
    });
  } catch (err) {
    console.error('[ChurnGuard][follow-up] Unexpected error:', err);
    return errorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}

// ===========================================
//  Utilities
// ===========================================

function sanitizeInput(text, maxLength) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}

function isValidQuestion(text) {
  if (!text || typeof text !== 'string') return false;
  const t = text.trim();
  if (t.length < 5 || t.length > 200) return false;
  if (/^(question|q)[\s:]/i.test(t)) return false;
  if (/^["'].*["']$/.test(t)) return false;
  return true;
}

function getFallbackQuestion(reason) {
  const r = String(reason).toLowerCase();
  if (/(expensive|price|cost|pay|money|budget|afford)/.test(r)) {
    return 'What price would have felt fair for the value you received?';
  }
  if (/(feature|missing|need|want|lack|require)/.test(r)) {
    return 'What specific feature would have made this a must-have for you?';
  }
  if (/(competitor|switch|another|alternative|other tool|better)/.test(r)) {
    return 'What is the other tool doing better that we missed?';
  }
  if (/(use|need|time|busy|changed|not enough)/.test(r)) {
    return 'What changed about your needs that made this less useful?';
  }
  if (/(bug|error|broken|slow|crash|issue|problem)/.test(r)) {
    return 'What specific issue did you experience that we should fix?';
  }
  if (/(support|help|service|response|contact)/.test(r)) {
    return 'How could our support have helped you better?';
  }
  if (/(complex|difficult|confusing|hard|complicate)/.test(r)) {
    return 'Which part of the product felt most complicated to use?';
  }
  return 'What could we have done differently to keep you with us?';
}