import * as React from 'react';
import { cn } from '../../utils/cn';

export interface TagChipProps extends React.HTMLAttributes<HTMLSpanElement> {}

const TagChip = React.forwardRef<HTMLSpanElement, TagChipProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-md bg-surface px-2.5 py-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground cursor-default',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);
TagChip.displayName = 'TagChip';

export { TagChip };
