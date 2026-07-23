import { Link } from "react-router";
import { Appbar } from "../components/Appbar";
import { useBlogs } from "../hooks";
import { Seo } from "../components/Seo";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { FileText, ArrowRight } from "lucide-react";

export default function Landing() {
  const { loading, blogs, error } = useBlogs({ limit: 10 });
  
  const featuredArticle = blogs.length > 0 ? blogs[0] : null;
  const recentArticles = blogs.length > 1 ? blogs.slice(1, 4) : [];
  const moreArticles = blogs.length > 4 ? blogs.slice(4, 10) : [];

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
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Seo 
        title="Devloom | Engineering Insights & Tutorials"
        description="A platform for software engineers to publish deep dives, architectural notes, and technical articles."
        url="https://devloom.com"
      />
      <Appbar />

      <main className="flex-1">
        {/* Editor's Pick / Hero Section */}
        <section className="bg-background py-16 md:py-24 border-b border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div>
                <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-foreground mb-4">
                  Engineering Insights
                </h1>
                <p className="text-lg md:text-xl text-muted max-w-2xl font-light">
                  Deep dives, architectural notes, and technical articles by developers, for developers.
                </p>
              </div>
              <div className="mt-8 md:mt-0">
                <Link to="/publish">
                  <Button variant="primary" size="lg" className="rounded-full px-6">Start Writing</Button>
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="w-full h-[400px] bg-muted/10 animate-pulse rounded-none border-b border-border"></div>
            ) : error ? (
              <EmptyState 
                icon={FileText} 
                title="Failed to load articles" 
                description="There was a problem fetching the latest content. Please try again later." 
              />
            ) : blogs.length === 0 ? (
              <EmptyState 
                icon={FileText} 
                title="No articles yet" 
                description="Be the first to publish an engineering insight on our platform." 
              />
            ) : (
              <div className="flex flex-col gap-16">
                {/* Featured Article */}
                {featuredArticle && (
                  <div className="w-full border-b border-border pb-16">
                    <Link to={`/blog/${featuredArticle.slug || featuredArticle.id}`} className="block h-full group">
                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="w-full md:w-1/2 aspect-[4/3] overflow-hidden bg-muted/5">
                          <img 
                            src={featuredArticle.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"} 
                            alt={featuredArticle.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                          />
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col justify-center py-4">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm font-semibold text-foreground">Featured</span>
                            <span className="text-sm text-muted">&bull; {formatDate(featuredArticle.publishedAt || featuredArticle.createdAt)}</span>
                          </div>
                          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4 group-hover:text-foreground/80 transition-colors">
                            {featuredArticle.title}
                          </h2>
                          <p className="text-muted mb-6 text-lg line-clamp-3 font-serif">
                            {featuredArticle.summary || (featuredArticle.content ? featuredArticle.content.substring(0, 150) + "..." : "Read more about this engineering topic.")}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border border-border overflow-hidden bg-background">
                              {featuredArticle.author?.avatarUrl ? (
                                <img src={featuredArticle.author.avatarUrl} alt="author" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-foreground">
                                  {(featuredArticle.author?.name || featuredArticle.author?.username || 'A')[0]}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{featuredArticle.author?.name || featuredArticle.author?.username || 'Anonymous'}</p>
                              <p className="text-xs text-muted">{getReadTime(featuredArticle.content || '')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Trending/Recent Articles */}
                {recentArticles.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-muted border-b border-border pb-4 mb-8">
                      Recent Stories
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                      {recentArticles.map(blog => (
                         <Link key={blog.id} to={`/blog/${blog.slug || blog.id}`} className="block group h-full">
                          <div className="flex flex-col h-full">
                            <div className="w-full aspect-[4/3] overflow-hidden mb-5 bg-muted/5">
                              <img 
                                src={blog.coverImage || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"} 
                                alt={blog.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                              />
                            </div>
                            <div className="flex flex-col flex-1">
                              <p className="text-sm text-muted mb-2">{formatDate(blog.publishedAt || blog.createdAt)}</p>
                              <h4 className="text-xl font-bold tracking-tight text-foreground mb-3 group-hover:text-foreground/80 transition-colors line-clamp-2">
                                {blog.title}
                              </h4>
                              <p className="text-base text-muted mb-5 line-clamp-2 flex-1 font-serif">
                                {blog.summary || (blog.content ? blog.content.substring(0, 100) + "..." : "")}
                              </p>
                              <div className="flex items-center gap-2 mt-auto">
                                <p className="text-sm font-medium text-foreground">{blog.author?.name || blog.author?.username || 'Anonymous'}</p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* More Articles & Topics */}
        {moreArticles.length > 0 && (
          <section className="bg-background py-16 md:py-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* Main Feed */}
                <div className="lg:col-span-8">
                  <div className="flex items-center justify-between border-b border-border pb-4 mb-8">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground uppercase">
                      Latest Feed
                    </h2>
                  </div>
                  <div className="flex flex-col gap-10">
                    {moreArticles.map(blog => (
                      <Link key={blog.id} to={`/blog/${blog.slug || blog.id}`} className="block h-full border-b border-border pb-10 last:border-0">
                        <div className="flex gap-6 items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                               <p className="text-sm font-medium text-foreground">{blog.author?.name || blog.author?.username || 'Anonymous'}</p>
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2 group-hover:text-foreground/80 transition-colors">
                              {blog.title}
                            </h3>
                            <p className="text-muted mb-4 line-clamp-2 font-serif text-lg">
                              {blog.summary || (blog.content ? blog.content.substring(0, 100) + "..." : "An insight on engineering.")}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted">
                                <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                                <span>&bull;</span>
                                <span>{getReadTime(blog.content || '')}</span>
                            </div>
                          </div>
                          <div className="w-32 h-32 hidden sm:block shrink-0 bg-muted/5">
                            <img 
                              src={blog.coverImage || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80"} 
                              alt={blog.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-12">
                    <Link to="/blogs">
                      <Button variant="outline" className="gap-2 rounded-full">
                        View All Articles
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-12">
                  {/* Topics */}
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-foreground mb-6">
                      Recommended Topics
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'System Design', 'TypeScript', 'Backend', 'DevOps', 'Architecture', 'AI', 'Performance'].map(topic => (
                        <Link key={topic} to={`/blogs?tag=${topic.toLowerCase()}`}>
                          <span className="inline-flex items-center px-4 py-2 bg-muted/5 rounded-full text-sm font-medium text-foreground hover:bg-muted/10 transition-colors cursor-pointer">
                            {topic}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Newsletter or Write for us box */}
                  <div className="bg-muted/5 rounded-none p-8">
                    <h3 className="text-lg font-bold text-foreground mb-3">Share Your Knowledge</h3>
                    <p className="text-muted text-sm mb-6 leading-relaxed">
                      Got a technical deep dive or an interesting engineering problem you solved? Write for our community of developers.
                    </p>
                    <Link to="/publish">
                      <Button variant="primary" className="w-full rounded-full">
                        Start Writing
                      </Button>
                    </Link>
                  </div>
                </div>
                
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="bg-background border-t border-border py-12 mt-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-foreground">
                Devloom
              </span>
            </div>
            <div className="text-sm text-muted">
              &copy; {new Date().getFullYear()} Devloom. Built for engineers.
            </div>
            <div className="flex gap-6">
              <Link to="/blogs" className="text-sm font-medium text-muted hover:text-foreground transition-colors">Articles</Link>
              <Link to="/publish" className="text-sm font-medium text-muted hover:text-foreground transition-colors">Publish</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
