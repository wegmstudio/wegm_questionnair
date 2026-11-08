"use client";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import type { Answers, FileMeta, Question } from "@/types/questions";
import type { QuestionnaireConfig } from "@/types/questionnaire";
import { isQuestionRequired, resolveOptions } from "@/lib/conditional-engine";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Field } from "./Field";
import { CategorySelector } from "./CategorySelector";
import { ListField } from "./ListField";
import { FileField } from "./FileField";

interface Props {
  question: Question;
  control: Control<Answers>;
  errors: FieldErrors<Answers>;
  answers: Answers;
  config: QuestionnaireConfig;
  /** Re-validates a field that currently shows an error, so the message clears as soon as it is fixed. */
  onRevalidate?: (questionId: string) => void;
}

/** Renders one question from configuration with React Hook Form. */
export function QuestionRenderer({ question, control, errors, answers, config, onRevalidate }: Props) {
  const required = isQuestionRequired(question, answers);
  const error = errors[question.id]?.message as string | undefined;
  const options = resolveOptions(question, config);
  const asGroup = ["single_choice", "multi_choice", "yes_no", "list", "file"].includes(question.type);

  return (
    <Field id={question.id} label={question.label} description={question.description} required={required} error={error} asGroup={asGroup}>
      <Controller
        name={question.id}
        control={control}
        render={({ field: rawField }) => {
          const invalid = Boolean(error);
          const field = {
            ...rawField,
            onChange: (value: unknown) => {
              rawField.onChange(value);
              if (invalid && onRevalidate) onRevalidate(question.id);
            },
          };
          switch (question.type) {
            case "short_text":
            case "email":
            case "phone":
            case "url":
              return (
                <Input
                  id={question.id}
                  type={question.type === "email" ? "email" : question.type === "phone" ? "tel" : "text"}
                  inputMode={question.type === "phone" ? "tel" : question.type === "url" ? "url" : undefined}
                  placeholder={question.placeholder}
                  value={(field.value as string) ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  aria-invalid={invalid}
                />
              );
            case "number":
              return <Input id={question.id} type="number" inputMode="decimal" min={question.min} max={question.max} placeholder={question.placeholder} value={(field.value as string | number) ?? ""} onChange={(e) => field.onChange(e.target.value)} onBlur={field.onBlur} aria-invalid={invalid} />;
            case "long_text":
              return <Textarea id={question.id} placeholder={question.placeholder} value={(field.value as string) ?? ""} onChange={(e) => field.onChange(e.target.value)} onBlur={field.onBlur} aria-invalid={invalid} />;
            case "single_choice": {
              const display = question.display ?? (options.length > 6 ? "select" : "radio");
              if (display === "cards") return <CategorySelector id={question.id} options={options} value={field.value as string} onChange={field.onChange} invalid={invalid} />;
              if (display === "select")
                return (
                  <Select id={question.id} value={(field.value as string) ?? ""} onChange={(e) => field.onChange(e.target.value)} onBlur={field.onBlur} aria-invalid={invalid}>
                    <option value="">Select an option</option>
                    {options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                );
              return (
                <RadioGroup value={(field.value as string) ?? ""} onValueChange={field.onChange} className={cn("gap-2", invalid && "rounded-xl ring-2 ring-destructive/30 ring-offset-2")}>
                  {options.map((o) => {
                    const itemId = `${question.id}-${o.value}`;
                    const checked = field.value === o.value;
                    return (
                      <label key={o.value} htmlFor={itemId} className={cn("flex cursor-pointer items-start gap-3 rounded-xl border bg-white px-3.5 py-3 transition-colors", checked ? "border-purple bg-purple-50" : "border-line hover:border-slate-400/60")}>
                        <RadioGroupItem id={itemId} value={o.value} className="mt-0.5" />
                        <span>
                          <span className="block text-[15px] font-medium text-ink">{o.label}</span>
                          {o.description && <span className="block text-sm text-slate">{o.description}</span>}
                        </span>
                      </label>
                    );
                  })}
                </RadioGroup>
              );
            }
            case "multi_choice": {
              const display = question.display ?? "checkboxes";
              const current = (field.value as string[]) ?? [];
              if (display === "cards") return <CategorySelector id={question.id} multiple options={options} value={current} onChange={field.onChange} invalid={invalid} />;
              return (
                <div className={cn("grid gap-2 sm:grid-cols-2", invalid && "rounded-xl ring-2 ring-destructive/30 ring-offset-2")}>
                  {options.map((o) => {
                    const itemId = `${question.id}-${o.value}`;
                    const checked = current.includes(o.value);
                    return (
                      <label key={o.value} htmlFor={itemId} className={cn("flex cursor-pointer items-start gap-3 rounded-xl border bg-white px-3.5 py-3 transition-colors", checked ? "border-purple bg-purple-50" : "border-line hover:border-slate-400/60")}>
                        <Checkbox id={itemId} checked={checked} className="mt-0.5" onCheckedChange={(v) => field.onChange(v ? [...current, o.value] : current.filter((x) => x !== o.value))} />
                        <span>
                          <span className="block text-[15px] font-medium text-ink">{o.label}</span>
                          {o.description && <span className="block text-sm text-slate">{o.description}</span>}
                        </span>
                      </label>
                    );
                  })}
                </div>
              );
            }
            case "yes_no": {
              const value = field.value as boolean | null | undefined;
              return (
                <div className={cn("inline-grid grid-cols-2 gap-2 rounded-xl", invalid && "ring-2 ring-destructive/30 ring-offset-2")}>
                  {[
                    { v: true, label: "Yes" },
                    { v: false, label: "No" },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      role="radio"
                      aria-checked={value === opt.v}
                      onClick={() => field.onChange(opt.v)}
                      className={cn("h-11 min-w-[7rem] rounded-xl border px-5 text-[15px] font-semibold transition-colors focus-ring", value === opt.v ? "border-purple bg-purple text-white" : "border-line bg-white text-navy hover:border-slate-400/60")}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              );
            }
            case "list":
              return <ListField id={question.id} value={field.value as string[]} onChange={field.onChange} placeholder={question.placeholder} invalid={invalid} />;
            case "file":
              return <FileField id={question.id} value={field.value as FileMeta[]} onChange={field.onChange} accept={question.accept} maxFiles={question.maxFiles} maxFileSizeMb={question.maxFileSizeMb} invalid={invalid} />;
            default:
              return <Input id={question.id} value={(field.value as string) ?? ""} onChange={(e) => field.onChange(e.target.value)} />;
          }
        }}
      />
    </Field>
  );
}
