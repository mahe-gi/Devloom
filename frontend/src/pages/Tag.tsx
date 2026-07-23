import { Appbar } from "../components/Appbar";
import { useBlogs } from "../hooks";
import { Link, useParams } from "react-router";
import { useState, useEffect } from "react";
import { Seo } from "../components/Seo";

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
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Seo 
        title={seoTitle}
        description={`Read the latest technical articles about ${tag} from the 101dev developer community.`}
        url={`https://101dev.com/tags/${tag}`}
      />
      <Appbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="border-b border-gray-200 pb-6 mb-10">
            <h1 className="text-4xl md:text-5xl font-bold font-sans text-gray-900 mb-4 flex items-center gap-4">
              <span className="text-gray-600">Topic:</span> 
              <span className="text-2xl py-1.5 px-4 bg-gray-100 text-gray-700 rounded-full border border-gray-200">{tag}</span>
            </h1>
            <p className="text-gray-600 text-lg font-serif">
              {pagination.total} {pagination.total === 1 ? 'article' : 'articles'} found
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-200 text-red-600 px-6 py-5 rounded-xl mb-10 text-center">
              <p className="font-medium text-lg">{error}</p>
            </div>
          )}

          {loading && page === 1 ? (
            <div className="space-y-4">
              <div className="h-64 w-full bg-gray-200 rounded-2xl animate-pulse" />
              <div className="h-64 w-full bg-gray-200 rounded-2xl animate-pulse" />
              <div className="h-64 w-full bg-gray-200 rounded-2xl animate-pulse" />
            </div>
          ) : !error && blogs.length === 0 ? (
            <div className="py-12">
              <div className="text-center">
                <h3 className="text-xl font-bold">No articles found for #{tag}</h3>
                <p className="text-gray-600 mt-2">There are currently no published articles with this tag.</p>
                <div className="mt-4">
                  <Link to="/blogs">
                    <button className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50">Browse all articles</button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <div key={blog.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="text-sm text-gray-600 mb-2">{blog.author?.name || 'Anonymous'}</div>
                    <Link to={`/blog/${blog.id}`} className="text-xl font-bold text-gray-900 hover:underline">{blog.title}</Link>
                    <p className="text-gray-700 mt-2 line-clamp-3">{blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...</p>
                  </div>
                ))}
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
        </div>
      </main>
    </div>
  );
}

export default Tag;
