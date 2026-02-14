import { getSession } from "@/lib/auth/session";
import { Sidebar } from "@/components/layout/Sidebar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen bg-neutral-50">
            <Sidebar user={session} />
            {/* pt-14 accounts for mobile top bar, lg:pt-0 removes it on desktop */}
            <main className="flex-1 pt-14 lg:pt-0 lg:ml-64 p-4 sm:p-6 lg:p-8">
                {children}
            </main>
        </div>
    );
}
