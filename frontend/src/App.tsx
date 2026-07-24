import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Signin from "./pages/Signin";
import Blog from "./pages/Blog";
import Blogs from "./pages/Blogs";
import Publish from "./pages/Publish";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import EditArticle from "./pages/EditArticle";
import { DashboardProfile } from "./pages/DashboardProfile";
import { AuthorProfile } from "./pages/AuthorProfile";
import { Tag } from "./pages/Tag";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  return (
      <HelmetProvider>
        <ErrorBoundary>
          <BrowserRouter>
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
          </BrowserRouter>
        </ErrorBoundary>
      </HelmetProvider>
  );
}

export default App;
