import Link from "next/link";
import { cn } from "@/lib/utils";

export function Wordmark({ className, dark = false, href = "/" }: { className?: string; dark?: boolean; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-baseline gap-1 text-[17px] tracking-tight focus-ring rounded-md", dark ? "text-white" : "text-navy", className)}>
      <span className="font-extrabold">WEGM</span>
      <span className="font-normal">Studio</span>
    </Link>
  );
}
