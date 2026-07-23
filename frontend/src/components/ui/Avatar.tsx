import React from 'react';
import { User } from 'lucide-react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className = '', src, alt, fallback, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
    };

    return (
      <div
        ref={ref}
        className={`relative flex shrink-0 overflow-hidden rounded-full bg-surface-secondary items-center justify-center text-foreground font-medium ${sizes[size]} ${className}`}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt || 'Avatar'} className="aspect-square h-full w-full object-cover" />
        ) : fallback ? (
          <span>{fallback}</span>
        ) : (
          <User className="h-1/2 w-1/2 text-foreground-muted" />
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';
