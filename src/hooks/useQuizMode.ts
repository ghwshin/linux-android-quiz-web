"use client";

import { useCallback, useSyncExternalStore } from "react";

export type QuizMode = "normal" | "hard";

const STORAGE_KEY = "quiz-mode";

let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

let cachedSnapshot: QuizMode = "normal";
let cachedRaw: string | null | undefined = undefined;

function getSnapshot(): QuizMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      cachedSnapshot = raw === "hard" ? "hard" : "normal";
    }
    return cachedSnapshot;
  } catch {
    return cachedSnapshot;
  }
}

function getServerSnapshot(): QuizMode {
  return "normal";
}

function setMode(mode: QuizMode) {
  localStorage.setItem(STORAGE_KEY, mode);
  cachedRaw = undefined; // force re-read
  emitChange();
}

export function useQuizMode() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const updateMode = useCallback((m: QuizMode) => {
    setMode(m);
  }, []);

  const toggleMode = useCallback(() => {
    const current = getSnapshot();
    setMode(current === "normal" ? "hard" : "normal");
  }, []);

  return { mode, setMode: updateMode, toggleMode };
}
