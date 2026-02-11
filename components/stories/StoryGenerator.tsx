"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { generateSectionStory } from "@/app/actions/stories";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

interface StoryGeneratorProps {
  sectionId: string;
  subjectId: string;
  onGenerated?: () => void;
}

export function StoryGenerator({
  sectionId,
  subjectId,
  onGenerated,
}: StoryGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<any>(null);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stories/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId, subjectId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate story");
      }

      const data = await response.json();
      setStory(data.story);
      toast.success("Story generated!");
      onGenerated?.();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate story",
      );
    } finally {
      setLoading(false);
    }
  };

  if (story) {
    return (
      <div className="card-base p-6 space-y-4">
        <h3 className="text-lg font-semibold text-neutral-900">Story</h3>
        <div className="prose prose-sm max-w-none">
          <p className="text-neutral-700 leading-relaxed">{story.narrative}</p>
          {story.keyPoints && (
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold text-neutral-800">Key Points:</h4>
              <ul className="list-disc list-inside space-y-1">
                {(typeof story.keyPoints === "string"
                  ? JSON.parse(story.keyPoints)
                  : story.keyPoints
                ).map((point: string, idx: number) => (
                  <li key={idx} className="text-neutral-600">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
          Generating story...
        </>
      ) : (
        "Generate AI Story"
      )}
    </button>
  );
}
