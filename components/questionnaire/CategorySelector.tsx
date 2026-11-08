"use client";
import { Check } from "lucide-react";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";

export interface CardOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

interface SingleProps { multiple?: false; value: string | null | undefined; onChange: (value: string) => void }
interface MultiProps { multiple: true; value: string[] | null | undefined; onChange: (value: string[]) => void }

type Props = (SingleProps | MultiProps) & { options: CardOption[]; columns?: 2 | 3; id?: string; invalid?: boolean };

/** Selectable cards used for business categories and website types. */
export function CategorySelector(props: Props) {
  const { options, columns = 3, id, invalid } = props;
  const selected = (v: string) => (props.multiple ? (props.value ?? []).includes(v) : props.value === v);
  const toggle = (v: string) => {
    if (props.multiple) {
      const current = props.value ?? [];
      props.onChange(current.includes(v) ? current.filter((x) => x !== v) : [...current, v]);
    } else {
      props.onChange(v);
    }
  };
  return (
    <div id={id} className={cn("grid gap-3 sm:grid-cols-2", columns === 3 && "lg:grid-cols-3", invalid && "rounded-2xl ring-2 ring-destructive/40 ring-offset-2")}>
      {options.map((option) => {
        const isSelected = selected(option.value);
        return (
          <button
            key={option.value}
            type="button"
            role={props.multiple ? "checkbox" : "radio"}
            aria-checked={isSelected}
            onClick={() => toggle(option.value)}
            className={cn(
              "group relative flex h-full flex-col items-start gap-3 rounded-2xl border bg-white p-4 text-left transition-all focus-ring",
              isSelected ? "border-purple shadow-lift ring-1 ring-purple" : "border-line hover:border-slate-400/60 hover:shadow-card",
            )}
          >
            <span className={cn("flex size-10 items-center justify-center rounded-xl transition-colors", isSelected ? "bg-purple text-white" : "bg-purple-100 text-purple")}>
              <Icon name={option.icon} className="size-5" />
            </span>
            <span className="space-y-1">
              <span className="block text-[15px] font-bold leading-tight text-navy">{option.label}</span>
              {option.description && <span className="block text-[13px] leading-snug text-slate">{option.description}</span>}
            </span>
            {isSelected && (
              <span className="absolute right-3 top-3 flex size-5 items-center justify-center rounded-full bg-purple text-white">
                <Check className="size-3" strokeWidth={3} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
