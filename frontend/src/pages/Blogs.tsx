import { Appbar } from "../components/Appbar";
import { Skeleton } from "../components/ui/Skeleton";
import { useBlogs } from "../hooks";
import { Link, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { Seo } from "../components/Seo";
import { ArticleCard } from "../components/ui/ArticleCard";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { EmptyState } from "../components/ui/EmptyState";
import { TagChip } from "../components/ui/TagChip";

function Blogs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const tag = searchParams.get("tag") || "";

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(q);

  const { loading, blogs, error, pagination } = useBlogs({ page, limit: 10, q, tag });

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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Seo 
        title={seoTitle}
        description="Discover the latest technical articles, tutorials, and insights from the 101dev developer community."
        url="https://101dev.com/blogs"
      />
      <Appbar />

      <main className="flex-1 py-12">
        <Container size="wide">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-6 mb-10 gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-sans text-foreground mb-4">
                {tag ? (
                  <span className="flex items-center gap-4">
                    Tag <TagChip className="text-xl pointer-events-none">{tag}</TagChip>
                  </span>
                ) : (
                  "Latest Articles"
                )}
              </h1>
              <p className="text-muted text-lg font-serif">
                {pagination.total} {pagination.total === 1 ? 'article' : 'articles'} found
              </p>
            </div>

            <form onSubmit={handleSearch} className="relative w-full md:w-80">
              <input
                type="search"
                placeholder="Search articles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-5 pr-12 py-3 bg-surface border border-border rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 text-muted hover:text-primary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>
          </div>

          {(q || tag) && (
            <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-muted">
              <span className="font-medium">Filters:</span>
              {q && <span className="bg-surface border border-border px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">Search: "{q}"</span>}
              {tag && <TagChip>{tag}</TagChip>}
              <Button variant="text" size="sm" onClick={clearFilters} className="ml-2">Clear all</Button>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-5 rounded-xl mb-10 text-center">
              <p className="font-medium text-lg">{error}</p>
            </div>
          )}

          {loading && page === 1 ? (
            <div className="space-y-4">
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          ) : !error && blogs.length === 0 ? (
            <div className="py-12">
              <EmptyState 
                title={q || tag ? "No articles found matching your criteria" : "No articles published yet"}
                description={q || tag ? "Try adjusting your search or clearing filters." : "Be the first developer to share your technical knowledge with the community."}
                action={
                  q || tag ? (
                    <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
                  ) : (
                    <Link to="/publish">
                      <Button>Write First Article</Button>
                    </Link>
                  )
                }
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <ArticleCard key={blog.id} blog={blog} />
                ))}
              </div>

              {pagination.hasNextPage && (
                <div className="mt-16 flex justify-center">
                  <Button
                    onClick={handleLoadMore}
                    loading={loading}
                    variant="outline"
                    size="lg"
                    className="rounded-full px-8"
                  >
                    Load More Articles
                  </Button>
                </div>
              )}
            </>
          )}
        </Container>
      </main>
    </div>
  );
}

export default Blogs;
