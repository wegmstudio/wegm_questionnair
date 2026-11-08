/**
 * Client-side PDF generation with jsPDF. The library is imported lazily so it
 * is never evaluated during the static build / server render.
 */
import type { Submission } from "@/types/submissions";
import type { WorkspacePreferences } from "@/types/questionnaire";

const NAVY: [number, number, number] = [20, 35, 59];
const PURPLE: [number, number, number] = [101, 84, 192];
const INK: [number, number, number] = [32, 38, 51];
const SLATE: [number, number, number] = [86, 99, 121];
const LINE: [number, number, number] = [221, 227, 238];
const LAV: [number, number, number] = [236, 233, 250];

export async function generateBriefPdf(submission: Submission, prefs: WorkspacePreferences): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: true });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;
  const contentW = W - M * 2;
  const bottom = H - 56;
  let y = 0;

  const totalPagesExp = "{total_pages_count_string}";
  const submittedOn = new Date(submission.submittedAt).toLocaleString("en-GB", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const drawHeader = (first: boolean) => {
    const h = first ? 118 : 54;
    doc.setFillColor(...NAVY);
    doc.rect(0, 0, W, h, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(first ? 18 : 13);
    doc.text("WEGM", M, first ? 44 : 33);
    const wegmWidth = doc.getTextWidth("WEGM");
    doc.setFont("helvetica", "normal");
    doc.text(" Studio", M + wegmWidth, first ? 44 : 33);
    if (first) {
      doc.setFontSize(8);
      doc.setTextColor(201, 195, 238);
      doc.text("WE IMAGINE. WE CREATE.", M, 60, { charSpace: 1.2 });
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text("Website Requirements Brief", M, 96);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(170, 181, 204);
      doc.text(`Reference ${submission.reference}`, W - M, 86, { align: "right" });
      doc.text(submittedOn, W - M, 100, { align: "right" });
    } else {
      doc.setFontSize(8.5);
      doc.setTextColor(170, 181, 204);
      doc.text(`Website Requirements Brief  |  ${submission.reference}`, W - M, 33, { align: "right" });
    }
    y = h + 28;
  };

  const drawFooter = () => {
    const page = doc.getCurrentPageInfo().pageNumber;
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.6);
    doc.line(M, H - 40, W - M, H - 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(138, 151, 180);
    doc.text(`${prefs.studioName || "WEGM Studio"}  |  ${prefs.websiteUrl || "wegmstudio.shop"}  |  Prepared from the customer's questionnaire answers`, M, H - 26);
    doc.text(`Page ${page} of ${totalPagesExp}`, W - M, H - 26, { align: "right" });
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > bottom) {
      drawFooter();
      doc.addPage();
      drawHeader(false);
    }
  };

  drawHeader(true);

  // Summary card
  const summaryRows: Array<[string, string]> = [
    ["Customer", submission.customerName || "-"],
    ["Business", submission.businessName || "-"],
    ["Email", submission.contactEmail || "-"],
    ["Phone / WhatsApp", submission.contactPhone || "-"],
    ["Business category", submission.categoryLabel || "-"],
    ["Website type", submission.websiteTypeLabels.join(", ") || "-"],
    ["Timeline", submission.timelineLabel || "-"],
  ];
  const colW = contentW / 2;
  const rowH = 30;
  const rows = Math.ceil(summaryRows.length / 2);
  const cardH = rows * rowH + 20;
  doc.setFillColor(...LAV);
  doc.roundedRect(M, y, contentW, cardH, 8, 8, "F");
  summaryRows.forEach(([label, value], i) => {
    const cx = M + 16 + (i % 2) * colW;
    const cy = y + 20 + Math.floor(i / 2) * rowH;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...SLATE);
    doc.text(label.toUpperCase(), cx, cy, { charSpace: 0.4 });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    const text = doc.splitTextToSize(value, colW - 28)[0] ?? "";
    doc.text(text, cx, cy + 13);
  });
  y += cardH + 28;

  // Brief sections
  for (const step of submission.brief) {
    ensureSpace(60);
    doc.setFillColor(...PURPLE);
    doc.roundedRect(M, y - 9, 5, 12, 1.5, 1.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13.5);
    doc.setTextColor(...NAVY);
    doc.text(step.title, M + 12, y);
    y += 14;
    doc.setDrawColor(...LINE);
    doc.line(M, y, W - M, y);
    y += 16;

    for (const section of step.sections) {
      if (section.title && section.title !== step.title) {
        ensureSpace(36);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(...SLATE);
        doc.text(section.title, M, y);
        y += 14;
      }
      for (const item of section.items) {
        doc.setFontSize(10);
        const valueLines = doc.splitTextToSize(item.display, contentW - 150) as string[];
        doc.setFontSize(8.5);
        const labelLines = doc.splitTextToSize(item.label, 136) as string[];
        const rowHeight = Math.max(valueLines.length * 12.5, labelLines.length * 10.5) + 8;
        ensureSpace(rowHeight + 2);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(...SLATE);
        doc.text(labelLines, M, y);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...INK);
        doc.text(valueLines, M + 150, y);
        y += rowHeight;
        doc.setDrawColor(240, 242, 247);
        doc.line(M, y - 5, W - M, y - 5);
      }
      y += 8;
    }
    y += 10;
  }

  // Closing note
  ensureSpace(70);
  doc.setFillColor(...LAV);
  doc.roundedRect(M, y, contentW, 54, 8, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...NAVY);
  doc.text("What happens next", M + 16, y + 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(75, 69, 144);
  const closing = doc.splitTextToSize(
    `${prefs.studioName || "WEGM Studio"} will review these requirements and prepare a customised proposal and quotation. This document contains the customer's answers only; it does not include pricing or estimates.`,
    contentW - 32,
  ) as string[];
  doc.text(closing, M + 16, y + 34);

  drawFooter();
  doc.putTotalPages(totalPagesExp);
  doc.setProperties({ title: `WEGM Studio - Website Requirements Brief ${submission.reference}`, subject: "Website requirements brief", author: prefs.studioName || "WEGM Studio" });
  return doc.output("blob");
}

export function briefFilename(submission: Submission): string {
  const business = (submission.businessName || "requirements").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 40);
  return `WEGM-Brief-${submission.reference}-${business || "requirements"}.pdf`;
}
