import { useState, useRef, useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { useMyBlogs, Blog } from "../hooks";
import { Link } from "react-router";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { EmptyState } from "../components/ui/EmptyState";
import { Edit, Trash2, Eye, Copy, CheckCircle2, Circle, FileText, Plus, MoreHorizontal } from "lucide-react";

function Dashboard() {
  const { loading, blogs, error, refetch } = useMyBlogs();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [mutatingId, setMutatingId] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState<number | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const total = blogs.length;
  const publishedCount = blogs.filter((b) => b.published).length;
  const draftCount = total - publishedCount;

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);
      const token = localStorage.getItem("token") || "";
      const headers = { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` };
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/${id}`, { headers });
      toast.success("Article deleted safely.", { position: "bottom-right", theme: "colored", transition: Bounce });
      setDeleteModalOpen(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to delete article", { position: "bottom-right", theme: "colored" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    try {
      setMutatingId(blog.id);
      const token = localStorage.getItem("token") || "";
      const headers = { Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}` };
      const newStatus = !blog.published;
      
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/${blog.id}/published`,
        { published: newStatus },
        { headers }
      );
      
      toast.success(newStatus ? "Article published publicly." : "Article unpublished and is now a draft.", { position: "bottom-right", theme: "colored", transition: Bounce });
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to change publish status", { position: "bottom-right", theme: "colored" });
    } finally {
      setMutatingId(null);
    }
  };

  const handleCopyLink = (id: number) => {
    const link = `${window.location.origin}/blog/${id}`;
    navigator.clipboard.writeText(link).then(() => {
      toast.info("Public link copied to clipboard!", { position: "bottom-right", theme: "colored", transition: Bounce });
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Appbar val={true} />
        <Container size="standard" className="py-12 flex-1">
          <div className="animate-pulse space-y-8">
            <div className="flex justify-between items-center">
              <div className="h-10 w-64 bg-surface-subtle rounded-md"></div>
              <div className="h-10 w-32 bg-surface-subtle rounded-md"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-surface-subtle rounded-xl"></div>)}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-surface-subtle rounded-xl"></div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Appbar val={true} />
        <Container size="standard" className="py-12 flex-1 flex flex-col items-center justify-center">
          <div className="bg-destructive/10 text-destructive p-8 rounded-2xl text-center max-w-md border border-destructive/20">
            <h2 className="font-bold text-xl mb-3">Failed to load dashboard</h2>
            <p className="text-sm opacity-80 mb-6">{error}</p>
            <Button variant="destructive" onClick={refetch}>Retry Connection</Button>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Appbar val={true} />
      
      <Container size="standard" className="py-12 flex-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground font-sans tracking-tight">Your Workspace</h1>
            <p className="text-muted text-lg mt-2 font-serif">Manage your stories, drafts, and publications.</p>
          </div>
          <Link 
            to="/publish" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm h-10 px-4 py-2 text-sm"
          >
            <Plus size={16} className="mr-2" /> Write a story
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface p-6 rounded-2xl border border-border flex flex-col shadow-sm">
            <span className="text-muted text-sm font-semibold uppercase tracking-wider mb-2">Total Stories</span>
            <span className="text-4xl font-bold text-foreground">{total}</span>
          </div>
          <div className="bg-surface p-6 rounded-2xl border border-border flex flex-col shadow-sm">
            <span className="text-muted text-sm font-semibold uppercase tracking-wider mb-2">Published</span>
            <span className="text-4xl font-bold text-primary">{publishedCount}</span>
          </div>
          <div className="bg-surface p-6 rounded-2xl border border-border flex flex-col shadow-sm">
            <span className="text-muted text-sm font-semibold uppercase tracking-wider mb-2">Drafts</span>
            <span className="text-4xl font-bold text-foreground opacity-70">{draftCount}</span>
          </div>
        </div>

        {/* Article List / Table */}
        {total === 0 ? (
          <EmptyState 
            title="Your workspace is empty"
            description="You haven't written any stories yet. Start crafting your first masterpiece today."
            icon={FileText}
            action={
              <Link 
                to="/publish" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm h-10 px-4 py-2 text-sm"
              >
                <Plus size={16} className="mr-2" /> Start Writing
              </Link>
            }
          />
        ) : (
          <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="divide-y divide-border">
              {blogs.map((blog) => (
                <div key={blog.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-surface-subtle transition-colors">
                  
                  {blog.coverImage && (
                    <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 border border-border/50 hidden sm:block">
                      <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 flex flex-col gap-1 w-full">
                    <h3 className="text-lg font-bold text-foreground truncate">
                      <Link to={`/dashboard/articles/${blog.id}/edit`} className="hover:text-primary transition-colors">
                        {blog.title || "Untitled Story"}
                      </Link>
                    </h3>
                    
                    <div className="flex items-center gap-3 text-sm text-muted mt-1">
                      {blog.published ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                          <CheckCircle2 size={12} /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted">
                          <Circle size={12} /> Draft
                        </span>
                      )}
                      <span>&bull;</span>
                      <span>{new Date(blog.createdAt || "").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0 relative" ref={menuOpenId === blog.id ? menuRef : null}>
                    {/* Primary Action */}
                    <Link 
                      to={`/dashboard/articles/${blog.id}/edit`} 
                      className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors"
                    >
                      <Edit size={14} className="mr-2" /> Edit
                    </Link>

                    {/* Overflow Menu */}
                    <button 
                      className="h-9 w-9 inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-subtle rounded-md transition-colors border border-transparent focus:outline-none"
                      onClick={() => setMenuOpenId(menuOpenId === blog.id ? null : blog.id)}
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {menuOpenId === blog.id && (
                      <div className="absolute right-0 top-12 w-48 bg-surface border border-border rounded-md shadow-lg z-50 py-1 flex flex-col animate-in fade-in zoom-in-95 duration-100">
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface-subtle flex items-center gap-2 disabled:opacity-50"
                          disabled={mutatingId === blog.id}
                          onClick={() => {
                            handleTogglePublish(blog);
                            setMenuOpenId(null);
                          }}
                        >
                          {mutatingId === blog.id ? "Saving..." : (blog.published ? "Unpublish" : "Publish")}
                        </button>

                        {blog.published && (
                          <>
                            <Link 
                              to={`/blog/${blog.id}`}
                              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface-subtle flex items-center gap-2"
                            >
                              <Eye size={14} /> View
                            </Link>
                            <button 
                              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-surface-subtle flex items-center gap-2"
                              onClick={() => {
                                handleCopyLink(blog.id);
                                setMenuOpenId(null);
                              }}
                            >
                              <Copy size={14} /> Copy Link
                            </button>
                          </>
                        )}
                        
                        <div className="h-px bg-border my-1" />
                        
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2"
                          onClick={() => {
                            setDeleteModalOpen(blog.id);
                            setMenuOpenId(null);
                          }}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-2xl shadow-xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-6">
              <Trash2 size={24} />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3 font-sans">Delete Story?</h3>
            <p className="text-muted mb-8 leading-relaxed">
              Are you sure you want to delete this story? This action cannot be undone and the content will be permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <Button 
                variant="outline"
                onClick={() => setDeleteModalOpen(null)}
                disabled={deletingId === deleteModalOpen}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={() => handleDelete(deleteModalOpen)}
                disabled={deletingId === deleteModalOpen}
                loading={deletingId === deleteModalOpen}
              >
                {deletingId === deleteModalOpen ? "Deleting..." : "Delete Permanently"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Dashboard;
