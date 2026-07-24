import { useParams } from "react-router";
import { Appbar } from "../components/Appbar";
import { useAuthorProfile } from "../hooks";
import { useState } from "react";
import { Seo } from "../components/Seo";
import { Link } from "react-router";
import { Button } from "../components/ui/Button";
import { ArticleCard } from "../components/ui/ArticleCard";
import { Avatar } from "../components/ui/Avatar";

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
        <div className="max-w-5xl mx-auto px-4 w-full pt-28 pb-16 flex-1">
          <div className="animate-pulse flex flex-col md:flex-row gap-8 items-start md:items-center mb-16 border-b border-border pb-12">
            <div className="h-32 w-32 bg-surface rounded-full border border-border shrink-0"></div>
            <div className="flex-1 w-full space-y-4">
              <div className="h-10 bg-surface rounded w-1/3"></div>
              <div className="h-6 bg-surface rounded w-1/4"></div>
              <div className="h-20 bg-surface rounded w-full max-w-2xl mt-4"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="h-80 w-full bg-surface rounded-2xl animate-pulse" />
            <div className="h-80 w-full bg-surface rounded-2xl animate-pulse" />
            <div className="h-80 w-full bg-surface rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Seo title="Author Not Found" description="The requested author profile could not be loaded." />
        <Appbar />
        <div className="max-w-5xl mx-auto px-4 w-full py-24 flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-2xl font-bold font-sans">Author Not Found</h3>
            <p className="text-muted mt-3 text-lg">{error || "The requested author profile could not be loaded or doesn't exist."}</p>
            <div className="mt-8">
              <Link to="/blogs">
                <Button variant="outline">Back to Blogs</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const authorDisplayName = author.name || author.username || "Anonymous";
  const seoDescription = author.bio || `Read technical articles by ${authorDisplayName} on Devloom.`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Seo 
        title={`${authorDisplayName} (@${author.handle})`}
        description={seoDescription}
        type="profile"
        image={author.avatarUrl || undefined}
        url={`https://devloom.com/authors/${author.handle}`}
      />
      <Appbar />
      
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-4 w-full">
          <section className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-16 border-b border-border pb-12">
            <div className="shrink-0">
              <Avatar 
                src={author.avatarUrl} 
                fallback={authorDisplayName.charAt(0)} 
                size="lg" 
                className="w-24 h-24 md:w-32 md:h-32 text-4xl border border-border shadow-sm" 
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold font-sans text-foreground mb-2 tracking-tight">{authorDisplayName}</h1>
              <p className="text-muted font-medium text-lg mb-6">@{author.handle}</p>
              {author.bio ? (
                <p className="text-foreground/90 text-lg md:text-xl max-w-3xl leading-relaxed font-serif">{author.bio}</p>
              ) : (
                <p className="text-muted italic text-lg font-serif">This author hasn't written a bio yet.</p>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-end justify-between mb-10">
              <h2 className="text-3xl font-bold font-sans text-foreground tracking-tight">Published Articles</h2>
              <span className="text-lg text-muted font-serif">{pagination.total} {pagination.total === 1 ? 'article' : 'articles'}</span>
            </div>

            {blogs.length === 0 ? (
              <div className="py-16 bg-surface rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center">
                <div className="text-4xl mb-4 opacity-50">✍️</div>
                <h3 className="text-xl font-bold mb-2">No articles yet</h3>
                <p className="text-muted max-w-sm">{authorDisplayName} hasn't published any articles yet. Check back later!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {blogs.map((blog) => {
                    const blogAuthor = blog.author || author;
                    const dateStr = new Date(blog.createdAt || "").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                    
                    return (
                      <Link key={blog.id} to={`/blog/${blog.id}`} className="block h-full transition-transform hover:-translate-y-1 duration-300">
                        <ArticleCard 
                          title={blog.title}
                          summary={blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..."}
                          date={dateStr}
                          author={{
                            name: blogAuthor.name || 'Anonymous',
                            avatar: blogAuthor.avatarUrl || undefined
                          }}
                          image={blog.coverImage || undefined}
                          variant="standard"
                          className="h-full bg-surface border border-border p-4 hover:border-foreground/20 rounded-xl"
                        />
                      </Link>
                    );
                  })}
                </div>

                {pagination.hasNextPage && (
                  <div className="mt-16 flex justify-center">
                    <Button
                      onClick={handleLoadMore}
                      disabled={loading}
                      variant="outline"
                      size="lg"
                    >
                      {loading ? "Loading..." : "Load More Articles"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default AuthorProfile;
