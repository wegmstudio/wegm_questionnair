"use client";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import type { Question, RuleGroup } from "@/types/questions";
import type { QuestionnaireConfig, Section, StepId } from "@/types/questionnaire";
import { allQuestions, resolveOptions } from "@/lib/conditional-engine";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QuestionEditor } from "./QuestionEditor";
import { RuleEditor, type RuleQuestionRef } from "./RuleEditor";

interface Props {
  config: QuestionnaireConfig;
  onChange: (config: QuestionnaireConfig) => void;
}

const PROTECTED_QUESTIONS = ["business_category", "website_types", "contact_name", "business_name", "contact_email", "contact_phone"];

function move<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function QuestionsManager({ config, onChange }: Props) {
  const editableSteps = config.steps.filter((s) => s.id !== "welcome" && s.id !== "review");
  const [stepId, setStepId] = useState<StepId>(editableSteps[0].id);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<{ sectionId: string; question: Question | null } | null>(null);
  const [sectionDialog, setSectionDialog] = useState<{ section: Section | null } | null>(null);

  const sections = config.sections.filter((s) => s.stepId === stepId);
  const ruleQuestions = useMemo<RuleQuestionRef[]>(
    () => allQuestions(config).map(({ question }) => ({ id: question.id, label: question.label, type: question.type, options: resolveOptions(question, config).map((o) => ({ value: o.value, label: o.label })) })),
    [config],
  );
  const existingIds = ruleQuestions.map((q) => q.id);

  const updateSections = (next: Section[]) => onChange({ ...config, sections: next });
  const updateSection = (sectionId: string, patch: (s: Section) => Section) => updateSections(config.sections.map((s) => (s.id === sectionId ? patch(s) : s)));

  const moveSection = (sectionId: string, direction: -1 | 1) => {
    const idsInStep = sections.map((s) => s.id);
    const index = idsInStep.indexOf(sectionId);
    const reordered = move(sections, index, index + direction);
    let cursor = 0;
    updateSections(config.sections.map((s) => (s.stepId === stepId ? reordered[cursor++] : s)));
  };

  const deleteSection = (section: Section) => {
    if (section.questions.some((q) => PROTECTED_QUESTIONS.includes(q.id))) return window.alert("This section contains core questions and cannot be deleted.");
    if (window.confirm(`Delete section "${section.title}" and its ${section.questions.length} questions?`)) updateSections(config.sections.filter((s) => s.id !== section.id));
  };

  const saveQuestion = (sectionId: string, question: Question, original: Question | null) => {
    updateSection(sectionId, (s) => ({ ...s, questions: original ? s.questions.map((q) => (q.id === original.id ? question : q)) : [...s.questions, question] }));
    setEditing(null);
  };

  const deleteQuestion = (sectionId: string, question: Question) => {
    if (PROTECTED_QUESTIONS.includes(question.id)) return window.alert("This core question is needed by the questionnaire and cannot be deleted.");
    if (window.confirm(`Delete question "${question.label}"?`)) updateSection(sectionId, (s) => ({ ...s, questions: s.questions.filter((q) => q.id !== question.id) }));
  };

  const saveSection = (section: Section, original: Section | null) => {
    if (original) updateSections(config.sections.map((s) => (s.id === original.id ? { ...s, ...section } : s)));
    else updateSections([...config.sections, section]);
    setSectionDialog(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="grid gap-2">
          <Label htmlFor="qm-step">Step</Label>
          <Select id="qm-step" value={stepId} onChange={(e) => setStepId(e.target.value as StepId)} className="w-72">
            {editableSteps.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </Select>
        </div>
        <Button type="button" variant="outline" onClick={() => setSectionDialog({ section: null })}>
          <Plus /> Add section
        </Button>
      </div>

      {sections.length === 0 && <p className="rounded-xl border border-dashed border-line bg-white p-6 text-sm text-slate">No sections in this step yet.</p>}

      <ul className="space-y-3">
        {sections.map((section, index) => {
          const isOpen = expanded[section.id] ?? false;
          const industry = section.industryId ? config.industries.find((i) => i.id === section.industryId) : null;
          return (
            <li key={section.id} className="rounded-2xl border border-line bg-white shadow-card">
              <div className="flex flex-wrap items-center gap-2 px-4 py-3">
                <button type="button" onClick={() => setExpanded((e) => ({ ...e, [section.id]: !isOpen }))} className="flex min-w-0 flex-1 items-center gap-2 text-left focus-ring rounded-md" aria-expanded={isOpen}>
                  {isOpen ? <ChevronDown className="size-4 shrink-0 text-slate" /> : <ChevronRight className="size-4 shrink-0 text-slate" />}
                  <span className="truncate font-bold text-navy">{section.title}</span>
                  <Badge variant="outline">{section.questions.length} questions</Badge>
                  {industry && <Badge variant="accent">{industry.name}</Badge>}
                  {section.visibleWhen && <Badge variant="warning">conditional</Badge>}
                </button>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => moveSection(section.id, -1)} disabled={index === 0} aria-label="Move section up">
                    <ArrowUp />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => moveSection(section.id, 1)} disabled={index === sections.length - 1} aria-label="Move section down">
                    <ArrowDown />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => setSectionDialog({ section })} aria-label="Edit section">
                    <Pencil />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => deleteSection(section)} aria-label="Delete section">
                    <Trash2 />
                  </Button>
                </div>
              </div>

              {isOpen && (
                <div className="space-y-2 border-t border-line px-4 py-3">
                  {section.description && <p className="text-xs text-slate">{section.description}</p>}
                  {section.questions.map((question, qIndex) => (
                    <div key={question.id} className="flex flex-wrap items-center gap-2 rounded-xl bg-surface/70 px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{question.label}</p>
                        <p className="text-xs text-slate">
                          <span className="font-mono">{question.id}</span> · {question.type.replace("_", " ")}
                          {question.required && " · required"}
                          {question.requiredWhen && " · required by rule"}
                          {question.visibleWhen && " · conditional"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button type="button" variant="ghost" size="icon" className="size-8" disabled={qIndex === 0} onClick={() => updateSection(section.id, (s) => ({ ...s, questions: move(s.questions, qIndex, qIndex - 1) }))} aria-label="Move question up">
                          <ArrowUp />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="size-8" disabled={qIndex === section.questions.length - 1} onClick={() => updateSection(section.id, (s) => ({ ...s, questions: move(s.questions, qIndex, qIndex + 1) }))} aria-label="Move question down">
                          <ArrowDown />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => setEditing({ sectionId: section.id, question })} aria-label="Edit question">
                          <Pencil />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => deleteQuestion(section.id, question)} aria-label="Delete question">
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="subtle" size="sm" onClick={() => setEditing({ sectionId: section.id, question: null })}>
                    <Plus /> Add question
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <QuestionEditor
        open={Boolean(editing)}
        question={editing?.question ?? null}
        existingIds={existingIds}
        ruleQuestions={ruleQuestions}
        onClose={() => setEditing(null)}
        onSave={(q) => editing && saveQuestion(editing.sectionId, q, editing.question)}
      />

      {sectionDialog && <SectionDialog config={config} stepId={stepId} section={sectionDialog.section} ruleQuestions={ruleQuestions} onClose={() => setSectionDialog(null)} onSave={saveSection} />}
    </div>
  );
}

function SectionDialog({ config, stepId, section, ruleQuestions, onClose, onSave }: { config: QuestionnaireConfig; stepId: StepId; section: Section | null; ruleQuestions: RuleQuestionRef[]; onClose: () => void; onSave: (s: Section, original: Section | null) => void }) {
  const [title, setTitle] = useState(section?.title ?? "");
  const [description, setDescription] = useState(section?.description ?? "");
  const [industryId, setIndustryId] = useState(section?.industryId ?? "");
  const [visibleWhen, setVisibleWhen] = useState<RuleGroup | undefined>(section?.visibleWhen);
  const [error, setError] = useState<string | null>(null);

  const save = () => {
    if (!title.trim()) return setError("Please enter a section title.");
    let id = section?.id ?? `section_${slugify(title)}`;
    if (!section) {
      let n = 1;
      const base = id;
      while (config.sections.some((s) => s.id === id)) id = `${base}_${++n}`;
    }
    const next: Section = { id, stepId: section?.stepId ?? stepId, title: title.trim(), questions: section?.questions ?? [] };
    if (description.trim()) next.description = description.trim();
    if (industryId) next.industryId = industryId;
    if (visibleWhen) next.visibleWhen = visibleWhen;
    onSave(next, section);
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{section ? "Edit section" : "Add section"}</DialogTitle>
          <DialogDescription>Sections group related questions inside a step.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sd-title">Title</Label>
            <Input id="sd-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sd-desc">Description (optional)</Label>
            <Textarea id="sd-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[70px]" />
          </div>
          {(section?.stepId ?? stepId) === "industry" && (
            <div className="grid gap-2">
              <Label htmlFor="sd-industry">Show only for business category</Label>
              <Select id="sd-industry" value={industryId} onChange={(e) => setIndustryId(e.target.value)}>
                <option value="">Any category</option>
                {config.industries.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </Select>
            </div>
          )}
          <RuleEditor title="Show this section when" value={visibleWhen} onChange={setVisibleWhen} questions={ruleQuestions} />
          {error && (
            <p className="text-sm font-medium text-destructive" role="alert">
              {error}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={save}>
            {section ? "Save changes" : "Add section"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
