"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { createSubject } from "@/app/actions/subjects";
import { useRouter } from "next/navigation";

const THEMES = [
  { value: "Academic", label: "🏫 Academic" },
  { value: "City", label: "🏙️ City" },
  { value: "World", label: "🌍 World" },
  { value: "Lab", label: "🔬 Lab" },
  { value: "Courtroom", label: "⚖️ Courtroom" },
];

interface CreateSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateSubjectModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateSubjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("Academic");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createSubject(title, description, theme);
      toast.success("Subject created!");
      setTitle("");
      setDescription("");
      setTheme("Academic");
      onClose();
      onSuccess?.();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create subject",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="card-base w-full max-w-md p-6">
        <h2 className="heading-2 mb-4">Create New Subject</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-neutral-700"
            >
              Subject Name
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-base"
              placeholder="e.g., Biology, Physics, History"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-neutral-700"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-base"
              placeholder="Brief description of what you'll learn"
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="theme"
              className="block text-sm font-medium text-neutral-700"
            >
              Learning Theme
            </label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="input-base"
              disabled={loading}
            >
              {THEMES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Creating..." : "Create Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
