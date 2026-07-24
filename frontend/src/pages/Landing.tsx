import { Link } from "react-router";
import { Appbar } from "../components/Appbar";
import { useBlogs } from "../hooks";
import { Seo } from "../components/Seo";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { FileText, ArrowRight, BookOpen, ChevronRight } from "lucide-react";
import { ArticleCard } from "../components/ui/ArticleCard";

export default function Landing() {
  const { loading, blogs, error } = useBlogs({ limit: 10 });
  
  const featuredArticle = blogs.length > 0 ? blogs[0] : null;
  const recentArticles = blogs.length > 1 ? blogs.slice(1) : [];

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Recent';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const getReadTime = (content: string) => {
    if (!content) return '1 min read';
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans relative selection:bg-primary/30 selection:text-primary-foreground">
      
      {/* Very subtle ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <Seo 
        title="Devloom | Engineering Insights & Tutorials"
        description="A platform for software engineers to publish deep dives, architectural notes, and technical articles."
        url="https://devloom.com"
      />
      <Appbar />

      <main className="flex-1 relative z-10">
        {/* Minimalist Typographic Hero */}
        <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col items-center justify-center border-b border-border/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-3xl leading-[1.1]">
              Where top engineers share <span className="text-muted-foreground">their best work.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-medium mb-10 leading-relaxed">
              A beautifully simple platform to publish technical deep dives, architectural notes, and tutorials. Focus strictly on the words.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center">
              <Link to="/publish" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto rounded-full px-8 h-12 text-sm font-semibold bg-foreground text-background hover:bg-foreground/90 transition-all">
                  Start Writing
                </Button>
              </Link>
              <Link to="/blogs" className="w-full sm:w-auto group">
                <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 h-12 text-sm font-semibold border-border hover:bg-surface transition-all text-foreground">
                  Explore Network
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Pure List Feed */}
        <section className="py-20 relative z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12 border-b border-border/40 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground uppercase tracking-widest">
                Latest Insights
              </h2>
              <Link to="/blogs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="flex flex-col gap-12">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex flex-col gap-4">
                    <div className="h-6 w-32 bg-surface animate-pulse rounded"></div>
                    <div className="h-10 w-3/4 bg-surface animate-pulse rounded"></div>
                    <div className="h-4 w-full bg-surface animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <EmptyState 
                icon={FileText} 
                title="Failed to load articles" 
                description="There was a problem fetching the latest content. Please try again later." 
              />
            ) : blogs.length === 0 ? (
              <EmptyState 
                icon={BookOpen} 
                title="No engineering notes yet" 
                description="Be the first to publish a technical deep dive." 
              />
            ) : (
              <div className="flex flex-col">
                {/* Massive Hero Story (if exists) */}
                {featuredArticle && (
                  <Link to={`/blog/${featuredArticle.slug || featuredArticle.id}`} className="block mb-16 border-b border-border/40 pb-16 group">
                    <ArticleCard 
                      variant="featured"
                      title={featuredArticle.title}
                      summary={featuredArticle.summary || (featuredArticle.content ? featuredArticle.content.substring(0, 150) + "..." : "")}
                      date={formatDate(featuredArticle.publishedAt || featuredArticle.createdAt)}
                      readTime={getReadTime(featuredArticle.content || '')}
                      author={{
                        name: featuredArticle.author?.name || featuredArticle.author?.username || 'Anonymous',
                        avatar: featuredArticle.author?.avatarUrl || undefined
                      }}
                      image={featuredArticle.coverImage || undefined}
                    />
                  </Link>
                )}

                {/* Vertical Feed for the rest */}
                {recentArticles.length > 0 && (
                  <div className="flex flex-col divide-y divide-border/40">
                    {recentArticles.map((blog) => (
                      <Link key={blog.id} to={`/blog/${blog.slug || blog.id}`} className="block">
                        <ArticleCard 
                          variant="standard"
                          title={blog.title}
                          summary={blog.summary || (blog.content ? blog.content.substring(0, 100) + "..." : "")}
                          date={formatDate(blog.publishedAt || blog.createdAt)}
                          readTime={getReadTime(blog.content || '')}
                          author={{
                            name: blog.author?.name || blog.author?.username || 'Anonymous',
                            avatar: blog.author?.avatarUrl || undefined
                          }}
                          image={blog.coverImage || undefined}
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-background border-t border-border/40 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-foreground">
                Devloom
              </span>
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              &copy; {new Date().getFullYear()} Devloom.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
