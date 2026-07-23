import { useNavigate } from "react-router";
import { Appbar } from "../components/Appbar";
import { ArticleEditor, ArticleEditorValue, PendingAction } from "../components/article/ArticleEditor";
import axios from "axios";
import { toast } from "react-toastify";

function Publish() {
  const navigate = useNavigate();

  const handleSave = async (value: ArticleEditorValue, action: PendingAction) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blog`,
        {
          title: value.title.trim(),
          content: value.content.trim(),
          summary: value.summary.trim() || undefined,
          coverImage: value.coverImage.trim() || undefined,
          tags: value.tags || [],
          published: action === "publish",
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (response.data?.id) {
        toast.success(action === "publish" ? "Article published successfully!" : "Draft saved successfully!");
        
        // Remove dirty state protection before navigating
        const handleBeforeUnload = () => {};
        window.removeEventListener("beforeunload", handleBeforeUnload);

        setTimeout(() => {
          if (action === "publish") {
            navigate(`/blog/${response.data.slug || response.data.id}`);
          } else {
            navigate("/dashboard");
          }
        }, 500);
      }
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to save article. Please try again.";
      toast.error(message);
      throw error;
    }
  };

  const initialValue: ArticleEditorValue = {
    title: "",
    summary: "",
    coverImage: "",
    content: "",
    published: false,
    tags: [],
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <Appbar val={true} />
      <ArticleEditor initialValue={initialValue} mode="create" onSave={handleSave} />
    </div>
  );
}

export default Publish;
