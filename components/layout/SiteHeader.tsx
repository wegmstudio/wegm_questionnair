"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Wordmark } from "./Wordmark";

const NAV = [
  { href: "/questionnaire/", label: "Questionnaire" },
  { href: "/submissions/", label: "Saved briefs" },
  { href: "/workspace/", label: "Workspace" },
];

export function SiteHeader({ minimal = false }: { minimal?: boolean }) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-white/85 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Wordmark />
          <span className="hidden text-xs font-medium text-slate sm:inline">Website requirements questionnaire</span>
        </div>
        {!minimal && (
          <nav className="flex items-center gap-1" aria-label="Main">
            {NAV.map((item) => {
              const active = pathname?.startsWith(item.href.replace(/\/$/, ""));
              return (
                <Link key={item.href} href={item.href} className={cn("rounded-lg px-3 py-2 text-sm font-semibold transition-colors focus-ring", active ? "bg-surface text-navy" : "text-slate hover:text-navy")}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
