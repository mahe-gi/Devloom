import { Link } from "react-router";
import { Blog } from "../../hooks";
import { ArrowUpRight, Calendar, Clock, Star } from "lucide-react";
import { Avatar } from "../ui/Avatar";

interface FeaturedArticleSectionProps {
  featured: Blog | null;
}

export function FeaturedArticleSection({ featured }: FeaturedArticleSectionProps) {
  if (!featured) return null;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Recent";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
  };

  const getReadTime = (content: string) => {
    if (!content) return "4 min read";
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 border-b border-border/40 font-sans">
      <div className="flex justify-between items-center mb-8 font-mono text-xs text-loom uppercase tracking-widest">
        <span className="flex items-center gap-2 font-bold">
          <Star className="w-3.5 h-3.5 fill-loom" />
          SECTION 05 // FEATURED COVER STORY
        </span>
        <span className="hidden sm:inline">EDITORIAL PICK</span>
      </div>

      <div className="relative rounded-3xl bg-surface border border-border/80 overflow-hidden shadow-2xl p-8 md:p-16">
        {/* Background Subtle Loom Accent Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-loom/10 rounded-full blur-[100px] pointer-events-none -z-0" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Enormous Magazine Headline */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
              <span className="px-3 py-1 rounded-full bg-loom/15 text-loom font-bold uppercase">
                FEATURED
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(featured.publishedAt || featured.createdAt)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {getReadTime(featured.content || "")}
              </span>
            </div>

            <Link
              to={`/blog/${featured.slug || featured.id}`}
              className="text-3xl sm:text-5xl md:text-6xl font-black font-serif tracking-tight text-foreground hover:text-loom transition-colors leading-[1.08]"
            >
              {featured.title}
            </Link>

            <p className="text-muted-foreground text-base md:text-xl font-normal leading-relaxed max-w-3xl">
              {featured.summary ||
                (featured.content
                  ? featured.content.substring(0, 240) + "..."
                  : "An in-depth technical analysis published on Devloom.")}
            </p>
          </div>

          {/* Right Column: Author Card & Read CTA */}
          <div className="lg:col-span-4 flex flex-col justify-between h-full bg-surface-subtle/80 backdrop-blur-md rounded-2xl p-8 border border-border/60 gap-8">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[11px] text-subtle-foreground uppercase tracking-widest">
                ARTICLE AUTHOR
              </span>
              <div className="flex items-center gap-4">
                <Avatar
                  src={featured.author?.avatarUrl || undefined}
                  fallback={(featured.author?.name || "A").charAt(0).toUpperCase()}
                  size="lg"
                />
                <div>
                  <h4 className="font-bold text-base text-foreground">
                    {featured.author?.name || featured.author?.username || "Anonymous"}
                  </h4>
                  <Link
                    to={`/authors/${featured.author?.handle || featured.author?.username || ""}`}
                    className="text-xs font-mono text-loom hover:underline"
                  >
                    @{featured.author?.handle || "author"}
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border/40">
              <Link
                to={`/blog/${featured.slug || featured.id}`}
                className="w-full py-4 rounded-full bg-foreground text-background font-bold text-sm hover:bg-loom hover:text-black transition-all flex items-center justify-center gap-2 group shadow-md"
              >
                <span>Read Full Story</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
