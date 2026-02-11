"use client";

import Link from "next/link";
import { Subject } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteSubject } from "@/app/actions/subjects";
import { useRouter } from "next/navigation";

interface SubjectCardProps {
  subject: Subject;
  documentCount?: number;
}

export function SubjectCard({ subject, documentCount = 0 }: SubjectCardProps) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !window.confirm("Are you sure? This will delete all documents and data.")
    )
      return;

    setDeleting(true);
    try {
      await deleteSubject(subject.id);
      toast.success("Subject deleted");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete subject",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="card-base p-6 hover:shadow-md transition-smooth">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <Link
            href={`/subject/${subject.id}`}
            className="heading-3 text-neutral-900 hover:text-blue-600 transition-smooth"
          >
            {subject.title}
          </Link>
          <p className="text-sm text-neutral-500 mt-1">{subject.theme}</p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-neutral-400 hover:text-red-600 transition-smooth disabled:opacity-50"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {subject.description && (
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
          {subject.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-neutral-500">
        <span>
          {documentCount} document{documentCount !== 1 ? "s" : ""}
        </span>
        <Link
          href={`/subject/${subject.id}`}
          className="text-blue-600 hover:underline font-medium"
        >
          View →
        </Link>
      </div>
    </div>
  );
}
