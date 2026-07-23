import { useParams } from "react-router";
import { Appbar } from "../components/Appbar";
import { useAuthorProfile } from "../hooks";
import { Skeleton } from "../components/ui/Skeleton";
import { useState } from "react";
import { Seo } from "../components/Seo";
import { ArticleCard } from "../components/ui/ArticleCard";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { EmptyState } from "../components/ui/EmptyState";

export function AuthorProfile() {
  const { handle } = useParams();
  const [page, setPage] = useState(1);
  const { loading, author, blogs, error, pagination } = useAuthorProfile(handle || "", page, 10);

  const handleLoadMore = () => {
    if (pagination.hasNextPage) {
      setPage(prev => prev + 1);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Appbar />
        <Container size="wide" className="py-12 flex-1">
          <div className="animate-pulse flex flex-col gap-6 mb-16">
            <div className="h-32 w-32 bg-surface-subtle rounded-full mb-2"></div>
            <div className="h-10 bg-surface-subtle rounded w-1/4"></div>
            <div className="h-6 bg-surface-subtle rounded w-2/3"></div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </Container>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Seo title="Author Not Found" description="The requested author profile could not be loaded." />
        <Appbar />
        <Container className="py-24 flex-1 flex items-center justify-center">
          <EmptyState 
            title="Author Not Found" 
            description={error || "The requested author profile could not be loaded or doesn't exist."}
            action={
              <a href="/blogs"><Button variant="outline">Back to Blogs</Button></a>
            }
          />
        </Container>
      </div>
    );
  }

  const authorDisplayName = author.name || author.username || "Anonymous";
  const seoDescription = author.bio || `Read technical articles by ${authorDisplayName} on 101dev.`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Seo 
        title={`${authorDisplayName} (@${author.handle})`}
        description={seoDescription}
        type="profile"
        image={author.avatarUrl || undefined}
        url={`https://101dev.com/authors/${author.handle}`}
      />
      <Appbar />
      
      <main className="flex-1 py-12">
        <Container size="wide">
          <section className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-16 pt-8">
            <div className="shrink-0">
              {author.avatarUrl ? (
                <img 
                  src={author.avatarUrl} 
                  alt={authorDisplayName} 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border border-border" 
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 bg-surface-subtle border border-border rounded-full flex items-center justify-center text-4xl font-bold text-muted">
                  {authorDisplayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold font-sans text-foreground mb-1">{authorDisplayName}</h1>
              <p className="text-muted font-medium text-lg mb-4">@{author.handle}</p>
              {author.bio ? (
                <p className="text-foreground text-base md:text-lg max-w-3xl leading-relaxed">{author.bio}</p>
              ) : (
                <p className="text-muted italic">This author hasn't written a bio yet.</p>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-end justify-between border-b border-border pb-6 mb-10">
              <h2 className="text-3xl font-bold font-sans text-foreground">Published Articles</h2>
              <span className="text-lg text-muted font-serif">{pagination.total} {pagination.total === 1 ? 'article' : 'articles'}</span>
            </div>

            {blogs.length === 0 ? (
              <div className="py-12">
                <EmptyState 
                  title="No articles yet" 
                  description={`${authorDisplayName} hasn't published any articles yet.`}
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogs.map((blog) => {
                    const blogWithAuthor = {
                      ...blog,
                      author: blog.author || author
                    };
                    return (
                      <ArticleCard
                        key={blog.id}
                        blog={blogWithAuthor}
                        variant="standard"
                      />
                    );
                  })}
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
          </section>
        </Container>
      </main>
    </div>
  );
}

export default AuthorProfile;
