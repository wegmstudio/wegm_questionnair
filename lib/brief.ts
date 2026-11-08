/**
 * Turns the current answers into a structured project brief.
 * Hidden questions and hidden sections are excluded, so no hidden answer
 * can leak into the review screen, the PDF or the WhatsApp message.
 */
import type { Answers, AnswerValue, FileMeta, Question } from "@/types/questions";
import type { QuestionnaireConfig } from "@/types/questionnaire";
import type { BriefStep, Submission } from "@/types/submissions";
import { getVisibleQuestions, getVisibleSections, isAnswered, resolveOptions } from "./conditional-engine";
import { formatBytes } from "./utils";

export function formatAnswer(question: Question, value: AnswerValue, config: QuestionnaireConfig): string {
  if (!isAnswered(value)) return "";
  switch (question.type) {
    case "yes_no":
      return value === true ? "Yes" : "No";
    case "single_choice": {
      const opt = resolveOptions(question, config).find((o) => o.value === value);
      return opt ? opt.label : String(value);
    }
    case "multi_choice": {
      const options = resolveOptions(question, config);
      return (value as string[]).map((v) => options.find((o) => o.value === v)?.label ?? v).join(", ");
    }
    case "list":
      return (value as string[]).filter((v) => v && v.trim()).join("; ");
    case "file":
      return (value as FileMeta[]).map((f) => `${f.name} (${formatBytes(f.size)})`).join(", ");
    case "number":
      return String(value);
    default:
      return String(value).trim();
  }
}

export function buildBrief(config: QuestionnaireConfig, answers: Answers): BriefStep[] {
  const steps: BriefStep[] = [];
  for (const step of config.steps) {
    if (step.id === "welcome" || step.id === "review") continue;
    const sections = getVisibleSections(config, step.id, answers)
      .map((section) => ({
        id: section.id,
        title: section.title,
        items: getVisibleQuestions(section, answers)
          .map((question) => ({ questionId: question.id, label: question.label, value: answers[question.id], display: formatAnswer(question, answers[question.id], config) }))
          .filter((item) => item.display !== ""),
      }))
      .filter((section) => section.items.length > 0);
    if (sections.length > 0) steps.push({ id: step.id, title: step.title, sections });
  }
  return steps;
}

function findDisplay(brief: BriefStep[], questionId: string): string {
  for (const step of brief) for (const section of step.sections) for (const item of section.items) if (item.questionId === questionId) return item.display;
  return "";
}

export function createSubmission(config: QuestionnaireConfig, answers: Answers, reference: string): Submission {
  const brief = buildBrief(config, answers);
  return {
    reference,
    submittedAt: new Date().toISOString(),
    customerName: findDisplay(brief, "contact_name"),
    businessName: findDisplay(brief, "business_name"),
    contactEmail: findDisplay(brief, "contact_email"),
    contactPhone: findDisplay(brief, "contact_phone"),
    categoryLabel: findDisplay(brief, "business_category") || findDisplay(brief, "other_business_type"),
    websiteTypeLabels: findDisplay(brief, "website_types").split(", ").filter(Boolean),
    timelineLabel: findDisplay(brief, "timeline"),
    configVersion: config.version,
    brief,
  };
}
