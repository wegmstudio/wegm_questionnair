import { Clock, ListChecks, ShieldCheck, Download } from "lucide-react";
import { BRAND } from "@/config/site";

export function WelcomeStep({ hasDraft, stepCount }: { hasDraft: boolean; stepCount: number }) {
  const points = [
    { icon: Clock, title: "About 10 to 15 minutes", text: `${stepCount} short steps. Only questions relevant to your business are shown.` },
    { icon: ListChecks, title: "Nothing technical", text: "Plain-language questions with helpful explanations. Skip anything marked optional." },
    { icon: ShieldCheck, title: "Private by design", text: "Answers are saved in this browser only so you can resume later. Nothing is sent to a server." },
    { icon: Download, title: "A brief you can share", text: `At the end you get a requirements PDF to send to ${BRAND.name} on WhatsApp.` },
  ];
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">Let&rsquo;s plan your website.</h2>
        <p className="max-w-prose text-[15px] leading-relaxed text-slate">
          This questionnaire helps us understand exactly what you need before we prepare a customised proposal. Answer in your own words; there are no wrong answers.
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {points.map((p) => (
          <li key={p.title} className="flex gap-3 rounded-2xl border border-line bg-surface/60 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-purple shadow-sm">
              <p.icon className="size-5" />
            </span>
            <span>
              <span className="block text-[15px] font-bold text-navy">{p.title}</span>
              <span className="block text-sm leading-snug text-slate">{p.text}</span>
            </span>
          </li>
        ))}
      </ul>
      {hasDraft && <p className="rounded-xl bg-purple-50 px-4 py-3 text-sm text-purple-600">Welcome back. We have restored your previous answers, so you can continue where you left off.</p>}
    </div>
  );
}
