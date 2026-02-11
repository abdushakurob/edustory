import React from "react";
import { cn } from "@/lib/utils";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

export function GlassPanel({
    children,
    className,
    hoverEffect = false,
    ...props
}: GlassPanelProps) {
    return (
        <div
            className={cn(
                "glass-panel transition-all duration-300",
                hoverEffect && "hover:bg-glass-surface/80 hover:scale-[1.01] hover:shadow-glass-sm",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
