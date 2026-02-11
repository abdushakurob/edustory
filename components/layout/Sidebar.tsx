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

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 h-screen fixed left-0 top-0 flex flex-col border-r border-glass-border bg-glass-surface/30 backdrop-blur-xl z-50">
            <div className="p-6">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    StoryMind AI
                </h1>
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
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-neutral-600 hover:bg-white/40 hover:text-neutral-900"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-glass-border/50">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/40 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                            User Name
                        </p>
                        <p className="text-xs text-neutral-500 truncate">Free Plan</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
