import { useState, useRef, useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { useMyBlogs, Blog } from "../hooks";
import { Link } from "react-router";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Button } from "../components/ui/Button";

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
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Appbar val={true} />
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex-1 w-full">
          <div className="animate-pulse space-y-8">
            <div className="flex justify-between items-center">
              <div className="h-10 w-64 bg-surface rounded-md"></div>
              <div className="h-10 w-32 bg-surface rounded-md"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-surface rounded-xl"></div>)}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-surface rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Appbar val={true} />
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex-1 flex flex-col items-center justify-center w-full">
          <div className="bg-red-500/10 text-red-500 p-8 rounded-2xl text-center max-w-md border border-red-500/20">
            <h2 className="font-bold text-xl mb-3">Failed to load workspace</h2>
            <p className="text-sm opacity-80 mb-6">{error}</p>
            <Button variant="destructive" onClick={refetch} className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">Retry Connection</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Appbar val={true} />
      
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex-1 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold font-sans tracking-tight">Your Workspace</h1>
            <p className="text-foreground-secondary text-lg mt-2 font-serif">Manage your stories, drafts, and publications on Devloom.</p>
          </div>
          <Link to="/publish" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
            <Button variant="primary" size="lg">
              <span className="mr-2">+</span> Write a story
            </Button>
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface p-6 rounded-2xl border border-border flex flex-col shadow-sm transition-all hover:border-foreground/20">
            <span className="text-foreground-muted text-sm font-semibold uppercase tracking-wider mb-2">Total Stories</span>
            <span className="text-4xl font-bold text-foreground">{total}</span>
          </div>
          <div className="bg-surface p-6 rounded-2xl border border-border flex flex-col shadow-sm transition-all hover:border-foreground/20">
            <span className="text-foreground-muted text-sm font-semibold uppercase tracking-wider mb-2">Published</span>
            <span className="text-4xl font-bold text-green-500">{publishedCount}</span>
          </div>
          <div className="bg-surface p-6 rounded-2xl border border-border flex flex-col shadow-sm transition-all hover:border-foreground/20">
            <span className="text-foreground-muted text-sm font-semibold uppercase tracking-wider mb-2">Drafts</span>
            <span className="text-4xl font-bold text-foreground-secondary">{draftCount}</span>
          </div>
        </div>

        {/* Article List / Table */}
        {total === 0 ? (
          <div className="text-center py-20 bg-surface rounded-xl border border-dashed border-border">
            <div className="mb-4 text-foreground-secondary text-4xl">📄</div>
            <h3 className="text-xl font-bold text-foreground mb-2">Your workspace is empty</h3>
            <p className="text-foreground-muted mb-6 max-w-sm mx-auto">You haven't written any stories yet. Start crafting your first masterpiece today.</p>
            <Link to="/publish" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md inline-block">
              <Button variant="primary">
                <span className="mr-2">+</span> Start Writing
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
            {/* Desktop Header */}
            <div className="hidden sm:grid grid-cols-[120px_1fr_150px_100px] gap-6 p-4 border-b border-border bg-surface-subtle text-xs font-semibold text-foreground-secondary uppercase tracking-wider">
              <div>Cover</div>
              <div>Details</div>
              <div>Status</div>
              <div className="text-right pr-4">Actions</div>
            </div>
            <div className="divide-y divide-border">
              {blogs.map((blog) => (
                <div key={blog.id} className="p-4 sm:p-4 flex flex-col sm:grid sm:grid-cols-[120px_1fr_150px_100px] gap-4 sm:gap-6 items-start sm:items-center hover:bg-surface-subtle transition-colors group">
                  
                  <div className="w-full sm:w-24 h-48 sm:h-16 rounded-md overflow-hidden shrink-0 border border-border bg-background">
                    {blog.coverImage ? (
                      <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-surface flex items-center justify-center text-foreground-secondary text-xs">No Cover</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col gap-1.5 w-full">
                    <h3 className="text-lg sm:text-base font-bold text-foreground truncate">
                      <Link to={`/dashboard/articles/${blog.id}/edit`} className="hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                        {blog.title || "Untitled Story"}
                      </Link>
                    </h3>
                    <div className="text-xs text-foreground-secondary truncate">
                      {new Date(blog.createdAt || "").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-foreground-secondary w-full sm:w-auto">
                    {blog.published ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground-secondary bg-surface-subtle px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted"></span>
                        Draft
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end mt-2 sm:mt-0 relative" ref={menuOpenId === blog.id ? menuRef : null}>
                    <Link to={`/dashboard/articles/${blog.id}/edit`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md">
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => setMenuOpenId(menuOpenId === blog.id ? null : blog.id)}
                    >
                      <span className="text-lg leading-none mb-1">•••</span>
                    </Button>

                    {menuOpenId === blog.id && (
                      <div className="absolute right-0 top-10 w-48 bg-surface border border-border rounded-md shadow-lg z-50 py-1 flex flex-col animate-in fade-in zoom-in-95 duration-100">
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-foreground/5 flex items-center gap-2 disabled:opacity-50 focus-visible:bg-foreground/5 focus-visible:outline-none"
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
                              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-foreground/5 flex items-center gap-2 focus-visible:bg-foreground/5 focus-visible:outline-none"
                            >
                              👁 View
                            </Link>
                            <button 
                              className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-foreground/5 flex items-center gap-2 focus-visible:bg-foreground/5 focus-visible:outline-none"
                              onClick={() => {
                                handleCopyLink(blog.id);
                                setMenuOpenId(null);
                              }}
                            >
                              🔗 Copy Link
                            </button>
                          </>
                        )}
                        
                        <div className="h-px bg-border my-1" />
                        
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2 transition-colors focus-visible:bg-red-500/10 focus-visible:outline-none"
                          onClick={() => {
                            setDeleteModalOpen(blog.id);
                            setMenuOpenId(null);
                          }}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-2xl shadow-xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-6 text-xl border border-red-500/20">
              🗑
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3 font-sans">Delete Story?</h3>
            <p className="text-foreground-muted mb-8 leading-relaxed">
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
