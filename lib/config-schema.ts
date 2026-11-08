/**
 * Zod schema used to validate imported questionnaire configuration files
 * before they are applied. Also performs referential checks.
 */
import { z } from "zod";
import type { QuestionnaireConfig } from "@/types/questionnaire";
import { isRuleGroup, type RuleGroup } from "@/types/questions";

const idPattern = /^[a-z0-9_]{1,64}$/;

const conditionSchema = z.object({
  questionId: z.string().min(1),
  operator: z.enum(["equals", "not_equals", "contains", "not_contains", "greater_than", "less_than", "is_answered", "is_not_answered"]),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
});

const ruleGroupSchema: z.ZodType<RuleGroup> = z.lazy(() =>
  z.object({ combinator: z.enum(["and", "or"]), conditions: z.array(z.union([conditionSchema, ruleGroupSchema])) }),
);

const optionSchema = z.object({ value: z.string().min(1), label: z.string().min(1), description: z.string().optional(), icon: z.string().optional() });

const questionSchema = z.object({
  id: z.string().regex(idPattern, "Question ids must use lowercase letters, numbers and underscores"),
  label: z.string().min(1),
  type: z.enum(["short_text", "long_text", "email", "phone", "url", "number", "single_choice", "multi_choice", "yes_no", "list", "file"]),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  mustBeTrue: z.boolean().optional(),
  options: z.array(optionSchema).optional(),
  optionsSource: z.enum(["industries", "websiteTypes"]).optional(),
  display: z.enum(["radio", "select", "cards", "checkboxes"]).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  accept: z.array(z.string()).optional(),
  maxFiles: z.number().int().positive().optional(),
  maxFileSizeMb: z.number().positive().optional(),
  visibleWhen: ruleGroupSchema.optional(),
  requiredWhen: ruleGroupSchema.optional(),
});

const stepIds = ["welcome", "business", "category", "website_type", "industry", "structure", "design", "features", "platform", "timeline", "additional", "review"] as const;

export const configSchema = z.object({
  version: z.number(),
  updatedAt: z.string(),
  industries: z.array(z.object({ id: z.string().regex(idPattern), name: z.string().min(1), description: z.string(), icon: z.string(), enabled: z.boolean() })).min(1),
  websiteTypes: z.array(z.object({ id: z.string().regex(idPattern), name: z.string().min(1), description: z.string(), icon: z.string() })).min(1),
  steps: z.array(z.object({ id: z.enum(stepIds), title: z.string().min(1), shortTitle: z.string().min(1), description: z.string(), icon: z.string() })).length(stepIds.length),
  sections: z.array(
    z.object({
      id: z.string().regex(idPattern),
      stepId: z.enum(stepIds),
      title: z.string().min(1),
      description: z.string().optional(),
      industryId: z.string().optional(),
      questions: z.array(questionSchema),
      visibleWhen: ruleGroupSchema.optional(),
    }),
  ),
});

export interface ConfigValidation {
  ok: boolean;
  errors: string[];
  warnings: string[];
  config?: QuestionnaireConfig;
}

function collectQuestionIds(group: RuleGroup, out: string[]) {
  for (const node of group.conditions) {
    if (isRuleGroup(node)) collectQuestionIds(node, out);
    else out.push(node.questionId);
  }
}

export function validateConfig(input: unknown): ConfigValidation {
  const parsed = configSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.issues.slice(0, 12).map((i) => `${i.path.join(".") || "config"}: ${i.message}`), warnings: [] };
  }
  const config = parsed.data as QuestionnaireConfig;
  const errors: string[] = [];
  const warnings: string[] = [];

  const questionIds = new Set<string>();
  for (const section of config.sections) {
    for (const question of section.questions) {
      if (questionIds.has(question.id)) errors.push(`Duplicate question id "${question.id}"`);
      questionIds.add(question.id);
      if ((question.type === "single_choice" || question.type === "multi_choice") && !question.optionsSource && !(question.options && question.options.length)) {
        errors.push(`Question "${question.id}" needs at least one option`);
      }
    }
    if (section.industryId && !config.industries.some((i) => i.id === section.industryId)) errors.push(`Section "${section.id}" refers to unknown industry "${section.industryId}"`);
  }
  const sectionIds = config.sections.map((s) => s.id);
  if (new Set(sectionIds).size !== sectionIds.length) errors.push("Section ids must be unique");

  for (const must of ["business_category", "website_types", "contact_name", "business_name", "contact_email", "contact_phone"]) {
    if (!questionIds.has(must)) errors.push(`The core question "${must}" is missing`);
  }

  for (const section of config.sections) {
    const refs: string[] = [];
    if (section.visibleWhen) collectQuestionIds(section.visibleWhen, refs);
    for (const question of section.questions) {
      if (question.visibleWhen) collectQuestionIds(question.visibleWhen, refs);
      if (question.requiredWhen) collectQuestionIds(question.requiredWhen, refs);
    }
    for (const ref of refs) if (!questionIds.has(ref)) warnings.push(`A rule in section "${section.id}" refers to unknown question "${ref}" (it will never match)`);
  }

  return { ok: errors.length === 0, errors, warnings, config: errors.length === 0 ? config : undefined };
}
