import type { Condition, Option, Question, QuestionType, RuleGroup } from "@/types/questions";

/** Small helpers that keep the configuration files short and readable. */
export const opts = (pairs: Array<[string, string] | [string, string, string]>): Option[] =>
  pairs.map(([value, label, description]) => (description ? { value, label, description } : { value, label }));

export const when = (questionId: string, operator: Condition["operator"], value?: Condition["value"]): Condition =>
  value === undefined ? { questionId, operator } : { questionId, operator, value };

export const all = (...conditions: Array<Condition | RuleGroup>): RuleGroup => ({ combinator: "and", conditions });
export const any = (...conditions: Array<Condition | RuleGroup>): RuleGroup => ({ combinator: "or", conditions });

export const isTrue = (questionId: string) => all(when(questionId, "equals", true));
export const includes = (questionId: string, value: string) => all(when(questionId, "contains", value));
export const equals = (questionId: string, value: string) => all(when(questionId, "equals", value));

type Extra = Omit<Question, "id" | "label" | "type">;

export const q = (id: string, label: string, type: QuestionType, extra: Extra = {}): Question => ({ id, label, type, ...extra });

export const yesNo = (id: string, label: string, extra: Extra = {}): Question => q(id, label, "yes_no", extra);
export const text = (id: string, label: string, extra: Extra = {}): Question => q(id, label, "short_text", extra);
export const longText = (id: string, label: string, extra: Extra = {}): Question => q(id, label, "long_text", extra);
export const list = (id: string, label: string, extra: Extra = {}): Question => q(id, label, "list", extra);
export const single = (id: string, label: string, options: Option[], extra: Extra = {}): Question => q(id, label, "single_choice", { options, ...extra });
export const multi = (id: string, label: string, options: Option[], extra: Extra = {}): Question => q(id, label, "multi_choice", { options, ...extra });

export const READINESS = opts([
  ["ready", "Ready to use"],
  ["partly", "Partly ready"],
  ["need_help", "Need help creating them"],
]);

export const COUNT_RANGES = opts([
  ["1_20", "1 to 20"],
  ["21_100", "21 to 100"],
  ["101_500", "101 to 500"],
  ["500_plus", "More than 500"],
]);
