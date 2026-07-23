import { useParams, Link, useNavigate } from "react-router";
import { Appbar } from "../components/Appbar";
import { useblog, Blog as BlogType } from "../hooks/index";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";
import { Share2, Link as LinkIcon, Calendar, Clock, ArrowLeft } from "lucide-react";

import { Seo } from "../components/Seo";
import { MarkdownRenderer } from "../components/article/MarkdownRenderer";

const TagChip = ({ name }: { name: string }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
    {name}
  </span>
);

function Blog() {
  const { slugOrId } = useParams<{ slugOrId: string }>();
  const navigate = useNavigate();
  const { loading, blog, error } = useblog({
    slugOrId: slugOrId ?? "",
  });

  useEffect(() => {
    if (!slugOrId || !blog?.slug) {
      return;
    }

    if (/^\d+$/.test(slugOrId)) {
      navigate(`/blog/${blog.slug}`, { replace: true });
    }
  }, [slugOrId, blog?.slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Appbar />
        <div className="max-w-[720px] mx-auto px-4 py-12">
          <div className="space-y-6 pt-8 animate-pulse">
            <div className="bg-gray-200 h-4 w-24 rounded-full" />
            <div className="bg-gray-200 h-12 w-3/4 rounded-xl" />
            <div className="flex items-center gap-4 mt-6">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="bg-gray-200 h-[400px] w-full mt-8 rounded-2xl" />
            <div className="space-y-4 mt-8">
              <div className="bg-gray-200 h-4 w-full rounded" />
              <div className="bg-gray-200 h-4 w-full rounded" />
              <div className="bg-gray-200 h-4 w-5/6 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-background">
        <Seo title="Article Not Found" description="The requested article could not be loaded." />
        <Appbar />
        <div className="max-w-[720px] mx-auto px-4 py-20 text-center">
          <div className="bg-surface/50 border border-border p-10 rounded-3xl shadow-sm">
            <h2 className="text-xl font-extrabold text-foreground mb-4 tracking-tight">Article Not Found</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              {error || "The requested technical article could not be loaded or has been removed."}
            </p>
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-full transition-colors"
            >
              <ArrowLeft size={18} />
              Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const authorDisplayName = blog.author?.name || blog.author?.username || "Anonymous";
  
  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Published recently";

  const wordCount = blog.content ? blog.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!", {
      position: "bottom-right",
      autoClose: 3000,
      theme: "colored",
      transition: Bounce,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      const url = blog.slug ? `${window.location.origin}/blog/${blog.slug}` : window.location.href;
      navigator.share({
        title: blog.title,
        text: blog.summary || blog.title,
        url: url,
      }).catch(console.error);
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 selection:bg-gray-200 selection:text-foreground">
      <Seo 
        title={blog.title} 
        description={blog.summary || `Read ${blog.title} by ${authorDisplayName}`}
        type="article"
        author={authorDisplayName}
        publishedTime={blog.publishedAt || blog.createdAt}
        image={blog.coverImage || undefined}
        url={`https://devloom.com/blog/${blog.slug || blog.id}`}
      />
      <Appbar />
      
      <main className="max-w-[720px] mx-auto px-4 sm:px-6 mt-10 md:mt-16">
        <div className="mb-10">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-medium transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>
        </div>

        <article>
          <header className="mb-12">
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((t, idx) => (
                  <TagChip key={idx} name={t.tag.name} />
                ))}
              </div>
            )}
            
            <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-5 tracking-tight leading-[1.15]">
              {blog.title}
            </h1>

            {blog.summary && (
              <p className="text-xl text-foreground/80 mb-6 leading-relaxed font-serif">
                {blog.summary}
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-5 border-y border-border">
              <div className="flex items-center gap-4">
                {blog.author?.handle ? (
                  <Link to={`/authors/${blog.author.handle}`} className="shrink-0 group">
                    {blog.author?.avatarUrl ? (
                      <img src={blog.author.avatarUrl} className="w-12 h-12 rounded-full object-cover group-hover:ring-2 ring-offset-2 ring-gray-200 transition-all" alt={authorDisplayName} />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-foreground/80 font-bold group-hover:ring-2 ring-offset-2 ring-gray-200 transition-all">
                        {authorDisplayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                ) : (
                  blog.author?.avatarUrl ? (
                    <img src={blog.author.avatarUrl} className="w-12 h-12 rounded-full object-cover" alt={authorDisplayName} />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-foreground/80 font-bold">
                      {authorDisplayName.charAt(0).toUpperCase()}
                    </div>
                  )
                )}
                
                <div>
                  <div className="text-base font-semibold text-foreground">
                    {blog.author?.handle ? (
                      <Link to={`/authors/${blog.author.handle}`} className="hover:underline underline-offset-4 decoration-gray-300">
                        {authorDisplayName}
                      </Link>
                    ) : (
                      authorDisplayName
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-gray-400" />
                      {readTime} min read
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full text-muted-foreground hover:text-foreground bg-surface/50 hover:bg-surface border border-border transition-colors"
                  aria-label="Copy link"
                  title="Copy link"
                >
                  <LinkIcon size={18} />
                </button>
                {'share' in navigator && (
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full text-muted-foreground hover:text-foreground bg-surface/50 hover:bg-surface border border-border transition-colors"
                    aria-label="Share article"
                    title="Share article"
                  >
                    <Share2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </header>

          {blog.coverImage && (
            <figure className="mb-10 mt-6">
              <img 
                src={blog.coverImage} 
                alt={blog.title} 
                className="w-full h-auto object-cover rounded-2xl shadow-sm border border-border max-h-[450px]" 
                loading="eager" 
              />
            </figure>
          )}

          <div className="mb-12 mt-8">
            <MarkdownRenderer content={blog.content || ""} />
          </div>

          <footer className="mt-16 pt-10 border-t border-border">
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {blog.tags.map((t, idx) => (
                  <TagChip key={idx} name={t.tag.name} />
                ))}
              </div>
            )}
            
            <div className="bg-surface/50 rounded-3xl p-8 border border-border flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {blog.author?.handle ? (
                <Link to={`/authors/${blog.author.handle}`} className="shrink-0 group">
                  {blog.author?.avatarUrl ? (
                     <img src={blog.author.avatarUrl} className="w-14 h-14 rounded-full object-cover group-hover:scale-105 transition-transform duration-300" alt={authorDisplayName} />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center text-gray-700 text-xl font-bold group-hover:scale-105 transition-transform duration-300">
                      {authorDisplayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
              ) : (
                blog.author?.avatarUrl ? (
                  <img src={blog.author.avatarUrl} className="w-14 h-14 rounded-full object-cover" alt={authorDisplayName} />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center text-gray-700 text-xl font-bold">
                    {authorDisplayName.charAt(0).toUpperCase()}
                  </div>
                )
              )}
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Written by {authorDisplayName}
                </h3>
                <p className="text-foreground/80 leading-relaxed mb-5">
                   {(blog.author as any)?.bio || "A passionate writer and developer sharing knowledge with the community."}
                </p>
                {blog.author?.handle && (
                  <Link 
                    to={`/authors/${blog.author.handle}`}
                    className="inline-flex items-center gap-1.5 text-foreground hover:text-foreground/80 font-semibold transition-colors"
                  >
                    View more posts
                    <ArrowLeft size={16} className="rotate-180" />
                  </Link>
                )}
              </div>
            </div>
          </footer>
        </article>

        <RelatedArticles slugOrId={slugOrId as string} />
      </main>
      <ToastContainer />
    </div>
  );
}

function RelatedArticles({ slugOrId }: { slugOrId: string }) {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<BlogType[]>([]);

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/blog/${slugOrId}/related`)
      .then(res => {
        setArticles(res.data.articles || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slugOrId]);

  if (loading || articles.length === 0) return null;

  return (
    <div className="mt-16 border-t border-border pt-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 tracking-tight">Read Next</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {articles.map(article => (
          <Link 
            key={article.id} 
            to={`/blog/${article.slug || article.id}`}
            className="group block p-6 bg-background border border-border rounded-2xl hover:border-gray-900 hover:shadow-md transition-all duration-300"
          >
            <h4 className="text-xl font-bold text-foreground mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
              {article.title}
            </h4>
            {article.summary && (
              <p className="text-muted-foreground leading-relaxed line-clamp-3">
                {article.summary}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Blog;
