import { useState, useEffect, useRef } from "react";
import { MarkdownToolbar } from "./MarkdownToolbar";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { TagInput } from "./TagInput";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "../ui/Button";
import { Settings2 } from "lucide-react";

export type ArticleEditorValue = {
  title: string;
  summary: string;
  coverImage: string;
  content: string;
  published: boolean;
  tags: string[];
};

export type PendingAction =
  | "save-draft"
  | "publish"
  | "save-changes"
  | "unpublish"
  | null;

interface ArticleEditorProps {
  initialValue: ArticleEditorValue;
  mode: "create" | "edit";
  onSave: (value: ArticleEditorValue, action: PendingAction) => Promise<void>;
}

export function ArticleEditor({ initialValue, mode, onSave }: ArticleEditorProps) {
  const [value, setValue] = useState<ArticleEditorValue>(initialValue);
  const [baseline, setBaseline] = useState<ArticleEditorValue>(initialValue);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDirty = 
    value.title !== baseline.title ||
    value.summary !== baseline.summary ||
    value.coverImage !== baseline.coverImage ||
    value.content !== baseline.content ||
    value.published !== baseline.published ||
    JSON.stringify(value.tags) !== JSON.stringify(baseline.tags);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const handleAction = async (action: PendingAction, publishState: boolean) => {
    if (!value.title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    if (!value.content.trim()) {
      toast.error("Content cannot be empty");
      return;
    }
    
    setPendingAction(action);
    const newValue = { ...value, published: publishState };
    
    try {
      await onSave(newValue, action);
      setBaseline(newValue);
      setValue(newValue);
    } catch (err) {
      // Error handling is managed by parent, but we keep it dirty here on fail
    } finally {
      setPendingAction(null);
    }
  };

  const isSaving = pendingAction !== null;

  return (
    <div className="w-full flex justify-center bg-background min-h-screen pb-16">
      <div className="w-full max-w-[920px] px-4 py-8 flex flex-col gap-8">
        
        {/* Action Buttons Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-20 bg-background/95 backdrop-blur py-4 border-b border-border/50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("write")}
              className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-md ${
                activeTab === "write" ? "bg-surface-subtle text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              Write
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-md ${
                activeTab === "preview" ? "bg-surface-subtle text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`text-sm font-medium transition-colors flex items-center gap-1 px-3 py-1.5 rounded-md ${
                showSettings ? "bg-surface-subtle text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              <Settings2 size={16} />
              Settings
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            {mode === "create" || (mode === "edit" && !baseline.published) ? (
              <>
                <Button
                  variant="ghost"
                  disabled={isSaving}
                  onClick={() => handleAction("save-draft", false)}
                  loading={pendingAction === "save-draft"}
                >
                  Save Draft
                </Button>
                <Button
                  variant="primary"
                  disabled={isSaving}
                  onClick={() => handleAction("publish", true)}
                  loading={pendingAction === "publish"}
                >
                  Publish
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  disabled={isSaving}
                  onClick={() => handleAction("unpublish", false)}
                  loading={pendingAction === "unpublish"}
                >
                  Unpublish
                </Button>
                <Button
                  variant="primary"
                  disabled={isSaving}
                  onClick={() => handleAction("save-changes", true)}
                  loading={pendingAction === "save-changes"}
                >
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-6 bg-surface border border-border rounded-xl flex flex-col gap-5 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Cover Image URL (Optional)</label>
              <input
                type="url"
                placeholder="https://example.com/image.png"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground placeholder:text-muted"
                value={value.coverImage}
                onChange={(e) => setValue({ ...value, coverImage: e.target.value })}
                disabled={isSaving}
              />
              {value.coverImage && (
                <div className="mt-3">
                  <img 
                    src={value.coverImage} 
                    alt="Cover Preview" 
                    className="h-32 w-auto object-cover rounded-md border border-border shadow-sm" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                    onLoad={(e) => {
                      (e.target as HTMLImageElement).style.display = 'block';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Summary (Optional)</label>
              <textarea
                placeholder="A brief summary of your article..."
                className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none text-foreground placeholder:text-muted"
                rows={3}
                value={value.summary}
                onChange={(e) => setValue({ ...value, summary: e.target.value })}
                disabled={isSaving}
                maxLength={300}
              />
              <div className="text-right text-xs text-muted mt-1">
                {value.summary.length} / 300
              </div>
            </div>
            
            <div className="pt-2 border-t border-border/50">
              <TagInput
                tags={value.tags || []}
                onChange={(tags) => setValue({ ...value, tags })}
                disabled={isSaving}
              />
            </div>
          </div>
        )}

        {/* Editor Area */}
        <div className="flex flex-col gap-2 relative">
          {activeTab === "write" ? (
            <div className="mt-4">
              <MarkdownToolbar 
                textareaRef={textareaRef} 
                onChange={(content) => setValue({ ...value, content })}
                disabled={isSaving}
              />
              {/* Title Input */}
              <input
                type="text"
                placeholder="Title"
                className="w-full text-5xl font-bold text-foreground bg-transparent outline-none placeholder:text-muted/40 mb-6 py-2 border-none focus:ring-0"
                value={value.title}
                onChange={(e) => setValue({ ...value, title: e.target.value })}
                disabled={isSaving}
              />
              
              <textarea
                ref={textareaRef}
                placeholder="Write your story..."
                className="w-full min-h-[70vh] bg-transparent border-none outline-none focus:ring-0 text-xl text-foreground placeholder:text-muted/60 font-serif leading-relaxed resize-none disabled:opacity-50"
                value={value.content}
                onChange={(e) => setValue({ ...value, content: e.target.value })}
                disabled={isSaving}
              />
            </div>
          ) : (
            <div className="min-h-[70vh] py-8 prose prose-slate max-w-none prose-lg">
              <h1 className="text-5xl font-bold mb-8 text-foreground">{value.title || "Untitled"}</h1>
              <MarkdownRenderer content={value.content || "*Nothing to preview yet.*"} />
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
