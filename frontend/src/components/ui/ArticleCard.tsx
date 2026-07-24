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
    
    // Compact: Just text, perfect for sidebars or "more from author" sections
    if (variant === 'compact') {
      return (
        <div ref={ref} className={cn('group flex flex-col gap-2 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 transition-all duration-300', className)} {...props}>
          <div className="flex items-center gap-2 mb-1">
             {author.avatar ? (
              <img src={author.avatar} alt={author.name} className="h-5 w-5 rounded-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/10 text-[10px] font-semibold text-foreground uppercase">
                {author.name.charAt(0)}
              </div>
            )}
            <span className="text-sm font-medium text-foreground">{author.name}</span>
          </div>
          <h3 className="text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">{title}</h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <time dateTime={date}>{date}</time>
            {readTime && (
              <>
                <span>&middot;</span>
                <span>{readTime}</span>
              </>
            )}
          </div>
        </div>
      );
    }

    // Featured: Massive hero layout, no container
    if (variant === 'featured') {
      return (
        <div ref={ref} className={cn('group flex flex-col gap-6 focus-visible:outline-none transition-all duration-300', className)} {...props}>
          {image && (
            <div className="w-full aspect-video overflow-hidden">
              <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" />
            </div>
          )}
          <div className="flex flex-col pt-2">
            <div className="flex items-center gap-3 mb-4">
              {author.avatar ? (
                <img src={author.avatar} alt={author.name} className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold text-foreground uppercase">
                  {author.name.charAt(0)}
                </div>
              )}
              <span className="text-base font-semibold text-foreground">{author.name}</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-muted-foreground leading-relaxed line-clamp-3 mb-6 text-xl">{summary}</p>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mt-auto">
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

    // Standard: Medium-style row layout
    return (
      <div ref={ref} className={cn('group flex flex-col-reverse md:flex-row justify-between gap-6 py-8 focus-visible:outline-none transition-all duration-300', className)} {...props}>
        <div className="flex flex-col flex-1 max-w-3xl justify-center pr-0 md:pr-8">
          <div className="flex items-center gap-2 mb-3">
             {author.avatar ? (
              <img src={author.avatar} alt={author.name} className="h-6 w-6 rounded-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground/10 text-[10px] font-semibold text-foreground uppercase">
                {author.name.charAt(0)}
              </div>
            )}
            <span className="text-sm font-semibold text-foreground">{author.name}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-snug text-foreground mb-3 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-base md:text-lg font-medium text-muted-foreground line-clamp-2 md:line-clamp-3 leading-relaxed mb-6">{summary}</p>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mt-auto">
            <time dateTime={date}>{date}</time>
            {readTime && (
              <>
                <span>&middot;</span>
                <span>{readTime}</span>
              </>
            )}
          </div>
        </div>
        {image && (
          <div className="w-full md:w-[280px] h-[180px] shrink-0 overflow-hidden bg-surface mb-4 md:mb-0">
            <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
        )}
      </div>
    );
  }
);
ArticleCard.displayName = 'ArticleCard';

export { ArticleCard };

