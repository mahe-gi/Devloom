# Implementation Plan: Fix Regressions & Migrate to Better Auth

## Goal Description
The objective is to repair existing production regressions (`/bulk`, `/mine`, `/related` endpoints failing) through evidence-based diagnosis, stabilize the Cloudflare Worker deployment on a custom subdomain, and execute a highly verified migration from custom JWTs to **Better Auth**.

## User Review Required
> [!IMPORTANT]
> - We require a **`DIRECT_DATABASE_URL`** (direct PostgreSQL connection string, not Prisma Accelerate) for safe migration execution on production. Please do not share it here, but ensure it is accessible when running the migrations.
> - A production database backup **must** be taken before we alter the schema.
> - Please configure DNS to point `api.techwithmahe.com` to your Cloudflare Worker so we can establish a proper SameSite cookie topology.

## Open Questions
- Do you have an established process or hosting provider UI to execute a database backup right now?
- Is the custom domain `api.techwithmahe.com` already attached to the Cloudflare Worker, or do you need to set that up?

---

## Phase 0 — Production Evidence
Before any code changes or deployments, we must prove the cause of the regressions.
1. Run `npx wrangler tail` while triggering the `/mine` and `/related` 500 errors in production to capture the exact exception.
2. Identify the deployed Worker version and confirm the frontend build version.
3. Query the production migration status using the `DIRECT_DATABASE_URL`.
4. Compare production tables with the committed schema.
5. Back up the production database.
6. Produce `production_evidence_report.md` with the findings.
**No modifications** will be made during this evidence-gathering phase.

## Phase 1 — Repair Regressions
1. **Fix `/bulk`:** Ensure `/bulk` is explicitly public and ignores malformed/expired JWTs without returning `401`. We will test it with a valid token, an expired token, a malformed token, and no token.
2. **Fix `/mine` & `/related`:** Apply the exact fix dictated by the `wrangler tail` exception log.
3. **Strict Migration Controls:** If a migration is required:
   - Verify production backup.
   - Review pending SQL.
   - Record `prisma migrate status`.
   - Pass tests on a fresh database and production-like clone.
   - Obtain explicit user approval.
   - Deploy using `DIRECT_DATABASE_URL` only.
   - Verify schema post-migration and smoke test app. Document rollback/recovery.
4. **Deploy to Preview:** Deploy to a staging Worker first and smoke test.
5. **Deploy to Production:** Deploy only after the staging Worker passes.

## Phase 2 — Establish Same-Site API
1. **API Domain:** Configure the environment to use `https://api.techwithmahe.com` for backend requests. Update the frontend `VITE_BACKEND_URL`.
2. **Restrict CORS:** Replace wildcard CORS with strict configuration handling environments distinctly. For production:
   ```ts
   app.use("/*", cors({
     origin: "https://blog.techwithmahe.com",
     credentials: true,
     allowHeaders: ["Content-Type", "Authorization"],
     allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
   }));
   ```
   *Note: Local development and staging will use their own distinct allowlists.*
3. **Frontend Requests:** Ensure the frontend uses `credentials: "include"`.
4. **Verification:** Confirm preflight requests and legacy JWT authentication remain operational in this new topology.

## Phase 3 — Design Better Auth Schema
1. **Reconcile Integer IDs:** Generate Better Auth’s proposed schema temporarily. Verify the Prisma adapter safely maps `User.id`, `Account.userId`, and `Session.userId` to `Int`. Do not alter existing identity types. If unsupported, stop and redesign.
2. **Map Fields Properly:**
   - Map `username` → `email`. (Backfill by lowercasing/trimming, resolve duplicates before enforcing unique).
   - Configure field mapping for `avatarUrl` → `image` (avoiding dual data).
   - Ensure `emailVerified`, `name`, `createdAt`, `updatedAt` map securely.
3. **Legacy Passwords:** Keep existing password login during a short transition. Authenticate existing users once via legacy bcrypt verification, then migrate their credentials natively into Better Auth. New users use Google, OTP, or Better Auth signup.
4. **Migration Testing:** Create a reviewed Prisma migration and rigorously test it.

## Phase 4 — Implement Better Auth
1. **Origin Configuration:**
   - Set `baseURL = https://api.techwithmahe.com`
   - Set `trustedOrigins = ["https://blog.techwithmahe.com"]`
   - Configure environments separately (no global localhost in prod).
   - Record Google Callback explicitly: `https://api.techwithmahe.com/api/auth/callback/google`
2. **Backend Integration:** 
   - Initialize Better Auth with Google OAuth, Email/Password, and **Email OTP** plugins (`sendVerificationOTP`).
   - Mount the Hono handler securely for all methods:
     ```ts
     app.on(["GET", "POST"], "/api/auth/*", (c) => {
       return auth.handler(c.req.raw);
     });
     ```
3. **Frontend Integration:**
   - Initialize the client via `import { createAuthClient } from "better-auth/react"`.
   - Update `Signup.tsx` and `Signin.tsx` for Google OAuth and 6-digit Email OTP.
4. **OTP Security Verification:** Test OTP expiration, incorrect OTP, max attempts, reuse, resend cooldown, rate limiting (email/IP), enumeration safety, delivery failure, and expired sessions.
5. **Account Linking Policy:** Explicitly handle Google-to-existing-user account linking safely, requiring re-authentication or explicit consent.

## Phase 5 — Transition
1. **Strict Credential Conflict Policy:**
   - The Better Auth session is authoritative.
   - If the legacy JWT and Better Auth session resolve to different users:
     1. Return `409 AUTH_IDENTITY_CONFLICT`.
     2. Block protected operations.
     3. Expire the Better Auth session cookie.
     4. Frontend clears the legacy JWT.
     5. Redirect to signin with a security explanation.
     6. Record security event.
2. **Cleanup:**
   - Remove the legacy `localStorage` JWT **only after** an authenticated Better Auth session is established, maps to the exact same `User.id`, and at least one protected-session request succeeds.
   - After a short transition, revoke all legacy JWT usage and remove old auth code entirely.
