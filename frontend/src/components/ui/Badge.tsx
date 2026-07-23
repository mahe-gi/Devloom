import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'primary';
}

export function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-surface-secondary text-foreground hover:bg-surface-hover',
    primary: 'bg-primary-soft text-primary hover:bg-primary/20',
    secondary: 'bg-surface-secondary text-foreground-secondary',
    outline: 'text-foreground border border-border',
  };

  return (
    <div
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
