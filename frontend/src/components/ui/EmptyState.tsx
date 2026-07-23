import React from 'react';
import { FileQuestion } from 'lucide-react';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: React.ReactNode | React.ElementType;
  action?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className = '', title, description, icon: Icon, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface p-8 text-center ${className}`}
        {...props}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-secondary text-foreground-muted mb-4">
          {Icon ? (
            React.isValidElement(Icon) ? Icon : (Icon as React.ElementType) && React.createElement(Icon as React.ElementType, { className: "h-8 w-8" })
          ) : (
            <FileQuestion className="h-8 w-8" />
          )}
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mb-6 max-w-sm text-sm text-foreground-muted">
            {description}
          </p>
        )}
        {action && <div>{action}</div>}
      </div>
    );
  }
);
EmptyState.displayName = 'EmptyState';
