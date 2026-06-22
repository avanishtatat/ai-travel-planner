"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthForm({ isRegister, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isRegister && (
        <Input
          placeholder="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      )}

      <Input
        type="email"
        placeholder="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <Input
        type="password"
        placeholder="Password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
      </Button>
    </form>
  );
}
