import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  title: string;
  description?: string;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon: Icon, title, description, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-transparent p-10 text-center animate-in fade-in-50',
          className
        )}
        {...props}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-subtle mb-4">
          <Icon className="h-6 w-6 text-foreground-muted" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight">{title}</h3>
        {description && (
          <p className="mt-2 text-sm text-foreground-muted max-w-sm leading-relaxed">
            {description}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';

export { EmptyState };
