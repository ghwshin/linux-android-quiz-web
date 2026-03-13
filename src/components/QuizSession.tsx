"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import type { Quiz, Category } from "@/types/quiz";
import { shuffle } from "@/lib/quiz-loader";
import { useQuizProgress } from "@/hooks/useQuizProgress";
import { MultipleChoiceQuiz } from "@/components/MultipleChoiceQuiz";
import { ShortAnswerQuiz } from "@/components/ShortAnswerQuiz";
import { CodeFillQuiz } from "@/components/CodeFillQuiz";
import { BuffTux, type TuxMood } from "@/components/BuffTux";

export function QuizSession({
  quizzes,
  category,
  subcategory,
  difficulty,
  categoryName,
}: {
  quizzes: Quiz[];
  category: Category;
  subcategory: string;
  difficulty: string;
  categoryName: string;
}) {
  const { allProgress } = useQuizProgress();

  const filteredQuizzes = useMemo(() => {
    const unsolved = quizzes.filter((q) => !allProgress[q.id]?.correct);
    // If all solved, show all quizzes
    const base = unsolved.length > 0 ? unsolved : quizzes;
    return difficulty === "random" ? shuffle(base) : base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [tuxMood, setTuxMood] = useState<TuxMood>("idle");
  const [tuxKey, setTuxKey] = useState(0);
  const total = filteredQuizzes.length;
  const quiz = filteredQuizzes[currentIndex];

  const handleResult = useCallback((correct: boolean) => {
    setTuxMood(correct ? "correct" : "wrong");
    setTuxKey((k) => k + 1);
  }, []);

  if (!quiz || total === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <p className="text-gray-400 mb-4">문제가 없습니다.</p>
        <Link
          href={`/quiz/${category}/${subcategory}`}
          className="text-blue-400 hover:text-blue-300"
        >
          돌아가기
        </Link>
      </main>
    );
  }

  function goNext() {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
      setTuxMood("idle");
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < total - 1;

  // Keyboard arrow navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" && canGoPrev) goPrev();
      if (e.key === "ArrowRight" && canGoNext) goNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const progressPercent = ((currentIndex + 1) / total) * 100;

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-8 relative">
      {/* Side navigation arrows - desktop only */}
      <button
        onClick={goPrev}
        disabled={!canGoPrev}
        aria-label="이전 문제"
        className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full border border-gray-700 bg-gray-900/80 backdrop-blur text-gray-400 hover:text-white hover:border-gray-500 hover:bg-gray-800 disabled:opacity-0 disabled:pointer-events-none transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        onClick={goNext}
        disabled={!canGoNext}
        aria-label="다음 문제"
        className="hidden lg:flex fixed right-4 top-1/2 -translate-y-1/2 w-12 h-12 items-center justify-center rounded-full border border-gray-700 bg-gray-900/80 backdrop-blur text-gray-400 hover:text-white hover:border-gray-500 hover:bg-gray-800 disabled:opacity-0 disabled:pointer-events-none transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </button>

      {/* Top bar */}
      <div className="w-full max-w-3xl mb-6">
        <div className="flex items-center justify-between mb-3">
          <Link
            href={`/quiz/${category}/${subcategory}`}
            className="text-gray-400 hover:text-white text-sm"
          >
            &larr; {categoryName}
          </Link>
          <span className="text-sm text-gray-400">
            {currentIndex + 1} / {total}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Tux - mobile: above quiz card, desktop: right side */}
      <div className="w-full max-w-3xl flex flex-col md:flex-row gap-4 md:items-start">
        <div className="flex-1 bg-gray-900 border border-gray-700 rounded-xl p-6 min-w-0 order-2 md:order-1">
          {quiz.type === "multiple-choice" && (
            <MultipleChoiceQuiz
              key={quiz.id}
              quiz={quiz}
              questionNumber={currentIndex + 1}
              onNext={goNext}
              onResult={handleResult}
            />
          )}
          {quiz.type === "short-answer" && (
            <ShortAnswerQuiz
              key={quiz.id}
              quiz={quiz}
              questionNumber={currentIndex + 1}
              onNext={goNext}
              onResult={handleResult}
            />
          )}
          {quiz.type === "code-fill" && (
            <CodeFillQuiz
              key={quiz.id}
              quiz={quiz}
              questionNumber={currentIndex + 1}
              onNext={goNext}
              onResult={handleResult}
            />
          )}
        </div>
        <div className="flex justify-center order-1 md:order-2 md:flex-shrink-0 md:pt-8">
          <BuffTux key={tuxKey} mood={tuxMood} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={goPrev}
          disabled={!canGoPrev}
          className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          이전
        </button>
        <button
          onClick={goNext}
          disabled={!canGoNext}
          className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          다음
        </button>
      </div>
    </main>
  );
}
