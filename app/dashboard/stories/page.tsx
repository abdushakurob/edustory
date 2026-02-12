import { GlassPanel } from "@/components/ui/GlassPanel";
import { BookOpen } from "lucide-react";

export default function StoriesPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-neutral-900">My Stories</h1>
            <GlassPanel className="p-12 text-center border-dashed border-2 border-neutral-200 bg-neutral-50/30">
                <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="font-medium text-neutral-900">No stories yet</h3>
                <p className="text-sm text-neutral-500 mb-4">You haven't generated any stories yet.</p>
            </GlassPanel>
        </div>
    );
}
