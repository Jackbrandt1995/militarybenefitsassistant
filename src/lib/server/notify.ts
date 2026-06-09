/**
 * Shared guards + mailer for the /api/notify-* routes.
 *
 * Centralizes auth, rate limiting, HTML escaping, and the email transport so the
 * notification endpoints can't be abused (previously they were unauthenticated,
 * unvalidated, and unthrottled). Swapping the email provider only touches
 * sendMail() here.
 */

import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { createClient } from '@/lib/supabase/server';

/** The currently-authenticated user, or null. */
export async function getAuthedUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

const ESC: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
};
/** Escape a value before interpolating it into an HTML email body. */
export function escapeHtml(s: unknown): string {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);
}

/** Strip CR/LF (header-injection) and clamp length for an email subject. */
export function safeSubject(s: unknown): string {
  return String(s ?? '').replace(/[\r\n]+/g, ' ').slice(0, 200);
}

/**
 * Best-effort in-memory rate limiter. On serverless this is per-instance, so it
 * throttles a single hot instance rather than globally — defense-in-depth on top
 * of the auth requirement, not a hard global guarantee. For a strict global
 * limit, back this with Upstash/Redis.
 */
const buckets = new Map<string, { count: number; reset: number }>();
export function rateLimit(key: string, max = 12, windowMs = 60_000): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (b.count >= max) return false;
  b.count++;
  return true;
}

/**
 * Send an email. Single chokepoint for the transport.
 *
 * Uses Resend when RESEND_API_KEY is set (recommended for production — Gmail SMTP
 * caps at ~500 emails/day and silently throttles), otherwise falls back to Gmail
 * SMTP. For Resend, EMAIL_FROM must be an address on a domain you've verified in
 * Resend (e.g. "Military Benefits Assistant <notifications@militarybenefitsassistant.com>").
 */
export async function sendMail(opts: { to: string; subject: string; html: string; from?: string }) {
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.EMAIL_FROM || 'Military Benefits Assistant <onboarding@resend.dev>';
    const { error } = await resend.emails.send({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
    });
    if (error) throw new Error(error.message || 'Resend send failed');
    return;
  }

  // Fallback: Gmail SMTP (development / until a Resend domain is verified).
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
  });
  await transporter.sendMail({
    from: opts.from ?? `"Military Benefits Assistant" <${process.env.GMAIL_USER}>`,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });
}
