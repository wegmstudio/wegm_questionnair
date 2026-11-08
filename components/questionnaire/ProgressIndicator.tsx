"use client";
import { Check } from "lucide-react";
import type { Step } from "@/types/questionnaire";
import { Progress } from "@/components/ui/progress";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

interface Props {
  steps: Step[];
  current: number;
  furthest: number;
  onNavigate: (index: number) => void;
}

export function ProgressIndicator({ steps, current, furthest, onNavigate }: Props) {
  const percent = Math.round((current / (steps.length - 1)) * 100);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-navy">
          Step {current + 1} of {steps.length}
        </span>
        <span className="text-slate">{percent}% complete</span>
      </div>
      <Progress value={percent} aria-label={`${percent}% complete`} />
      <ol className="hidden lg:block" aria-label="Questionnaire steps">
        {steps.map((step, index) => {
          const done = index < current;
          const active = index === current;
          const reachable = index <= furthest;
          return (
            <li key={step.id}>
              <button
                type="button"
                disabled={!reachable}
                onClick={() => onNavigate(index)}
                aria-current={active ? "step" : undefined}
                className={cn("flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition-colors focus-ring", active ? "bg-white font-semibold text-navy shadow-card" : reachable ? "text-slate hover:bg-white/70 hover:text-navy" : "text-slate-400")}
              >
                <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg", active ? "bg-purple text-white" : done ? "bg-purple-100 text-purple" : "bg-line/70 text-slate-400")}>
                  {done ? <Check className="size-3.5" strokeWidth={3} /> : <Icon name={step.icon} className="size-3.5" />}
                </span>
                {step.shortTitle}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
