import { GlassPanel } from "@/components/ui/GlassPanel";
import { Library } from "lucide-react";

export default function LibraryPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-neutral-900">Library</h1>
            <GlassPanel className="p-12 text-center border-dashed border-2 border-neutral-200 bg-neutral-50/30">
                <div className="w-16 h-16 mx-auto bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <Library className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="font-medium text-neutral-900">Library Empty</h3>
                <p className="text-sm text-neutral-500 mb-4">Upload documents to populate your library.</p>
            </GlassPanel>
        </div>
    );
}
