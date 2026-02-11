import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <Sidebar />
            <main className="pl-64 min-h-screen">
                <div className="max-w-7xl mx-auto p-8">{children}</div>
            </main>
        </div>
    );
}
