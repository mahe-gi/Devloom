import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'destructive' | 'text';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading,
      loading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const v = variant === 'destructive' ? 'danger' : variant === 'text' ? 'ghost' : variant;
    
    const variants = {
      primary: 'bg-primary text-white hover:opacity-90',
      secondary: 'bg-surface-secondary text-foreground hover:bg-surface-hover',
      outline: 'border border-border bg-transparent hover:bg-surface-secondary text-foreground',
      ghost: 'bg-transparent hover:bg-surface-secondary text-foreground',
      danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-8 text-base rounded-lg',
    };

    const isLoad = isLoading || loading;

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[v as keyof typeof variants]} ${sizes[size]} ${className}`}
        disabled={isLoad || disabled}
        {...props}
      >
        {isLoad && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoad && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoad && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
