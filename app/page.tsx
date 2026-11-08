"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList, FileDown, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/config/site";
import { loadDraft } from "@/lib/local-storage";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const [draftUpdated, setDraftUpdated] = useState<string | null>(null);
  useEffect(() => {
    const draft = loadDraft();
    setDraftUpdated(draft && Object.keys(draft.answers ?? {}).length ? draft.updatedAt : null);
  }, []);

  const how = [
    { icon: ClipboardList, title: "Answer a few guided questions", text: "Twelve short steps, tailored to your business category and the kind of website you need." },
    { icon: FileDown, title: "Download your requirements brief", text: "A clean PDF summarising everything, with a unique enquiry reference." },
    { icon: MessageCircle, title: `Share it with ${BRAND.name}`, text: "Send the PDF on WhatsApp. We review it and reply with a customised proposal and quotation." },
  ];

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-navy text-white">
          <div className="pointer-events-none absolute -right-40 -top-40 size-[480px] rounded-full bg-purple/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-48 -left-32 size-[420px] rounded-full bg-purple/25 blur-3xl" />
          <div className="container relative py-20 sm:py-28">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-white/80">
              <Sparkles className="size-3.5" /> Website Requirements Questionnaire
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">Tell us exactly what your website needs to do.</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">A guided questionnaire that turns your ideas into a clear project brief, so we can prepare a proposal that fits your business, not a template.</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild variant="accent" size="lg">
                <Link href="/questionnaire/">
                  {draftUpdated ? "Continue my questionnaire" : "Start the questionnaire"} <ArrowRight />
                </Link>
              </Button>
              {draftUpdated && <span className="text-sm text-white/70">Draft saved {formatDate(draftUpdated)}</span>}
            </div>
            <p className="mt-10 text-xs font-bold tracking-[0.2em] text-white/60">{BRAND.tagline}</p>
          </div>
        </section>

        <section className="container py-16 sm:py-20">
          <h2 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">How it works</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {how.map((item, i) => (
              <li key={item.title} className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-purple-100 text-purple">
                    <item.icon className="size-5" />
                  </span>
                  <span className="text-sm font-bold text-slate-400">0{i + 1}</span>
                </div>
                <h3 className="text-[17px] font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{item.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="container pb-20">
          <div className="grid gap-6 rounded-2xl border border-purple-100 bg-purple-50 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
            <span className="flex size-12 items-center justify-center rounded-xl bg-white text-purple shadow-sm">
              <ShieldCheck className="size-6" />
            </span>
            <div className="space-y-2 text-sm leading-relaxed text-purple-600">
              <h2 className="text-lg font-bold text-navy">Privacy notice</h2>
              <p>
                This questionnaire runs entirely in your browser. Your answers are saved on this device only, so you can pause and resume, and they are <strong>not transmitted to {BRAND.name} servers</strong>. Files you attach are never uploaded; only their names appear in your brief.
              </p>
              <p>Sharing happens only when you choose to send the downloaded PDF to us. You can clear everything stored on this device at any time from the Saved briefs page.</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
