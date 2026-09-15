// ===========================================
//  ChurnGuard - Email Notification
//  Sends email via Resend when customer cancels
// ===========================================

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCancellationAlert({
  toEmail,
  customerEmail,
  reason,
  aiQuestion,
  followUpAnswer,
  offerShown,
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[ChurnGuard][email] RESEND_API_KEY missing, skipping email');
    return { success: false, error: 'No API key' };
  }

  if (!toEmail) {
    console.warn('[ChurnGuard][email] No recipient email, skipping');
    return { success: false, error: 'No recipient' };
  }

  try {
    const dashboardUrl = 'https://churnguard-sandy.vercel.app/dashboard';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f7; margin: 0; padding: 40px 20px; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%); padding: 32px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; }
          .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
          .content { padding: 32px; }
          .row { margin-bottom: 20px; }
          .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin-bottom: 6px; }
          .value { font-size: 15px; color: #111827; background: #f9fafb; padding: 12px 16px; border-radius: 10px; border: 1px solid #e5e7eb; }
          .value.mono { font-family: 'Courier New', monospace; font-size: 13px; }
          .button { display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: 600; font-size: 14px; margin-top: 8px; }
          .footer { padding: 20px 32px; background: #f9fafb; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Cancellation Alert</h1>
            <p>Someone just tried to cancel</p>
          </div>
          <div class="content">
            <div class="row">
              <div class="label">Customer</div>
              <div class="value mono">${escapeHtml(customerEmail || 'Anonymous')}</div>
            </div>
            <div class="row">
              <div class="label">Reason</div>
              <div class="value">${escapeHtml(reason || 'N/A')}</div>
            </div>
            ${aiQuestion ? `
            <div class="row">
              <div class="label">AI Follow-up Question</div>
              <div class="value">${escapeHtml(aiQuestion)}</div>
            </div>
            ` : ''}
            ${followUpAnswer ? `
            <div class="row">
              <div class="label">Customer Answer</div>
              <div class="value">${escapeHtml(followUpAnswer)}</div>
            </div>
            ` : ''}
            ${offerShown ? `
            <div class="row">
              <div class="label">Offer Shown</div>
              <div class="value">${escapeHtml(offerShown)}</div>
            </div>
            ` : ''}
            <div style="text-align: center; margin-top: 32px;">
              <a href="${dashboardUrl}" class="button">View in Dashboard →</a>
            </div>
          </div>
          <div class="footer">
            ChurnGuard · You're receiving this because someone cancelled on your site.
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'ChurnGuard <onboarding@resend.dev>',
      to: [toEmail],
      subject: `🔔 New Cancellation: ${customerEmail || 'Anonymous'}`,
      html,
    });

    console.log('[ChurnGuard][email] Sent to:', toEmail, '| ID:', result?.data?.id);

    return { success: true, id: result?.data?.id };
  } catch (err) {
    console.error('[ChurnGuard][email] Failed:', err.message);
    return { success: false, error: err.message };
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}