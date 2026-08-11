import { useState } from "react";
import { Link } from "react-router";
import { Blog } from "../../hooks";
import { ArrowUpRight, Clock, Tag, User as UserIcon } from "lucide-react";
import { Avatar } from "../ui/Avatar";

interface LiveArticleStreamProps {
  blogs: Blog[];
  loading: boolean;
}

export function LiveArticleStream({ blogs, loading }: LiveArticleStreamProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const getReadTime = (content: string) => {
    if (!content) return "2 min read";
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Recent";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
  };

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 border-b border-border/40 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="font-mono text-xs text-loom uppercase tracking-widest block mb-2">
            SECTION 02 // REAL-TIME DISCOVERY
          </span>
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter text-foreground uppercase">
            LIVE ARTICLE STREAM.
          </h2>
        </div>
        <p className="text-muted-foreground text-sm max-w-md font-medium">
          Direct insights, architectural post-mortems, and engineering notes streamed straight from active developer publications.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-surface-subtle animate-pulse border border-border/40" />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground font-mono text-sm">NO PUBLISHED ARTICLES YET.</p>
          <Link to="/publish" className="inline-block mt-4 text-loom font-bold text-sm hover:underline">
            Be the first to publish →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Numbered Interactive Titles Stream */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-border/40">
            {blogs.slice(0, 6).map((blog, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div
                  key={blog.id}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`py-6 cursor-pointer transition-all duration-300 group flex items-start justify-between gap-4 ${
                    isActive ? "pl-4 border-l-4 border-loom" : "hover:pl-2"
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    <span className="font-mono text-xs text-subtle-foreground font-bold pt-1">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <div>
                      <Link
                        to={`/blog/${blog.slug || blog.id}`}
                        className={`text-xl md:text-2xl font-bold tracking-tight block transition-colors ${
                          isActive ? "text-loom" : "text-foreground group-hover:text-loom"
                        }`}
                      >
                        {blog.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground font-mono">
                        <span>{blog.author?.name || blog.author?.username || "Anonymous"}</span>
                        <span>•</span>
                        <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/blog/${blog.slug || blog.id}`}
                    aria-label={`Read ${blog.title}`}
                    className={`p-2 rounded-full border transition-all ${
                      isActive
                        ? "bg-loom text-black border-loom translate-x-1"
                        : "border-border/60 text-muted-foreground group-hover:text-foreground group-hover:border-foreground"
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Article Spotlight Preview Card */}
          <div className="lg:col-span-5 sticky top-28 bg-surface rounded-3xl p-8 border border-border/80 shadow-2xl flex flex-col justify-between min-h-[380px]">
            {blogs[activeIndex] && (
              <>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={blogs[activeIndex].author?.avatarUrl || undefined}
                        fallback={(blogs[activeIndex].author?.name || "A").charAt(0).toUpperCase()}
                        size="sm"
                      />
                      <div>
                        <p className="font-bold text-sm text-foreground">
                          {blogs[activeIndex].author?.name || blogs[activeIndex].author?.username || "Anonymous"}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          @{blogs[activeIndex].author?.handle || "author"}
                        </p>
                      </div>
                    </div>

                    <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-surface-subtle border border-border text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3 text-loom" />
                      {getReadTime(blogs[activeIndex].content || "")}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-foreground font-serif tracking-tight leading-snug mb-3">
                      {blogs[activeIndex].title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-4 leading-relaxed font-sans font-normal">
                      {blogs[activeIndex].summary ||
                        (blogs[activeIndex].content
                          ? blogs[activeIndex].content.substring(0, 180) + "..."
                          : "Explore full technical analysis and code implementations.")}
                    </p>
                  </div>

                  {blogs[activeIndex].tags && blogs[activeIndex].tags!.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {blogs[activeIndex].tags!.map((t, tidx) => (
                        <span
                          key={tidx}
                          className="px-2.5 py-1 rounded-md bg-loom/10 text-loom font-mono text-[10px] uppercase font-bold flex items-center gap-1"
                        >
                          <Tag className="w-2.5 h-2.5" />
                          {t.tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-8 border-t border-border/40 mt-8 flex justify-between items-center">
                  <span className="font-mono text-xs text-subtle-foreground">
                    ID: #{blogs[activeIndex].id}
                  </span>
                  <Link
                    to={`/blog/${blogs[activeIndex].slug || blogs[activeIndex].id}`}
                    className="px-5 py-2.5 rounded-full bg-foreground text-background font-sans font-bold text-xs hover:bg-loom hover:text-black transition-all flex items-center gap-1.5"
                  >
                    <span>Read Article</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
