import { Appbar } from "../components/Appbar";
import { useBlogs } from "../hooks";
import { Link, useSearchParams } from "react-router";
import { useState, useEffect } from "react";
import { Seo } from "../components/Seo";

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
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Seo 
        title={seoTitle}
        description="Discover the latest technical articles, tutorials, and insights from the 101dev developer community."
        url="https://101dev.com/blogs"
      />
      <Appbar />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-6 mb-10 gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-sans text-gray-900 mb-4">
                {tag ? (
                  <span className="flex items-center gap-4">
                    Tag <span className="text-xl px-3 py-1 bg-gray-100 rounded-full">{tag}</span>
                  </span>
                ) : (
                  "Latest Articles"
                )}
              </h1>
              <p className="text-gray-500 text-lg font-serif">
                {pagination.total} {pagination.total === 1 ? 'article' : 'articles'} found
              </p>
            </div>

            <form onSubmit={handleSearch} className="relative w-full md:w-80">
              <input
                type="search"
                placeholder="Search articles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-5 pr-12 py-3 bg-white border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>
          </div>

          {(q || tag) && (
            <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="font-medium">Filters:</span>
              {q && <span className="bg-white border border-gray-200 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">Search: "{q}"</span>}
              {tag && <span className="px-3 py-1 bg-gray-100 rounded-full">{tag}</span>}
              <button onClick={clearFilters} className="ml-2 text-blue-600 hover:underline">Clear all</button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-5 rounded-xl mb-10 text-center">
              <p className="font-medium text-lg">{error}</p>
            </div>
          )}

          {loading && page === 1 ? (
            <div className="space-y-4">
              <div className="h-64 w-full bg-gray-100 animate-pulse rounded-2xl" />
              <div className="h-64 w-full bg-gray-100 animate-pulse rounded-2xl" />
              <div className="h-64 w-full bg-gray-100 animate-pulse rounded-2xl" />
            </div>
          ) : !error && blogs.length === 0 ? (
            <div className="py-12">
              <div className="text-center p-8 border border-gray-200 rounded-2xl bg-gray-50">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {q || tag ? "No articles found matching your criteria" : "No articles published yet"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {q || tag ? "Try adjusting your search or clearing filters." : "Be the first developer to share your technical knowledge with the community."}
                </p>
                {q || tag ? (
                  <button onClick={clearFilters} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">Clear Filters</button>
                ) : (
                  <Link to="/publish">
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-lg">Write First Article</button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <div key={blog.id} className="border border-gray-200 p-4 rounded-lg bg-white flex flex-col shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{blog.title || 'Article'}</h3>
                    <Link to={`/blog/${blog.id}`} className="text-blue-600 hover:underline mt-auto inline-block text-sm font-medium">Read more</Link>
                  </div>
                ))}
              </div>

              {pagination.hasNextPage && (
                <div className="mt-16 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-full px-8 py-3 font-medium transition-colors disabled:opacity-50"
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
