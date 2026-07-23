import { InputHTMLAttributes } from "react";

interface LabeledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const LabeledInput = ({
  label,
  className = "",
  disabled,
  ...props
}: LabeledInputProps) => {
  return (
    <div className="w-full space-y-1.5">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <input
        className={`w-full px-4 py-2.5 bg-surface border border-border rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors disabled:opacity-50 disabled:bg-surface-subtle disabled:cursor-not-allowed text-foreground placeholder:text-muted ${className}`}
        disabled={disabled}
        {...props}
      />
    </div>
  );
};
