/**
 * Question-level types. Every question in the questionnaire is described by
 * configuration data (see /config), never hard-coded inside UI components.
 */

export type QuestionType =
  | "short_text"
  | "long_text"
  | "email"
  | "phone"
  | "url"
  | "number"
  | "single_choice"
  | "multi_choice"
  | "yes_no"
  | "list"
  | "file";

export type ChoiceDisplay = "radio" | "select" | "cards" | "checkboxes";

export interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

export type Operator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "greater_than"
  | "less_than"
  | "is_answered"
  | "is_not_answered";

export type ConditionValue = string | number | boolean;

export interface Condition {
  questionId: string;
  operator: Operator;
  value?: ConditionValue;
}

export interface RuleGroup {
  combinator: "and" | "or";
  conditions: Array<Condition | RuleGroup>;
}

export function isRuleGroup(node: Condition | RuleGroup): node is RuleGroup {
  return (node as RuleGroup).conditions !== undefined;
}

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  description?: string;
  placeholder?: string;
  required?: boolean;
  /** Only for yes_no: the answer must be "Yes" to continue (e.g. acknowledgements). */
  mustBeTrue?: boolean;
  options?: Option[];
  /** Options pulled from configuration lists instead of a fixed list. */
  optionsSource?: "industries" | "websiteTypes";
  display?: ChoiceDisplay;
  min?: number;
  max?: number;
  /** file questions */
  accept?: string[];
  maxFiles?: number;
  maxFileSizeMb?: number;
  /** Conditional logic */
  visibleWhen?: RuleGroup;
  requiredWhen?: RuleGroup;
}

export interface FileMeta {
  id: string;
  name: string;
  size: number;
  type: string;
  /** Browser object URL for previews; never persisted. */
  previewUrl?: string;
}

export type AnswerValue = string | number | boolean | string[] | FileMeta[] | null | undefined;
export type Answers = Record<string, AnswerValue>;
