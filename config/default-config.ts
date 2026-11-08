import type { QuestionnaireConfig } from "@/types/questionnaire";
import { STEPS } from "./steps";
import { INDUSTRIES } from "./industries";
import { WEBSITE_TYPES } from "./website-types";
import { COMMON_SECTIONS } from "./common-questions";
import { INDUSTRY_SECTIONS } from "./industry-questions";
import { WEBSITE_TYPE_SECTIONS } from "./website-type-questions";

/**
 * The default questionnaire. The local Workspace can modify a copy of this
 * in localStorage; "Restore defaults" brings this version back.
 */
export const DEFAULT_CONFIG: QuestionnaireConfig = {
  version: 1,
  updatedAt: "2026-01-01T00:00:00.000Z",
  industries: INDUSTRIES,
  websiteTypes: WEBSITE_TYPES,
  steps: STEPS,
  sections: [...COMMON_SECTIONS, ...INDUSTRY_SECTIONS, ...WEBSITE_TYPE_SECTIONS],
};

/** Deep clone so edits in the workspace never mutate the bundled default. */
export const cloneDefaultConfig = (): QuestionnaireConfig => JSON.parse(JSON.stringify(DEFAULT_CONFIG));
