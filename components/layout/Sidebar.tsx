"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, Library, Settings, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "My Stories", href: "/dashboard/stories", icon: BookOpen },
    { name: "Library", href: "/dashboard/library", icon: Library },
    { name: "Progress", href: "/dashboard/progress", icon: GraduationCap },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface User {
    name: string;
    email: string;
    image?: string | null;
}

interface SidebarProps {
    user: User;
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();

    return (
        <div className="w-64 h-screen fixed left-0 top-0 flex flex-col border-r border-neutral-200 bg-white/80 backdrop-blur-xl z-50">
            <div className="p-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center text-white font-bold">
                        E
                    </div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
                        Edustory
                    </h1>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-neutral-500")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-neutral-200">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate group-hover:text-blue-600 transition-colors">
                            {user.name}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
