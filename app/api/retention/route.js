// ===========================================
//  ChurnGuard API - Retention Route
//  Generates ONE retention offer (California ARA compliant)
//  AI only phrases the offer - never invents terms
// ===========================================

import { createClient } from '@supabase/supabase-js';
import { retentionRatelimit, getClientIP } from '../../../lib/ratelimit';

// --- Environment Variables ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('[ChurnGuard][retention] Missing Supabase env vars');
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
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_TIMEOUT_MS = 5000;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// --- Fixed Offer Terms (founder controls, AI phrases) ---
function getOfferForReason(reason) {
  const r = String(reason).toLowerCase();

  if (/(expensive|price|cost|pay|money|budget|afford)/.test(r)) {
    return { type: 'discount', terms: '20% off for the next 3 months' };
  }
  if (/(feature|missing|need|want|lack|require)/.test(r)) {
    return {
      type: 'discount',
      terms: "15% off for 1 month, and we'll personally notify you when the feature ships",
    };
  }
  if (/(competitor|switch|another|alternative|other tool|better)/.test(r)) {
    return { type: 'discount', terms: '30% off for the next 3 months' };
  }
  if (/(use|need|time|busy|changed|not enough)/.test(r)) {
    return {
      type: 'pause',
      terms: 'a free 2-month pause instead of cancelling - resume anytime',
    };
  }
  if (/(complex|difficult|confusing|hard|complicate)/.test(r)) {
    return {
      type: 'discount',
      terms: '20% off for 2 months, and a 15-minute onboarding call with our team',
    };
  }
  return { type: 'discount', terms: '15% off for the next 2 months' };
}

// --- System Prompt ---
function buildSystemPrompt() {
  return [
    'You are a warm, honest customer retention specialist writing for a SaaS product.',
    'CRITICAL RULES:',
    '- Reply with ONLY one sentence.',
    '- NEVER invent offers, discounts, or promises beyond what you are given.',
    '- NEVER use manipulative language, fake urgency, or guilt.',
    '- Be empathetic and human.',
    '- Keep it under 40 words.',
  ].join(' ');
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
  const { success, limit, remaining, reset } = await retentionRatelimit.limit(ip);

  if (!success) {
    console.warn('[ChurnGuard][retention] Rate limit hit | IP:', ip);
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

    const { event_id, reason, follow_up_answer } = body;

    // --- Validate Input ---
    if (!event_id || typeof event_id !== 'string' || !UUID_REGEX.test(event_id)) {
      return errorResponse('Missing or invalid event_id', 400, 'INVALID_EVENT_ID');
    }

    if (!reason || typeof reason !== 'string') {
      return errorResponse('Missing or invalid reason', 400, 'INVALID_REASON');
    }

    // --- Get Fixed Offer ---
    const offer = getOfferForReason(reason);
    let offerCopy = "We'd like to offer you " + offer.terms + '.';

    // --- AI Phrases It (with fallback) ---
    let aiSource = 'fallback';

    if (GROQ_API_KEY) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

        const userContent =
          'A customer is cancelling. Their reason: "' + reason + '".' +
          (follow_up_answer ? ' They also said: "' + follow_up_answer + '".' : '') +
          '\n\nWrite ONE warm, human sentence offering them exactly this, and nothing more: "' +
          offer.terms + '". ' +
          'Do not invent any other offer or promise anything beyond this. ' +
          'Reply with ONLY the sentence, no quotes, no prefix.';

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
            temperature: 0.5,
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
          if (isValidOfferCopy(text)) {
            offerCopy = text;
            aiSource = 'groq';
          }
        } else {
          console.error('[ChurnGuard][retention] Groq error status:', groqRes.status);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          console.warn('[ChurnGuard][retention] Groq timeout, using default copy');
        } else {
          console.error('[ChurnGuard][retention] Groq failed:', err.message);
        }
      }
    }

    // --- Save Offer Shown ---
    const { error: updateError } = await supabase
      .from('cancellation_events')
      .update({ offer_shown: offer.terms })
      .eq('id', event_id);

    if (updateError) {
      console.error('[ChurnGuard][retention] DB update error:', updateError.message);
    }

    // --- Success ---
    const duration = Date.now() - startTime;
    console.log(
      '[ChurnGuard][retention] OK | type=' + offer.type + ' | ai=' + aiSource + ' | ' + duration + 'ms'
    );

    return jsonResponse({
      success: true,
      offer: offerCopy,
      offer_type: offer.type,
      offer_terms: offer.terms,
    });
  } catch (err) {
    console.error('[ChurnGuard][retention] Unexpected error:', err);
    return errorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}

// ===========================================
//  Utilities
// ===========================================

function isValidOfferCopy(text) {
  if (!text || typeof text !== 'string') return false;
  const t = text.trim();
  if (t.length < 10 || t.length > 300) return false;
  if (/^(offer|copy|sentence)[\s:]/i.test(t)) return false;
  if (/^["'].*["']$/.test(t)) return false;
  return true;
}