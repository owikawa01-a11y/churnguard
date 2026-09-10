import { supabase } from '../../../lib/supabaseClient';
import { NextResponse } from 'next/server';

// دالة OPTIONS عشان تسمح بأي مصدر (CORS)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// دالة POST الرئيسية
export async function POST(request) {
  try {
    const body = await request.json();
    const { public_key, reason, customer_email } = body;

    if (!public_key) {
      return NextResponse.json(
        { error: 'Missing public_key' },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('id')
      .eq('public_key', public_key)
      .single();

    if (widgetError || !widget) {
      return NextResponse.json(
        { error: 'Invalid public_key' },
        { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    const { data, error } = await supabase
      .from('cancellation_events')
      .insert([
        {
          widget_id: widget.id,
          customer_email: customer_email || null,
          reason: reason,
        }
      ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save reason' },
        { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }

    return NextResponse.json(
      { success: true, data },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}