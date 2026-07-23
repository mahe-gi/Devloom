import { X } from 'lucide-react';

export interface TagChipProps extends React.HTMLAttributes<HTMLDivElement> {
  onRemove?: () => void;
  removable?: boolean;
  label?: string;
  selected?: boolean;
}

export function TagChip({ className = '', onRemove, removable, label, selected, children, ...props }: TagChipProps) {
  return (
    <div
      className={`inline-flex items-center rounded-md border border-border px-2.5 py-0.5 text-xs font-medium text-foreground ${selected ? 'bg-primary text-white' : 'bg-surface-secondary'} ${className}`}
      {...props}
    >
      {label || children}
      {(onRemove || removable) && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 rounded-sm outline-none ring-offset-background hover:bg-surface-hover focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <X className="h-3 w-3 text-foreground-muted hover:text-foreground" />
          <span className="sr-only">Remove</span>
        </button>
      )}
    </div>
  );
}
