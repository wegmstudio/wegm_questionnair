import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldProps {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
  /** Use a plain element instead of <label> when the control is a group of buttons. */
  asGroup?: boolean;
}

export function Field({ id, label, description, required, error, children, className, asGroup }: FieldProps) {
  const LabelTag = asGroup ? "div" : Label;
  return (
    <div className={cn("space-y-2", className)} role={asGroup ? "group" : undefined} aria-labelledby={asGroup ? `${id}-label` : undefined}>
      <LabelTag {...(asGroup ? { id: `${id}-label`, className: "text-[15px] font-semibold leading-snug text-navy" } : { htmlFor: id })}>
        {label}
        {required ? <span className="ml-1 text-purple" aria-hidden>*</span> : <span className="ml-2 text-xs font-medium text-slate-400">Optional</span>}
      </LabelTag>
      {description && <p className="text-sm leading-relaxed text-slate">{description}</p>}
      {children}
      {error && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
