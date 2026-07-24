import { Appbar } from "../components/Appbar";
import { useBlogs } from "../hooks";
import { Link, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { Seo } from "../components/Seo";
import { ArticleCard } from "../components/ui/ArticleCard";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { SearchX, FileText, Search, X } from "lucide-react";

function Blogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const tag = searchParams.get("tag") || "";

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(q);

  const { loading, blogs, error, pagination } = useBlogs({ page, limit: 12, q, tag });

  useEffect(() => {
    setPage(1);
  }, [q, tag]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      if (searchInput) p.set("q", searchInput);
      else p.delete("q");
      return p;
    });
  };

  const handleLoadMore = () => {
    if (pagination.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams());
  };

  const seoTitle = tag ? `Articles tagged #${tag}` : q ? `Search results for "${q}"` : "Latest Technical Articles";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Seo 
        title={seoTitle}
        description="Discover the latest technical articles, tutorials, and insights from the Devloom developer community."
        url="https://devloom.com/blogs"
      />
      <Appbar />

      <main className="flex-1 pt-28 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-8 mb-8 gap-8">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground mb-4 drop-shadow-sm">
                {tag ? (
                  <span className="flex flex-wrap items-center gap-4">
                    Tag <span className="text-2xl md:text-3xl px-4 py-2 bg-surface text-foreground rounded-full border border-border shadow-sm">#{tag}</span>
                  </span>
                ) : (
                  "Explore Articles"
                )}
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl font-medium tracking-tight leading-relaxed">
                Discover the latest technical articles, tutorials, and insights from our developer community.
                {!loading && !error && ` ${pagination.total} ${pagination.total === 1 ? 'article' : 'articles'} found.`}
              </p>
            </div>

            <form onSubmit={handleSearch} className="relative w-full md:w-96 shrink-0 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-foreground" />
              <input
                type="search"
                placeholder="Search articles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-background/50 backdrop-blur-xl border border-border/50 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all text-foreground placeholder:text-muted-foreground shadow-sm hover:shadow-md"
              />
            </form>
          </div>

          {(q || tag) && (
            <div className="mb-8 flex flex-wrap items-center gap-3 text-sm">
              <span className="font-semibold text-foreground">Active filters:</span>
              {q && <span className="bg-surface border border-border text-foreground px-4 py-1.5 rounded-full flex items-center shadow-sm font-medium">Search: "{q}"</span>}
              {tag && <span className="bg-surface border border-border text-foreground px-4 py-1.5 rounded-full flex items-center shadow-sm font-medium">#{tag}</span>}
              <button onClick={clearFilters} className="ml-2 text-muted-foreground hover:text-foreground font-semibold transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 rounded-sm"><X className="h-4 w-4" /> Clear all</button>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-5 rounded-2xl mb-12 text-center">
              <p className="font-medium text-lg">{error}</p>
            </div>
          )}

          {loading && page === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col gap-5">
                  <Skeleton className="aspect-[3/2] w-full rounded-2xl" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-7 w-full" />
                    <Skeleton className="h-7 w-4/5" />
                  </div>
                  <div className="mt-auto pt-4 flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : !error && blogs.length === 0 ? (
            <div className="py-16 flex justify-center">
              {q || tag ? (
                <EmptyState 
                  icon={SearchX} 
                  title="No articles found" 
                  description="We couldn't find any articles matching your current search filters. Try adjusting your search term or clearing filters." 
                  className="w-full max-w-lg"
                >
                  <button onClick={clearFilters} className="px-6 py-2.5 bg-surface border border-border text-foreground rounded-xl hover:bg-surface/80 transition-colors font-medium shadow-sm">
                    Clear Filters
                  </button>
                </EmptyState>
              ) : (
                <EmptyState 
                  icon={FileText} 
                  title="No articles published yet" 
                  description="Be the first developer to share your technical knowledge with the community."
                  className="w-full max-w-lg"
                >
                  <Link to="/publish" className="inline-flex px-6 py-2.5 bg-foreground text-background rounded-xl hover:bg-foreground/90 transition-colors font-medium shadow-sm">
                    Write First Article
                  </Link>
                </EmptyState>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-col divide-y divide-border/40">
                {blogs.map((blog) => (
                  <Link key={blog.id} to={`/blog/${blog.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm">
                    <ArticleCard
                      title={blog.title || 'Untitled Article'}
                      summary={blog.summary || (blog.content ? blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : 'No summary available.')}
                      date={new Date(blog.publishedAt || blog.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      author={{
                        name: blog.author?.name || 'Anonymous',
                        avatar: blog.author?.avatarUrl || undefined,
                      }}
                      image={blog.coverImage || undefined}
                      variant="standard"
                    />
                  </Link>
                ))}
              </div>

              {pagination.hasNextPage && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="border border-border text-foreground bg-surface hover:bg-surface/80 rounded-full px-8 py-3.5 font-medium transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? 'Loading...' : 'Load More Articles'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Blogs;

