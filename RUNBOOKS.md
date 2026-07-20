# Ship & Scale Runbooks

Three runbooks, in order. Items marked **✅ DONE** are already in the repo —
you only do the **🖱 YOU** items (dashboard clicks and account signups I can't
perform for you), then the **VERIFY** block proves the step worked.

---

## Runbook 1 — Make production match the code (~30 min)

The admin pool, case view, and rep-profile pages call database functions that
do not exist in Supabase until this runs. Do this before anyone touches admin.

**✅ DONE (in repo):**
- `supabase/production_setup.sql` — migrations 014→018 consolidated into ONE
  idempotent paste (safe to re-run; ends with a read-only verification report).
  019 (appointments / 21-22A signature flow) is intentionally excluded.

**🖱 YOU:**
1. **Run the SQL** — Supabase Dashboard → SQL Editor → New query → paste the
   entire contents of `supabase/production_setup.sql` → Run.
   The tail of the output must show: `tables 4`, `rpc functions 9`,
   `owner-update policies 0`. Anything else → stop and send me the output.
2. **Enable the brute-force hook** — Dashboard → Authentication → Hooks →
   "Password verification attempt" → Enable → choose
   `public.password_verification_hook`. (The SQL created it; this switch turns
   it on inside the auth server where it can't be bypassed.)
3. **Upgrade to Supabase Pro** — Dashboard → Settings → Billing → Pro ($25/mo).
   Buys daily backups + 7-day point-in-time recovery for veteran PII, and stops
   the free-tier project-pausing that would take demos down.
4. Quick env sanity in Vercel → Settings → Environment Variables (Production):
   `ENCRYPTION_KEY` ✔ (already set — submissions work), and confirm
   `SUPABASE_SERVICE_ROLE_KEY` is **not** exposed with a `NEXT_PUBLIC_` prefix.

**VERIFY:** log in as the demo admin → `/admin` → search a client → **Claim** →
open their case view → add a note → release (proves 016–017) → open
Admin → My Rep Profile and save it (proves 018). A wrong-password login attempt
repeated ~6× should start returning a "too many attempts" style error = 015
hook live. One caveat: the admin message threads / Mark Mailed / tracking
features come from EARLIER migrations (005–011, assumed already applied) — if
those specific features error while claim/case-view work, an earlier migration
never ran in prod; send me the exact error.

---

## Runbook 2 — Email + full dress rehearsal (~45 min)

Supabase's built-in mailer sends a handful of emails per hour and lands in
spam. Real signups will silently fail without this.

**🖱 YOU:**
1. **Create a Resend account** (resend.com, free tier: 3k emails/mo) →
   Add domain `militarybenefitsassistant.com` → add the DKIM records it shows
   you in your DNS. ⚠ Wix DNS can't host the return-path **subdomain MX**
   Resend suggests — verify with **DKIM only** (that's enough to send), or use
   SendGrid's all-CNAME domain auth instead.
2. Resend → API Keys → create key → then Supabase Dashboard → Authentication →
   Emails → SMTP Settings → Enable custom SMTP:
   - Host `smtp.resend.com`, Port `465`, User `resend`, Password = the API key
   - Sender: `no-reply@militarybenefitsassistant.com`, name
     "Military Benefits Assistant"
3. **Dress rehearsal on the deployed site** (use a real personal email, not a
   demo account) — run straight through this list:
   - [ ] Sign up → confirmation email arrives (inbox, not spam) → confirm
   - [ ] Log in → dashboard loads → complete a short form (e.g. 22-1990)
   - [ ] PDF generates; submission appears in History
   - [ ] Send a message from History → admin inbox gets the notification email
   - [ ] Log in as demo admin → claim that client → reply → your account sees it
   - [ ] Log out → "Forgot password?" → reset email arrives → reset works
   - [ ] Delete the test account's rows afterward if you want a clean pool

**VERIFY:** every box above checked, and Supabase → Authentication → Logs shows
SMTP sends succeeding (no rate-limit warnings).

---

## Runbook 3 — Security posture + eyes (launch day, ~20 min)

**✅ DONE (in repo):**
- **CSP flip is now an env var.** Middleware sends Report-Only by default;
  setting `CSP_ENFORCE=true` in Vercel switches the same policy to enforcing.
  No code change, instant rollback by unsetting it. (Policy already allowlists
  hCaptcha + Supabase + Vercel insights.)
- **Server error telemetry** — `src/instrumentation.ts` logs every uncaught
  server error as one structured JSON line tagged `[server-error]` (path,
  route, digest, trimmed stack — never bodies/PII).
- **Crash screens** — `src/app/error.tsx` (page errors, navbar survives) and
  `src/app/global-error.tsx` (shell crashes) replace white pages with a
  plain-language recovery screen showing the error code veterans can email you.

**🖱 YOU (in order):**
1. **CSP violation pass** on the deployed site: open Chrome DevTools console →
   browse login (let the hCaptcha widget render) → dashboard → a form →
   profile → admin. Zero `[Report Only]` lines? → Vercel → Settings →
   Environment Variables → add `CSP_ENFORCE=true` (Production) → redeploy.
   If anything breaks: delete the var, redeploy — instant rollback.
2. **Re-enable MFA** — set `NEXT_PUBLIC_REQUIRE_MFA=true` (Production) →
   redeploy → verify: fresh real account is forced through authenticator
   setup; demo accounts still skip it (requires `NEXT_PUBLIC_ENABLE_DEMO=true`).
   Leave this OFF until you're done demoing — it's the last switch to flip.
3. **Log alerts** — Vercel → Observability (Logs) → query `[server-error]` →
   save/alert if your plan supports it. If not, the free-tier move: create a
   Sentry account (sentry.io, free tier) and tell me — wiring the SDK is a
   15-minute code change I'll do when you have the DSN.
4. **When real traffic arrives** — the API rate limiter is in-memory (resets
   per serverless instance). Create a free Upstash Redis database and tell me;
   swapping the limiter to `@upstash/ratelimit` is a small change I'll make
   against `src/lib/server/notify.ts`.

**VERIFY:** response headers on the live site show `content-security-policy`
(not `-report-only`) — DevTools → Network → any doc request; login still shows
the captcha; a fresh account hits MFA setup; demo buttons still work after
completing the captcha (they're disabled until it's solved — the amber hint
under them explains this to visitors).

---

### Deferred / not blocking launch
- `019_appointments.sql` — only if the in-app 21-22A signature flow ships.
- Quarterly `ENCRYPTION_KEY` rotation via `ENCRYPTION_KEY_PREVIOUS` (mechanism
  already in `src/lib/encryption.ts`).
- Managed KMS / envelope encryption if payments ever enter the picture.
