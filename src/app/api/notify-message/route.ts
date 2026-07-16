import { NextRequest, NextResponse } from 'next/server';
import { getAuthedUser, escapeHtml, safeSubject, rateLimit, sendMail } from '@/lib/server/notify';

const ADMIN_EMAIL = 'info@militarybenefitsassistant.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!rateLimit(`notify-message:${user.id}`)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const raw = await req.json();
    const direction = raw.direction;
    const message  = escapeHtml(raw.message);
    const userName = escapeHtml(raw.userName);
    const formName = escapeHtml(raw.formName);

    // Reject unknown directions up front — otherwise a typo'd value would fall
    // into the admin→client branch (403 for clients, wrong template for admins).
    if (direction !== 'client_to_admin' && direction !== 'admin_to_client') {
      return NextResponse.json({ error: 'Invalid direction.' }, { status: 400 });
    }
    // `message` is OPTIONAL: both in-app callers intentionally omit the text so
    // case details never transit email. Without it we send a generic "you have
    // a new secure message" notification instead.

    const isClientToAdmin = direction === 'client_to_admin';

    // Only an admin may send TO a client at an arbitrary address. Anyone else can
    // only message the admin inbox — this closes the open relay / spam vector.
    if (!isClientToAdmin && !user.app_metadata?.is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const recipient = isClientToAdmin ? ADMIN_EMAIL : String(raw.userEmail ?? '');
    if (!isClientToAdmin && !EMAIL_RE.test(recipient)) {
      return NextResponse.json({ error: 'Invalid recipient email.' }, { status: 400 });
    }

    const to      = recipient;
    const subject = safeSubject(isClientToAdmin
      ? `New Message from ${userName || 'Client'} — ${formName || 'VA Form'}`
      : `Reply from MBA — ${formName || 'Your VA Form'}`);

    const senderLabel  = isClientToAdmin ? (userName || 'Client') : 'Military Benefits Assistant';
    const contextLabel = isClientToAdmin ? 'has sent you a message' : 'has replied to your message';
    const ctaUrl       = isClientToAdmin
      ? 'https://militarybenefitsassistant.vercel.app/admin'
      : 'https://militarybenefitsassistant.vercel.app/history';
    const ctaLabel     = isClientToAdmin ? 'View in Admin Panel →' : 'View My Filing History →';
    const headerColor  = isClientToAdmin ? '#1e3a5f' : '#7c3aed';

    // Identify the sender to the admin — without this the notification carries no
    // email address at all (userName may be empty), leaving no way to reply.
    // Prefer the authenticated user's email over the client-supplied one.
    const senderEmail  = isClientToAdmin ? escapeHtml(user.email || raw.userEmail) : '';
    const senderRow    = isClientToAdmin
      ? `<p style="font-size:13px;color:#475569;margin:0 0 4px;">From: ${senderEmail ? `<a href="mailto:${senderEmail}" style="color:#1e3a5f;">${senderEmail}</a>` : 'no email on file'}</p>`
      : '';

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" />
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#f8fafc; margin:0; padding:24px; }
  .card { background:#fff; border-radius:12px; border:1px solid #e2e8f0; max-width:560px; margin:0 auto; overflow:hidden; }
  .header { background:${headerColor}; color:#fff; padding:24px 28px; }
  .header h1 { margin:0; font-size:18px; font-weight:700; }
  .header p  { margin:4px 0 0; font-size:13px; opacity:.85; }
  .body  { padding:24px 28px; }
  .msg-box { background:#f8fafc; border:1px solid #e2e8f0; border-left:4px solid ${headerColor}; border-radius:8px; padding:16px; margin:16px 0; font-size:14px; color:#1e293b; white-space:pre-wrap; line-height:1.6; }
  .cta { display:inline-block; background:${headerColor}; color:#fff!important; text-decoration:none; padding:10px 22px; border-radius:8px; font-size:14px; font-weight:600; }
  .footer { background:#f8fafc; padding:16px 28px; font-size:12px; color:#94a3b8; border-top:1px solid #e2e8f0; }
</style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>New Message</h1>
      <p>${senderLabel} ${contextLabel}${formName ? ` regarding ${formName}` : ''}.</p>
    </div>
    <div class="body">
      ${senderRow}
      <div class="msg-box">${message || 'You have a new secure message. Sign in to read it.'}</div>
      <a href="${ctaUrl}" class="cta">${ctaLabel}</a>
    </div>
    <div class="footer">Military Benefits Assistant · <a href="mailto:info@militarybenefitsassistant.com" style="color:#94a3b8;">info@militarybenefitsassistant.com</a></div>
  </div>
</body>
</html>`;

    await sendMail({ to, subject, html });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[notify-message]', err);
    return NextResponse.json({ error: 'Failed to send.' }, { status: 500 });
  }
}
