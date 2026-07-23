import * as React from 'react';
import { cn } from '../../utils/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, fallback, size = 'md', ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false);

    const sizeClasses = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-14 w-14 text-base',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full bg-surface',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt="Avatar"
            className="aspect-square h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface text-muted font-medium uppercase">
            {fallback}
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

export { Avatar };
