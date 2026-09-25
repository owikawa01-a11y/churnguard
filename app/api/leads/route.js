// ===========================================
//  RetainPulse API - Leads Route
//  Handles /book form submissions
// ===========================================

import { createClient } from '@supabase/supabase-js';
import {
  sendLeadNotificationToOwner,
  sendLeadConfirmationToCustomer,
} from '../../../lib/sendLeadEmail';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const jsonResponse = (data, status = 200) => Response.json(data, { status });
const errorResponse = (message, status = 500, code = 'ERROR') =>
  jsonResponse({ success: false, error: message, code }, status);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  const startTime = Date.now();

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return errorResponse('Server configuration error', 500, 'CONFIG_ERROR');
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return errorResponse('Invalid JSON body', 400, 'INVALID_JSON');
    }

    const { name, email, saas_url, mrr_range, churn_problem } = body;

    // --- Validate ---
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return errorResponse('Please enter your name', 400, 'INVALID_NAME');
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return errorResponse('Please enter a valid email', 400, 'INVALID_EMAIL');
    }

    if (!saas_url || typeof saas_url !== 'string' || saas_url.trim().length < 3) {
      return errorResponse('Please enter your SaaS URL', 400, 'INVALID_URL');
    }

    if (!mrr_range || typeof mrr_range !== 'string') {
      return errorResponse('Please select your MRR range', 400, 'INVALID_MRR');
    }

    // --- Sanitize ---
    const cleanName = sanitize(name, 100);
    const cleanEmail = email.trim().toLowerCase().slice(0, 200);
    const cleanUrl = sanitize(saas_url, 200);
    const cleanMrr = sanitize(mrr_range, 50);
    const cleanProblem = churn_problem ? sanitize(churn_problem, 2000) : null;

    // --- Save to Supabase ---
    const { data: lead, error: insertError } = await supabase
      .from('leads')
      .insert({
        name: cleanName,
        email: cleanEmail,
        saas_url: cleanUrl,
        mrr_range: cleanMrr,
        churn_problem: cleanProblem,
        status: 'new',
        source: 'book_page',
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('[RetainPulse][leads] DB insert error:', insertError.message);
      return errorResponse('Could not save your request', 500, 'DB_ERROR');
    }

    // --- Send emails in parallel ---
    const [ownerResult, customerResult] = await Promise.all([
      sendLeadNotificationToOwner({
        name: cleanName,
        email: cleanEmail,
        saasUrl: cleanUrl,
        mrrRange: cleanMrr,
        churnProblem: cleanProblem,
      }).catch((err) => {
        console.error('[RetainPulse][leads] Owner email failed:', err.message);
        return { success: false };
      }),
      sendLeadConfirmationToCustomer({
        name: cleanName,
        email: cleanEmail,
      }).catch((err) => {
        console.error('[RetainPulse][leads] Customer email failed:', err.message);
        return { success: false };
      }),
    ]);

    const duration = Date.now() - startTime;
    console.log(
      `[RetainPulse][leads] OK | id=${lead.id.slice(0, 8)} | ownerEmail=${ownerResult.success} | customerEmail=${customerResult.success} | ${duration}ms`
    );

    return jsonResponse({
      success: true,
      lead_id: lead.id,
    });
  } catch (err) {
    console.error('[RetainPulse][leads] Unexpected error:', err);
    return errorResponse('Internal server error', 500, 'INTERNAL_ERROR');
  }
}

function sanitize(text, maxLength) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLength);
}