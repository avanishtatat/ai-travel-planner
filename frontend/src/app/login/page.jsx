"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import AuthLayout from "@/components/layout/AuthLayout";
import AuthForm from "@/components/forms/AuthForm";
import { loginUser } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (formData) => {
    try {
      setLoading(true);
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      login(response.data.user, response.data.token);
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to continue planning your trips"
    >
      <AuthForm loading={loading} onSubmit={handleLogin} />

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-slate-900">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}