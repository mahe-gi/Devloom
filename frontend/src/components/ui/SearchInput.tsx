import React from 'react';
import { Search } from 'lucide-react';
import { Input, InputProps } from './Input';

export const SearchInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <div className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
        <Input ref={ref} className="pl-9" type="search" {...props} />
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';
