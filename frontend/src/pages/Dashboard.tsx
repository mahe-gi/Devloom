import { useState, useRef, useEffect } from "react";
import { Appbar } from "../components/Appbar";
import { useMyBlogs, Blog } from "../hooks";
import { Link } from "react-router";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";


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
      <div className="min-h-screen bg-white flex flex-col">
        <Appbar val={true} />
        <div className="max-w-5xl mx-auto px-4 py-12 flex-1 w-full">
          <div className="animate-pulse space-y-8">
            <div className="flex justify-between items-center">
              <div className="h-10 w-64 bg-gray-100 rounded-md"></div>
              <div className="h-10 w-32 bg-gray-100 rounded-md"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>)}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Appbar val={true} />
        <div className="max-w-5xl mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center w-full">
          <div className="bg-red-100 text-red-600 p-8 rounded-2xl text-center max-w-md border border-red-200">
            <h2 className="font-bold text-xl mb-3">Failed to load dashboard</h2>
            <p className="text-sm opacity-80 mb-6">{error}</p>
            <button className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md" onClick={refetch}>Retry Connection</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Appbar val={true} />
      
      <div className="max-w-5xl mx-auto px-4 py-12 flex-1 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 font-sans tracking-tight">Your Workspace</h1>
            <p className="text-gray-500 text-lg mt-2 font-serif">Manage your stories, drafts, and publications.</p>
          </div>
          <Link 
            to="/publish" 
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 shadow-sm h-10 px-4 py-2 text-sm"
          >
            <span className="mr-2">+</span> Write a story
          </Link>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col shadow-sm">
            <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Stories</span>
            <span className="text-4xl font-bold text-gray-900">{total}</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col shadow-sm">
            <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Published</span>
            <span className="text-4xl font-bold text-blue-600">{publishedCount}</span>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col shadow-sm">
            <span className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">Drafts</span>
            <span className="text-4xl font-bold text-gray-900 opacity-70">{draftCount}</span>
          </div>
        </div>

        {/* Article List / Table */}
        {total === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <div className="mb-4 text-gray-400 text-4xl">📄</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your workspace is empty</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">You haven't written any stories yet. Start crafting your first masterpiece today.</p>
            <Link 
              to="/publish" 
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 shadow-sm h-10 px-4 py-2 text-sm"
            >
              <span className="mr-2">+</span> Start Writing
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-200">
              {blogs.map((blog) => (
                <div key={blog.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-gray-50 transition-colors">
                  
                  {blog.coverImage && (
                    <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 border border-gray-200 hidden sm:block">
                      <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0 flex flex-col gap-1 w-full">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                      <Link to={`/dashboard/articles/${blog.id}/edit`} className="hover:text-blue-600 transition-colors">
                        {blog.title || "Untitled Story"}
                      </Link>
                    </h3>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                      {blog.published ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                          ✓ Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                          ○ Draft
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
                      className="inline-flex items-center justify-center h-9 px-4 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
                    >
                      ✎ Edit
                    </Link>

                    {/* Overflow Menu */}
                    <button 
                      className="h-9 w-9 inline-flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors border border-transparent focus:outline-none"
                      onClick={() => setMenuOpenId(menuOpenId === blog.id ? null : blog.id)}
                    >
                      •••
                    </button>

                    {menuOpenId === blog.id && (
                      <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 py-1 flex flex-col animate-in fade-in zoom-in-95 duration-100">
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50"
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
                              className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 flex items-center gap-2"
                            >
                              👁 View
                            </Link>
                            <button 
                              className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 flex items-center gap-2"
                              onClick={() => {
                                handleCopyLink(blog.id);
                                setMenuOpenId(null);
                              }}
                            >
                              🔗 Copy Link
                            </button>
                          </>
                        )}
                        
                        <div className="h-px bg-gray-200 my-1" />
                        
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-6 text-xl">
              🗑
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 font-sans">Delete Story?</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Are you sure you want to delete this story? This action cannot be undone and the content will be permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setDeleteModalOpen(null)}
                disabled={deletingId === deleteModalOpen}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50"
                onClick={() => handleDelete(deleteModalOpen)}
                disabled={deletingId === deleteModalOpen}
              >
                {deletingId === deleteModalOpen ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Dashboard;
