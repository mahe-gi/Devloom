import { useNavigate, useParams } from "react-router";
import { Appbar } from "../components/Appbar";
import { useMyBlog } from "../hooks";
import { ArticleEditor, ArticleEditorValue, PendingAction } from "../components/article/ArticleEditor";
import axios from "axios";
import { toast } from "react-toastify";

function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading, blog, error } = useMyBlog({ id: Number(id) });

  const handleSave = async (value: ArticleEditorValue, action: PendingAction) => {
    try {
      const isPublishAction = action === "publish" || action === "save-changes";
      const token = localStorage.getItem("token");

      if (action === "publish" || action === "unpublish") {
        await axios.patch(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/${id}/published`,
          { published: isPublishAction },
          { headers: { Authorization: token } }
        );
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog`,
        {
          id: Number(id),
          title: value.title.trim(),
          content: value.content.trim(),
          summary: value.summary.trim() || undefined,
          coverImage: value.coverImage.trim() || undefined,
          tags: value.tags || [],
        },
        { headers: { Authorization: token } }
      );

      if (action === "unpublish") {
        toast.success("Article unpublished successfully!");
        const handleBeforeUnload = () => {};
        window.removeEventListener("beforeunload", handleBeforeUnload);
        setTimeout(() => navigate("/dashboard"), 500);
      } else if (action === "publish" || action === "save-changes") {
        toast.success(action === "publish" ? "Article published successfully!" : "Changes saved successfully!");
        const handleBeforeUnload = () => {};
        window.removeEventListener("beforeunload", handleBeforeUnload);
        setTimeout(() => navigate(`/blog/${response.data.slug || id}`), 500);
      } else {
        toast.success("Draft saved successfully!");
      }
    } catch (err: any) {
      const message = err.response?.data?.error || "Failed to save changes.";
      toast.error(message);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Appbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-6 pt-12 max-w-[920px] mx-auto w-full">
            <div className="animate-pulse bg-gray-200 rounded h-12 w-3/4" />
            <div className="animate-pulse bg-gray-200 rounded h-64 w-full mt-8" />
            <div className="animate-pulse bg-gray-200 rounded h-4 w-full" />
            <div className="animate-pulse bg-gray-200 rounded h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || "Could not load article"}</p>
          <button onClick={() => navigate("/dashboard")} className="text-blue-600 hover:underline">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const initialValue: ArticleEditorValue = {
    title: blog.title || "",
    summary: blog.summary || "",
    coverImage: blog.coverImage || "",
    content: blog.content || "",
    published: blog.published || false,
    tags: blog.tags?.map((t: any) => t.tag.name) || [],
  };

  return (
    <div className="min-h-screen bg-white pb-16">
      <Appbar val={true} />
      <ArticleEditor initialValue={initialValue} mode="edit" onSave={handleSave} />
    </div>
  );
}

export default EditArticle;
