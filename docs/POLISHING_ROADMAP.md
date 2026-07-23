# Prioritized Implementation & Polishing Roadmap: 101dev

## Phase Breakdown

### P0 — Critical Blockers & Security Fixes
| ID | Priority | Area | Problem | Evidence | Proposed Change | Files Likely Affected | Risk | Acceptance Criteria |
| -- | -------- | ---- | ------- | -------- | --------------- | --------------------- | ---- | ------------------- |
| P0-1 | P0 | Backend Security | IDOR on `PUT /api/v1/blog` | `blogRouter.ts` L60 | Restrict update mutation with `where: { id: reqData.id, authorId: Number(userId) }` | `backend/src/routes/blogRouter.ts` | Low | Only the post author can successfully update a post; non-authors receive 403 Forbidden. |
| P0-2 | P0 | Backend Routing | Public blog reading blocked | `blogRouter.ts` L17 | Remove global `blogRouter.use("/*")` and apply auth middleware specifically to mutating routes (`POST`, `PUT`, `DELETE`). | `backend/src/routes/blogRouter.ts` | Low | Unauthenticated users can fetch `/api/v1/blog/bulk` and `/api/v1/blog/:id` without 401 token errors. |
| P0-3 | P0 | Backend Architecture | Per-request Prisma Client instantiation | `userRouter.ts`, `blogRouter.ts` | Instantiate Prisma Client Edge once per worker context / middleware binding. | `backend/src/routes/userRouter.ts`, `backend/src/routes/blogRouter.ts` | Low | Database connections are reused efficiently across worker invocations. |
| P0-4 | P0 | Frontend Syntax | Rogue `ß` character in skeleton component | `BlogSkeleton.tsx` L33 | Clean syntax error on line 33 of `BlogSkeleton.tsx`. | `frontend/src/components/BlogSkeleton.tsx` | Low | Skeleton component renders cleanly without rogue characters. |
| P0-5 | P0 | Auth Consistency | Token header format mismatch | `Landing.tsx`, `Publish.tsx` | Standardize token storage and authorization header formatting (`Bearer token`). | `frontend/src/pages/Landing.tsx`, `Publish.tsx`, `Signin.tsx` | Low | Token verification succeeds consistently across all authenticated routes. |

---

### P1 — Database Schema & Backend Polish
| ID | Priority | Area | Problem | Evidence | Proposed Change | Files Likely Affected | Risk | Acceptance Criteria |
| -- | -------- | ---- | ------- | -------- | --------------- | --------------------- | ---- | ------------------- |
| P1-1 | P1 | Database Schema | Missing timestamps in Prisma schema | `schema.prisma` | Add `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt` to `User` and `Blog`. | `backend/prisma/schema.prisma` | Low | Schema builds with timestamps; database queries expose creation dates. |
| P1-2 | P1 | Database Performance | Unindexed queries & unpaginated feed | `blogRouter.ts` L88 | Add `@index([authorId])` in Prisma schema; implement `take`, `skip` pagination and `orderBy: { createdAt: 'desc' }` on `/bulk`. | `backend/prisma/schema.prisma`, `backend/src/routes/blogRouter.ts` | Low | `/bulk` returns paginated, latest-first articles. |
| P1-3 | P1 | Backend Auth | User details verification | `userRouter.ts` L84 | Update `POST /me` to query database and return user profile details (`id`, `name`, `username`). | `backend/src/routes/userRouter.ts` | Low | Backend returns verified user details. |

---

### P2 — UI/UX & Feature Polish
| ID | Priority | Area | Problem | Evidence | Proposed Change | Files Likely Affected | Risk | Acceptance Criteria |
| -- | -------- | ---- | ------- | -------- | --------------- | --------------------- | ---- | ------------------- |
| P2-1 | P2 | Frontend Auth UI | Commented out `<Quote />` component | `Signup.tsx`, `Signin.tsx` | Restore split-screen layout with `<Quote />` on `lg` screens. | `frontend/src/pages/Signup.tsx`, `Signin.tsx` | Low | Auth screens render side-by-side quote panel on large screens. |
| P2-2 | P2 | Frontend Usability | Signin email input placeholder typo | `Signin.tsx` L75 | Fix label and placeholder to correctly prompt for email. | `frontend/src/pages/Signin.tsx` | Low | Placeholder correctly displays email prompt. |
| P2-3 | P2 | Frontend Reader UI | Hardcoded author and publication date | `BlogCardLeft.tsx`, `BlogsCard.tsx` | Render dynamic `blog.author.name` and formatted `blog.createdAt`. | `frontend/src/components/BlogCardLeft.tsx`, `BlogsCard.tsx`, `Blogs.tsx` | Low | Real author name and date displayed on cards and blog detail screen. |
| P2-4 | P2 | Frontend Authoring | Publish button missing loading state | `Publish.tsx` | Add loading state and disable button while publishing. | `frontend/src/pages/Publish.tsx` | Low | Publish button shows spinner and prevents double-submits. |
| P2-5 | P2 | Frontend Landing | Bare redirect text on landing page | `Landing.tsx` | Replace bare text with a polished Landing Hero section for guest readers. | `frontend/src/pages/Landing.tsx` | Low | Visiting `/` presents a welcoming hero section with CTA buttons. |

---

### P3 — Maintainability & Tooling
| ID | Priority | Area | Problem | Evidence | Proposed Change | Files Likely Affected | Risk | Acceptance Criteria |
| -- | -------- | ---- | ------- | -------- | --------------- | --------------------- | ---- | ------------------- |
| P3-1 | P3 | DX / Monorepo | Missing root npm scripts | Root `package.json` | Add root `package.json` with npm workspace configuration and scripts (`dev`, `build`, `lint`). | `package.json` | Low | Root `npm run dev` starts all workspace services cleanly. |
