// ===========================================
//  RetainPulse API - Account Status
//  Returns subscription status for the current user
// ===========================================

import { createClient } from '@supabase/supabase-js';
import { getAccountAccess } from '../../../../lib/trial';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return Response.json(
        { error: 'Missing authorization' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData?.user) {
      return Response.json(
        { error: 'Invalid session' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const user = userData.user;

    // Fetch account
    const { data: account, error: accError } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (accError || !account) {
      return Response.json(
        { error: 'Account not found' },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    const access = getAccountAccess(account);

    return Response.json(
      {
        success: true,
        account: {
          plan_status: account.plan_status,
          subscription_status: account.subscription_status,
          subscription_plan: account.subscription_plan,
          trial_ends_at: account.trial_ends_at,
          current_period_end: account.current_period_end,
        },
        access,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err) {
    console.error('[RetainPulse][account-status] Error:', err);
    return Response.json(
      { error: 'Server error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}