# Project Discovery Report: 101dev (Medium/Blog Platform)

## 1. Product Identity
- **Application Name**: 101dev (Medium / Blog Platform Clone)
- **Product Category**: Content Publishing & Blogging Platform
- **Primary Business Problem**: Provides developers and tech creators with a fast, modern platform to read, write, publish, and manage long-form technical articles and blogs.
- **Intended Users**: Tech writers, developers, engineers, and general tech readers.
- **User Roles**:
  - **Guest User**: Can view public blog posts (currently blocked by auth middleware, intended feature).
  - **Authenticated Author/Reader**: Can log in, publish blog posts, edit own posts, view feed, and manage session.
- **Main User Journeys**:
  1. User registers (`/signup`) or logs in (`/signin`), receives JWT stored in `localStorage`.
  2. Redirected to feed (`/blogs`) to view published articles.
  3. Clicks on article to view full details (`/blog/:id`).
  4. Navigates to `/publish` to write and publish a new blog post.
  5. Logs out via user avatar dropdown in top header.

## 2. Functional Module Inventory & Status

| Feature / Module | Scope | Status | Evidence & Gaps |
| ---------------- | ----- | ------ | --------------- |
| User Signup | Auth | Implemented (Needs Polish) | `userRouter.ts` (`POST /signup`), `Signup.tsx`. Lack of Zod email format validation. Redundant token store logic. |
| User Signin | Auth | Implemented (Needs Polish) | `userRouter.ts` (`POST /signin`), `Signin.tsx`. Wrong input placeholder ("Name" for email). |
| Session Verification | Auth | Implemented (Needs Polish) | `userRouter.ts` (`POST /me`), `Landing.tsx`. Does not verify user existence in DB. Header format inconsistent. |
| Blog Feed (Bulk) | Feed | Implemented (Needs Polish) | `blogRouter.ts` (`GET /bulk`), `Blogs.tsx`. Protected behind auth middleware (unauthenticated users blocked). No pagination or sorting. Hardcoded dates in frontend. |
| Blog Detail View | Reader | Implemented (Needs Polish) | `blogRouter.ts` (`GET /:id`), `Blog.tsx`, `BlogCardLeft.tsx`. Protected behind auth middleware. Author name & date hardcoded in component. Syntax error `ß` in `BlogSkeleton.tsx`. |
| Publish Blog | Authoring | Implemented (Needs Polish) | `blogRouter.ts` (`POST /`), `Publish.tsx`. No loading state on submit button. |
| Update Blog | Editing | Backend Only / Disconnected | `blogRouter.ts` (`PUT /`). No UI screen/button exists. Critical IDOR flaw (no author ownership check). |
| User Dropdown / Menu | Header | Mocked / Partial | `Appbar.tsx`, `ToggleCard.tsx`. Avatar hardcoded to "Mahesh". Profile link points to `#`. |
| Landing Page | Landing | Mocked / Redirection | `Landing.tsx`. Bare redirect spinner; no marketing UI for visitors. |
| Split Quote Panel | Design | Hidden / Commented Out | `Quote.tsx`, `Signup.tsx`, `Signin.tsx`. Component disabled in code comments. |

## 3. Confirmed Technology Stack Summary
- **Frontend**: React 18.3, Vite 6.0, Tailwind CSS 4.0, React Router 7.1, Axios 1.7, React Toastify 11.0.
- **Backend**: Cloudflare Workers Edge Runtime, Hono 4.0, Prisma Client Edge 6.3, Prisma Accelerate 1.2, bcryptjs 3.0.
- **Database**: PostgreSQL with Prisma ORM 6.4.
- **Shared Library**: `@mahe-npm/common` (Zod schemas for validation).

## 4. Local Setup Summary
- Monorepo structure containing `backend`, `frontend`, and `common`.
- Local development requires running `wrangler dev` for backend and `vite` for frontend. Dependencies need to be installed via `npm install` in each workspace directory.
