"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Upload, FileText } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="card-base p-6 space-y-4">
      <h3 className="text-lg font-semibold text-neutral-900">
        Upload Document
      </h3>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-700">
          Document Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-base"
          placeholder="e.g., Chapter 3 - Photosynthesis"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-700">
          File (PDF, DOCX, PPT, or Image)
        </label>
        <div className="relative">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.docx,.ppt,.pptx,.png,.jpg,.jpeg"
            className="hidden"
            id="file-input"
            disabled={loading}
          />
          <label
            htmlFor="file-input"
            className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
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
        className="btn-primary w-full"
      >
        {loading ? "Uploading..." : "Upload Document"}
      </button>
    </form>
  );
}
