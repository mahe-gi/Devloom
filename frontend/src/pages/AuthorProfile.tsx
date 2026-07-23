import { useParams } from "react-router";
import { Appbar } from "../components/Appbar";
import { useAuthorProfile } from "../hooks";
import { useState } from "react";
import { Seo } from "../components/Seo";
import { Link } from "react-router";

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
      <div className="min-h-screen bg-white text-gray-900 flex flex-col">
        <Appbar />
        <div className="max-w-7xl mx-auto px-4 w-full py-12 flex-1">
          <div className="animate-pulse flex flex-col gap-6 mb-16">
            <div className="h-32 w-32 bg-gray-100 rounded-full mb-2"></div>
            <div className="h-10 bg-gray-100 rounded w-1/4"></div>
            <div className="h-6 bg-gray-100 rounded w-2/3"></div>
          </div>
          <div className="space-y-4">
            <div className="h-64 w-full bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-64 w-full bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-64 w-full bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex flex-col">
        <Seo title="Author Not Found" description="The requested author profile could not be loaded." />
        <Appbar />
        <div className="max-w-7xl mx-auto px-4 w-full py-24 flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-bold">Author Not Found</h3>
            <p className="text-gray-600 mt-2">{error || "The requested author profile could not be loaded or doesn't exist."}</p>
            <div className="mt-4">
              <a href="/blogs"><button className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50">Back to Blogs</button></a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const authorDisplayName = author.name || author.username || "Anonymous";
  const seoDescription = author.bio || `Read technical articles by ${authorDisplayName} on 101dev.`;

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Seo 
        title={`${authorDisplayName} (@${author.handle})`}
        description={seoDescription}
        type="profile"
        image={author.avatarUrl || undefined}
        url={`https://101dev.com/authors/${author.handle}`}
      />
      <Appbar />
      
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <section className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-16 pt-8">
            <div className="shrink-0">
              {author.avatarUrl ? (
                <img 
                  src={author.avatarUrl} 
                  alt={authorDisplayName} 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border border-gray-200" 
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-gray-600">
                  {authorDisplayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold font-sans text-gray-900 mb-1">{authorDisplayName}</h1>
              <p className="text-gray-600 font-medium text-lg mb-4">@{author.handle}</p>
              {author.bio ? (
                <p className="text-gray-900 text-base md:text-lg max-w-3xl leading-relaxed">{author.bio}</p>
              ) : (
                <p className="text-gray-600 italic">This author hasn't written a bio yet.</p>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-end justify-between border-b border-gray-200 pb-6 mb-10">
              <h2 className="text-3xl font-bold font-sans text-gray-900">Published Articles</h2>
              <span className="text-lg text-gray-600 font-serif">{pagination.total} {pagination.total === 1 ? 'article' : 'articles'}</span>
            </div>

            {blogs.length === 0 ? (
              <div className="py-12">
                <div className="text-center">
                  <h3 className="text-xl font-bold">No articles yet</h3>
                  <p className="text-gray-600 mt-2">{authorDisplayName} hasn't published any articles yet.</p>
                </div>
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
                      <div key={blog.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="text-sm text-gray-600 mb-2">{blogWithAuthor.author?.name || 'Anonymous'}</div>
                        <Link to={`/blog/${blog.id}`} className="text-xl font-bold text-gray-900 hover:underline">{blog.title}</Link>
                        <p className="text-gray-700 mt-2 line-clamp-3">{blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...</p>
                      </div>
                    );
                  })}
                </div>

                {pagination.hasNextPage && (
                  <div className="mt-16 flex justify-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="border border-gray-300 rounded-full px-8 py-2 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {loading ? "Loading..." : "Load More"}
                    </button>
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
