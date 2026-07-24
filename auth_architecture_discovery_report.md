# 101dev Authentication Architecture Discovery Report

## 1. Executive Summary

- **Current authentication mechanism**: Email/Password utilizing `bcryptjs` hashing.
- **Current session/token mechanism**: Custom Bearer JWTs signed via `hono/jwt` with `HS256`, extracted from the `Authorization` header on protected endpoints and persisted in the browser's `localStorage`.
- **Auth.js feasibility**: Highly feasible. The Cloudflare Worker is using `nodejs_compat_v2`, and Auth.js natively supports WinterCG-compliant runtimes like Workers.
- **Google OAuth feasibility**: Highly feasible. The primary risk is account linking (if an existing password user tries to sign in with Google using the same email address).
- **Magic-link feasibility**: Highly feasible utilizing Auth.js's native `Email` provider and Resend.
- **Numeric OTP feasibility**: Not recommended. While feasible, it requires entirely custom backend models, rate-limiting, and verification endpoint logic because Auth.js heavily optimizes for magic links over pure numeric OTPs.
- **Main integration risk**: Transitioning from `localStorage`-based authorization headers to `HttpOnly` cross-origin cookies. Additionally, the Prisma schema must safely transition the `password` field to nullable without breaking the legacy login endpoints during the migration period.
- **Recommended high-level direction**: Implement `@hono/auth-js` alongside the existing JWT system. Introduce Auth.js models to Prisma, make `password` nullable, and implement a staged rollout where the frontend begins requesting Auth.js sessions while falling back to the old JWT if needed.

## 2. Verified Technology Versions

| Technology | Version | Evidence |
| --- | --- | --- |
| React | `^18.3.1` | `frontend/package.json` |
| React Router | `^7.1.5` | `frontend/package.json` |
| Vite | `^6.0.5` | `frontend/package.json` |
| TypeScript | `~5.6.2` (fe) / `^7.0.2` (be) | `package.json` |
| Hono | `^4.0.8` | `backend/package.json` |
| Wrangler | `^4.15.2` | `backend/package.json` |
| Prisma | `^6.4.0` | `backend/package.json` |
| @prisma/client | `^6.3.1` | `backend/package.json` |
| Zod | `3.24.2` | `common/package.json` |
| JWT packages | `hono/jwt` (internal) | `backend/src/routes/userRouter.ts` |
| Password-hashing | `bcryptjs ^3.0.2` | `backend/package.json` |
| Cookie packages | NOT INSTALLED | Scanned dependencies |
| CORS middleware | `hono/cors` | `backend/src/index.ts` |
| Auth.js packages | NOT INSTALLED | Scanned dependencies |
| Resend | NOT INSTALLED | Scanned dependencies |

## 3. Current Prisma Authentication Schema

- **User Model Summary**: Contains `id` (Int), `username` (acts as email, unique), `password` (required), `name`, `handle` (unique), `bio`, `avatarUrl`, `createdAt`, `updatedAt`, and a one-to-many relationship with `Blog`.
- **Relevant relations**: `Blog.authorId` points to `User.id`. `BlogTag` handles many-to-many tags.
- **Constraints**: `username` and `handle` are explicitly `@unique`.
- **Missing Auth.js models**: `Account`, `Session`, `VerificationToken`, and `Authenticator` do not exist.
- **Migration implications**: `password` must be made nullable (`String?`) to allow Google/Passwordless users. A schema migration is required to add the Auth.js companion tables.

## 4. Existing Signup Flow

1. User submits `{ name, username, password }` on `frontend/src/pages/Signup.tsx`.
2. Frontend validation verifies fields are not empty.
3. Axios `POST`s to `VITE_BACKEND_URL/api/v1/user/signup`.
4. Backend `userRouter` validates the payload via `@mahe-npm/common` Zod `signupInput`.
5. Backend hashes the password using `bcrypt.hash(password, 10)`.
6. Backend attempts `prisma.user.create()`. (Catches DB constraint errors if `username` already exists).
7. Backend signs a JWT via `hono/jwt` with `{ id: user.id }`.
8. Backend returns `200 OK` with `{ token, user }`.
9. Frontend writes `token` to `localStorage.setItem("token", "Bearer " + token)`.
10. Frontend redirects user to `/blogs`.

