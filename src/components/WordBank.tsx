"use client";

import { useMemo } from "react";
import { shuffle } from "@/lib/quiz-loader";

interface WordBankProps {
  blanks: {
    answer: string;
    distractors: string[];
  }[];
  filledValues: (string | null)[];
  activeBlankIndex: number | null;
  submitted: boolean;
  onChipSelect: (value: string) => void;
}

export function WordBank({
  blanks,
  filledValues,
  activeBlankIndex,
  submitted,
  onChipSelect,
}: WordBankProps) {
  // Build a shuffled pool of all chips (answers + distractors) once
  const chips = useMemo(() => {
    const pool: string[] = [];
    for (const blank of blanks) {
      pool.push(blank.answer);
      pool.push(...blank.distractors);
    }
    return shuffle(pool);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set of currently used values
  const usedValues = useMemo(() => {
    const counts = new Map<string, number>();
    for (const v of filledValues) {
      if (v !== null) {
        counts.set(v, (counts.get(v) ?? 0) + 1);
      }
    }
    return counts;
  }, [filledValues]);

  // Track which chip indices are "used" (matched to filled values)
  const chipUsed = useMemo(() => {
    const remaining = new Map<string, number>(usedValues);
    return chips.map((chip) => {
      const count = remaining.get(chip) ?? 0;
      if (count > 0) {
        remaining.set(chip, count - 1);
        return true;
      }
      return false;
    });
  }, [chips, usedValues]);

  return (
    <div className="flex flex-wrap gap-2 mt-4" data-testid="word-bank">
      {chips.map((chip, i) => {
        const used = chipUsed[i];

        if (used) {
          // Ghost chip — same size, invisible text
          return (
            <span
              key={i}
              className="border border-dashed border-gray-700 rounded-full px-3 py-1.5 text-sm text-transparent select-none"
            >
              {chip}
            </span>
          );
        }

        if (submitted) {
          return (
            <span
              key={i}
              className="border border-gray-700 rounded-full px-3 py-1.5 text-sm text-gray-500 cursor-not-allowed"
            >
              {chip}
            </span>
          );
        }

        return (
          <button
            key={i}
            type="button"
            onClick={() => onChipSelect(chip)}
            disabled={activeBlankIndex === null}
            className="bg-gray-800 border border-gray-600 text-gray-200 rounded-full px-3 py-1.5 text-sm cursor-pointer hover:border-blue-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {chip}
          </button>
        );
      })}
    </div>
  );
}
