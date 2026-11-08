"use client";
import { useRef, useState } from "react";
import { Download, FileJson, RotateCcw, Upload } from "lucide-react";
import type { QuestionnaireConfig } from "@/types/questionnaire";
import { DEFAULT_CONFIG } from "@/config/default-config";
import { validateConfig, type ConfigValidation } from "@/lib/config-schema";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { downloadJson, formatDate } from "@/lib/utils";

interface Props {
  config: QuestionnaireConfig;
  isCustom: boolean;
  onImport: (config: QuestionnaireConfig) => void;
  onReset: () => void;
}

export function ConfigImportExport({ config, isCustom, onImport, onReset }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<ConfigValidation | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    try {
      const parsed = JSON.parse(await file.text());
      setPending(validateConfig(parsed));
    } catch {
      setPending({ ok: false, errors: ["The file is not valid JSON."], warnings: [] });
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const apply = () => {
    if (pending?.ok && pending.config) {
      onImport(pending.config);
      setPending(null);
    }
  };

  const questionCount = config.sections.reduce((n, s) => n + s.questions.length, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="space-y-3 rounded-2xl border border-line bg-white p-5 shadow-card">
        <h3 className="font-bold text-navy">Current configuration</h3>
        <p className="text-sm text-slate">
          {isCustom ? "Customised on this device" : "Bundled default"} · {config.sections.length} sections · {questionCount} questions · updated {formatDate(config.updatedAt)}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => downloadJson(config, `wegm-questionnaire-config-${new Date().toISOString().slice(0, 10)}.json`)}>
            <Download /> Export configuration
          </Button>
          <Button type="button" variant="outline" onClick={() => downloadJson(DEFAULT_CONFIG, "wegm-questionnaire-default-config.json")}>
            <FileJson /> Download default
          </Button>
        </div>
        <div className="border-t border-line pt-3">
          <Button
            type="button"
            variant="ghost"
            className="text-destructive"
            disabled={!isCustom}
            onClick={() => {
              if (window.confirm("Replace your customised questionnaire with the original default? Export it first if you want to keep a copy.")) onReset();
            }}
          >
            <RotateCcw /> Restore default questionnaire
          </Button>
        </div>
      </section>

      <section className="space-y-3 rounded-2xl border border-line bg-white p-5 shadow-card">
        <h3 className="font-bold text-navy">Import configuration</h3>
        <p className="text-sm text-slate">Import a previously exported JSON file. It is validated before anything changes.</p>
        <input ref={inputRef} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => handleFile(e.target.files?.[0])} />
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
          <Upload /> Choose JSON file
        </Button>
        {pending && (
          <div className="space-y-3">
            {pending.ok ? (
              <Alert variant="success">
                <AlertTitle>{fileName} looks good</AlertTitle>
                <AlertDescription>
                  {pending.config?.sections.length} sections and {pending.config?.industries.length} categories. Applying replaces the current configuration on this device.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertTitle>{fileName} cannot be imported</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4">
                    {pending.errors.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            {pending.warnings.length > 0 && (
              <Alert variant="warning">
                <AlertTitle>Warnings</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc pl-4">
                    {pending.warnings.map((w) => (
                      <li key={w}>{w}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            <div className="flex gap-2">
              <Button type="button" onClick={apply} disabled={!pending.ok}>
                Apply configuration
              </Button>
              <Button type="button" variant="ghost" onClick={() => setPending(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