## 5. Existing Signin Flow

1. User submits credentials on `/signin`.
2. Axios `POST`s to `VITE_BACKEND_URL/api/v1/user/signin`.
3. Backend fetches `prisma.user.findFirst` based on `username`.
4. Backend verifies hash via `bcrypt.compare`.
5. Token generated identical to signup step 7.
6. Frontend stores the token in `localStorage` and redirects.

## 6. Authentication Middleware and Protected Routes

- **Middleware**: `authMiddleware` in `backend/src/routes/blogRouter.ts` parses the `Authorization` header, verifies the JWT, and assigns `c.set("userId", payload.id)`. It **does not** verify if the user still exists in the database.
- **Protected Endpoints**:
  - `GET /api/v1/blog/mine`
  - `GET /api/v1/blog/mine/:id`
  - `POST /api/v1/blog/`
  - `PATCH /api/v1/blog/:id/published`
  - `PUT /api/v1/blog/`
  - `DELETE /api/v1/blog/:id`
  - `GET /api/v1/user/me` (Manual verification inside route)
  - `PUT /api/v1/user/profile` (Manual verification inside route)

## 7. Frontend Authentication State

| Frontend concern | Current implementation | File |
| --- | --- | --- |
| Token storage | `localStorage.getItem("token")` | `Signup.tsx`, `Signin.tsx`, `Appbar.tsx` |
| Current user | Fetched via `useUser` hook calling `/api/v1/user/me` | `hooks/index.ts` |
| API authorization | Manually attaching `Authorization: localStorage.getItem("token")` | `hooks/index.ts`, `Publish.tsx` |
| Route protection | `ProtectedRoute.tsx` blocks access if token is missing | `ProtectedRoute.tsx` |
| Logout | Triggers `localStorage.removeItem("token")` | `Appbar.tsx`, `ToggleCard.tsx` |
| Expiration handling | Endpoint returns 401, frontend lacks robust global logout sync | `hooks/index.ts` |

## 8. Deployment, CORS, and Cookie Boundaries

- **CORS**: Implemented globally via `app.use("/*", cors())`. By default, credentials (cookies) are **not** permitted with wildcard origins.
- **Local Origins**: `http://localhost:5173` (Vite) and `http://localhost:8787` (Wrangler).
- **Production Origins**: Separated by `VITE_BACKEND_URL`. 
- **Cookie Implications**: Because the API operates on a different port/domain from the frontend, Auth.js cookies will act as third-party cookies unless the frontend proxies API requests (e.g. Vercel Rewrites) OR CORS is heavily restricted to specific domains and cookies are configured as `SameSite=None; Secure`.

## 9. Cloudflare Worker Compatibility

- **Wrangler**: `wrangler.toml` is configured with `nodejs_compat_v2` and `compatibility_date = "2024-09-25"`.
- **Database**: The project uses `PrismaPg` (with node `pg` pooling) for local development and `@prisma/extension-accelerate` (`prisma://`) for production. 
- **Dry-run**: Verified `wrangler deploy --dry-run` succeeds. The infrastructure is modern and ready for edge deployments.
- **Crypto Constraints**: Auth.js relies heavily on standard Web Crypto, which Cloudflare Workers explicitly support.

## 10. Auth.js Compatibility Assessment

- **Recommended Approach**: `@hono/auth-js` paired with `@auth/prisma-adapter`.
- **Runtime Compatibility**: Full support via WinterCG compliance in Cloudflare Workers. 
- **Adapter Compatibility**: `PrismaAdapter` works out of the box with Accelerate.
- **Version Maturity**: Auth.js core is highly stable, `@hono/auth-js` is an actively maintained official community package.

## 11. Google OAuth Design Constraints

- **Local Callback Pattern**: `http://localhost:8787/api/v1/auth/callback/google` (if hosted purely on the API domain) or proxied through the Vite domain.
- **Account Linking Risks**: If an existing user (`foo@gmail.com`) authenticated previously with a password, a subsequent Google Login with `foo@gmail.com` will fail by default in Auth.js (OAuthAccountNotLinked error). We must explicitly allow safe linking by verifying Google's provided email and updating the database.

## 12. Magic Link Versus OTP

