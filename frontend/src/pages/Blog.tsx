import { useParams, Link, useNavigate } from "react-router";
import { Appbar } from "../components/Appbar";
import { useblog, Blog as BlogType } from "../hooks/index";
import { Skeleton } from "../components/ui/Skeleton";
import { ArticleCard } from "../components/ui/ArticleCard";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useEffect, useState } from "react";
import axios from "axios";

import { Seo } from "../components/Seo";
import { ArrowLeft, Share2, Link as LinkIcon, Calendar, Clock } from "lucide-react";
import { Avatar } from "../components/ui/Avatar";
import { MarkdownRenderer } from "../components/article/MarkdownRenderer";

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
        <div className="max-w-[760px] mx-auto px-4 py-8">
          <div className="space-y-6 pt-12 max-w-[760px] mx-auto">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-64 w-full mt-8" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
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
        <div className="max-w-[760px] mx-auto px-4 py-16 text-center">
          <div className="bg-surface border border-border p-8 rounded-xl shadow-xs">
            <h2 className="text-2xl font-bold text-foreground mb-2">Article Not Found</h2>
            <p className="text-muted mb-6">
              {error || "The requested technical article could not be loaded."}
            </p>
            <Link
              to="/blogs"
              className="inline-flex items-center bg-primary hover:bg-primary-hover text-primary-foreground font-medium px-5 py-2.5 rounded-lg transition"
            >
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
    <div className="min-h-screen bg-background pb-16">
      <Seo 
        title={blog.title} 
        description={blog.summary || `Read ${blog.title} by ${authorDisplayName}`}
        type="article"
        author={authorDisplayName}
        publishedTime={blog.publishedAt || blog.createdAt}
        image={blog.coverImage || undefined}
        url={`https://101dev.com/blog/${blog.slug || blog.id}`}
      />
      <Appbar />
      
      <main className="max-w-[760px] mx-auto px-4 sm:px-6 mt-8 md:mt-12">
        <div className="mb-8">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1.5 text-sm text-foreground-muted hover:text-foreground font-medium transition group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>
        </div>

        <article>
          <header className="mb-10">
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-5">
                <span className="text-primary font-semibold text-sm tracking-wider uppercase">
                  {blog.tags[0].tag.name}
                </span>
              </div>
            )}
            
            <h1 className="text-page-title font-bold text-foreground mb-6 tracking-tight">
              {blog.title}
            </h1>

            {blog.summary && (
              <p className="text-xl text-foreground-secondary mb-8 leading-relaxed font-serif">
                {blog.summary}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-y border-border">
              <div className="flex items-center gap-4">
                {blog.author?.handle ? (
                  <Link to={`/authors/${blog.author.handle}`} className="shrink-0 hover:opacity-80 transition-opacity">
                    <Avatar src={blog.author.avatarUrl || undefined} fallback={authorDisplayName.charAt(0).toUpperCase()} size="lg" />
                  </Link>
                ) : (
                  <Avatar src={blog.author?.avatarUrl || undefined} fallback={authorDisplayName.charAt(0).toUpperCase()} size="lg" />
                )}
                
                <div>
                  <div className="text-base font-semibold text-foreground">
                    {blog.author?.handle ? (
                      <Link to={`/authors/${blog.author.handle}`} className="hover:text-primary transition-colors">
                        {authorDisplayName}
                      </Link>
                    ) : (
                      authorDisplayName
                    )}
                  </div>
                  <div className="text-sm text-foreground-secondary flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {readTime} min read
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full text-foreground-secondary hover:text-foreground bg-surface-secondary hover:bg-surface-hover border border-transparent hover:border-border transition-all"
                  aria-label="Copy link"
                  title="Copy link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                {'share' in navigator && (
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full text-foreground-secondary hover:text-foreground bg-surface-secondary hover:bg-surface-hover border border-transparent hover:border-border transition-all"
                    aria-label="Share article"
                    title="Share article"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </header>

          {blog.coverImage && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-sm border border-border">
              <img src={blog.coverImage} alt={blog.title} className="w-full h-auto object-cover max-h-[500px]" loading="eager" />
            </div>
          )}

          <div className="mb-16">
            <MarkdownRenderer content={blog.content || ""} />
          </div>

          <footer className="mt-12 pt-8 border-t border-border">
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mb-12">
                {blog.tags.map((t, idx) => (
                  <span key={idx} className="px-4 py-1.5 bg-surface-secondary hover:bg-surface-hover text-foreground-secondary hover:text-foreground text-sm font-medium rounded-full border border-border transition-colors cursor-pointer">
                    #{t.tag.name}
                  </span>
                ))}
              </div>
            )}
            
            <div className="bg-surface-secondary rounded-2xl p-6 sm:p-8 border border-border flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {blog.author?.handle ? (
                <Link to={`/authors/${blog.author.handle}`} className="shrink-0 hover:opacity-80 transition-opacity">
                  <Avatar src={blog.author.avatarUrl || undefined} fallback={authorDisplayName.charAt(0).toUpperCase()} size="lg" className="w-20 h-20 text-2xl" />
                </Link>
              ) : (
                <Avatar src={blog.author?.avatarUrl || undefined} fallback={authorDisplayName.charAt(0).toUpperCase()} size="lg" className="w-20 h-20 text-2xl" />
              )}
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Written by {authorDisplayName}
                </h3>
                <p className="text-foreground-secondary leading-relaxed mb-4">
                   {(blog.author as any)?.bio || "A passionate writer and developer sharing knowledge with the community."}
                </p>
                {blog.author?.handle && (
                  <Link 
                    to={`/authors/${blog.author.handle}`}
                    className="inline-flex items-center text-primary hover:text-primary-hover font-medium transition-colors"
                  >
                    View all posts →
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
    <div className="mt-16 border-t border-border pt-12">
      <h3 className="text-2xl font-bold text-foreground mb-6">Read Next</h3>
      <div className="space-y-6">
        {articles.map(article => {

          return (
            <div className="bg-surface border border-border rounded-xl shadow-xs" key={article.id}>
              <ArticleCard blog={article} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Blog;
