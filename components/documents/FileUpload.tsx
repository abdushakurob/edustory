"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Upload, FileText } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";

interface FileUploadProps {
  subjectId: string;
  onSuccess?: () => void;
}

export function FileUpload({ subjectId, onSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4.5 * 1024 * 1024) {
        toast.error("File size must be less than 4.5MB");
        return;
      }
      setFile(selectedFile);
      setTitle(selectedFile.name.split(".")[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("subjectId", subjectId);
      formData.append("title", title);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      toast.success(data.message || "Document uploaded!");
      setFile(null);
      setTitle("");
      onSuccess?.();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassPanel className="p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        Upload Document
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">
            Document Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="glass-input w-full"
            placeholder="e.g., Chapter 3 - Photosynthesis"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">
            File (PDF, DOCX, PPT, TXT, or Image)
          </label>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.docx,.ppt,.pptx,.txt,.png,.jpg,.jpeg"
              className="hidden"
              id="file-input"
              disabled={loading}
            />
            <label
              htmlFor="file-input"
              className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-neutral-300/50 rounded-lg cursor-pointer hover:border-blue-400/50 hover:bg-blue-50/30 transition-colors"
            >
              <Upload size={20} className="text-neutral-400" />
              <span className="text-neutral-600">
                {file ? file.name : "Click to select a file"}
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={!file || !title || loading}
          className="glass-button w-full py-2.5"
        >
          {loading ? "Uploading..." : "Upload Document"}
        </button>
      </form>
    </GlassPanel>
  );
}
