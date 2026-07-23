import { Link } from "react-router";
import { Appbar } from "../components/Appbar";
import { useBlogs } from "../hooks";
import { Seo } from "../components/Seo";

function Landing() {
  const { loading, blogs, error } = useBlogs();
  
  const featuredArticle = blogs.length > 0 ? blogs[0] : null;
  const recentArticles = blogs.length > 1 ? blogs.slice(1, 4) : [];
  const moreArticles = blogs.length > 4 ? blogs.slice(4, 8) : [];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Seo 
        title="101dev | Engineering Insights & Tutorials"
        description="A platform for software engineers to publish deep dives, architectural notes, and technical articles."
        url="https://101dev.com"
      />
      <Appbar />

      <main className="flex-1">
        {/* Hero Section - 2 Column */}
        <section className="border-b border-gray-200 bg-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col items-start text-left">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-8">
                  <span>The Engineering Publication</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6 font-serif">
                  Write what you learn. Help developers build better.
                </h1>
                
                <p className="text-lg md:text-xl text-gray-500 max-w-xl leading-relaxed mb-10 font-serif">
                  Discover in-depth engineering tutorials, software design patterns, and architectural insights written by developers, for developers.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                  <Link to="/blogs" className="w-full sm:w-auto">
                    <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium w-full sm:w-auto">
                      Start Reading
                    </button>
                  </Link>
                  <Link to="/publish" className="w-full sm:w-auto">
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg font-medium w-full sm:w-auto hover:bg-gray-50">
                      Write an Article
                    </button>
                  </Link>
                </div>
              </div>
              
              <div className="w-full">
                {loading ? (
                  <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-2xl border border-gray-200"></div>
                ) : error ? (
                  <div className="text-center py-12 px-4 border border-gray-200 rounded-2xl bg-white">
                    <h3 className="text-lg font-medium text-gray-900">Failed to load articles</h3>
                    <p className="mt-2 text-sm text-gray-500">There was a problem fetching the latest content. Please try again later.</p>
                  </div>
                ) : featuredArticle ? (
                  <div className="transform rotate-1 hover:rotate-0 transition-transform duration-300">
                    <div className="border border-gray-200 p-6 rounded-2xl bg-white shadow-sm flex flex-col">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{featuredArticle.title || 'Featured Article'}</h2>
                      <Link to={`/blog/${featuredArticle.id}`} className="text-blue-600 hover:underline mt-4 inline-block font-medium">Read more</Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 p-8 rounded-2xl shadow-sm text-center">
                    <h3 className="font-serif text-2xl font-bold mb-2 text-gray-900">No articles yet</h3>
                    <p className="text-gray-500 mb-6">Be the first to publish an engineering insight.</p>
                    <Link to="/publish">
                      <button className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium">Start Writing</button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Recent Articles Grid */}
        {recentArticles.length > 0 && (
          <section className="bg-white py-16 md:py-24 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold font-serif text-gray-900 mb-12">Latest Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentArticles.map(blog => (
                  <div key={blog.id} className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{blog.title || 'Article'}</h3>
                    <Link to={`/blog/${blog.id}`} className="text-blue-600 hover:underline mt-auto inline-block text-sm font-medium">Read more</Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* More Articles / Topics Exploration */}
        {moreArticles.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              <div className="lg:col-span-1">
                <h3 className="text-xl font-bold font-serif text-gray-900 mb-6">Explore Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'System Design', 'TypeScript', 'Backend', 'DevOps', 'Architecture'].map(topic => (
                    <span key={topic} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-500 hover:text-gray-900 hover:border-blue-500 cursor-pointer transition-colors">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="lg:col-span-3">
                <h3 className="text-2xl font-bold font-serif text-gray-900 mb-8">More Reading</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {moreArticles.map(blog => (
                    <div key={blog.id} className="border border-gray-200 p-4 rounded-lg bg-white flex flex-col">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{blog.title || 'Article'}</h4>
                      <Link to={`/blog/${blog.id}`} className="text-blue-600 hover:underline mt-auto inline-block text-sm font-medium">Read more</Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-gray-900">
                101dev
              </span>
            </div>
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} 101dev. Built for engineers.
            </div>
            <div className="flex gap-4">
              <Link to="/blogs" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Articles</Link>
              <Link to="/publish" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Publish</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

