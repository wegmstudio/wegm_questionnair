/**
 * Builds Zod schemas dynamically from the questionnaire configuration.
 * Only visible questions are validated, and "required" can itself be conditional.
 */
import { z, type ZodTypeAny } from "zod";
import type { Resolver } from "react-hook-form";
import type { Answers, Question } from "@/types/questions";
import type { QuestionnaireConfig, StepId } from "@/types/questionnaire";
import { getVisibleQuestionEntries, isQuestionRequired, resolveOptions } from "./conditional-engine";

const REQUIRED = "This question is required";

const fileMetaSchema = z.object({
  id: z.string(),
  name: z.string(),
  size: z.number(),
  type: z.string(),
  previewUrl: z.string().optional(),
});

function looksLikeUrl(value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  try {
    const url = new URL(v.includes("://") ? v : `https://${v}`);
    return /\./.test(url.hostname);
  } catch {
    return false;
  }
}

const optionalString = (base: ZodTypeAny) => z.union([base, z.literal(""), z.undefined(), z.null()]);

export function schemaForQuestion(question: Question, required: boolean, config: QuestionnaireConfig): ZodTypeAny {
  switch (question.type) {
    case "short_text":
    case "long_text": {
      const max = question.type === "long_text" ? 3000 : 300;
      const base = z.string().trim().max(max, `Please keep this under ${max} characters`);
      return required ? base.min(1, REQUIRED) : optionalString(base);
    }
    case "email": {
      const base = z.string().trim().email("Enter a valid email address");
      return required ? z.string({ required_error: REQUIRED }).trim().min(1, REQUIRED).pipe(base) : optionalString(base);
    }
    case "phone": {
      const base = z.string().trim().regex(/^\+?[0-9][0-9\s().-]{6,19}$/, "Enter a valid phone or WhatsApp number");
      return required ? z.string({ required_error: REQUIRED }).trim().min(1, REQUIRED).pipe(base) : optionalString(base);
    }
    case "url": {
      const base = z.string().trim().refine(looksLikeUrl, "Enter a valid website address, e.g. example.com");
      return required ? z.string({ required_error: REQUIRED }).trim().min(1, REQUIRED).pipe(base) : optionalString(base);
    }
    case "number": {
      let num = z.number({ invalid_type_error: "Enter a number" });
      if (question.min !== undefined) num = num.min(question.min, `Must be at least ${question.min}`);
      if (question.max !== undefined) num = num.max(question.max, `Must be ${question.max} or less`);
      const pre = z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)), required ? num : num.optional());
      return required ? pre.refine((v) => v !== undefined, REQUIRED) : pre;
    }
    case "single_choice": {
      const values = resolveOptions(question, config).map((o) => o.value);
      const base = z.string().refine((v) => values.includes(v), "Please choose one of the options");
      return required ? z.string({ required_error: REQUIRED }).min(1, REQUIRED).pipe(base) : optionalString(base);
    }
    case "multi_choice": {
      const values = resolveOptions(question, config).map((o) => o.value);
      const base = z.array(z.string().refine((v) => values.includes(v), "Unknown option"));
      return required ? base.min(1, "Please select at least one option") : z.union([base, z.undefined(), z.null()]);
    }
    case "yes_no": {
      if (required) {
        const base = z.boolean({ required_error: "Please choose Yes or No", invalid_type_error: "Please choose Yes or No" });
        return question.mustBeTrue ? base.refine((v) => v === true, "Please confirm to continue") : base;
      }
      return z.union([z.boolean(), z.undefined(), z.null()]);
    }
    case "list": {
      const base = z.array(z.string().trim().max(300)).transform((a) => a.filter((v) => v.length > 0));
      return required ? base.refine((a) => a.length > 0, "Please add at least one entry") : z.union([base, z.undefined(), z.null()]);
    }
    case "file": {
      const maxBytes = (question.maxFileSizeMb ?? 10) * 1024 * 1024;
      const list = z.array(fileMetaSchema).max(question.maxFiles ?? 5, `You can add up to ${question.maxFiles ?? 5} files`);
      const sized = (required ? list.min(1, "Please add at least one file") : list).refine((files) => files.every((f) => f.size <= maxBytes), `Each file must be ${question.maxFileSizeMb ?? 10} MB or smaller`);
      return required ? sized : z.union([sized, z.undefined(), z.null()]);
    }
    default:
      return z.any();
  }
}

/** Schema for one step (or the whole questionnaire) given the current answers. */
export function buildSchema(config: QuestionnaireConfig, scope: StepId | "all", answers: Answers) {
  const shape: Record<string, ZodTypeAny> = {};
  for (const { question } of getVisibleQuestionEntries(config, scope, answers)) {
    shape[question.id] = schemaForQuestion(question, isQuestionRequired(question, answers), config);
  }
  return z.object(shape).passthrough();
}

/** React Hook Form resolver that validates whichever step is currently active. */
export function makeStepResolver(config: QuestionnaireConfig, scopeRef: { current: StepId | "all" }): Resolver<Answers> {
  return async (values) => {
    const schema = buildSchema(config, scopeRef.current, values as Answers);
    const result = schema.safeParse(values);
    if (result.success) return { values: result.data as Answers, errors: {} };
    const errors: Record<string, { type: string; message: string }> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !errors[key]) errors[key] = { type: issue.code, message: issue.message };
    }
    return { values: {}, errors };
  };
}
