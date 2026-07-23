# Feature-to-Database Traceability Matrix: 101dev

## Traceability Table

| Feature | UI Entry | Frontend Handler / Hook | API Endpoint | Backend Controller | Database Operations | Permissions | Tests | Status | Implementation Gaps |
| ------- | -------- | ----------------------- | ------------ | ------------------ | ------------------- | ----------- | ----- | ------ | ------------------- |
| **User Registration** | `/signup` | `Signup.tsx` (`handlePostSignup`) | `POST /api/v1/user/signup` | `userRouter.ts` (L15) | `User.create` | Public | None | Implemented (Needs Polish) | Username not validated as email; redundant token store logic. |
| **User Authentication** | `/signin` | `Signin.tsx` (`handlePostRequest`) | `POST /api/v1/user/signin` | `userRouter.ts` (L47) | `User.findFirst` | Public | None | Implemented (Needs Polish) | Form input placeholder says "Name" for email; `console.log` leaks hash status. |
| **Session Verification** | `/` (Landing) | `Landing.tsx` (`useEffect`) | `POST /api/v1/user/me` | `userRouter.ts` (L84) | None (JWT verify only) | Bearer Token | None | Implemented (Needs Polish) | Does not verify if user still exists in DB; authorization header format mismatch. |
| **Blog Feed Listing** | `/blogs` | `Blogs.tsx` -> `useBlogs` hook | `GET /api/v1/blog/bulk` | `blogRouter.ts` (L88) | `Blog.findMany` | Bearer Token (Incorrect) | None | Implemented (Needs Polish) | Blocked for guest users; no pagination or limit; no sorting by date; hardcoded dates in UI. |
| **Single Blog Reading** | `/blog/:id` | `Blog.tsx` -> `useblog` hook | `GET /api/v1/blog/:id` | `blogRouter.ts` (L113) | `Blog.findUnique` | Bearer Token (Incorrect) | None | Implemented (Needs Polish) | Blocked for guest users; author name and publish date hardcoded in component; skeleton typo. |
| **Create Article** | `/publish` | `Publish.tsx` (`handleBlogPublish`) | `POST /api/v1/blog` | `blogRouter.ts` (L35) | `Blog.create` | Authenticated | None | Implemented (Needs Polish) | No submit loading state; inputs unvalidated on client side; basic styling. |
| **Update Article** | None | Disconnected / Missing UI | `PUT /api/v1/blog` | `blogRouter.ts` (L60) | `Blog.update` | Authenticated (Insecure) | None | Backend Only / IDOR Flaw | Critical security gap: any authenticated user can overwrite any post. |
| **User Profile / Menu** | Header | `ToggleCard.tsx`, `ToggleHandleButton.tsx` | None | None | None | None | None | Mocked / Partial | Hardcoded name "Mahesh"; profile menu item links to `#`. |
