/**
 * All browser persistence lives here. Nothing is sent to a server.
 * Keys are namespaced so they never collide with other apps on the same origin.
 */
import type { Draft, QuestionnaireConfig, WorkspacePreferences } from "@/types/questionnaire";
import type { Submission } from "@/types/submissions";
import type { Answers, AnswerValue, FileMeta } from "@/types/questions";

export const STORAGE_KEYS = {
  draft: "wegm:questionnaire:draft",
  submissions: "wegm:questionnaire:submissions",
  config: "wegm:questionnaire:config",
  preferences: "wegm:questionnaire:preferences",
} as const;

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

function read<T>(key: string): T | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): boolean {
  if (!canUseStorage()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false; // quota exceeded or storage disabled
  }
}

function remove(key: string) {
  if (canUseStorage()) window.localStorage.removeItem(key);
}

/** Files are never persisted as base64. Only lightweight metadata is kept. */
export function stripTransientFileData(answers: Answers): Answers {
  const out: Answers = {};
  for (const [key, value] of Object.entries(answers)) {
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object" && value[0] !== null && "size" in (value[0] as object)) {
      out[key] = (value as FileMeta[]).map(({ id, name, size, type }) => ({ id, name, size, type })) as AnswerValue;
    } else {
      out[key] = value;
    }
  }
  return out;
}

// ---- Draft ----
export const loadDraft = () => read<Draft>(STORAGE_KEYS.draft);
export const saveDraft = (draft: Draft) => write(STORAGE_KEYS.draft, { ...draft, answers: stripTransientFileData(draft.answers as Answers) });
export const clearDraft = () => remove(STORAGE_KEYS.draft);

// ---- Submissions ----
export const listSubmissions = () => read<Submission[]>(STORAGE_KEYS.submissions) ?? [];
export function saveSubmission(submission: Submission) {
  const all = listSubmissions().filter((s) => s.reference !== submission.reference);
  return write(STORAGE_KEYS.submissions, [submission, ...all]);
}
export function deleteSubmission(reference: string) {
  return write(STORAGE_KEYS.submissions, listSubmissions().filter((s) => s.reference !== reference));
}
export const clearSubmissions = () => remove(STORAGE_KEYS.submissions);

// ---- Configuration ----
export const loadStoredConfig = () => read<QuestionnaireConfig>(STORAGE_KEYS.config);
export const saveStoredConfig = (config: QuestionnaireConfig) => write(STORAGE_KEYS.config, config);
export const clearStoredConfig = () => remove(STORAGE_KEYS.config);

// ---- Preferences ----
export const loadPreferences = () => read<Partial<WorkspacePreferences>>(STORAGE_KEYS.preferences);
export const savePreferences = (prefs: WorkspacePreferences) => write(STORAGE_KEYS.preferences, prefs);

export function clearAllLocalData() {
  Object.values(STORAGE_KEYS).forEach(remove);
}
