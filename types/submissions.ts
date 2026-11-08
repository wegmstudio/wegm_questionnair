import type { AnswerValue } from "./questions";

export interface BriefItem {
  questionId: string;
  label: string;
  value: AnswerValue;
  display: string;
}

export interface BriefSection {
  id: string;
  title: string;
  items: BriefItem[];
}

export interface BriefStep {
  id: string;
  title: string;
  sections: BriefSection[];
}

export interface Submission {
  reference: string;
  submittedAt: string;
  customerName: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  categoryLabel: string;
  websiteTypeLabels: string[];
  timelineLabel: string;
  configVersion: number;
  brief: BriefStep[];
}
