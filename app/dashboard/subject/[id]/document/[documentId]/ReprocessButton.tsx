"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { RefreshCw } from "lucide-react";

interface ReprocessButtonProps {
    documentId: string;
    subjectId: string;
}

export default function ReprocessButton({
    documentId,
    subjectId,
}: ReprocessButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleReprocess = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/reprocess", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ documentId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Reprocessing failed");
            }

            toast.success(data.message || "Document reprocessed!");
            router.refresh();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Reprocessing failed",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this document?")) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/documents/${documentId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Deletion failed");
            }

            toast.success("Document deleted");
            router.push(`/dashboard/subject/${subjectId}`);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Deletion failed",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
                onClick={handleReprocess}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                {loading ? "Processing..." : "Retry Processing"}
            </button>
            <button
                onClick={handleDelete}
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Delete Document
            </button>
        </div>
    );
}
