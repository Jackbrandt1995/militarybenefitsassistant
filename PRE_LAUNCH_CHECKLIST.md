# Pre-Launch Checklist — DO BEFORE PRODUCTION

> Hard gates. Do not open signups to real veterans until every **[ ] REQUIRED** item is checked.

## 🔴 REQUIRED — data durability & secrets
- [x] **Upgrade Supabase to Pro ($25/mo) BEFORE LAUNCH.** ✔ Done Aug 2026.
      Pro includes automated **daily backups (7-day retention)**. Note: true
      point-in-time recovery (PITR) is a separate paid add-on, not part of Pro —
      daily backups are sufficient at launch scale; consider the PITR add-on
      once real volume arrives (worst case with daily backups = losing up to
      one day of writes).
- [x] **Set `ENCRYPTION_KEY`** as a Vercel Production secret (sensitive, Prod
      scope only — not Preview/Dev). Confirm it is **not** committed to git.
      ✔ Done — submissions encrypt-and-save in production.
- [ ] **Set `SUPABASE_SERVICE_ROLE_KEY`** in Vercel (Production) — used by the
      one-time PII backfill script only, never shipped to the browser.
- [ ] **Run `supabase/production_setup.sql`** in the Supabase SQL editor — one
      idempotent paste covering migrations 014–018 (RLS tightening, brute-force
      hook, admin pool, case view, rep profiles). See RUNBOOKS.md → Runbook 1.

## 🟠 REQUIRED — brute-force protection (auth-layer)
- [ ] **Brute-force protection.** ⚠ The "Password verification attempt" hook is
      **Teams/Enterprise-only** — on Free/Pro it does not appear under
      Authentication → Hooks (migration 015's function stays unused; harmless).
      On Pro, do instead: Authentication → Rate Limits → tighten "sign ups and
      sign ins" to ~10 per 5 min per IP, AND Authentication → Passwords → enable
      leaked-password protection. Revisit the hook if the project ever moves to
      the Teams plan.
- [ ] **Enable CAPTCHA (hCaptcha — this is what the code implements).** Put the
      hCaptcha SITE key in `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` (Vercel) **and** the
      SECRET key in Supabase → Authentication → Bot & Abuse Protection
      (hCaptcha). ⚠ Enable both together — turning on Supabase CAPTCHA without
      the site key set makes every login/signup/reset fail. (Demo buttons stay
      usable: the login page shows a "complete the hCaptcha to demo" hint.)

## 🟠 REQUIRED — transactional email
- [ ] **Replace Supabase's built-in auth email sender with custom SMTP.** The
      default sender is testing-grade — rate-limited to ~a few emails/hour and
      frequently spam-filtered — so confirmation and password-reset emails will
      fail for real users at volume. DECISION: **Gmail SMTP is the primary**
      (same GMAIL_USER account the app's notifications already use; domain MX/SPF
      are already Google's). Supabase → Authentication → Emails → SMTP:
      smtp.gmail.com:465, user = GMAIL_USER, a dedicated app password, sender =
      that same address. Caps ~2,000/day (Workspace) — revisit at scale; upgrade
      path is SendGrid all-CNAME domain auth (see RUNBOOKS.md Runbook 2).

## 🟠 REQUIRED — app hardening
- [ ] **Flip CSP from report-only to enforcing.** Set `CSP_ENFORCE=true` in
      Vercel (Production) and redeploy — no code change; unset to roll back.
      Do it **after** confirming zero `[Report Only]` violations in Chrome
      DevTools across login (with live hCaptcha) → dashboard → forms → profile
      → admin. (hCaptcha + Supabase are already allowlisted in the policy.)
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
