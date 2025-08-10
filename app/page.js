"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  const router = useRouter();


  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-6">
      <div className="max-w-2xl text-center text-white space-y-6">

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          Welcome to{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            AI Interview Schedule Voice Agent
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-300 text-lg max-w-xl mx-auto">
          Conduct intelligent, real-time voice interviews powered by AI.  
          Schedule, record, and evaluate candidates seamlessly.
        </p>

        {/* CTA */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all duration-300 shadow-lg text-lg px-8 cursor-pointer"
            onClick={() => router.push("/auth/signin")}
          >
            Get Started
          </Button>
        </div>
      </div>
    </main>
  );
}
