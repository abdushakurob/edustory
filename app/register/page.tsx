import { LoginForm } from "@/components/auth/LoginForm";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Navbar } from "@/components/layout/Navbar";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <Navbar />
      <div className="w-full max-w-md mt-16">
        <GlassPanel className="p-8 space-y-8 backdrop-blur-2xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-neutral-500">
              Start learning smarter today
            </p>
          </div>
          <LoginForm isRegister />
        </GlassPanel>
      </div>
    </div>
  );
}
