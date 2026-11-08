"use client";
import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { ChoiceDisplay, Option, Question, QuestionType } from "@/types/questions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RuleEditor, type RuleQuestionRef } from "./RuleEditor";
import { slugify } from "@/lib/utils";

const TYPES: Array<{ value: QuestionType; label: string }> = [
  { value: "short_text", label: "Short text" },
  { value: "long_text", label: "Long text" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "url", label: "Website address" },
  { value: "number", label: "Number" },
  { value: "single_choice", label: "Single choice" },
  { value: "multi_choice", label: "Multiple choice" },
  { value: "yes_no", label: "Yes / No" },
  { value: "list", label: "List of entries" },
  { value: "file", label: "File upload" },
];

const CHOICE_TYPES: QuestionType[] = ["single_choice", "multi_choice"];

interface Props {
  open: boolean;
  question: Question | null;
  existingIds: string[];
  ruleQuestions: RuleQuestionRef[];
  onSave: (question: Question) => void;
  onClose: () => void;
}

const blank = (): Question => ({ id: "", label: "", type: "short_text", required: false });

export function QuestionEditor({ open, question, existingIds, ruleQuestions, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<Question>(blank());
  const [idTouched, setIdTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isNew = !question;

  useEffect(() => {
    if (open) {
      setDraft(question ? JSON.parse(JSON.stringify(question)) : blank());
      setIdTouched(Boolean(question));
      setError(null);
    }
  }, [open, question]);

  const set = <K extends keyof Question>(key: K, value: Question[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const options = draft.options ?? [];
  const setOptions = (next: Option[]) => set("options", next);
  const isChoice = CHOICE_TYPES.includes(draft.type);

  const save = () => {
    const id = draft.id.trim();
    if (!draft.label.trim()) return setError("Please enter a question label.");
    if (!/^[a-z0-9_]{1,64}$/.test(id)) return setError("The id must use lowercase letters, numbers and underscores.");
    if (existingIds.includes(id) && (isNew || id !== question?.id)) return setError(`The id "${id}" is already used by another question.`);
    if (isChoice && !draft.optionsSource) {
      const cleaned = options.map((o) => ({ ...o, value: o.value.trim() || slugify(o.label), label: o.label.trim() })).filter((o) => o.label);
      if (cleaned.length === 0) return setError("Add at least one option.");
      if (new Set(cleaned.map((o) => o.value)).size !== cleaned.length) return setError("Option values must be unique.");
      draft.options = cleaned;
    }
    const clean: Question = { ...draft, id, label: draft.label.trim() };
    if (!clean.description?.trim()) delete clean.description;
    if (!clean.placeholder?.trim()) delete clean.placeholder;
    if (!isChoice) {
      delete clean.options;
      delete clean.display;
    }
    if (clean.type !== "yes_no") delete clean.mustBeTrue;
    if (clean.type !== "file") {
      delete clean.accept;
      delete clean.maxFiles;
      delete clean.maxFileSizeMb;
    }
    if (clean.type !== "number") {
      delete clean.min;
      delete clean.max;
    }
    onSave(clean);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isNew ? "Add question" : "Edit question"}</DialogTitle>
          <DialogDescription>Changes are saved to this device only and apply to the customer questionnaire immediately.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="qe-label">Question label</Label>
            <Input
              id="qe-label"
              value={draft.label}
              onChange={(e) => {
                set("label", e.target.value);
                if (!idTouched) set("id", slugify(e.target.value));
              }}
              placeholder="e.g. Do you offer home delivery?"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="qe-id">Id (used by rules)</Label>
              <Input
                id="qe-id"
                value={draft.id}
                disabled={!isNew && ["business_category", "website_types"].includes(draft.id)}
                onChange={(e) => {
                  setIdTouched(true);
                  set("id", slugify(e.target.value));
                }}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="qe-type">Answer type</Label>
              <Select id="qe-type" value={draft.type} disabled={Boolean(draft.optionsSource)} onChange={(e) => set("type", e.target.value as QuestionType)}>
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="qe-desc">Helper text (optional)</Label>
            <Textarea id="qe-desc" value={draft.description ?? ""} onChange={(e) => set("description", e.target.value)} className="min-h-[70px]" placeholder="A plain-language explanation shown under the question." />
          </div>
          {!["yes_no", "file", "single_choice", "multi_choice"].includes(draft.type) && (
            <div className="grid gap-2">
              <Label htmlFor="qe-placeholder">Placeholder (optional)</Label>
              <Input id="qe-placeholder" value={draft.placeholder ?? ""} onChange={(e) => set("placeholder", e.target.value)} />
            </div>
          )}

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 text-sm font-medium text-navy">
              <Switch checked={Boolean(draft.required)} onCheckedChange={(v) => set("required", v)} /> Required
            </label>
            {draft.type === "yes_no" && (
              <label className="flex items-center gap-3 text-sm font-medium text-navy">
                <Switch checked={Boolean(draft.mustBeTrue)} onCheckedChange={(v) => set("mustBeTrue", v)} /> Must be answered Yes
              </label>
            )}
          </div>

          {draft.type === "number" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="qe-min">Minimum</Label>
                <Input id="qe-min" type="number" value={draft.min ?? ""} onChange={(e) => set("min", e.target.value === "" ? undefined : Number(e.target.value))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="qe-max">Maximum</Label>
                <Input id="qe-max" type="number" value={draft.max ?? ""} onChange={(e) => set("max", e.target.value === "" ? undefined : Number(e.target.value))} />
              </div>
            </div>
          )}

          {draft.type === "file" && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2 sm:col-span-1">
                <Label htmlFor="qe-accept">Accepted types</Label>
                <Input id="qe-accept" value={(draft.accept ?? []).join(", ")} onChange={(e) => set("accept", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder=".png, .jpg, .pdf" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="qe-maxfiles">Max files</Label>
                <Input id="qe-maxfiles" type="number" min={1} value={draft.maxFiles ?? 5} onChange={(e) => set("maxFiles", Math.max(1, Number(e.target.value) || 1))} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="qe-maxsize">Max size (MB)</Label>
                <Input id="qe-maxsize" type="number" min={1} value={draft.maxFileSizeMb ?? 10} onChange={(e) => set("maxFileSizeMb", Math.max(1, Number(e.target.value) || 1))} />
              </div>
            </div>
          )}

          {isChoice && (
            <div className="space-y-3 rounded-xl border border-line bg-surface/60 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-navy">Options</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate">Display as</span>
                  <Select value={draft.display ?? (draft.type === "single_choice" ? "radio" : "checkboxes")} onChange={(e) => set("display", e.target.value as ChoiceDisplay)} className="h-9 w-auto rounded-lg py-1 text-sm">
                    {draft.type === "single_choice" && <option value="radio">Radio buttons</option>}
                    {draft.type === "single_choice" && <option value="select">Dropdown</option>}
                    {draft.type === "multi_choice" && <option value="checkboxes">Checkboxes</option>}
                    <option value="cards">Cards</option>
                  </Select>
                </div>
              </div>
              {draft.optionsSource ? (
                <p className="text-xs text-slate">Options come from the {draft.optionsSource === "industries" ? "business categories" : "website types"} list and are managed in their own tab.</p>
              ) : (
                <>
                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                        <Input value={option.label} placeholder="Label shown to customers" onChange={(e) => setOptions(options.map((o, i) => (i === index ? { ...o, label: e.target.value, value: o.value || slugify(e.target.value) } : o)))} className="h-9 rounded-lg text-sm" />
                        <Input value={option.value} placeholder="value (for rules)" onChange={(e) => setOptions(options.map((o, i) => (i === index ? { ...o, value: slugify(e.target.value) } : o)))} className="h-9 rounded-lg text-sm font-mono" />
                        <Button type="button" variant="ghost" size="icon" className="size-9 text-slate" onClick={() => setOptions(options.filter((_, i) => i !== index))} aria-label="Remove option">
                          <Trash2 />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="subtle" size="sm" onClick={() => setOptions([...options, { value: "", label: "" }])}>
                    <Plus /> Add option
                  </Button>
                </>
              )}
            </div>
          )}

          <RuleEditor title="Show this question when" value={draft.visibleWhen} onChange={(v) => set("visibleWhen", v)} questions={ruleQuestions.filter((q) => q.id !== draft.id)} />
          {!draft.required && <RuleEditor title="Make it required when" value={draft.requiredWhen} onChange={(v) => set("requiredWhen", v)} questions={ruleQuestions.filter((q) => q.id !== draft.id)} emptyHint="No conditions: stays optional." />}

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
            {isNew ? "Add question" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
