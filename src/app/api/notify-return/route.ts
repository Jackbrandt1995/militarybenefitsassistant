import { NextRequest, NextResponse } from 'next/server';
import { getAuthedUser, escapeHtml, safeSubject, rateLimit, sendMail } from '@/lib/server/notify';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Returning a submission to a client is an admin action.
    if (!user.user_metadata?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!rateLimit(`notify-return:${user.id}`)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const raw = await req.json();
    const userEmail = String(raw.userEmail ?? '');
    const userName = escapeHtml(raw.userName);
    const formName = escapeHtml(raw.formName);
    const formId = escapeHtml(raw.formId);
    const returnReason = escapeHtml(raw.returnReason);

    if (!userEmail || !formName || !returnReason) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    if (!EMAIL_RE.test(userEmail)) {
      return NextResponse.json({ error: 'Invalid recipient email.' }, { status: 400 });
    }

    const subject = safeSubject(`Action Required: Your ${formId ? formId.toUpperCase() : 'VA'} Form Needs Updates`);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 24px; }
    .card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 560px; margin: 0 auto; overflow: hidden; }
    .header { background: #7c3aed; color: #fff; padding: 24px 28px; }
    .header h1 { margin: 0; font-size: 18px; font-weight: 700; }
    .header p  { margin: 4px 0 0; font-size: 13px; opacity: 0.85; }
    .body { padding: 24px 28px; }
    .reason-box { background: #faf5ff; border: 1px solid #e9d5ff; border-left: 4px solid #7c3aed; border-radius: 8px; padding: 16px 18px; margin: 16px 0; }
    .reason-box p { margin: 0; font-size: 14px; color: #3b0764; line-height: 1.6; white-space: pre-wrap; }
    .cta { display: inline-block; background: #7c3aed; color: #fff !important; text-decoration: none; padding: 10px 22px; border-radius: 8px; font-size: 14px; font-weight: 600; }
    .divider { border: none; border-top: 1px solid #f1f5f9; margin: 20px 0; }
    .footer { background: #f8fafc; padding: 16px 28px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Your Form Has Been Returned</h1>
      <p>Our team reviewed your submission and needs a few updates before mailing.</p>
    </div>
    <div class="body">
      <p style="font-size:15px;color:#0f172a;margin:0 0 4px;">Hi ${userName || 'there'},</p>
      <p style="font-size:14px;color:#475569;margin:8px 0 16px;">
        We reviewed your <strong>${formName}</strong> (${formId?.toUpperCase() ?? ''}) submission and have a few items
        that need to be corrected or completed before we can mail it to the VA.
      </p>

      <p style="font-size:12px;font-weight:600;color:#6b21a8;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;">
        Notes from our team
      </p>
      <div class="reason-box">
        <p>${returnReason}</p>
      </div>

      <hr class="divider" />
      <p style="font-size:13px;color:#475569;margin:0 0 16px;">
        Please log in to your account to view the details, then reply to this email or contact us
        so we can get your form corrected and on its way to the VA.
      </p>
      <a href="https://militarybenefitsassistant.vercel.app/history" class="cta">View My Filing History →</a>
    </div>
    <div class="footer">
      Military Benefits Assistant &nbsp;·&nbsp; <a href="mailto:info@militarybenefitsassistant.com" style="color:#94a3b8;">info@militarybenefitsassistant.com</a>
    </div>
  </div>
</body>
</html>`;

    await sendMail({ to: userEmail, subject, html });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[notify-return]', err);
    return NextResponse.json({ error: err.message ?? 'Failed to send email.' }, { status: 500 });
  }
}
