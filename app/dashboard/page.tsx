import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getSubjects } from "@/app/actions/subjects";
import { SubjectCard } from "@/components/subjects/SubjectCard";
import Link from "next/link";
import { Plus, LogOut } from "lucide-react";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const subjects = await getSubjects();

  return <DashboardClient subjects={subjects} session={session} />;
}
