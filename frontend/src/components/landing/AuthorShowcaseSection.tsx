import { Link } from "react-router";
import { Blog } from "../../hooks";
import { ArrowUpRight, Users } from "lucide-react";
import { Avatar } from "../ui/Avatar";

interface AuthorShowcaseSectionProps {
  blogs: Blog[];
}

export function AuthorShowcaseSection({ blogs }: AuthorShowcaseSectionProps) {
  // Deduplicate authors from live blogs list
  const authorsMap = new Map();
  blogs.forEach((b) => {
    if (b.author && (b.author.handle || b.author.username || b.author.id)) {
      const handle = b.author.handle || b.author.username || String(b.author.id);
      if (!authorsMap.has(handle)) {
        authorsMap.set(handle, {
          handle,
          name: b.author.name || b.author.username || "Anonymous Engineer",
          avatar: b.author.avatarUrl || undefined,
          articleCount: blogs.filter((x) => (x.author?.handle || x.author?.username || String(x.author?.id)) === handle).length,
          latestTitle: b.title,
        });
      }
    }
  });

  const authorsList = Array.from(authorsMap.values());

  if (authorsList.length === 0) return null;

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 border-b border-border/40 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="font-mono text-xs text-loom uppercase tracking-widest block mb-2">
            SECTION 10 // COMMUNITY AUTHORS
          </span>
          <h2 className="font-black text-4xl md:text-6xl tracking-tighter text-foreground uppercase">
            CONTRIBUTING AUTHORS.
          </h2>
        </div>
        <p className="text-muted-foreground text-sm max-w-md font-medium">
          Meet the software engineers, system architects, and open-source maintainers publishing their engineering work on Devloom.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authorsList.slice(0, 6).map((author, idx) => (
          <Link
            key={author.handle}
            to={`/authors/${author.handle}`}
            className="p-6 rounded-3xl bg-surface border border-border/70 hover:border-loom transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-xl"
          >
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <Avatar src={author.avatar} fallback={author.name.charAt(0).toUpperCase()} size="md" />
                <span className="font-mono text-xs text-subtle-foreground">
                  0{(idx + 1)}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-lg text-foreground group-hover:text-loom transition-colors">
                  {author.name}
                </h3>
                <p className="text-xs font-mono text-muted-foreground">@{author.handle}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface-subtle border border-border/40 text-xs text-muted-foreground line-clamp-2">
                <span className="font-semibold text-foreground">Latest: </span>
                "{author.latestTitle}"
              </div>
            </div>

            <div className="pt-4 border-t border-border/40 mt-6 flex justify-between items-center text-xs font-mono">
              <span className="text-muted-foreground flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-loom" />
                {author.articleCount} {author.articleCount === 1 ? "Article" : "Articles"}
              </span>
              <span className="text-loom font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
