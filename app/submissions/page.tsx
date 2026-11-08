"use client";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SubmissionList } from "@/components/submissions/SubmissionList";

export default function SubmissionsPage() {
  return (
    <>
      <SiteHeader />
      <main className="container flex-1 py-8 sm:py-10">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">Saved briefs</h1>
          <p className="max-w-2xl text-sm text-slate">Completed questionnaires stored in this browser. Download a PDF again, export everything as JSON, or delete what you no longer need.</p>
        </div>
        <SubmissionList />
      </main>
      <SiteFooter />
    </>
  );
}
