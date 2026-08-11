import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Search, X, ArrowRight, Loader2, BookOpen } from "lucide-react";
import { useBlogs } from "../../hooks";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const { blogs, loading } = useBlogs({ q: query, limit: 6 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200">
      <div className="bg-surface border border-border/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col font-sans">
        
        {/* Search Input Bar */}
        <div className="p-5 border-b border-border/40 flex items-center gap-3">
          <Search className="w-5 h-5 text-loom" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, tags, authors, system design..."
            autoFocus
            className="w-full bg-transparent text-foreground text-lg placeholder:text-muted-foreground focus:outline-none font-sans"
          />
          {loading && <Loader2 className="w-4 h-4 animate-spin text-loom" />}
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results List */}
        <div className="max-h-[380px] overflow-y-auto p-4 flex flex-col gap-2">
          {query.trim() === "" ? (
            <div className="p-8 text-center text-muted-foreground font-mono text-xs">
              TYPE A KEYWORD TO SEARCH REAL ARTICLES (E.G., "REACT", "MEMORY", "NODE")
            </div>
          ) : blogs.length === 0 && !loading ? (
            <div className="p-8 text-center text-muted-foreground font-mono text-xs">
              NO MATCHING ARTICLES FOUND FOR "{query}"
            </div>
          ) : (
            blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.slug || blog.id}`}
                onClick={onClose}
                className="p-4 rounded-2xl bg-surface-subtle/50 hover:bg-surface border border-transparent hover:border-loom/40 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-loom" />
                  <div>
                    <h4 className="font-bold text-sm text-foreground group-hover:text-loom transition-colors">
                      {blog.title}
                    </h4>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">
                      By {blog.author?.name || blog.author?.username || "Anonymous"}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-loom group-hover:translate-x-1 transition-all" />
              </Link>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-3 border-t border-border/40 bg-surface-subtle/40 flex justify-between items-center font-mono text-[11px] text-subtle-foreground">
          <span>PRESS ESC TO CLOSE</span>
          <span>DEVLOOM INDEX SEARCH</span>
        </div>
      </div>
    </div>
  );
}
