"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { Industry, QuestionnaireConfig } from "@/types/questionnaire";
import { ICON_NAMES, Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { slugify } from "@/lib/utils";

interface Props {
  config: QuestionnaireConfig;
  onChange: (config: QuestionnaireConfig) => void;
}

export function CategoryManager({ config, onChange }: Props) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<string>("Store");
  const [error, setError] = useState<string | null>(null);

  const update = (id: string, patch: Partial<Industry>) => onChange({ ...config, industries: config.industries.map((i) => (i.id === id ? { ...i, ...patch } : i)) });

  const add = () => {
    const id = slugify(name);
    if (!name.trim() || !id) return setError("Please enter a category name.");
    if (config.industries.some((i) => i.id === id)) return setError("A category with this name already exists.");
    const industry: Industry = { id, name: name.trim(), description: description.trim(), icon, enabled: true };
    onChange({
      ...config,
      industries: [...config.industries.filter((i) => i.id !== "other"), industry, ...config.industries.filter((i) => i.id === "other")],
      sections: [...config.sections, { id: `industry_${id}`, stepId: "industry", industryId: id, title: industry.name, questions: [] }],
    });
    setAdding(false);
    setName("");
    setDescription("");
    setError(null);
  };

  const enabledCount = config.industries.filter((i) => i.enabled).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate">
          {enabledCount} of {config.industries.length} categories are shown to customers. Disabled categories keep their questions but are hidden.
        </p>
        <Button type="button" variant="outline" onClick={() => setAdding(true)}>
          <Plus /> Add category
        </Button>
      </div>
      <ul className="grid gap-3 md:grid-cols-2">
        {config.industries.map((industry) => (
          <li key={industry.id} className="flex gap-3 rounded-2xl border border-line bg-white p-4 shadow-card">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple">
              <Icon name={industry.icon} className="size-5" />
            </span>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Input value={industry.name} onChange={(e) => update(industry.id, { name: e.target.value })} className="h-9 rounded-lg font-semibold" aria-label={`Name of ${industry.name}`} />
                <label className="flex shrink-0 items-center gap-2 text-xs font-semibold text-slate">
                  <Switch checked={industry.enabled} disabled={industry.enabled && enabledCount === 1} onCheckedChange={(v) => update(industry.id, { enabled: v })} aria-label={`Enable ${industry.name}`} />
                  {industry.enabled ? "On" : "Off"}
                </label>
              </div>
              <Input value={industry.description} onChange={(e) => update(industry.id, { description: e.target.value })} className="h-9 rounded-lg text-sm" aria-label={`Description of ${industry.name}`} />
              <div className="flex items-center gap-2 text-xs text-slate">
                <span className="font-mono">{industry.id}</span>
                <span>·</span>
                <Select value={industry.icon} onChange={(e) => update(industry.id, { icon: e.target.value })} className="h-8 w-auto rounded-lg py-0 text-xs" aria-label={`Icon for ${industry.name}`}>
                  {ICON_NAMES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={adding} onOpenChange={(o) => !o && setAdding(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a business category</DialogTitle>
            <DialogDescription>A matching empty section is created in the Industry-Specific step so you can add questions for it.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cm-name">Name</Label>
              <Input id="cm-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Automotive" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cm-desc">Short description</Label>
              <Input id="cm-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Garages, dealers and car services." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cm-icon">Icon</Label>
              <Select id="cm-icon" value={icon} onChange={(e) => setIcon(e.target.value)}>
                {ICON_NAMES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </Select>
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={add}>
              Add category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
