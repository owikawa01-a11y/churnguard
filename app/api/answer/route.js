// ═══════════════════════════════════════════════════════════
//  ChurnGuard API - Answer Route
//  Saves the visitor's answer to the AI follow-up question
// ═══════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';
import { answerRatelimit, getClientIP } from '../../../lib/ratelimit';

// ─── Environment Variables ────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('[ChurnGuard][answer] Missing Supabase environment variables');
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
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_ANSWER_LENGTH = 1000;

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
  const { success, limit, remaining, reset } = await answerRatelimit.limit(ip);

  if (!success) {
    console.warn(`[ChurnGuard][answer] Rate limit hit | IP: ${ip}`);
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
      return errorResponse('Server configuration error', 500, 'CONFIG_ERROR');
    }

    // ─── 3. Parse JSON Body ─────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse('Invalid JSON body', 400, 'INVALID_JSON');
    }

    const { event_id, answer } = body;

    // ─── 4. Validate event_id (required) ────────────────
    if (!event_id || typeof event_id !== 'string') {
      return errorResponse('Missing or invalid event_id', 400, 'INVALID_EVENT_ID');
    }

    if (!UUID_REGEX.test(event_id)) {
      return errorResponse('Invalid event_id format', 400, 'INVALID_EVENT_ID');
    }

    // ─── 5. Sanitize Answer (optional) ──────────────────
    const cleanAnswer =
      answer && typeof answer === 'string'
        ? sanitizeInput(answer, MAX_ANSWER_LENGTH)
        : null;

    // ─── 6. Update Event in Database ────────────────────
    const { data: updated, error: updateError } = await supabase
      .from('cancellation_events')
      .update({ follow_up_answer: cleanAnswer })
      .eq('id', event_id)
      .select('id')
      .single();

    if (updateError) {
      console.error('[ChurnGuard][answer] DB update error:', updateError.message);
      return errorResponse('Could not save answer', 500, 'DB_ERROR');
    }

    if (!updated) {
      return errorResponse('Event not found', 404, 'EVENT_NOT_FOUND');
    }

    // ─── 7. Success Response ────────────────────────────
    const duration = Date.now() - startTime;
    console.log(
      `[ChurnGuard][answer] ✓ Answer saved | Event: ${event_id.slice(0, 8)}... | hasAnswer: ${!!cleanAnswer} | ${duration}ms`
    );

    return jsonResponse({
      success: true,
      event_id: updated.id,
      has_answer: cleanAnswer !== null,
    });
  } catch (err) {
    console.error('[ChurnGuard][answer] Unexpected error:', err);
    return errorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}

// ═══════════════════════════════════════════════════════════
//  Utilities
// ═══════════════════════════════════════════════════════════

/**
 * Removes control characters and HTML brackets from input.
 * Returns null if the cleaned text is empty.
 */
function sanitizeInput(text, maxLength) {
  if (typeof text !== 'string') return null;
  const cleaned = text
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
  return cleaned.length > 0 ? cleaned : null;
}