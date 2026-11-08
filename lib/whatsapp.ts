import type { Submission } from "@/types/submissions";

export function buildWhatsAppMessage(submission: Submission, studioName = "WEGM Studio"): string {
  const lines = [
    `Hello ${studioName}, I have completed the website requirements questionnaire.`,
    ``,
    `Reference: ${submission.reference}`,
    submission.customerName ? `Name: ${submission.customerName}` : "",
    submission.businessName ? `Business: ${submission.businessName}` : "",
    submission.categoryLabel ? `Category: ${submission.categoryLabel}` : "",
    submission.websiteTypeLabels.length ? `Website: ${submission.websiteTypeLabels.join(", ")}` : "",
    submission.timelineLabel ? `Timeline: ${submission.timelineLabel}` : "",
    ``,
    `I am attaching the requirements PDF in this chat.`,
  ];
  return lines.filter((l, i) => l !== "" || i === 1 || i === lines.length - 2).join("\n");
}

/** Only digits are allowed in wa.me links. An empty number opens WhatsApp's contact picker. */
export function buildWhatsAppUrl(number: string, message: string): string {
  const digits = (number || "").replace(/\D/g, "");
  const text = encodeURIComponent(message);
  return digits ? `https://wa.me/${digits}?text=${text}` : `https://wa.me/?text=${text}`;
}
