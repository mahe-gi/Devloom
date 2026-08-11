import { Link } from "react-router";
import { Blog } from "../../hooks";
import { ArrowUpRight, TrendingUp, Clock } from "lucide-react";

interface TrendingListSectionProps {
  blogs: Blog[];
}

export function TrendingListSection({ blogs }: TrendingListSectionProps) {
  if (blogs.length === 0) return null;

  const getReadTime = (content: string) => {
    if (!content) return "3 min read";
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 border-b border-border/40 font-sans">
      <div className="flex justify-between items-center mb-12 font-mono text-xs text-loom uppercase tracking-widest">
        <span className="flex items-center gap-2 font-bold">
          <TrendingUp className="w-4 h-4 text-loom" />
          SECTION 11 // TRENDING READS
        </span>
        <span>MOST READ THIS WEEK</span>
      </div>

      <div className="flex flex-col divide-y divide-border/40">
        {blogs.slice(0, 5).map((blog, idx) => (
          <Link
            key={blog.id}
            to={`/blog/${blog.slug || blog.id}`}
            className="py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:pl-3 transition-all duration-300"
          >
            <div className="flex items-start md:items-center gap-6">
              <span className="font-serif italic font-light text-3xl md:text-5xl text-subtle-foreground group-hover:text-loom transition-colors w-12">
                0{idx + 1}
              </span>
              <div>
                <h3 className="text-xl md:text-3xl font-bold font-sans tracking-tight text-foreground group-hover:text-loom transition-colors">
                  {blog.title}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-xs font-mono text-muted-foreground">
                  <span>By {blog.author?.name || blog.author?.username || "Anonymous"}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-loom" />
                    {getReadTime(blog.content || "")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs font-bold text-muted-foreground group-hover:text-loom transition-colors">
              <span>READ STORY</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
