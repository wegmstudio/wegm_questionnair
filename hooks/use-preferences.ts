"use client";
import { useCallback, useEffect, useState } from "react";
import type { WorkspacePreferences } from "@/types/questionnaire";
import { DEFAULT_PREFERENCES } from "@/config/site";
import { loadPreferences, savePreferences } from "@/lib/local-storage";

export function usePreferences() {
  const [prefs, setPrefsState] = useState<WorkspacePreferences>(DEFAULT_PREFERENCES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPrefsState({ ...DEFAULT_PREFERENCES, ...(loadPreferences() ?? {}) });
    setReady(true);
  }, []);

  const setPrefs = useCallback((next: WorkspacePreferences) => {
    savePreferences(next);
    setPrefsState(next);
  }, []);

  return { prefs, setPrefs, ready };
}
