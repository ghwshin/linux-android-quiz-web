"use client";

import { useState } from "react";
import type { Quiz } from "@/types/quiz";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { DIFFICULTIES } from "@/lib/constants";

export function MultipleChoiceQuiz({
  quiz,
  questionNumber,
  onNext,
  onResult,
}: {
  quiz: Quiz;
  questionNumber: number;
  onNext: () => void;
  onResult?: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { saveResult, getResult, clearResult } = useQuizProgress();

  const previousResult = getResult(quiz.id);
  const isAnswered = submitted || previousResult !== undefined;
  const isCorrect = submitted
    ? selected === quiz.answer
    : previousResult?.correct;

  const difficultyInfo = DIFFICULTIES.find((d) => d.id === quiz.difficulty);

  function handleSubmit() {
    if (selected === null) return;
    const correct = selected === quiz.answer;
    setSubmitted(true);
    saveResult(quiz.id, correct);
    onResult?.(correct);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-gray-400 text-sm">문제 {questionNumber}</span>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded ${
            quiz.difficulty === "초급"
              ? "bg-green-400/20 text-green-400"
              : quiz.difficulty === "중급"
                ? "bg-yellow-400/20 text-yellow-400"
                : "bg-red-400/20 text-red-400"
          }`}
        >
          {difficultyInfo?.name}
        </span>
        <span className="text-xs text-gray-500">{quiz.subcategory}</span>
      </div>

      {/* Question */}
      <p className="text-lg font-medium text-gray-100">{quiz.question}</p>

      {/* Options */}
      <div className="space-y-3">
        {quiz.options?.map((option, idx) => {
          const isThis = selected === idx;
          const isAnswer = quiz.answer === idx;

          let optionClass =
            "w-full text-left px-4 py-3 rounded-lg border transition-colors ";

          if (isAnswered) {
            if (isAnswer) {
              optionClass +=
                "border-green-500 bg-green-500/10 text-green-300";
            } else if (isThis && !isAnswer) {
              optionClass += "border-red-500 bg-red-500/10 text-red-300";
            } else {
              optionClass +=
                "border-gray-700 bg-gray-800/50 text-gray-500";
            }
          } else {
            optionClass += isThis
              ? "border-blue-500 bg-blue-500/10 text-blue-300"
              : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600";
          }

          return (
            <button
              key={idx}
              onClick={() => !isAnswered && setSelected(idx)}
              disabled={isAnswered}
              className={optionClass}
            >
              <span className="font-medium mr-2">
                {String.fromCharCode(65 + idx)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Submit / Result */}
      {!isAnswered ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          제출
        </button>
      ) : (
        <div className="space-y-4">
          <div
            className={`text-sm font-medium ${isCorrect ? "text-green-400" : "text-red-400"}`}
          >
            {isCorrect ? "✓ 정답입니다!" : "✗ 오답입니다."}
          </div>

          {/* Explanation */}
          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800/50">
            <h4 className="text-sm font-medium text-gray-400 mb-2">해설</h4>
            <p className="text-gray-300 text-sm whitespace-pre-wrap">
              {quiz.explanation}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isCorrect && (
              <button
                onClick={() => {
                  clearResult(quiz.id);
                  setSubmitted(false);
                  setSelected(null);
                }}
                className="px-6 py-2 rounded-lg border border-yellow-600 text-yellow-400 font-medium hover:bg-yellow-600/10 transition-colors"
              >
                다시 풀기
              </button>
            )}
            <button
              onClick={onNext}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors"
            >
              다음 문제
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
