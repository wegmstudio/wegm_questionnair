"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy, Download, MessageCircle, RotateCcw } from "lucide-react";
import type { Submission } from "@/types/submissions";
import type { WorkspacePreferences } from "@/types/questionnaire";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { briefFilename, generateBriefPdf } from "@/lib/pdf-generator";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { downloadBlob } from "@/lib/utils";

interface Props {
  submission: Submission;
  prefs: WorkspacePreferences;
  onStartNew: () => void;
}

export function SubmissionSuccess({ submission, prefs, onStartNew }: Props) {
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const message = buildWhatsAppMessage(submission, prefs.studioName);
  const whatsappUrl = buildWhatsAppUrl(prefs.whatsappNumber, message);

  const download = async () => {
    setBusy(true);
    setPdfError(null);
    try {
      const blob = await generateBriefPdf(submission, prefs);
      downloadBlob(blob, briefFilename(submission));
    } catch (err) {
      setPdfError("The PDF could not be generated in this browser. Please try again or use a different browser.");
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-8" />
        </span>
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-navy">Your requirements are ready.</h2>
          <p className="text-slate">
            Enquiry reference <span className="font-mono font-semibold text-navy">{submission.reference}</span>
          </p>
        </div>
      </div>

      <Alert variant="info">
        <MessageCircle />
        <AlertTitle>One more step: share your brief with {prefs.studioName}</AlertTitle>
        <AlertDescription>
          This questionnaire runs in your browser, so nothing has been sent automatically. Download the PDF, then send it to us on WhatsApp. We will review it and reply with a customised proposal and quotation.
        </AlertDescription>
      </Alert>

      <ol className="grid gap-3 sm:grid-cols-2">
        <li className="rounded-2xl border border-line bg-white p-5">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Step 1</p>
          <h3 className="mb-3 text-[15px] font-bold text-navy">Download your requirements PDF</h3>
          <Button type="button" onClick={download} disabled={busy} className="w-full sm:w-auto">
            <Download /> {busy ? "Preparing PDF…" : "Download PDF"}
          </Button>
          {pdfError && <p className="mt-2 text-sm text-destructive">{pdfError}</p>}
        </li>
        <li className="rounded-2xl border border-line bg-white p-5">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">Step 2</p>
          <h3 className="mb-3 text-[15px] font-bold text-navy">Send it to us on WhatsApp</h3>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="accent" className="w-full sm:w-auto">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle /> Open WhatsApp
              </a>
            </Button>
            <Button type="button" variant="outline" onClick={copy} className="w-full sm:w-auto">
              <Copy /> {copied ? "Copied" : "Copy message"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-slate">WhatsApp opens with a prepared message. Attach the downloaded PDF in the chat.</p>
        </li>
      </ol>

      <div className="rounded-2xl bg-surface p-4 text-sm text-slate">
        <p className="mb-1 font-semibold text-navy">Prepared message</p>
        <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed">{message}</pre>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-line pt-5">
        <Button type="button" variant="ghost" onClick={onStartNew}>
          <RotateCcw /> Start a new questionnaire
        </Button>
        <Button asChild variant="ghost">
          <Link href="/submissions/">View saved briefs on this device</Link>
        </Button>
      </div>
    </div>
  );
}
