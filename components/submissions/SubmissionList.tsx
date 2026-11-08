"use client";
import { useState } from "react";
import Link from "next/link";
import { Download, Eye, FileJson, Trash2 } from "lucide-react";
import type { Submission } from "@/types/submissions";
import { useSubmissions } from "@/hooks/use-submissions";
import { usePreferences } from "@/hooks/use-preferences";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReviewSummary } from "@/components/questionnaire/ReviewSummary";
import { briefFilename, generateBriefPdf } from "@/lib/pdf-generator";
import { downloadBlob, downloadJson, formatDate } from "@/lib/utils";

export function SubmissionList() {
  const { submissions, remove, clear, ready } = useSubmissions();
  const { prefs } = usePreferences();
  const [viewing, setViewing] = useState<Submission | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const download = async (submission: Submission) => {
    setBusy(submission.reference);
    try {
      downloadBlob(await generateBriefPdf(submission, prefs), briefFilename(submission));
    } finally {
      setBusy(null);
    }
  };

  if (!ready) return <div className="h-40" aria-busy="true" />;

  if (submissions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
        <p className="font-semibold text-navy">No saved briefs yet</p>
        <p className="mt-1 text-sm text-slate">Completed questionnaires will appear here.</p>
        <Button asChild className="mt-5">
          <Link href="/questionnaire/">Start the questionnaire</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate">
          {submissions.length} saved {submissions.length === 1 ? "brief" : "briefs"} on this device
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => downloadJson(submissions, `wegm-submissions-${new Date().toISOString().slice(0, 10)}.json`)}>
            <FileJson /> Export all as JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive"
            onClick={() => {
              if (window.confirm("Delete all saved briefs from this device? This cannot be undone.")) clear();
            }}
          >
            <Trash2 /> Delete all
          </Button>
        </div>
      </div>
      <ul className="grid gap-3">
        {submissions.map((s) => (
          <li key={s.reference} className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-bold text-navy">{s.reference}</span>
                <Badge variant="accent">{s.categoryLabel || "Uncategorised"}</Badge>
              </div>
              <p className="truncate text-[15px] font-semibold text-ink">
                {s.businessName || "Unnamed business"} {s.customerName && <span className="font-normal text-slate">· {s.customerName}</span>}
              </p>
              <p className="text-xs text-slate">
                {formatDate(s.submittedAt)} · {s.websiteTypeLabels.join(", ") || "No website type"} · {s.timelineLabel || "No timeline"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setViewing(s)}>
                <Eye /> View
              </Button>
              <Button size="sm" onClick={() => download(s)} disabled={busy === s.reference}>
                <Download /> PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => {
                  if (window.confirm(`Delete brief ${s.reference}?`)) remove(s.reference);
                }}
              >
                <Trash2 /> Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="max-w-3xl">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle>{viewing.businessName || viewing.reference}</DialogTitle>
                <DialogDescription>
                  {viewing.reference} · submitted {formatDate(viewing.submittedAt)}
                </DialogDescription>
              </DialogHeader>
              <ReviewSummary brief={viewing.brief} compact />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
