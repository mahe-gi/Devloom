import { Link } from "react-router";
import { Appbar } from "../components/Appbar";
import { useBlogs } from "../hooks";
import { Seo } from "../components/Seo";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { ArticleCard } from "../components/ui/ArticleCard";
import { EmptyState } from "../components/ui/EmptyState";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";

function Landing() {
  const { loading, blogs, error } = useBlogs();
  
  const featuredArticle = blogs.length > 0 ? blogs[0] : null;
  const recentArticles = blogs.length > 1 ? blogs.slice(1, 4) : [];
  const moreArticles = blogs.length > 4 ? blogs.slice(4, 8) : [];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Seo 
        title="101dev | Engineering Insights & Tutorials"
        description="A platform for software engineers to publish deep dives, architectural notes, and technical articles."
        url="https://101dev.com"
      />
      <Appbar />

      <main className="flex-1">
        {/* Hero Section - 2 Column */}
        <section className="border-b border-border bg-surface py-16 md:py-24">
          <Container size="wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col items-start text-left">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-8">
                  <Sparkles size={14} />
                  <span>The Engineering Publication</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1] mb-6 font-serif">
                  Write what you learn. Help developers build better.
                </h1>
                
                <p className="text-lg md:text-xl text-muted max-w-xl leading-relaxed mb-10 font-serif">
                  Discover in-depth engineering tutorials, software design patterns, and architectural insights written by developers, for developers.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <Link to="/blogs" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto gap-2">
                      Start Reading
                      <ArrowRight size={18} />
                    </Button>
                  </Link>
                  <Link to="/publish" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Write an Article
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="w-full">
                {loading ? (
                  <div className="w-full h-[400px] bg-surface-secondary animate-pulse rounded-2xl border border-border"></div>
                ) : error ? (
                  <EmptyState 
                    title="Failed to load articles" 
                    description="There was a problem fetching the latest content. Please try again later."
                    icon={BookOpen}
                  />
                ) : featuredArticle ? (
                  <div className="transform rotate-1 hover:rotate-0 transition-transform duration-300">
                    <ArticleCard blog={featuredArticle} variant="featured" />
                  </div>
                ) : (
                  <div className="bg-surface-secondary border border-border p-8 rounded-2xl shadow-sm text-center">
                    <BookOpen size={48} className="mx-auto text-muted mb-4" />
                    <h3 className="font-serif text-2xl font-bold mb-2 text-foreground">No articles yet</h3>
                    <p className="text-muted mb-6">Be the first to publish an engineering insight.</p>
                    <Link to="/publish">
                      <Button>Start Writing</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>

        {/* Recent Articles Grid */}
        {recentArticles.length > 0 && (
          <section className="bg-surface py-16 md:py-24 border-b border-border">
            <Container size="wide">
              <h2 className="text-3xl font-bold font-serif text-foreground mb-12">Latest Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentArticles.map(blog => (
                  <ArticleCard key={blog.id} blog={blog} variant="standard" />
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* More Articles / Topics Exploration */}
        {moreArticles.length > 0 && (
          <Container size="wide" className="py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              <div className="lg:col-span-1">
                <h3 className="text-xl font-bold font-serif text-foreground mb-6">Explore Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'System Design', 'TypeScript', 'Backend', 'DevOps', 'Architecture'].map(topic => (
                    <span key={topic} className="px-3 py-1.5 bg-surface border border-border rounded-full text-sm font-medium text-muted hover:text-foreground hover:border-primary cursor-pointer transition-colors">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="lg:col-span-3">
                <h3 className="text-2xl font-bold font-serif text-foreground mb-8">More Reading</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {moreArticles.map(blog => (
                    <ArticleCard key={blog.id} blog={blog} variant="compact" />
                  ))}
                </div>
              </div>
            </div>
          </Container>
        )}
      </main>

      <footer className="bg-surface-secondary border-t border-border py-12">
        <Container size="wide">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-foreground">
                101dev
              </span>
            </div>
            <div className="text-sm text-muted">
              &copy; {new Date().getFullYear()} 101dev. Built for engineers.
            </div>
            <div className="flex gap-4">
              <Link to="/blogs" className="text-sm text-muted hover:text-foreground transition-colors">Articles</Link>
              <Link to="/publish" className="text-sm text-muted hover:text-foreground transition-colors">Publish</Link>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}

export default Landing;

