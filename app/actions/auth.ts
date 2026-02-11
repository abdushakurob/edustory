"use server";

import { clearAuthCookie } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export async function logout() {
  await clearAuthCookie();
  redirect("/login");
}
