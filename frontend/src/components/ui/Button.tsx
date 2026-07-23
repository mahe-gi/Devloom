import * as React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary-hover',
          (variant === 'secondary' || variant === 'outline') && 'border border-border bg-transparent hover:bg-surface-hover text-foreground',
          variant === 'ghost' && 'hover:bg-surface-hover text-foreground',
          variant === 'destructive' && 'bg-red-500 text-white hover:bg-red-600',
          size === 'sm' && 'h-8 px-3 text-xs',
          size === 'md' && 'h-9 px-4 py-2 text-sm',
          size === 'lg' && 'h-11 px-8 text-base',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
