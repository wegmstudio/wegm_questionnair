"use client";
import { Pencil } from "lucide-react";
import type { BriefStep } from "@/types/submissions";
import { Button } from "@/components/ui/button";

interface Props {
  brief: BriefStep[];
  onEdit?: (stepId: string) => void;
  compact?: boolean;
}

/** Structured summary of visible answers, grouped by step and section. */
export function ReviewSummary({ brief, onEdit, compact = false }: Props) {
  if (brief.length === 0) return <p className="text-sm text-slate">No answers yet.</p>;
  return (
    <div className="space-y-4">
      {brief.map((step) => (
        <section key={step.id} className="rounded-2xl border border-line bg-white">
          <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
            <h3 className="text-[15px] font-bold text-navy">{step.title}</h3>
            {onEdit && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(step.id)}>
                <Pencil /> Edit
              </Button>
            )}
          </header>
          <div className="divide-y divide-line/70 px-5">
            {step.sections.map((section) => (
              <div key={section.id} className="py-3">
                {section.title !== step.title && <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">{section.title}</h4>}
                <dl className={compact ? "space-y-1.5" : "space-y-2"}>
                  {section.items.map((item) => (
                    <div key={item.questionId} className="grid gap-0.5 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-4">
                      <dt className="text-sm text-slate">{item.label}</dt>
                      <dd className="text-sm font-medium text-ink break-words">{item.display}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
