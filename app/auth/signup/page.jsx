"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, UserPlus, Chrome, Image } from 'lucide-react';
import { signIn } from "next-auth/react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [picture, setPicture] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, picture }),
    });

    const result = await res.json();

    if (res.ok) {
      setSuccess("Signup successful! Please check your email to verify your account.");
      setTimeout(() => router.push("/auth/signin"), 2000);
    } else {
      setError(result.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-100 to-blue-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Create an Account</h2>
          <p className="text-gray-500">Sign up to get started</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <div className="relative mt-1">
              <UserPlus className="absolute top-2.5 left-3 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute top-2.5 left-3 text-gray-400" size={18} />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute top-2.5 left-3 text-gray-400" size={18} />
              <Input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Profile Picture URL</label>
            <div className="relative mt-1">
              <Image className="absolute top-2.5 left-3 text-gray-400" size={18} />
              <Input
                type="url"
                placeholder="Optional image URL"
                value={picture}
                onChange={(e) => setPicture(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center">{success}</p>}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            <UserPlus size={18} className="mr-2" />
            Sign Up
          </Button>
        </form>

        <div className="text-center text-gray-500">or</div>

        <Button
          variant="outline"
          className="w-full border-gray-300 hover:border-gray-400 flex items-center justify-center gap-2"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          <Chrome size={20} />
          Sign up with Google
        </Button>

        <div className="text-center pt-2 text-sm text-gray-600">
          Already have an account?
          <a href="/auth/signin" className="ml-1 text-blue-600 hover:underline">Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
