import "./App.css";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Landing from "./pages/Landing";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "./components/ErrorBoundary";

const Signin = lazy(() => import("./pages/Signin"));
const Blog = lazy(() => import("./pages/Blog"));
const Blogs = lazy(() => import("./pages/Blogs"));
const Publish = lazy(() => import("./pages/Publish"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const EditArticle = lazy(() => import("./pages/EditArticle"));
const DashboardProfile = lazy(() => import("./pages/DashboardProfile").then(m => ({ default: m.DashboardProfile })));
const AuthorProfile = lazy(() => import("./pages/AuthorProfile").then(m => ({ default: m.AuthorProfile })));
const Tag = lazy(() => import("./pages/Tag").then(m => ({ default: m.Tag })));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={<Signin />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/tags/:slug" element={<Tag />} />
              <Route path="/blog/:slugOrId" element={<Blog />} />
              <Route path="/authors/:handle" element={<AuthorProfile />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/articles/:id/edit" element={<EditArticle />} />
                <Route path="/dashboard/profile" element={<DashboardProfile />} />
                <Route path="/publish" element={<Publish />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
