import { Link } from "react-router";
import { Appbar } from "../components/Appbar";
import { useBlogs } from "../hooks";
import { Seo } from "../components/Seo";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { FileText, ArrowRight, Sparkles, ChevronRight, Clock } from "lucide-react";

export default function Landing() {
  const { loading, blogs, error } = useBlogs({ limit: 10 });
  
  const featuredArticle = blogs.length > 0 ? blogs[0] : null;
  const recentArticles = blogs.length > 1 ? blogs.slice(1, 7) : [];

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
    <div className="min-h-screen bg-background flex flex-col font-sans relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none -z-10" />

      <Seo 
        title="Devloom | Engineering Insights & Tutorials"
        description="A platform for software engineers to publish deep dives, architectural notes, and technical articles."
        url="https://devloom.com"
      />
      <Appbar />

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-36 md:pb-24 overflow-hidden border-b border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/50 border border-white/10 backdrop-blur-md text-sm font-medium mb-8 text-foreground/80 shadow-sm animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>The platform for visionary engineers</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter text-foreground mb-6 max-w-4xl leading-[1.05]">
              Engineering Insights <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
                Redefined.
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-foreground/60 max-w-2xl font-medium tracking-tight mb-10">
              Deep dives, architectural notes, and technical articles by developers, for developers. Elevate your craft.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link to="/publish" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full rounded-xl px-8 h-14 text-lg font-semibold shadow-[0_0_30px_rgba(var(--primary),0.3)] hover:shadow-[0_0_40px_rgba(var(--primary),0.5)] transition-all duration-300">
                  Start Writing <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/blogs" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full rounded-xl px-8 h-14 text-lg font-semibold backdrop-blur-md bg-surface/20 border-white/10 hover:bg-surface/50 transition-all duration-300">
                  Explore Articles
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24 relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Trending Articles
              </h2>
              <Link to="/blogs" className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[300px] bg-surface/30 rounded-2xl animate-pulse border border-white/5"></div>
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
                icon={FileText} 
                title="No articles yet" 
                description="Be the first to publish an engineering insight on our platform." 
              />
            ) : (
              <div className="flex flex-col gap-8">
                {/* Featured Article */}
                {featuredArticle && (
                  <Link to={`/blog/${featuredArticle.slug || featuredArticle.id}`} className="group block">
                    <div className="relative rounded-3xl overflow-hidden bg-surface/30 border border-white/10 backdrop-blur-md hover:border-primary/30 transition-all duration-500 p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center shadow-lg hover:shadow-xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="w-full md:w-1/2 aspect-[16/10] overflow-hidden rounded-2xl bg-surface/50 relative z-10 shadow-inner">
                        <img 
                          src={featuredArticle.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80"} 
                          alt={featuredArticle.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      </div>
                      
                      <div className="w-full md:w-1/2 flex flex-col justify-center relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-2.5 py-1 rounded-md bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                            Featured
                          </span>
                          <span className="text-sm font-medium text-foreground/50 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatDate(featuredArticle.publishedAt || featuredArticle.createdAt)}
                          </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-foreground mb-4 group-hover:text-primary transition-colors duration-300 leading-tight">
                          {featuredArticle.title}
                        </h2>
                        <p className="text-foreground/60 mb-8 text-lg font-medium leading-relaxed line-clamp-3">
                          {featuredArticle.summary || (featuredArticle.content ? featuredArticle.content.substring(0, 150) + "..." : "Read more about this engineering topic.")}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-auto">
                          <div className="w-12 h-12 rounded-full border-2 border-surface overflow-hidden bg-background shadow-md">
                            {featuredArticle.author?.avatarUrl ? (
                              <img src={featuredArticle.author.avatarUrl} alt="author" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-foreground bg-surface/80">
                                {(featuredArticle.author?.name || featuredArticle.author?.username || 'A')[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-base font-bold text-foreground tracking-tight">{featuredArticle.author?.name || featuredArticle.author?.username || 'Anonymous'}</p>
                            <p className="text-sm text-foreground/50 font-medium">{getReadTime(featuredArticle.content || '')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )}

                {/* Grid Articles */}
                {recentArticles.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {recentArticles.map(blog => (
                      <Link key={blog.id} to={`/blog/${blog.slug || blog.id}`} className="group flex h-full">
                        <div className="flex flex-col w-full h-full rounded-2xl bg-surface/20 border border-white/5 backdrop-blur-sm p-5 hover:bg-surface/40 hover:border-white/20 transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          <div className="w-full aspect-video overflow-hidden rounded-xl mb-5 bg-surface/50 relative z-10">
                            <img 
                              src={blog.coverImage || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80"} 
                              alt={blog.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                          
                          <div className="flex flex-col flex-1 relative z-10">
                            <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-foreground/50 uppercase tracking-wider">
                              <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                              <span>•</span>
                              <span>{getReadTime(blog.content || '')}</span>
                            </div>
                            
                            <h3 className="text-xl font-bold tracking-tight text-foreground mb-3 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                              {blog.title}
                            </h3>
                            
                            <p className="text-sm font-medium text-foreground/60 mb-6 line-clamp-3 flex-1">
                              {blog.summary || (blog.content ? blog.content.substring(0, 100) + "..." : "")}
                            </p>
                            
                            <div className="flex items-center gap-3 mt-auto">
                              <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-surface">
                                {blog.author?.avatarUrl ? (
                                  <img src={blog.author.avatarUrl} alt="author" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-foreground">
                                    {(blog.author?.name || blog.author?.username || 'A')[0]}
                                  </div>
                                )}
                              </div>
                              <p className="text-sm font-semibold text-foreground">{blog.author?.name || blog.author?.username || 'Anonymous'}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="relative bg-surface/30 border-t border-white/10 py-12 mt-auto backdrop-blur-lg z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tighter text-foreground flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-background font-bold text-lg leading-none">D</span>
                </div>
                Devloom
              </span>
            </div>
            <div className="text-sm font-medium text-foreground/50">
              &copy; {new Date().getFullYear()} Devloom. Built for engineers.
            </div>
            <div className="flex gap-6">
              <Link to="/blogs" className="text-sm font-semibold text-foreground/60 hover:text-foreground transition-colors">Articles</Link>
              <Link to="/publish" className="text-sm font-semibold text-foreground/60 hover:text-foreground transition-colors">Publish</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
