import { Appbar } from "../components/Appbar";
import { useBlogs } from "../hooks";
import { Link, useParams } from "react-router";
import { useState, useEffect } from "react";
import { Seo } from "../components/Seo";
import { ArticleCard } from "../components/ui/ArticleCard";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { SearchX } from "lucide-react";

export function Tag() {
  const { slug } = useParams();
  const tag = slug || "";
  
  const [page, setPage] = useState(1);

  const { loading, blogs, error, pagination } = useBlogs({ page, limit: 12, tag });

  useEffect(() => {
    setPage(1);
  }, [tag]);

  const handleLoadMore = () => {
    if (pagination.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  };

  const seoTitle = `Articles tagged #${tag}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Seo 
        title={seoTitle}
        description={`Read the latest technical articles about ${tag} from the Devloom developer community.`}
        url={`https://devloom.com/tags/${tag}`}
      />
      <Appbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="border-b border-border pb-8 mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 flex flex-wrap items-center gap-4">
              <span className="text-muted font-normal">Topic:</span> 
              <span className="px-6 py-2.5 bg-surface text-foreground rounded-full border border-border shadow-sm">#{tag}</span>
            </h1>
            <p className="text-muted text-lg md:text-xl leading-relaxed">
              Explore articles, tutorials, and insights related to {tag}.
              {!loading && !error && ` ${pagination.total} ${pagination.total === 1 ? 'article' : 'articles'} found.`}
            </p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-6 py-5 rounded-2xl mb-12 text-center">
              <p className="font-medium text-lg">{error}</p>
            </div>
          )}

          {loading && page === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
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
              <EmptyState 
                icon={SearchX} 
                title={`No articles found for #${tag}`} 
                description="There are currently no published articles with this tag. Check back later or browse other topics." 
                className="w-full max-w-lg"
              >
                <Link to="/blogs" className="inline-flex px-6 py-2.5 bg-surface border border-border text-foreground rounded-xl hover:bg-surface/80 transition-colors font-medium shadow-sm">
                  Browse all articles
                </Link>
              </EmptyState>
            </div>
          ) : (
            <>
              <div className="flex flex-col divide-y divide-border/40">
                {blogs.map((blog) => (
                  <Link key={blog.id} to={`/blog/${blog.id}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm">
                    <ArticleCard
                      title={blog.title || 'Untitled Article'}
                      summary={blog.content ? blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : 'No summary available.'}
                      date={new Date(blog.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      author={{ name: blog.author?.name || 'Anonymous' }}
                      variant="standard"
                    />
                  </Link>
                ))}
              </div>

              {pagination.hasNextPage && (
                <div className="mt-20 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="border border-border text-foreground bg-surface hover:bg-surface/80 rounded-full px-8 py-3.5 font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? "Loading..." : "Load More Articles"}
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

export default Tag;
