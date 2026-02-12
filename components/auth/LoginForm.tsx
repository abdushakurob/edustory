"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface LoginFormProps {
  isRegister?: boolean;
}

export function LoginForm({ isRegister = false }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister
        ? { email, password, name }
        : { email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Authentication failed");
      }

      toast.success(isRegister ? "Account created!" : "Logged in!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Authentication failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-input w-full"
            placeholder="you@example.com"
            required
            disabled={loading}
          />
        </div>

        {isRegister && (
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-neutral-700"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass-input w-full"
              placeholder="John Doe"
              disabled={loading}
            />
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-neutral-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass-input w-full"
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : isRegister ? (
          "Create account"
        ) : (
          "Sign in"
        )}
      </button>

      <div className="text-center text-sm text-neutral-500">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-neutral-900 hover:underline"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-neutral-900 hover:underline"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </form>
  );
}
