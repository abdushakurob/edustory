import { getSession } from "@/lib/auth/session";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export default async function SettingsPage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Settings</h1>
                <p className="text-neutral-500">Manage your account preferences</p>
            </div>

            <GlassPanel className="p-8">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Profile Information</h2>

                <ProfileForm initialName={session.name || ""} email={session.email} />
            </GlassPanel>
        </div>
    );
}
