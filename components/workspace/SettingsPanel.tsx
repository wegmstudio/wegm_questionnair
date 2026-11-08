"use client";
import { useEffect, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import type { WorkspacePreferences } from "@/types/questionnaire";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { clearAllLocalData } from "@/lib/local-storage";

interface Props {
  prefs: WorkspacePreferences;
  onSave: (prefs: WorkspacePreferences) => void;
}

export function SettingsPanel({ prefs, onSave }: Props) {
  const [draft, setDraft] = useState(prefs);
  const [saved, setSaved] = useState(false);
  useEffect(() => setDraft(prefs), [prefs]);

  const set = (key: keyof WorkspacePreferences, value: string) => setDraft((d) => ({ ...d, [key]: value }));
  const digits = draft.whatsappNumber.replace(/\D/g, "");

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <form
        className="space-y-4 rounded-2xl border border-line bg-white p-5 shadow-card"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ ...draft, whatsappNumber: digits });
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }}
      >
        <h3 className="font-bold text-navy">Contact details used in the questionnaire</h3>
        <div className="grid gap-2">
          <Label htmlFor="sp-name">Studio name</Label>
          <Input id="sp-name" value={draft.studioName} onChange={(e) => set("studioName", e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sp-wa">WhatsApp number (with country code, digits only)</Label>
          <Input id="sp-wa" inputMode="tel" value={draft.whatsappNumber} onChange={(e) => set("whatsappNumber", e.target.value)} placeholder="e.g. 919876543210" />
          <p className="text-xs text-slate">
            Customers are sent to <span className="font-mono">wa.me/{digits || "…"}</span>. Indian numbers need the 91 prefix and 10 digits after it{digits && digits.length < 11 ? " — the current number looks too short." : "."}
          </p>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sp-ig">Instagram URL</Label>
          <Input id="sp-ig" value={draft.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sp-web">Website URL</Label>
          <Input id="sp-web" value={draft.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sp-email">Contact email (optional)</Label>
          <Input id="sp-email" type="email" value={draft.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} />
        </div>
        <Button type="submit">
          <Save /> {saved ? "Saved" : "Save settings"}
        </Button>
      </form>

      <section className="space-y-3 rounded-2xl border border-line bg-white p-5 shadow-card">
        <h3 className="font-bold text-navy">About this workspace</h3>
        <p className="text-sm leading-relaxed text-slate">
          This is a local workspace, not a secure admin system. Everything here is stored in this browser&rsquo;s localStorage: the questionnaire configuration, these settings, customer drafts and saved briefs. Anyone using this device and browser can open it. Export your configuration regularly so you have a backup.
        </p>
        <div className="border-t border-line pt-3">
          <Button
            type="button"
            variant="ghost"
            className="text-destructive"
            onClick={() => {
              if (window.confirm("Remove ALL questionnaire data from this browser: configuration, settings, drafts and saved briefs?")) {
                clearAllLocalData();
                window.location.reload();
              }
            }}
          >
            <Trash2 /> Clear all local data
          </Button>
        </div>
      </section>
    </div>
  );
}
