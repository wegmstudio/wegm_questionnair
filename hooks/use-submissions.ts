"use client";
import { useCallback, useEffect, useState } from "react";
import type { Submission } from "@/types/submissions";
import { clearSubmissions, deleteSubmission, listSubmissions } from "@/lib/local-storage";

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSubmissions(listSubmissions());
    setReady(true);
  }, []);

  const remove = useCallback((reference: string) => {
    deleteSubmission(reference);
    setSubmissions(listSubmissions());
  }, []);

  const clear = useCallback(() => {
    clearSubmissions();
    setSubmissions([]);
  }, []);

  return { submissions, remove, clear, ready, refresh: () => setSubmissions(listSubmissions()) };
}
