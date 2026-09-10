import { createClient } from '@supabase/supabase-js';

// ─── Environment Variables Check ──────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('[ChurnGuard] Missing Supabase env vars in answer route');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ─── CORS Headers ─────────────────────────────────────────
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ─── Response Helpers ─────────────────────────────────────
const jsonResponse = (data, status = 200) =>
  Response.json(data, { status, headers: corsHeaders });

const errorResponse = (message, status = 500, code = 'ERROR') =>
  jsonResponse({ success: false, error: message, code }, status);

// ─── OPTIONS Handler ──────────────────────────────────────
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// ─── POST Handler ─────────────────────────────────────────
export async function POST(request) {
  const startTime = Date.now();

  try {
    // 1. تحقق من المتغيرات البيئية
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return errorResponse('Server configuration error', 500, 'CONFIG_ERROR');
    }

    // 2. استقبل البيانات
    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse('Invalid JSON body', 400, 'INVALID_JSON');
    }

    const { event_id, answer } = body;

    // 3. تحقق من event_id (إجباري)
    if (!event_id || typeof event_id !== 'string') {
      return errorResponse('Missing or invalid event_id', 400, 'INVALID_EVENT_ID');
    }

    // 4. تحقق من شكل UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(event_id)) {
      return errorResponse('Invalid event_id format', 400, 'INVALID_EVENT_ID');
    }

    // 5. تنظيف الإجابة (اختيارية)
    const cleanAnswer = answer && typeof answer === 'string'
      ? sanitizeInput(answer, 1000)
      : null;

    // 6. تحديث الحدث في قاعدة البيانات
    const { data: updated, error: updateError } = await supabase
      .from('cancellation_events')
      .update({ follow_up_answer: cleanAnswer })
      .eq('id', event_id)
      .select('id')
      .single();

    if (updateError) {
      console.error('[ChurnGuard] Update error:', updateError.message);
      return errorResponse('Could not save answer', 500, 'DB_ERROR');
    }

    if (!updated) {
      return errorResponse('Event not found', 404, 'EVENT_NOT_FOUND');
    }

    // 7. نجاح
    const duration = Date.now() - startTime;
    console.log(`[ChurnGuard] ✓ Answer saved for event ${event_id} | ${duration}ms`);

    return jsonResponse({
      success: true,
      event_id: updated.id,
      has_answer: cleanAnswer !== null,
    });

  } catch (err) {
    console.error('[ChurnGuard] Unexpected error:', err);
    return errorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}

// ─── Utilities ────────────────────────────────────────────

function sanitizeInput(text, maxLength) {
  if (typeof text !== 'string') return null;
  const cleaned = text
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // إزالة control chars
    .replace(/[<>]/g, '') // إزالة HTML brackets
    .trim()
    .slice(0, maxLength);
  return cleaned.length > 0 ? cleaned : null;
}