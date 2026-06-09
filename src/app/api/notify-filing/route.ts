import { NextRequest, NextResponse } from 'next/server';
import { getAuthedUser, escapeHtml, safeSubject, rateLimit, sendMail } from '@/lib/server/notify';

const ADMIN_EMAIL = 'info@militarybenefitsassistant.com';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!rateLimit(`notify-filing:${user.id}`)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const raw = await req.json();
    const userName = escapeHtml(raw.userName);
    const formName = escapeHtml(raw.formName);
    const formId = escapeHtml(raw.formId);
    const userEmail = escapeHtml(raw.userEmail);
    const submissionId = escapeHtml(raw.submissionId);
    const submittedAt = raw.submittedAt;

    if (!userName || !formName || !formId) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    // Subject format: {User_Name}_{Benefit}_{Application}
    const subject = safeSubject(`${userName}_${formName}_${formId.toUpperCase()}`);

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 24px; }
    .card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; max-width: 560px; margin: 0 auto; overflow: hidden; }
    .header { background: #1e3a5f; color: #fff; padding: 24px 28px; }
    .header h1 { margin: 0; font-size: 18px; font-weight: 700; }
    .header p  { margin: 4px 0 0; font-size: 13px; opacity: 0.8; }
    .body { padding: 24px 28px; }
    .row { display: flex; gap: 8px; margin-bottom: 12px; }
    .label { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; min-width: 120px; padding-top: 2px; }
    .value { font-size: 14px; color: #0f172a; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 999px; border: 1px solid #fde68a; }
    .divider { border: none; border-top: 1px solid #f1f5f9; margin: 20px 0; }
    .cta { display: inline-block; background: #1e3a5f; color: #fff !important; text-decoration: none; padding: 10px 22px; border-radius: 8px; font-size: 14px; font-weight: 600; }
    .footer { background: #f8fafc; padding: 16px 28px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>New Agent Filing Request</h1>
      <p>A client has authorized MBA to print and mail their VA form.</p>
    </div>
    <div class="body">
      <div class="row">
        <span class="label">Client Name</span>
        <span class="value">${userName}</span>
      </div>
      <div class="row">
        <span class="label">Email</span>
        <span class="value">${userEmail || '—'}</span>
      </div>
      <hr class="divider" />
      <div class="row">
        <span class="label">Form</span>
        <span class="value">${formId.toUpperCase()}</span>
      </div>
      <div class="row">
        <span class="label">Benefit</span>
        <span class="value">${formName}</span>
      </div>
      <div class="row">
        <span class="label">Submission ID</span>
        <span class="value" style="font-family:monospace;font-size:12px;">${submissionId || '—'}</span>
      </div>
      <div class="row">
        <span class="label">Received</span>
        <span class="value">${submittedAt ? new Date(submittedAt).toLocaleString('en-US', { timeZone: 'America/New_York', dateStyle: 'full', timeStyle: 'short' }) : new Date().toLocaleString()}</span>
      </div>
      <div class="row">
        <span class="label">Status</span>
        <span class="badge">⏳ Awaiting Mailing</span>
      </div>
      <hr class="divider" />
      <p style="font-size:13px;color:#475569;margin:0 0 16px;">
        Log in to the MBA admin panel to download the filled PDF, review the authorization signature, and mark the form as mailed once sent.
      </p>
      <a href="https://militarybenefitsassistant.vercel.app/admin" class="cta">Open Admin Panel →</a>
    </div>
    <div class="footer">
      Military Benefits Assistant · This is an automated notification.
    </div>
  </div>
</body>
</html>`;

    await sendMail({
      from: `"MBA Notifications" <${process.env.GMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[notify-filing]', err);
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
  }
}
