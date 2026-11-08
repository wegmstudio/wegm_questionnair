"use client";
import { useCallback, useEffect, useState } from "react";
import type { QuestionnaireConfig } from "@/types/questionnaire";
import { cloneDefaultConfig } from "@/config/default-config";
import { clearStoredConfig, loadStoredConfig, saveStoredConfig } from "@/lib/local-storage";
import { validateConfig } from "@/lib/config-schema";

/** Loads the active configuration (stored override or bundled default) after mount. */
export function useQuestionnaireConfig() {
  const [config, setConfigState] = useState<QuestionnaireConfig | null>(null);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    const stored = loadStoredConfig();
    if (stored && validateConfig(stored).ok) {
      setConfigState(stored);
      setIsCustom(true);
    } else {
      setConfigState(cloneDefaultConfig());
      setIsCustom(false);
    }
  }, []);

  const setConfig = useCallback((next: QuestionnaireConfig) => {
    const stamped = { ...next, updatedAt: new Date().toISOString() };
    saveStoredConfig(stamped);
    setConfigState(stamped);
    setIsCustom(true);
  }, []);

  const resetConfig = useCallback(() => {
    clearStoredConfig();
    setConfigState(cloneDefaultConfig());
    setIsCustom(false);
  }, []);

  return { config, setConfig, resetConfig, isCustom, ready: config !== null };
}
