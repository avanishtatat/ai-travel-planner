"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import AuthLayout from "@/components/layout/AuthLayout";
import AuthForm from "@/components/forms/AuthForm";
import { registerUser } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (formData) => {
    try {
      setLoading(true);
      const response = await registerUser(formData);

      login(response.data.user, response.data.token);
      toast.success("Account created successfully");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start generating AI-powered travel plans"
    >
      <AuthForm isRegister loading={loading} onSubmit={handleRegister} />

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-slate-900">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}