"use server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";

export async function updateProfile(name: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    try {
        const user = await prisma.user.update({
            where: { id: session.userId },
            data: { name },
        });

        revalidatePath("/dashboard");
        return { success: true, user };
    } catch (error) {
        console.error("Failed to update profile", error);
        return { success: false, error: "Failed to update profile" };
    }
}