| Concern | Magic link | Six-digit OTP |
| --- | --- | --- |
| Auth.js native support | Full (via Email Provider) | Partial/None natively |
| Custom backend work | None (uses VerificationToken model) | High (custom DB, hashing, expiry, rate-limits) |
| Mobile usability | Good, but opens a new tab | Better, user remains in original tab |
| Security risks | Email scanner bots clicking links | Brute-force dictionary attacks |
| Required DB models | `VerificationToken` | Custom `OTP` tables |
| Recommended for 101dev | **Yes** | No |

**Recommendation:** Utilize the built-in Auth.js Magic Links via Resend. It requires zero custom security boilerplate.

## 13. Existing User Migration Strategy

- Existing users map directly into the Auth.js `User` model. `User.id` (Int) does not need to change.
- Existing `username` fields remain intact and act as the `email` identifier.
- Passwords become optional (`String?`). The legacy `/signin` route will safely fail for new Google/Magic Link users because `bcrypt.compare` fails against a `null` password.
- A compatibility bridge is necessary: The frontend must send BOTH the legacy `localStorage` JWT and standard cookies for a transitionary period, and `authMiddleware` should decode whichever is present.

## 14. Security Findings

| Severity | Finding | Evidence | Required mitigation |
| --- | --- | --- | --- |
| High | XSS Exposure | JWT stored in `localStorage` | Migrate to `HttpOnly`, `Secure` cookies via Auth.js |
| High | Broken Authentication | Deleted/disabled users remain logged in | Keep JWTs short-lived or verify user existence in middleware |
| Medium | CSRF Risk | Introduction of cookies | Implement standard Auth.js CSRF checks and `SameSite=Lax` |
| Low | CORS Configuration | Wildcard `*` | Restrict `cors()` to trusted production domains with credentials enabled |
| Low | Email Normalization | `signupInput` does not normalize | Apply `.toLowerCase().trim()` to all auth input |

## 15. Required Environment Variables

**Frontend Public Variables**
- `VITE_BACKEND_URL`

**Backend Normal Variables**
- `DATABASE_URL`
- `JWT_SECRET`

**Worker Secrets**
- `AUTH_SECRET`
- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_RESEND_KEY`
- `AUTH_URL`

## 16. Proposed Database Changes

- Modify `User.password` to be `String?`
- Add `Account` model (linking OAuth providers to `User.id`)
- Add `Session` model (Database sessions)
- Add `VerificationToken` model (Magic Links)

## 17. Proposed File Change Map

| File | Existing/New | Intended change |
| --- | --- | --- |
| `backend/prisma/schema.prisma` | Existing | Make password nullable, append Auth.js models |
| `backend/src/routes/authRouter.ts` | New | Implement `@hono/auth-js` endpoints |
| `backend/src/index.ts` | Existing | Mount the new `authRouter` and tighten CORS |
| `backend/src/routes/blogRouter.ts` | Existing | Update `authMiddleware` to resolve Auth.js sessions in addition to JWTs |
| `frontend/src/pages/Signup.tsx` | Existing | Introduce Google and Email Magic Link buttons |
| `frontend/src/pages/Signin.tsx` | Existing | Introduce Google and Email Magic Link buttons |

## 18. Minimum Verification Matrix

- Legacy password signup/signin (Backward compatibility)
- Google Sign-In (New user)
- Google Sign-In with an existing email (Account Linking)
- Email magic-link consumption
- Protected route access using Auth.js session cookie
- Cross-Origin Cookie propagation in production

## 19. Unknowns and Blocking Questions

- Are the frontend and backend deployed under the same parent domain (e.g., `devloom.com` and `api.devloom.com`), or entirely different domains (e.g., `devloom-frontend.vercel.app` and `devloom-api.workers.dev`)? This strictly dictates if `SameSite=None` or `SameSite=Lax` is required for cookies.

## 20. Final Verdict

**READY WITH CONDITIONS**

The current architecture is highly robust, running standard Hono, Cloudflare Workers with native WinterCG APIs, and Prisma Accelerate. All of these play perfectly with the modern Auth.js ecosystem. 

The conditions for implementation are purely logical:
1. Resolving the Cookie Domain strategy for production.
2. Managing the transitionary period between `localStorage` and `HttpOnly` cookies without locking out existing users.
3. Writing a careful database migration to make the password nullable and append the mandatory Auth.js models.
