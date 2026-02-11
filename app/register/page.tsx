import { LoginForm } from "@/components/auth/LoginForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="heading-2 mb-2">Create Your Account</h1>
          <p className="text-neutral-600">Start learning smarter today</p>
        </div>
        <LoginForm isRegister />
      </div>
    </div>
  );
}
