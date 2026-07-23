import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ className = '', title = 'Something went wrong', description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50/50 p-8 text-center dark:border-red-900/50 dark:bg-red-900/10 ${className}`}
        {...props}
      >
        <AlertCircle className="mb-4 h-10 w-10 text-red-500" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mb-6 max-w-sm text-sm text-foreground-secondary">
            {description}
          </p>
        )}
        {action && <div>{action}</div>}
      </div>
    );
  }
);
ErrorState.displayName = 'ErrorState';
