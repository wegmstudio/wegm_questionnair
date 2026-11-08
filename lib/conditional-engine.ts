/**
 * Reusable conditional logic engine.
 * Evaluates visibility / required rules against the current answers.
 */
import { isRuleGroup, type AnswerValue, type Answers, type Condition, type ConditionValue, type Question, type RuleGroup } from "@/types/questions";
import type { QuestionnaireConfig, Section, StepId } from "@/types/questionnaire";

export function isAnswered(value: AnswerValue): boolean {
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true; // numbers and booleans (including false) count as answered
}

function toNumber(value: AnswerValue): number | null {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) return Number(value);
  return null;
}

function matches(value: AnswerValue, target: ConditionValue | undefined): boolean {
  if (target === undefined) return isAnswered(value);
  if (Array.isArray(value)) return value.some((v) => matches(typeof v === "string" ? v : (v as { name: string }).name, target));
  if (typeof value === "boolean") return value === (target === true || target === "true");
  if (typeof value === "number") return value === Number(target);
  if (typeof value === "string") return value.trim().toLowerCase() === String(target).trim().toLowerCase();
  return false;
}

function contains(value: AnswerValue, target: ConditionValue | undefined): boolean {
  if (target === undefined) return isAnswered(value);
  if (Array.isArray(value)) return value.some((v) => matches(typeof v === "string" ? v : (v as { name: string }).name, target));
  if (typeof value === "string") return value.toLowerCase().includes(String(target).toLowerCase());
  return matches(value, target);
}

export function evaluateCondition(condition: Condition, answers: Answers): boolean {
  const value = answers[condition.questionId];
  switch (condition.operator) {
    case "is_answered":
      return isAnswered(value);
    case "is_not_answered":
      return !isAnswered(value);
    case "equals":
      return matches(value, condition.value);
    case "not_equals":
      return !matches(value, condition.value);
    case "contains":
      return contains(value, condition.value);
    case "not_contains":
      return !contains(value, condition.value);
    case "greater_than": {
      const n = toNumber(value);
      return n !== null && n > Number(condition.value);
    }
    case "less_than": {
      const n = toNumber(value);
      return n !== null && n < Number(condition.value);
    }
    default:
      return true;
  }
}

/** A missing or empty rule group always evaluates to true. */
export function evaluateRules(group: RuleGroup | undefined, answers: Answers): boolean {
  if (!group || !group.conditions || group.conditions.length === 0) return true;
  const results = group.conditions.map((node) => (isRuleGroup(node) ? evaluateRules(node, answers) : evaluateCondition(node, answers)));
  return group.combinator === "or" ? results.some(Boolean) : results.every(Boolean);
}

export function isQuestionVisible(question: Question, answers: Answers): boolean {
  return evaluateRules(question.visibleWhen, answers);
}

export function isQuestionRequired(question: Question, answers: Answers): boolean {
  if (question.required) return true;
  if (question.requiredWhen) return evaluateRules(question.requiredWhen, answers);
  return false;
}

export function isSectionVisible(section: Section, answers: Answers, config: QuestionnaireConfig): boolean {
  if (section.industryId) {
    const industry = config.industries.find((i) => i.id === section.industryId);
    if (!industry || !industry.enabled) return false;
    if (answers.business_category !== section.industryId) return false;
  }
  return evaluateRules(section.visibleWhen, answers);
}

export function getVisibleSections(config: QuestionnaireConfig, stepId: StepId, answers: Answers): Section[] {
  return config.sections.filter((s) => s.stepId === stepId && isSectionVisible(s, answers, config));
}

export function getVisibleQuestions(section: Section, answers: Answers): Question[] {
  return section.questions.filter((q) => isQuestionVisible(q, answers));
}

/** Visible questions for one step, or for the whole questionnaire ("all"). */
export function getVisibleQuestionEntries(config: QuestionnaireConfig, scope: StepId | "all", answers: Answers): Array<{ question: Question; section: Section }> {
  const sections = scope === "all" ? config.sections.filter((s) => isSectionVisible(s, answers, config)) : getVisibleSections(config, scope, answers);
  const entries: Array<{ question: Question; section: Section }> = [];
  for (const section of sections) {
    for (const question of getVisibleQuestions(section, answers)) entries.push({ question, section });
  }
  return entries;
}

export function getVisibleQuestionIds(config: QuestionnaireConfig, scope: StepId | "all", answers: Answers): string[] {
  return getVisibleQuestionEntries(config, scope, answers).map((e) => e.question.id);
}

/** Resolve the options for a question (fixed list or a configuration source). */
export function resolveOptions(question: Question, config: QuestionnaireConfig) {
  if (question.optionsSource === "industries") {
    return config.industries.filter((i) => i.enabled).map((i) => ({ value: i.id, label: i.name, description: i.description, icon: i.icon }));
  }
  if (question.optionsSource === "websiteTypes") {
    return config.websiteTypes.map((t) => ({ value: t.id, label: t.name, description: t.description, icon: t.icon }));
  }
  return question.options ?? [];
}

/** Every question in the configuration, with its section, for editors and rule pickers. */
export function allQuestions(config: QuestionnaireConfig): Array<{ question: Question; section: Section }> {
  const out: Array<{ question: Question; section: Section }> = [];
  for (const section of config.sections) for (const question of section.questions) out.push({ question, section });
  return out;
}
