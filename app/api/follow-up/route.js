import { createClient } from '@supabase/supabase-js';

// ─── التحقق من المتغيرات البيئية ───────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GROQ_API_KEY) {
  console.error('[ChurnGuard] Missing environment variables:', {
    hasSupabaseUrl: !!SUPABASE_URL,
    hasServiceKey: !!SUPABASE_SERVICE_KEY,
    hasGroqKey: !!GROQ_API_KEY,
  });
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
      console.error('[ChurnGuard] Supabase env vars missing');
      return errorResponse('Server configuration error', 500, 'CONFIG_ERROR');
    }

    // 2. استقبل البيانات
    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse('Invalid JSON body', 400, 'INVALID_JSON');
    }

    const { public_key, reason } = body;

    // 3. تحقق من المدخلات
    if (!public_key || typeof public_key !== 'string') {
      return errorResponse('Missing or invalid public_key', 400, 'INVALID_KEY');
    }

    if (!reason || typeof reason !== 'string' || reason.trim().length < 2) {
      return errorResponse('Missing or invalid reason', 400, 'INVALID_REASON');
    }

    // 4. تنظيف النص (منع الهجمات والرموز الغريبة)
    const cleanReason = sanitizeInput(reason, 500);
    const cleanPublicKey = public_key.trim().slice(0, 100);

    // 5. دور على الـ widget
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('id')
      .eq('public_key', cleanPublicKey)
      .single();

    if (widgetError || !widget) {
      console.warn('[ChurnGuard] Widget not found for key:', cleanPublicKey.slice(0, 8) + '...');
      return errorResponse('Invalid widget key', 404, 'WIDGET_NOT_FOUND');
    }

    // 6. اسأل Groq (مع timeout 5 ثواني)
    let followUpQuestion = getFallbackQuestion(cleanReason);
    let aiSource = 'fallback';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 80,
          temperature: 0.6,
          messages: [
            {
              role: 'system',
              content: `You are a UX researcher helping SaaS companies understand churn.
Write ONE short, warm, specific follow-up question.
Rules:
- Maximum 20 words
- No quotes, no prefixes, no explanations
- Reply with ONLY the question text
- Be empathetic and specific to their reason`,
            },
            {
              role: 'user',
              content: `Customer cancellation reason: "${cleanReason}". Write one follow-up question.`,
            },
          ],
        }),
      });

      clearTimeout(timeoutId);

      if (groqRes.ok) {
        const data = await groqRes.json();
        const text = data?.choices?.[0]?.message?.content?.trim();
        if (text && text.length > 5 && text.length < 200) {
          followUpQuestion = text;
          aiSource = 'groq';
        }
      } else {
        console.error('[ChurnGuard] Groq error:', groqRes.status);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.warn('[ChurnGuard] Groq timeout, using fallback');
      } else {
        console.error('[ChurnGuard] Groq failed:', err.message);
      }
    }

    // 7. خزّن الحدث
    const { data: event, error: insertError } = await supabase
      .from('cancellation_events')
      .insert({
        widget_id: widget.id,
        initial_reason: cleanReason,
        ai_follow_up_question: followUpQuestion,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('[ChurnGuard] Insert error:', insertError.message);
      return errorResponse('Could not save event', 500, 'DB_ERROR');
    }

    // 8. نجاح
    const duration = Date.now() - startTime;
    console.log(`[ChurnGuard] ✓ Event ${event.id} | ${aiSource} | ${duration}ms`);

    return jsonResponse({
      success: true,
      event_id: event.id,
      question: followUpQuestion,
      source: aiSource,
    });

  } catch (err) {
    console.error('[ChurnGuard] Unexpected error:', err);
    return errorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}

// ─── Utilities ────────────────────────────────────────────

function sanitizeInput(text, maxLength) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // إزالة control chars
    .replace(/[<>]/g, '') // إزالة HTML brackets
    .trim()
    .slice(0, maxLength);
}

function getFallbackQuestion(reason) {
  const r = reason.toLowerCase();
  if (/(price|expensive|cost|pay|money|budget)/.test(r)) {
    return 'What price would have felt fair to you?';
  }
  if (/(feature|missing|need|want|lack)/.test(r)) {
    return 'What feature were you hoping we had?';
  }
  if (/(competitor|switch|another|alternative|other tool)/.test(r)) {
    return 'What is the other tool doing better?';
  }
  if (/(use|need|time|busy|changed)/.test(r)) {
    return 'What changed about your needs recently?';
  }
  if (/(bug|error|broken|slow|crash)/.test(r)) {
    return 'What issue were you experiencing exactly?';
  }
  if (/(support|help|service|response)/.test(r)) {
    return 'How could our support have helped you better?';
  }
  return 'Anything else that would help us understand your decision?';
}