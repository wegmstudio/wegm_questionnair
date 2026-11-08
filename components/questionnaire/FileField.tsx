"use client";
import { useEffect, useRef, useState } from "react";
import { FileText, Paperclip, RefreshCw, X } from "lucide-react";
import type { FileMeta } from "@/types/questions";
import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/utils";
import { uid } from "@/lib/reference-generator";

interface Props {
  id: string;
  value: FileMeta[] | null | undefined;
  onChange: (value: FileMeta[]) => void;
  accept?: string[];
  maxFiles?: number;
  maxFileSizeMb?: number;
  invalid?: boolean;
}

/**
 * Files are kept only in memory for the current page session. The questionnaire
 * stores their name, size and type, never the file contents, so nothing large is
 * written to localStorage. Previews use browser object URLs.
 */
export function FileField({ id, value, onChange, accept = [], maxFiles = 5, maxFileSizeMb = 10, invalid }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const files = value ?? [];
  const needsReselect = files.some((f) => !f.previewUrl);

  useEffect(() => () => files.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl)), []); // eslint-disable-line react-hooks/exhaustive-deps

  const matchesAccept = (file: File) => {
    if (accept.length === 0) return true;
    const name = file.name.toLowerCase();
    return accept.some((a) => (a.startsWith(".") ? name.endsWith(a.toLowerCase()) : file.type === a || (a.endsWith("/*") && file.type.startsWith(a.slice(0, -1)))));
  };

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    setLocalError(null);
    const next = [...files.filter((f) => f.previewUrl)];
    for (const file of Array.from(list)) {
      if (next.length >= maxFiles) {
        setLocalError(`You can add up to ${maxFiles} files.`);
        break;
      }
      if (!matchesAccept(file)) {
        setLocalError(`"${file.name}" is not an accepted file type (${accept.join(", ")}).`);
        continue;
      }
      if (file.size > maxFileSizeMb * 1024 * 1024) {
        setLocalError(`"${file.name}" is larger than ${maxFileSizeMb} MB.`);
        continue;
      }
      next.push({ id: uid("file"), name: file.name, size: file.size, type: file.type, previewUrl: URL.createObjectURL(file) });
    }
    onChange(next);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (fileId: string) => {
    const target = files.find((f) => f.id === fileId);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    onChange(files.filter((f) => f.id !== fileId));
  };

  return (
    <div className="space-y-3">
      <input ref={inputRef} id={id} type="file" multiple={maxFiles > 1} accept={accept.join(",")} className="sr-only" onChange={(e) => handleFiles(e.target.files)} aria-invalid={invalid} />
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
          <Paperclip /> Choose files
        </Button>
        <span className="text-xs text-slate">
          {accept.length ? accept.join(", ") : "Any file"} · up to {maxFileSizeMb} MB each · max {maxFiles}
        </span>
      </div>
      {files.length > 0 && (
        <ul className="grid gap-2 sm:grid-cols-2">
          {files.map((file) => (
            <li key={file.id} className="flex items-center gap-3 rounded-xl border border-line bg-white p-2.5 pr-2">
              {file.previewUrl && file.type.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={file.previewUrl} alt="" className="size-11 shrink-0 rounded-lg object-cover" />
              ) : (
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple">
                  <FileText className="size-5" />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-navy">{file.name}</span>
                <span className="block text-xs text-slate">
                  {formatBytes(file.size)}
                  {!file.previewUrl && " · needs re-selecting"}
                </span>
              </span>
              <Button type="button" variant="ghost" size="icon" className="size-8 text-slate" onClick={() => remove(file.id)} aria-label={`Remove ${file.name}`}>
                <X />
              </Button>
            </li>
          ))}
        </ul>
      )}
      {needsReselect && (
        <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <RefreshCw className="mt-0.5 size-3.5 shrink-0" />
          Files are not stored after a page reload. The names above are remembered, but please select the files again before you submit if you want them listed.
        </p>
      )}
      {localError && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {localError}
        </p>
      )}
    </div>
  );
}
