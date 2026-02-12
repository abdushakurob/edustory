"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSubject } from "@/app/actions/subjects";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export function CreateSubjectForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        theme: "Academic"
    });

    const themes = [
        "Academic",
        "Creative",
        "Technical",
        "Business",
        "Language"
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const subject = await createSubject(
                formData.title,
                formData.description,
                formData.theme
            );

            toast.success("Subject created successfully!");
            router.push(`/dashboard/subject/${subject.id}`);
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to create subject");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
                    Subject Title
                </label>
                <input
                    type="text"
                    id="title"
                    required
                    placeholder="e.g. Biology 101, French History"
                    className="w-full glass-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
            </div>

            <div>
                <label htmlFor="theme" className="block text-sm font-medium text-neutral-700 mb-2">
                    Theme
                </label>
                <select
                    id="theme"
                    className="w-full glass-input"
                    value={formData.theme}
                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                >
                    {themes.map((theme) => (
                        <option key={theme} value={theme}>
                            {theme}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                    Description (Optional)
                </label>
                <textarea
                    id="description"
                    rows={4}
                    placeholder="What is this subject about?"
                    className="w-full glass-input resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full glass-button py-3 flex items-center justify-center gap-2"
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? "Creating..." : "Create Subject"}
            </button>
        </form>
    );
}
