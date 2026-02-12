"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface Question {
  id: string;
  questionText: string;
  options: string | string[];
  correctAnswer: string;
  explanation?: string;
}

interface QuestionGeneratorProps {
  sectionId: string;
  subjectId: string;
  existingQuestions?: Question[];
  onGenerated?: () => void;
}

export function QuestionGenerator({
  sectionId,
  subjectId,
  existingQuestions,
  onGenerated,
}: QuestionGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(
    existingQuestions || [],
  );
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(
    new Set(),
  );
  const [score, setScore] = useState<number | null>(null);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    toast.loading("Generating questions...");

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("/api/questions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId, subjectId }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate questions");
      }

      const data = await response.json();
      setQuestions(data.questions);
      setSelectedAnswers({});
      setRevealedAnswers(new Set());
      setScore(null);
      toast.dismiss();
      toast.success(`Generated ${data.questions.length} questions!`);
      onGenerated?.();
      router.refresh();
    } catch (error) {
      toast.dismiss();
      if (error instanceof Error && error.name === "AbortError") {
        toast.error("Question generation took too long. Please try again.");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to generate questions",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionId: string, optionIndex: number) => {
    if (revealedAnswers.has(questionId)) return; // Already answered
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const checkAnswer = (questionId: string) => {
    setRevealedAnswers((prev) => new Set([...prev, questionId]));
  };

  const checkAllAnswers = () => {
    const allRevealed = new Set(questions.map((q) => q.id));
    setRevealedAnswers(allRevealed);

    // Calculate score
    let correct = 0;
    questions.forEach((q) => {
      const opts =
        typeof q.options === "string" ? JSON.parse(q.options) : q.options;
      const selectedIdx = selectedAnswers[q.id];
      if (selectedIdx !== undefined && opts[selectedIdx] === q.correctAnswer) {
        correct++;
      }
    });
    setScore(correct);
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setRevealedAnswers(new Set());
    setScore(null);
  };

  const allAnswered = questions.every(
    (q) => selectedAnswers[q.id] !== undefined,
  );

  if (questions.length > 0) {
    return (
      <GlassPanel className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">
            Practice Questions ({questions.length})
          </h3>
          {score !== null && (
            <div
              className={`text-sm font-semibold px-3 py-1.5 rounded-full ${score >= questions.length * 0.7
                  ? "bg-green-100 text-green-700"
                  : score >= questions.length * 0.4
                    ? "bg-amber-100 text-amber-700"
                    : "bg-red-100 text-red-700"
                }`}
            >
              {score} / {questions.length} correct
            </div>
          )}
        </div>

        <div className="space-y-5">
          {questions.map((q, idx) => {
            const opts =
              typeof q.options === "string"
                ? JSON.parse(q.options)
                : q.options;
            const isRevealed = revealedAnswers.has(q.id);
            const selectedIdx = selectedAnswers[q.id];
            const correctIdx = opts.findIndex(
              (o: string) => o === q.correctAnswer,
            );

            return (
              <div
                key={q.id}
                className="p-4 bg-white/40 rounded-lg border border-white/50 backdrop-blur-sm"
              >
                <p className="font-semibold text-neutral-900 text-base mb-3">
                  {idx + 1}. {q.questionText}
                </p>

                <div className="space-y-2 ml-1">
                  {opts.map((opt: string, i: number) => {
                    const isSelected = selectedIdx === i;
                    const isCorrect = i === correctIdx;

                    let optionClasses =
                      "flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ";

                    if (isRevealed) {
                      if (isCorrect) {
                        optionClasses +=
                          "bg-green-50 border-green-300 text-green-800";
                      } else if (isSelected && !isCorrect) {
                        optionClasses +=
                          "bg-red-50 border-red-300 text-red-800";
                      } else {
                        optionClasses +=
                          "bg-white/30 border-neutral-200 text-neutral-500";
                      }
                    } else if (isSelected) {
                      optionClasses +=
                        "bg-blue-50 border-blue-300 text-blue-800";
                    } else {
                      optionClasses +=
                        "bg-white/30 border-neutral-200 hover:bg-blue-50/50 hover:border-blue-200 text-neutral-700";
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => selectAnswer(q.id, i)}
                        disabled={isRevealed}
                        className={optionClasses}
                      >
                        <span className="font-medium min-w-[24px] text-left">
                          {String.fromCharCode(65 + i)})
                        </span>
                        <span className="flex-1 text-left">{opt}</span>
                        {isRevealed && isCorrect && (
                          <Check size={16} className="text-green-600 mt-0.5" />
                        )}
                        {isRevealed && isSelected && !isCorrect && (
                          <X size={16} className="text-red-500 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Check individual answer */}
                {selectedIdx !== undefined && !isRevealed && (
                  <button
                    onClick={() => checkAnswer(q.id)}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Check answer
                  </button>
                )}

                {/* Explanation */}
                {isRevealed && q.explanation && (
                  <div className="mt-3 p-3 bg-blue-50/50 rounded-lg border border-blue-200/50 text-sm text-blue-900">
                    <p className="font-medium mb-1">Explanation:</p>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-2">
          {score === null && allAnswered && (
            <button
              onClick={checkAllAnswers}
              className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Check All Answers
            </button>
          )}
          {score !== null && (
            <button
              onClick={resetQuiz}
              className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </GlassPanel>
    );
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="glass-button w-full flex items-center justify-center gap-2 py-3"
    >
      {loading ? (
        <>
          <Loader size={18} className="animate-spin" />
          Generating questions...
        </>
      ) : (
        "Generate Practice Questions"
      )}
    </button>
  );
}
