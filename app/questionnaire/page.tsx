"use client";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { QuestionnaireWizard } from "@/components/questionnaire/QuestionnaireWizard";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuestionnaireConfig } from "@/hooks/use-questionnaire-config";
import { usePreferences } from "@/hooks/use-preferences";

export default function QuestionnairePage() {
  const { config, ready } = useQuestionnaireConfig();
  const { prefs, ready: prefsReady } = usePreferences();
  return (
    <>
      <SiteHeader minimal />
      <main className="container flex-1 py-8 sm:py-10">
        {ready && prefsReady && config ? (
          <QuestionnaireWizard config={config} prefs={prefs} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
            <Skeleton className="h-64" />
            <Skeleton className="h-[480px]" />
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
