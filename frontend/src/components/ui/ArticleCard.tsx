import * as React from 'react';
import { cn } from '../../utils/cn';

export interface ArticleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  summary: string;
  date: string;
  readTime?: string;
  author: {
    name: string;
    avatar?: string;
  };
  image?: string;
  variant?: 'standard' | 'featured' | 'compact';
}

const ArticleCard = React.forwardRef<HTMLDivElement, ArticleCardProps>(
  ({ className, title, summary, date, readTime, author, image, variant = 'standard', ...props }, ref) => {
    
    if (variant === 'compact') {
      return (
        <div ref={ref} className={cn('group flex gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 rounded-md', className)} {...props}>
          {image && (
            <div className="h-20 w-24 shrink-0 overflow-hidden rounded-md bg-surface">
              <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>
          )}
          <div className="flex flex-col justify-center">
            <h3 className="text-base font-medium leading-tight text-foreground transition-colors group-hover:text-foreground/80">{title}</h3>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{author.name}</span>
              <span>&middot;</span>
              <time dateTime={date}>{date}</time>
            </div>
          </div>
        </div>
      );
    }

    if (variant === 'featured') {
      return (
        <div ref={ref} className={cn('group relative overflow-hidden bg-transparent flex flex-col md:flex-row gap-6 md:gap-10 focus-visible:outline-none', className)} {...props}>
          {image && (
            <div className="aspect-[4/3] md:aspect-auto md:w-1/2 overflow-hidden bg-surface">
              <img src={image} alt={title} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="flex flex-col justify-center py-2 md:w-1/2">
            <div className="flex items-center gap-3 mb-4">
              {author.avatar ? (
                <img src={author.avatar} alt={author.name} className="h-8 w-8 rounded-full bg-surface object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-xs font-semibold text-foreground uppercase">
                  {author.name.charAt(0)}
                </div>
              )}
              <span className="text-base font-medium text-foreground">{author.name}</span>
            </div>
            <h3 className="text-3xl font-bold tracking-tight text-foreground mb-4 group-hover:underline decoration-foreground/50 underline-offset-4">{title}</h3>
            <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-6 text-lg">{summary}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-auto">
              <time dateTime={date}>{date}</time>
              {readTime && (
                <>
                  <span>&middot;</span>
                  <span>{readTime}</span>
                </>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Standard variant
    return (
      <div ref={ref} className={cn('group flex flex-col h-full bg-transparent focus-visible:outline-none', className)} {...props}>
        {image && (
          <div className="aspect-[16/10] w-full overflow-hidden mb-4 bg-surface">
            <img src={image} alt={title} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
             {author.avatar ? (
              <img src={author.avatar} alt={author.name} className="h-5 w-5 rounded-full bg-surface object-cover" />
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-surface text-[10px] font-semibold text-foreground uppercase">
                {author.name.charAt(0)}
              </div>
            )}
            <span className="text-sm font-medium text-foreground">{author.name}</span>
          </div>
          <h3 className="text-xl font-bold leading-snug text-foreground mb-2 group-hover:underline decoration-foreground/50 underline-offset-4">{title}</h3>
          <p className="text-base text-muted-foreground line-clamp-3 leading-relaxed mb-4">{summary}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-auto">
            <time dateTime={date}>{date}</time>
            {readTime && (
              <>
                <span>&middot;</span>
                <span>{readTime}</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);
ArticleCard.displayName = 'ArticleCard';

export { ArticleCard };
