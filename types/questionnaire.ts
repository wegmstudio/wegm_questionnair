import type { Question, RuleGroup } from "./questions";

export type StepId =
  | "welcome"
  | "business"
  | "category"
  | "website_type"
  | "industry"
  | "structure"
  | "design"
  | "features"
  | "platform"
  | "timeline"
  | "additional"
  | "review";

export interface Step {
  id: StepId;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
}

export interface Industry {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export interface WebsiteType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Section {
  id: string;
  stepId: StepId;
  title: string;
  description?: string;
  /** When set, the section only appears for this business category. */
  industryId?: string;
  questions: Question[];
  visibleWhen?: RuleGroup;
}

export interface QuestionnaireConfig {
  version: number;
  updatedAt: string;
  industries: Industry[];
  websiteTypes: WebsiteType[];
  steps: Step[];
  sections: Section[];
}

export interface WorkspacePreferences {
  studioName: string;
  whatsappNumber: string;
  instagramUrl: string;
  websiteUrl: string;
  contactEmail: string;
}

export interface Draft {
  answers: Record<string, unknown>;
  stepIndex: number;
  updatedAt: string;
}
