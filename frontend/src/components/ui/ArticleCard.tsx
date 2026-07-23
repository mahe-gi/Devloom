import { Card, CardContent, CardFooter, CardHeader } from './Card';
import { Badge } from './Badge';

export interface ArticleCardProps {
  blog?: any;
  title?: string;
  excerpt?: string;
  date?: string;
  readTime?: string;
  tags?: any[];
  imageUrl?: string;
  className?: string;
  variant?: string;
  onClick?: () => void;
}

export function ArticleCard({ blog, title, excerpt, date, readTime, tags, imageUrl, className = '', onClick }: ArticleCardProps) {
  const displayTitle = title || blog?.title;
  const displayExcerpt = excerpt || blog?.excerpt || blog?.content?.substring(0, 100);
  const displayDate = date || blog?.publishedAt || blog?.createdAt;
  const displayTags = tags || blog?.tags || [];
  
  return (
    <Card 
      className={`overflow-hidden transition-colors hover:bg-surface-hover cursor-pointer group ${className}`} 
      onClick={onClick}
    >
      {imageUrl && (
        <div className="aspect-video w-full overflow-hidden bg-surface-secondary">
          <img src={imageUrl} alt={displayTitle} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
      )}
      <CardHeader>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {displayTitle}
          </h3>
          <div className="flex items-center text-sm text-foreground-muted space-x-2">
            <span>{displayDate}</span>
            {readTime && (
              <>
                <span>•</span>
                <span>{readTime}</span>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground-secondary line-clamp-3 text-sm">
          {displayExcerpt}
        </p>
      </CardContent>
      {displayTags && displayTags.length > 0 && (
        <CardFooter>
          <div className="flex flex-wrap gap-2">
            {displayTags.map((t: any) => {
              const tagName = t?.tag?.name || t?.name || (typeof t === 'string' ? t : 'Tag');
              const tagId = t?.tag?.id || t?.id || t;
              return <Badge key={tagId} variant="secondary">{tagName}</Badge>;
            })}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
