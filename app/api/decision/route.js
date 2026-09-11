// ===========================================
//  ChurnGuard API - Decision Route
//  Records the customer's final decision (accepted/declined)
// ===========================================

import { createClient } from '@supabase/supabase-js';
import { decisionRatelimit, getClientIP } from '../../../lib/ratelimit';

// --- Environment Variables ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('[ChurnGuard][decision] Missing Supabase env vars');
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
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
  const { success, limit, remaining, reset } = await decisionRatelimit.limit(ip);

  if (!success) {
    console.warn('[ChurnGuard][decision] Rate limit hit | IP:', ip);
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

    const { event_id, accepted, customer_mrr } = body;

    // --- Validate event_id ---
    if (!event_id || typeof event_id !== 'string' || !UUID_REGEX.test(event_id)) {
      return errorResponse('Missing or invalid event_id', 400, 'INVALID_EVENT_ID');
    }

    // --- Validate accepted ---
    if (typeof accepted !== 'boolean') {
      return errorResponse('accepted must be a boolean', 400, 'INVALID_ACCEPTED');
    }

    // --- Build Update Payload ---
    const updatePayload = {
      offer_accepted: accepted,
      final_action: accepted ? 'stayed' : 'cancelled',
    };

    // --- Optional: customer_mrr ---
    if (customer_mrr != null) {
      const mrrNum = Number(customer_mrr);
      if (!isNaN(mrrNum) && mrrNum >= 0) {
        updatePayload.customer_mrr = mrrNum;
      }
    }

    // --- Update Database ---
    const { data: updated, error: updateError } = await supabase
      .from('cancellation_events')
      .update(updatePayload)
      .eq('id', event_id)
      .select('id')
      .single();

    if (updateError) {
      console.error('[ChurnGuard][decision] DB error:', updateError.message);
      return errorResponse('Could not save decision', 500, 'DB_ERROR');
    }

    if (!updated) {
      return errorResponse('Event not found', 404, 'EVENT_NOT_FOUND');
    }

    // --- Success ---
    const duration = Date.now() - startTime;
    const decisionLabel = accepted ? 'Accepted' : 'Declined';
    console.log(
      '[ChurnGuard][decision] OK | ' + decisionLabel + ' | id=' + event_id.slice(0, 8) + ' | ' + duration + 'ms'
    );

    return jsonResponse({
      success: true,
      event_id: updated.id,
      final_action: updatePayload.final_action,
    });
  } catch (err) {
    console.error('[ChurnGuard][decision] Unexpected error:', err);
    return errorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}