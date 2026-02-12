import { GlassPanel } from "@/components/ui/GlassPanel";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-neutral-900">Settings</h1>
            <GlassPanel className="p-8">
                <h3 className="font-medium text-neutral-900 mb-4">Account Settings</h3>
                <p className="text-sm text-neutral-500">Settings configuration coming soon.</p>
            </GlassPanel>
        </div>
    );
}
