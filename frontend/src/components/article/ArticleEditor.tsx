import { useState, useEffect, useRef } from "react";
import { MarkdownToolbar } from "./MarkdownToolbar";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { TagInput } from "./TagInput";
import { ToastContainer, toast } from "react-toastify";
import { Settings } from "lucide-react";

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
      <div className="w-full max-w-[720px] px-4 py-8 flex flex-col gap-8">
        
        {/* Action Buttons Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-16 z-20 bg-background/95 backdrop-blur py-4 border-b border-border">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("write")}
              className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-md ${
                activeTab === "write" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Write
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`text-sm font-medium transition-colors px-3 py-1.5 rounded-md ${
                activeTab === "preview" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md ${
                showSettings ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            {mode === "create" || (mode === "edit" && !baseline.published) ? (
              <>
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                  disabled={isSaving || pendingAction === "save-draft"}
                  onClick={() => handleAction("save-draft", false)}
                >
                  {pendingAction === "save-draft" ? "Saving..." : "Save Draft"}
                </button>
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary-hover transition-colors disabled:opacity-50"
                  disabled={isSaving || pendingAction === "publish"}
                  onClick={() => handleAction("publish", true)}
                >
                  {pendingAction === "publish" ? "Publishing..." : "Publish"}
                </button>
              </>
            ) : (
              <>
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium text-foreground border border-border hover:bg-muted transition-colors disabled:opacity-50"
                  disabled={isSaving || pendingAction === "unpublish"}
                  onClick={() => handleAction("unpublish", false)}
                >
                  {pendingAction === "unpublish" ? "Unpublishing..." : "Unpublish"}
                </button>
                <button
                  className="px-4 py-2 rounded-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary-hover transition-colors disabled:opacity-50"
                  disabled={isSaving || pendingAction === "save-changes"}
                  onClick={() => handleAction("save-changes", true)}
                >
                  {pendingAction === "save-changes" ? "Saving..." : "Save Changes"}
                </button>
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
                className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-foreground placeholder:text-muted-foreground text-sm"
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
                className="w-full px-4 py-2 bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none text-foreground placeholder:text-muted-foreground text-sm"
                rows={3}
                value={value.summary}
                onChange={(e) => setValue({ ...value, summary: e.target.value })}
                disabled={isSaving}
                maxLength={300}
              />
              <div className="text-right text-xs text-muted-foreground mt-1">
                {value.summary.length} / 300
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
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
            <div className="mt-2 flex flex-col">
              <input
                type="text"
                placeholder="Title"
                className="w-full text-5xl font-bold text-foreground bg-transparent outline-none placeholder:text-muted-foreground/60 mb-6 py-2 border-none focus:ring-0 leading-tight"
                value={value.title}
                onChange={(e) => setValue({ ...value, title: e.target.value })}
                disabled={isSaving}
              />
              
              <div className="flex flex-col border border-border/40 rounded-xl overflow-hidden shadow-sm bg-background transition-colors focus-within:border-border focus-within:ring-1 focus-within:ring-border mt-2">
                <MarkdownToolbar 
                  textareaRef={textareaRef} 
                  onChange={(content) => setValue({ ...value, content })}
                  disabled={isSaving}
                />
                
                <textarea
                  ref={textareaRef}
                  placeholder="Tell your story..."
                  className="w-full min-h-[60vh] bg-transparent border-none outline-none focus:ring-0 text-lg text-foreground placeholder:text-muted-foreground font-serif leading-relaxed resize-none disabled:opacity-50 p-6"
                  value={value.content}
                  onChange={(e) => setValue({ ...value, content: e.target.value })}
                  disabled={isSaving}
                />
              </div>
            </div>
          ) : (
            <div className="min-h-[70vh] py-8 prose prose-slate max-w-none prose-lg dark:prose-invert">
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
