"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, RotateCcw, X } from "lucide-react";
import { QUIZ_QUESTIONS } from "@/lib/quizData";

export default function Quiz() {
  const [order] = useState(() => QUIZ_QUESTIONS);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<boolean[]>([]);

  const question = order[index];
  const total = order.length;
  const progressPct = useMemo(() => ((index + (finished ? 1 : 0)) / total) * 100, [index, finished, total]);

  const handleChoose = (choiceIndex: number) => {
    if (selected !== null) return;
    setSelected(choiceIndex);
    const correct = choiceIndex === question.correctIndex;
    if (correct) setScore((s) => s + 1);
    setAnsweredCorrectly((prev) => [...prev, correct]);
  };

  const handleNext = () => {
    if (index + 1 >= total) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  const handleRestart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnsweredCorrectly([]);
  };

  if (finished) {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 text-center">
        <h3 className="text-sm font-semibold text-slate-100">Quiz complete</h3>
        <p className="mt-3 text-3xl font-bold text-sky-300">
          {score}/{total}
        </p>
        <p className="mt-1 text-xs text-slate-400">{pct}% correct</p>
        <div className="mx-auto mt-4 flex max-w-xs flex-wrap justify-center gap-1">
          {answeredCorrectly.map((correct, i) => (
            <span
              key={i}
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                correct ? "bg-emerald-500/25 text-emerald-300" : "bg-rose-500/25 text-rose-300"
              }`}
            >
              {i + 1}
            </span>
          ))}
        </div>
        <button
          onClick={handleRestart}
          className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-400 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:outline-none"
        >
          <RotateCcw size={14} aria-hidden />
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
        <span>
          Question {index + 1} / {total}
        </span>
        <span>
          Score: <span className="font-semibold text-slate-200">{score}</span>
        </span>
      </div>
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <motion.div
          className="h-full rounded-full bg-sky-500"
          animate={{ width: `${progressPct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>

      <p className="mb-3 text-sm font-medium text-slate-100">{question.question}</p>

      <div className="space-y-2">
        {question.choices.map((choice, i) => {
          const isCorrect = i === question.correctIndex;
          const isSelected = selected === i;
          let stateClasses =
            "border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/[0.08]";
          if (selected !== null) {
            if (isCorrect) {
              stateClasses = "border-emerald-500/50 bg-emerald-500/15 text-emerald-200";
            } else if (isSelected) {
              stateClasses = "border-rose-500/50 bg-rose-500/15 text-rose-200";
            } else {
              stateClasses = "border-white/5 bg-white/[0.02] text-slate-500";
            }
          }
          return (
            <button
              key={i}
              onClick={() => handleChoose(i)}
              disabled={selected !== null}
              className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none disabled:cursor-default ${stateClasses}`}
            >
              <span>{choice}</span>
              {selected !== null && isCorrect && (
                <Check size={15} className="shrink-0 text-emerald-400" aria-hidden />
              )}
              {selected !== null && isSelected && !isCorrect && (
                <X size={15} className="shrink-0 text-rose-400" aria-hidden />
              )}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-lg border border-sky-500/20 bg-sky-500/10 p-3 text-[11px] leading-relaxed text-slate-300"
        >
          {question.explanation}
        </motion.div>
      )}

      {selected !== null && (
        <button
          onClick={handleNext}
          className="mt-4 w-full rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-400 focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:outline-none"
        >
          {index + 1 >= total ? "See Results" : "Next Question"}
        </button>
      )}
    </div>
  );
}
