# Pre-Launch Checklist — DO BEFORE PRODUCTION

> Hard gates. Do not open signups to real veterans until every **[ ] REQUIRED** item is checked.

## 🔴 REQUIRED — data durability & secrets
- [ ] **Upgrade Supabase to Pro ($25/mo) BEFORE LAUNCH.**
      Free has **no automated backups and no point-in-time recovery** — a bad
      migration, an accidental `delete`, or a leaked service-role key running
      `DROP` is **permanent and unrecoverable**. Pro gives daily backups + 7-day
      PITR. This is the single cheapest piece of insurance for irreplaceable
      veteran PII (SSNs, bank numbers, submitted forms).
- [ ] **Set `ENCRYPTION_KEY`** as a Vercel Production secret (sensitive, Prod
      scope only — not Preview/Dev). Confirm it is **not** committed to git.
- [ ] **Set `SUPABASE_SERVICE_ROLE_KEY`** in Vercel (Production) — used by the
      one-time PII backfill script only, never shipped to the browser.
- [ ] Run all SQL migrations through `015_password_verification_hook.sql` in the
      Supabase SQL editor.

## 🟠 REQUIRED — brute-force protection (auth-layer)
- [ ] **Enable the password-verification auth hook.** Supabase Dashboard →
      Authentication → Hooks → "Password verification attempt" → enable → select
      `public.password_verification_hook` (created by migration 015). This is the
      *real* brute-force defense — enforced inside GoTrue, so it can't be bypassed
      by calling the auth endpoint directly. Exponential backoff, auto-expiring.
- [ ] **Enable CAPTCHA.** Create a free Cloudflare Turnstile site → put the SITE
      key in `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (Vercel) **and** the SECRET key in
      Supabase → Authentication → Settings → Bot & Abuse Protection (Turnstile).
      ⚠ Enable both together — turning on Supabase CAPTCHA without the site key
      set makes every login/signup/reset fail.

## 🟠 REQUIRED — transactional email
- [ ] **Replace Supabase's built-in auth email sender with a real SMTP provider**
      (Resend or SendGrid on a verified sending domain). The default sender is
      testing-grade — rate-limited to ~a few emails/hour and frequently spam-
      filtered — so confirmation and password-reset emails will fail for real
      users at volume. Set it in Supabase → Authentication → Emails → SMTP.
      (Note: Wix DNS can't add the subdomain MX Resend's custom return-path wants
      — either verify with DKIM only, move DNS to Cloudflare, or use SendGrid's
      all-CNAME domain auth.)

## 🟠 REQUIRED — app hardening
- [ ] **Flip CSP from report-only to enforcing.** In `src/lib/supabase/middleware.ts`
      rename `Content-Security-Policy-Report-Only` → `Content-Security-Policy`
      **after** confirming zero `[Report Only]` violations in Chrome DevTools
      across login → MFA → dashboard → forms → profile → admin. (Turnstile +
      Supabase are already allowlisted in the policy.)
- [ ] **Re-enable mandatory MFA** — set `NEXT_PUBLIC_REQUIRE_MFA=true` (it's OFF
      for now so demos are frictionless). Then verify it's enforced end-to-end on
      a fresh real account (setup → login step-up) and that an un-enrolled session
      is **denied** PII API access. Confirm demo accounts are still exempt.
- [ ] Confirm the homepage "Get Started Free" routes logged-in users to /dashboard.

## 🟡 RECOMMENDED — operational
- [ ] Rotate `ENCRYPTION_KEY` on a schedule (quarterly) using the versioned-key
      mechanism (`ENCRYPTION_KEY` + `ENCRYPTION_KEY_PREVIOUS`).
- [ ] Confirm the GitHub `Security` workflow (npm audit + gitleaks) is green and
      Dependabot is enabled in repo settings.
- [ ] Add a global rate limiter (Upstash) for `/api/*` if launch traffic warrants
      it — the in-memory limiter does not hold across serverless instances.
- [ ] Consider a managed KMS / envelope encryption if you ever process payments
      or pursue enterprise/compliance.

## Accepted risks (owner sign-off)
- Insider/admin abuse & no admin audit log — accepted because **only the project
  owner can mint admins** (service-role-only; no in-app path).
- No MFA self-recovery — accepted; admin Reset MFA covers lockouts.
