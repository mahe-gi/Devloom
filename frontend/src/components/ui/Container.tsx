import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'wide' | 'standard' | 'article';
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className = '', size = 'lg', ...props }, ref) => {
    const sizes: Record<string, string> = {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      full: 'max-w-full',
      wide: 'max-w-screen-xl',
      standard: 'max-w-screen-lg',
      article: 'max-w-screen-md',
    };

    return (
      <div
        ref={ref}
        className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizes[size as string] || sizes.lg} ${className}`}
        {...props}
      />
    );
  }
);
Container.displayName = 'Container';
