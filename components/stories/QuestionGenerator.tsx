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
    try {
      const response = await fetch("/api/questions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId, subjectId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate questions");
      }

      const data = await response.json();
      setQuestions(data.questions);
      toast.success(`Generated ${data.questions.length} questions!`);
      onGenerated?.();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate questions",
      );
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
        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div key={q.id} className="p-3 bg-neutral-50 rounded-lg">
              <p className="font-medium text-neutral-900 text-sm mb-2">
                {idx + 1}. {q.questionText}
              </p>
              {q.options && (
                <ul className="space-y-1 ml-4">
                  {(typeof q.options === "string"
                    ? JSON.parse(q.options)
                    : q.options
                  ).map((opt: string, i: number) => (
                    <li key={i} className="text-sm text-neutral-600">
                      {String.fromCharCode(65 + i)}) {opt}
                    </li>
                  ))}
                </ul>
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
