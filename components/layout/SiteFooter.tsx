import { BRAND } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line/80 py-8">
      <div className="container flex flex-col items-start justify-between gap-3 text-xs text-slate sm:flex-row sm:items-center">
        <p>
          <span className="font-semibold text-navy">{BRAND.name}</span> · {BRAND.tagline}
        </p>
        <p className="max-w-xl">This questionnaire runs entirely in your browser. Your answers are stored on this device only and are not transmitted to WEGM servers.</p>
      </div>
    </footer>
  );
}
