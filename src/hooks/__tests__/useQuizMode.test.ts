import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useQuizMode } from "@/hooks/useQuizMode";

const STORAGE_KEY = "quiz-mode";

describe("useQuizMode", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to normal mode", () => {
    const { result } = renderHook(() => useQuizMode());
    expect(result.current.mode).toBe("normal");
  });

  it("toggles between normal and hard", () => {
    const { result } = renderHook(() => useQuizMode());

    act(() => {
      result.current.toggleMode();
    });
    expect(result.current.mode).toBe("hard");

    act(() => {
      result.current.toggleMode();
    });
    expect(result.current.mode).toBe("normal");
  });

  it("sets mode directly", () => {
    const { result } = renderHook(() => useQuizMode());

    act(() => {
      result.current.setMode("hard");
    });
    expect(result.current.mode).toBe("hard");

    act(() => {
      result.current.setMode("normal");
    });
    expect(result.current.mode).toBe("normal");
  });

  it("persists to localStorage", () => {
    const { result } = renderHook(() => useQuizMode());

    act(() => {
      result.current.setMode("hard");
    });

    expect(localStorage.getItem(STORAGE_KEY)).toBe("hard");
  });

  it("reads from localStorage on mount", () => {
    localStorage.setItem(STORAGE_KEY, "hard");
    const { result } = renderHook(() => useQuizMode());
    expect(result.current.mode).toBe("hard");
  });

  it("defaults to normal for invalid localStorage value", () => {
    localStorage.setItem(STORAGE_KEY, "invalid");
    const { result } = renderHook(() => useQuizMode());
    expect(result.current.mode).toBe("normal");
  });
});
