"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

interface QuestionGeneratorProps {
  sectionId: string;
  subjectId: string;
  onGenerated?: () => void;
}

export function QuestionGenerator({
  sectionId,
  subjectId,
  onGenerated,
}: QuestionGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    toast.loading("Generating questions...");

    try {
      // Add 30 second timeout
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

  if (questions.length > 0) {
    return (
      <div className="card-base p-6 space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">
          Practice Questions ({questions.length})
        </h3>
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
            >
              <p className="font-semibold text-neutral-900 text-base mb-3">
                {idx + 1}. {q.questionText}
              </p>
              {q.options && (
                <div className="space-y-2 ml-4">
                  {(typeof q.options === "string"
                    ? JSON.parse(q.options)
                    : q.options
                  ).map((opt: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-2 rounded hover:bg-neutral-100 cursor-pointer transition-colors"
                    >
                      <span className="font-medium text-neutral-700 min-w-fit">
                        {String.fromCharCode(65 + i)})
                      </span>
                      <span className="text-neutral-700">{opt}</span>
                    </div>
                  ))}
                </div>
              )}
              {q.explanation && (
                <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200 text-sm text-blue-900">
                  <p className="font-medium mb-1">Explanation:</p>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="btn-primary w-full flex items-center justify-center gap-2"
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
