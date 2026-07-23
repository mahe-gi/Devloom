import { Appbar } from "../components/Appbar";
import { Skeleton } from "../components/ui/Skeleton";
import { useBlogs } from "../hooks";
import { Link, useParams } from "react-router";
import { useState, useEffect } from "react";
import { Seo } from "../components/Seo";
import { ArticleCard } from "../components/ui/ArticleCard";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { EmptyState } from "../components/ui/EmptyState";
import { TagChip } from "../components/ui/TagChip";

export function Tag() {
  const { slug } = useParams();
  const tag = slug || "";
  
  const [page, setPage] = useState(1);

  const { loading, blogs, error, pagination } = useBlogs({ page, limit: 10, tag });

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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Seo 
        title={seoTitle}
        description={`Read the latest technical articles about ${tag} from the 101dev developer community.`}
        url={`https://101dev.com/tags/${tag}`}
      />
      <Appbar />

      <main className="flex-1 py-12">
        <Container size="wide">
          <div className="border-b border-border pb-6 mb-10">
            <h1 className="text-4xl md:text-5xl font-bold font-sans text-foreground mb-4 flex items-center gap-4">
              <span className="text-muted">Topic:</span> 
              <TagChip className="text-2xl py-1.5 px-4 pointer-events-none">{tag}</TagChip>
            </h1>
            <p className="text-muted text-lg font-serif">
              {pagination.total} {pagination.total === 1 ? 'article' : 'articles'} found
            </p>
          </div>

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
                title={`No articles found for #${tag}`}
                description="There are currently no published articles with this tag."
                action={
                  <Link to="/blogs">
                    <Button variant="outline">Browse all articles</Button>
                  </Link>
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
                    Load More
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

export default Tag;
