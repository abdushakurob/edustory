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
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
