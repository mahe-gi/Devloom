# UI Rework Audit Report

## Frontend Architecture & Inconsistencies
The current frontend architecture heavily relies on inconsistent inline Tailwind classes. 
We found significant usage of legacy classes such as `bg-white`, `text-gray-*`, `border-gray-*`, `bg-sky-*`, `shadow-*`, `backdrop-blur`, `font-serif`, `font-sans`, and `transition-*` spread across files like `Appbar.tsx`, `BlogsCard.tsx`, and `ArticleEditor.tsx`.

### Identified Issues:
- **Duplicated Components:** Multiple card variants (`BlogsCard.tsx`, `BlogCardLeft.tsx`, `FullBlogCard.tsx`) and skeleton variants (`BlogSkeleton.tsx`, `BlogsSkeleton.tsx`) indicate redundant logic.
- **Inconsistent Styling:** A mix of custom CSS (`App.css`, `index.css`), legacy gray/sky classes, and standard utility classes creates visual dissonance.
- **Hardcoded Patterns:** The UI frequently hardcodes colors and spacing instead of using a consistent design system or component library.

## Component Migration Inventory

| Current file/component | Purpose | Keep logic | Rebuild visually | Replace | Delete after migration |
|-----------------------|---------|------------|------------------|---------|------------------------|
| `components/Appbar.tsx` | Main navigation | Yes | Yes | No | No |
| `components/BlogsCard.tsx` | Feed article card | Yes | Yes | No | No |
| `components/BlogCardLeft.tsx` | Article detailed view | Yes | Yes | No | No |
| `components/FullBlogCard.tsx` | Full article page card | No | No | Yes | Yes |
| `components/BlogSkeleton.tsx` | Loading state | No | No | Yes | Yes |
| `components/BlogsSkeleton.tsx` | Feed loading state | No | No | Yes | Yes |
| `components/ThemeToggle.tsx` | Dark mode switch | Yes | Yes | No | No |
| `components/ToggleCard.tsx` | Dropdown card | No | No | Yes | Yes |
| `components/ToggleHandleButton.tsx` | Trigger button | No | No | Yes | Yes |
| `pages/Dashboard.tsx` | User dashboard | Yes | Yes | No | No |
| `pages/Landing.tsx` | Landing page | Yes | Yes | No | No |
| `pages/Signin.tsx` | Sign in page | Yes | Yes | No | No |
| `pages/Signup.tsx` | Sign up page | Yes | Yes | No | No |
| `components/article/ArticleEditor.tsx` | Article creation | Yes | Yes | No | No |
