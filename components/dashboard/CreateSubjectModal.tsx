"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { createSubject } from "@/app/actions/subjects";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export function CreateSubjectModal({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        try {
            await createSubject(title);
            toast.success("Subject created!");
            setIsOpen(false);
            setTitle("");
            router.refresh();
        } catch (error) {
            toast.error("Failed to create subject");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div onClick={() => setIsOpen(true)}>{children}</div>
            <Dialog open={isOpen} onOpenChange={setIsOpen} title="Create New Subject">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-neutral-700">Subject Title</label>
                        <input
                            autoFocus
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Biology 101, History of Art..."
                            className="w-full mt-1 px-4 py-2 rounded-lg border border-neutral-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={loading || !title.trim()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Create Subject
                        </button>
                    </div>
                </form>
            </Dialog>
        </>
    );
}
