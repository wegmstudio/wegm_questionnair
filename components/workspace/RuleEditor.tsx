"use client";
import { Plus, Trash2, X } from "lucide-react";
import { isRuleGroup, type Condition, type Operator, type Question, type RuleGroup } from "@/types/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface RuleQuestionRef {
  id: string;
  label: string;
  type: Question["type"];
  options: Array<{ value: string; label: string }>;
}

const OPERATORS: Array<{ value: Operator; label: string }> = [
  { value: "equals", label: "equals" },
  { value: "not_equals", label: "does not equal" },
  { value: "contains", label: "contains" },
  { value: "not_contains", label: "does not contain" },
  { value: "greater_than", label: "is greater than" },
  { value: "less_than", label: "is less than" },
  { value: "is_answered", label: "is answered" },
  { value: "is_not_answered", label: "is not answered" },
];

interface Props {
  value: RuleGroup | undefined;
  onChange: (value: RuleGroup | undefined) => void;
  questions: RuleQuestionRef[];
  /** Nested groups render with a lighter frame. */
  depth?: number;
  title?: string;
  emptyHint?: string;
}

const emptyGroup = (): RuleGroup => ({ combinator: "and", conditions: [] });

/** Visual editor for AND / OR rule groups with nested groups. */
export function RuleEditor({ value, onChange, questions, depth = 0, title, emptyHint = "No conditions: always shown." }: Props) {
  const group = value ?? emptyGroup();

  const update = (next: RuleGroup) => onChange(next.conditions.length === 0 && depth === 0 ? undefined : next);
  const setCondition = (index: number, next: Condition | RuleGroup) => update({ ...group, conditions: group.conditions.map((c, i) => (i === index ? next : c)) });
  const removeCondition = (index: number) => update({ ...group, conditions: group.conditions.filter((_, i) => i !== index) });
  const addCondition = () => update({ ...group, conditions: [...group.conditions, { questionId: questions[0]?.id ?? "", operator: "equals", value: "" }] });
  const addGroup = () => update({ ...group, conditions: [...group.conditions, { combinator: "or", conditions: [] }] });

  return (
    <div className={cn("space-y-3 rounded-xl border p-3", depth === 0 ? "border-line bg-surface/60" : "border-purple-100 bg-white")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          {title && <span className="font-semibold text-navy">{title}</span>}
          <span className="text-slate">Match</span>
          <Select value={group.combinator} onChange={(e) => update({ ...group, combinator: e.target.value as "and" | "or" })} className="h-9 w-auto rounded-lg py-1 text-sm">
            <option value="and">all (AND)</option>
            <option value="or">any (OR)</option>
          </Select>
          <span className="text-slate">of the following</span>
        </div>
        {depth > 0 && (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange(undefined)} className="text-destructive">
            <X /> Remove group
          </Button>
        )}
      </div>

      {group.conditions.length === 0 && <p className="text-xs text-slate">{emptyHint}</p>}

      <div className="space-y-2">
        {group.conditions.map((node, index) =>
          isRuleGroup(node) ? (
            <RuleEditor key={index} value={node} onChange={(next) => (next ? setCondition(index, next) : removeCondition(index))} questions={questions} depth={depth + 1} emptyHint="Empty group (always true)." />
          ) : (
            <ConditionRow key={index} condition={node} questions={questions} onChange={(next) => setCondition(index, next)} onRemove={() => removeCondition(index)} />
          ),
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="subtle" size="sm" onClick={addCondition} disabled={questions.length === 0}>
          <Plus /> Add condition
        </Button>
        {depth < 2 && (
          <Button type="button" variant="ghost" size="sm" onClick={addGroup}>
            <Plus /> Add group
          </Button>
        )}
      </div>
    </div>
  );
}

function ConditionRow({ condition, questions, onChange, onRemove }: { condition: Condition; questions: RuleQuestionRef[]; onChange: (c: Condition) => void; onRemove: () => void }) {
  const question = questions.find((q) => q.id === condition.questionId);
  const needsValue = !["is_answered", "is_not_answered"].includes(condition.operator);
  const setValue = (raw: string) => {
    if (question?.type === "yes_no") onChange({ ...condition, value: raw === "true" });
    else if (question?.type === "number" && raw !== "" && !Number.isNaN(Number(raw))) onChange({ ...condition, value: Number(raw) });
    else onChange({ ...condition, value: raw });
  };
  return (
    <div className="grid gap-2 rounded-lg border border-line bg-white p-2 sm:grid-cols-[1fr_auto_1fr_auto] sm:items-center">
      <Select value={condition.questionId} onChange={(e) => onChange({ questionId: e.target.value, operator: condition.operator, value: "" })} className="h-9 rounded-lg py-1 text-sm" aria-label="Question">
        {questions.map((q) => (
          <option key={q.id} value={q.id}>
            {q.label} ({q.id})
          </option>
        ))}
      </Select>
      <Select value={condition.operator} onChange={(e) => onChange({ ...condition, operator: e.target.value as Operator })} className="h-9 rounded-lg py-1 text-sm" aria-label="Operator">
        {OPERATORS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
      {needsValue ? (
        question?.type === "yes_no" ? (
          <Select value={String(condition.value ?? "true")} onChange={(e) => setValue(e.target.value)} className="h-9 rounded-lg py-1 text-sm" aria-label="Value">
            <option value="true">Yes</option>
            <option value="false">No</option>
          </Select>
        ) : question && question.options.length > 0 && ["equals", "not_equals", "contains", "not_contains"].includes(condition.operator) ? (
          <Select value={String(condition.value ?? "")} onChange={(e) => setValue(e.target.value)} className="h-9 rounded-lg py-1 text-sm" aria-label="Value">
            <option value="">Choose a value</option>
            {question.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        ) : (
          <Input value={String(condition.value ?? "")} onChange={(e) => setValue(e.target.value)} placeholder="Value" className="h-9 rounded-lg text-sm" aria-label="Value" />
        )
      ) : (
        <span className="text-xs text-slate">no value needed</span>
      )}
      <Button type="button" variant="ghost" size="icon" className="size-9 text-slate" onClick={onRemove} aria-label="Remove condition">
        <Trash2 />
      </Button>
    </div>
  );
}
