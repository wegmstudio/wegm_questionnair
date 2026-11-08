import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(({ className, ...props }, ref) => (
  <textarea
    className={cn(
      "flex min-h-[110px] w-full rounded-xl border border-input bg-white px-3.5 py-2.5 text-[15px] text-ink shadow-sm transition-colors placeholder:text-slate-400 focus-ring disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive",
      className,
    )}
    ref={ref}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
