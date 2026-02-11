"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SubjectCard } from "@/components/subjects/SubjectCard";
import { CreateSubjectModal } from "@/components/subjects/CreateSubjectModal";
import { Plus, LogOut } from "lucide-react";

interface DashboardClientProps {
  subjects: any[];
  session: any;
}

export function DashboardClient({ subjects, session }: DashboardClientProps) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="heading-2">Dashboard</h1>
            <p className="text-neutral-600">Welcome back, {session.email}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-900">Your Subjects</h2>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            New Subject
          </button>
        </div>

        {subjects.length === 0 ? (
          <div className="card-base p-12 text-center">
            <h3 className="heading-3 mb-2">No subjects yet</h3>
            <p className="text-neutral-600 mb-6">
              Create your first subject to start uploading learning materials
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={18} />
              Create Subject
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                documentCount={subject.documents?.length || 0}
              />
            ))}
          </div>
        )}
      </main>

      <CreateSubjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
