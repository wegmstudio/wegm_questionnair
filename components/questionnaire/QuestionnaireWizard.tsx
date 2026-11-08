"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { AlertCircle, ArrowLeft, ArrowRight, Info, RotateCcw, Send } from "lucide-react";
import type { Answers } from "@/types/questions";
import type { QuestionnaireConfig, StepId, WorkspacePreferences } from "@/types/questionnaire";
import type { Submission } from "@/types/submissions";
import { getVisibleQuestionIds, getVisibleQuestions, getVisibleSections } from "@/lib/conditional-engine";
import { makeStepResolver } from "@/lib/validation";
import { buildBrief, createSubmission } from "@/lib/brief";
import { generateReference } from "@/lib/reference-generator";
import { clearDraft, loadDraft, saveDraft, saveSubmission, stripTransientFileData } from "@/lib/local-storage";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icon } from "@/components/icon";
import { ProgressIndicator } from "./ProgressIndicator";
import { QuestionRenderer } from "./QuestionRenderer";
import { WelcomeStep } from "./WelcomeStep";
import { ReviewSummary } from "./ReviewSummary";
import { SubmissionSuccess } from "./SubmissionSuccess";

interface Props {
  config: QuestionnaireConfig;
  prefs: WorkspacePreferences;
}

export function QuestionnaireWizard({ config, prefs }: Props) {
  const steps = config.steps;
  const [stepIndex, setStepIndex] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [hadDraft, setHadDraft] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const scopeRef = useRef<StepId | "all">(steps[0].id);
  const resolver = useMemo(() => makeStepResolver(config, scopeRef), [config]);

  const form = useForm<Answers>({ defaultValues: {}, mode: "onTouched", resolver, shouldUnregister: false });
  const { control, getValues, trigger, clearErrors, reset, getFieldState, formState } = form;
  const answers = (useWatch({ control }) ?? {}) as Answers;
  const step = steps[stepIndex];

  // Restore a saved draft after mount (avoids hydration mismatches).
  useEffect(() => {
    const draft = loadDraft();
    if (draft && draft.answers && Object.keys(draft.answers).length > 0) {
      reset(draft.answers as Answers);
      const index = Math.min(Math.max(draft.stepIndex ?? 0, 0), steps.length - 1);
      setStepIndex(index);
      setFurthest(index);
      setHadDraft(true);
    }
    setHydrated(true);
  }, [reset, steps.length]);

  // Keep the validation scope on the step being viewed.
  useEffect(() => {
    scopeRef.current = step.id;
  }, [step.id]);

  const revalidate = useCallback((questionId: string) => void trigger(questionId as keyof Answers & string), [trigger]);

  // Auto-save (debounced). File contents are never persisted, only their names.
  const serialized = JSON.stringify(stripTransientFileData(answers));
  useEffect(() => {
    if (!hydrated || submission) return;
    const timer = setTimeout(() => saveDraft({ answers: getValues(), stepIndex, updatedAt: new Date().toISOString() }), 400);
    return () => clearTimeout(timer);
  }, [serialized, stepIndex, hydrated, submission, getValues]);

  const goTo = useCallback((index: number) => {
    setStepIndex(index);
    setFurthest((f) => Math.max(f, index));
    setSubmitError(null);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const focusFirstError = () => {
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>('[aria-invalid="true"], [role="alert"]');
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      if (el && "focus" in el) el.focus({ preventScroll: true });
    });
  };

  const validateScope = async (scope: StepId | "all") => {
    scopeRef.current = scope;
    clearErrors();
    const ids = getVisibleQuestionIds(config, scope, getValues());
    if (ids.length === 0) return true;
    return trigger(ids as Array<keyof Answers & string>);
  };

  const next = async () => {
    const ok = await validateScope(step.id);
    if (!ok) {
      focusFirstError();
      return;
    }
    goTo(Math.min(stepIndex + 1, steps.length - 1));
  };

  const back = () => goTo(Math.max(stepIndex - 1, 0));

  const submit = async () => {
    setSubmitting(true);
    try {
      const ok = await validateScope("all");
      if (!ok) {
        const values = getValues();
        const firstInvalid = steps.findIndex((s) => getVisibleQuestionIds(config, s.id, values).some((id) => getFieldState(id).error));
        setSubmitError("A few required answers are missing. We have taken you to the first step that needs attention.");
        if (firstInvalid >= 0) {
          goTo(firstInvalid);
          setSubmitError("A few required answers are missing on this step.");
        }
        focusFirstError();
        return;
      }
      const created = createSubmission(config, getValues(), generateReference());
      saveSubmission(created);
      clearDraft();
      setSubmission(created);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  const startNew = () => {
    clearDraft();
    reset({});
    setSubmission(null);
    setHadDraft(false);
    setFurthest(0);
    goTo(0);
  };

  const startOver = () => {
    if (window.confirm("Clear all your answers on this device and start again?")) startNew();
  };

  const brief = useMemo(() => (step.id === "review" ? buildBrief(config, answers) : []), [config, answers, step.id]);

  if (!hydrated) return <div className="min-h-[50vh]" aria-busy="true" />;

  if (submission) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
        <SubmissionSuccess submission={submission} prefs={prefs} onStartNew={startNew} />
      </div>
    );
  }

  const sections = step.id === "welcome" || step.id === "review" ? [] : getVisibleSections(config, step.id, answers);
  const isReview = step.id === "review";
  const isWelcome = step.id === "welcome";

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
      <aside className="space-y-5 self-start lg:sticky lg:top-24">
        <ProgressIndicator steps={steps} current={stepIndex} furthest={furthest} onNavigate={goTo} />
        <div className="hidden space-y-2 rounded-2xl bg-white/70 p-4 text-xs text-slate lg:block">
          <p>Your progress is saved automatically on this device.</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <Link href="/" className="font-semibold text-purple hover:underline">
              Save and exit
            </Link>
            <button type="button" onClick={startOver} className="font-semibold text-slate hover:text-navy">
              Start over
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0">
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (isReview) void submit();
            else void next();
          }}
          className="rounded-2xl border border-line bg-white shadow-card"
        >
          <header className="flex items-start gap-4 border-b border-line px-5 py-5 sm:px-8">
            <span className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple sm:flex">
              <Icon name={step.icon} className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Step {stepIndex + 1} of {steps.length}
              </p>
              <h1 className="text-xl font-extrabold tracking-tight text-navy sm:text-2xl">{step.title}</h1>
              <p className="mt-1 text-sm text-slate">{step.description}</p>
            </div>
          </header>

          <div key={step.id} className="space-y-8 px-5 py-6 animate-fade-in sm:px-8 sm:py-8">
            {isWelcome && <WelcomeStep hasDraft={hadDraft} stepCount={steps.length} />}

            {isReview && (
              <div className="space-y-5">
                <Alert variant="info">
                  <Info />
                  <AlertTitle>Check your answers</AlertTitle>
                  <AlertDescription>Only the questions relevant to your choices are included. Use Edit to change anything, then submit to generate your requirements PDF.</AlertDescription>
                </Alert>
                <ReviewSummary brief={brief} onEdit={(stepId) => goTo(steps.findIndex((s) => s.id === stepId))} />
              </div>
            )}

            {!isWelcome && !isReview && sections.length === 0 && (
              <Alert>
                <Info />
                <AlertTitle>Nothing extra needed here</AlertTitle>
                <AlertDescription>Based on your earlier answers there are no additional questions for this step. Continue to the next one.</AlertDescription>
              </Alert>
            )}

            {sections.map((section) => {
              const questions = getVisibleQuestions(section, answers);
              if (questions.length === 0) return null;
              return (
                <section key={section.id} className="space-y-6" aria-labelledby={`${section.id}-title`}>
                  {(sections.length > 1 || section.description) && (
                    <div className="space-y-1">
                      <h2 id={`${section.id}-title`} className="text-lg font-bold text-navy">
                        {section.title}
                      </h2>
                      {section.description && <p className="text-sm text-slate">{section.description}</p>}
                    </div>
                  )}
                  {questions.map((question) => (
                    <QuestionRenderer key={question.id} question={question} control={control} errors={formState.errors} answers={answers} config={config} onRevalidate={revalidate} />
                  ))}
                </section>
              );
            })}

            {submitError && (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Please check your answers</AlertTitle>
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}
          </div>

          <footer className="flex flex-col-reverse gap-3 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-center gap-2">
              {stepIndex > 0 && (
                <Button type="button" variant="ghost" onClick={back}>
                  <ArrowLeft /> Back
                </Button>
              )}
              <button type="button" onClick={startOver} className="inline-flex items-center gap-1.5 px-2 text-xs font-semibold text-slate hover:text-navy lg:hidden">
                <RotateCcw className="size-3.5" /> Start over
              </button>
            </div>
            {isReview ? (
              <Button type="submit" variant="accent" size="lg" disabled={submitting}>
                <Send /> {submitting ? "Preparing…" : "Submit requirements"}
              </Button>
            ) : (
              <Button type="submit" size="lg">
                {isWelcome ? "Start" : "Continue"} <ArrowRight />
              </Button>
            )}
          </footer>
        </form>
      </main>
    </div>
  );
}
