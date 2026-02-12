"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader, RefreshCw, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { StoryReader } from "./StoryReader";
import { GlassPanel } from "@/components/ui/GlassPanel";

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
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const router = useRouter();

  const handleGenerate = async (userFeedback?: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/stories/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId,
          subjectId,
          ...(userFeedback ? { userFeedback } : {}),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate story");
      }

      const data = await response.json();
      setStory(data.story);
      setFeedback("");
      setShowFeedback(false);
      toast.success(userFeedback ? "Story regenerated!" : "Story generated!");
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

  const handleRegenerate = () => {
    if (feedback.trim()) {
      handleGenerate(feedback.trim());
    } else {
      toast.error("Tell us what kind of story you'd prefer");
    }
  };

  if (story) {
    return (
      <GlassPanel className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h3 className="text-lg font-semibold text-neutral-900">Story</h3>
          <StoryReader
            narrative={story.narrative}
            title="Your AI-Generated Story"
          />
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-2xl font-bold text-neutral-900 mt-4 mb-2"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-xl font-bold text-neutral-900 mt-3 mb-2"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-lg font-bold text-neutral-900 mt-2 mb-1"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p
                  className="text-neutral-700 leading-relaxed mb-3"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  className="list-disc list-inside space-y-2 mb-3 text-neutral-700"
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  className="list-decimal list-inside space-y-2 mb-3 text-neutral-700"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li className="text-neutral-700" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-4 border-blue-500 pl-4 italic text-neutral-600 my-3"
                  {...props}
                />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-semibold text-neutral-900" {...props} />
              ),
              em: ({ node, ...props }) => (
                <em className="italic text-neutral-800" {...props} />
              ),
            }}
          >
            {story.narrative}
          </ReactMarkdown>

          {story.keyPoints && (
            <div className="mt-6 pt-6 border-t border-glass-border/50 space-y-3">
              <h4 className="font-semibold text-neutral-900 text-base">
                Key Points:
              </h4>
              <ul className="list-disc list-inside space-y-2">
                {(typeof story.keyPoints === "string"
                  ? JSON.parse(story.keyPoints)
                  : story.keyPoints
                ).map((point: string, idx: number) => (
                  <li key={idx} className="text-neutral-700">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Feedback / Regenerate Section */}
        <div className="mt-6 pt-6 border-t border-glass-border/50">
          {showFeedback ? (
            <div className="space-y-3">
              <label className="text-sm font-medium text-neutral-700">
                What kind of story would you prefer?
              </label>
              <p className="text-xs text-neutral-500">
                e.g. "Set it in a Lagos market", "Make it about university students", "Use a more humorous tone"
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && feedback.trim()) handleRegenerate();
                  }}
                  placeholder="Describe what you'd like..."
                  className="flex-1 px-4 py-2.5 bg-white/60 border border-neutral-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  disabled={loading}
                />
                <button
                  onClick={handleRegenerate}
                  disabled={loading || !feedback.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  Regenerate
                </button>
              </div>
              <button
                onClick={() => {
                  setShowFeedback(false);
                  setFeedback("");
                }}
                className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowFeedback(true)}
              className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-blue-600 transition-colors"
            >
              <RefreshCw size={14} />
              Not what you wanted? Try a different story
            </button>
          )}
        </div>
      </GlassPanel>
    );
  }

  return (
    <button
      onClick={() => handleGenerate()}
      disabled={loading}
      className="glass-button w-full flex items-center justify-center gap-2 py-3"
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
