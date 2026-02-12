import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { CreateSubjectForm } from "@/components/dashboard/CreateSubjectForm";
import { Sparkles } from "lucide-react";

export default async function NewStoryPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="max-w-2xl mx-auto py-12">
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
                    <Sparkles className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-3">
                    Create a New Story Subject
                </h1>
                <p className="text-neutral-500 text-lg">
                    What would you like to learn about today?
                </p>
            </div>

            <GlassPanel className="p-8 md:p-10">
                <CreateSubjectForm />
            </GlassPanel>
        </div>
    );
}
