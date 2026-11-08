import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva("relative w-full rounded-xl border px-4 py-3.5 text-sm [&>svg~*]:pl-8 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:size-4", {
  variants: {
    variant: {
      default: "border-line bg-white text-ink [&>svg]:text-navy",
      info: "border-purple-100 bg-purple-50 text-purple-600 [&>svg]:text-purple",
      warning: "border-amber-200 bg-amber-50 text-amber-900 [&>svg]:text-amber-600",
      destructive: "border-red-200 bg-red-50 text-red-800 [&>svg]:text-red-600",
      success: "border-emerald-200 bg-emerald-50 text-emerald-900 [&>svg]:text-emerald-600",
    },
  },
  defaultVariants: { variant: "default" },
});

const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h5 ref={ref} className={cn("mb-1 font-semibold leading-none", className)} {...props} />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm leading-relaxed [&_p]:leading-relaxed", className)} {...props} />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
