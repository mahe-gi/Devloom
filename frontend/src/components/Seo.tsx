import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  author?: string;
  publishedTime?: string;
}

export function Seo({
  title,
  description,
  url,
  image = "https://devloom.com/default-og.jpg",
  type = "website",
  author,
  publishedTime,
}: SeoProps) {
  const siteName = "Devloom";
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content={siteName} />

      {/* Article Specific Metadata */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && author && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}
