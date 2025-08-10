import React from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export function WelcomeContainer() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div className="flex justify-center items-center">Loading...</div>;
  if (!session) return <div>Please sign in to continue.</div>;

  const { name, image } = session.user;

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 flex items-center justify-between max-w-xl mx-auto">
      <div className="flex items-center space-x-4">
        {image && (
          <Image
            src={image}
            alt={`${name}'s profile image`}
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Welcome back, {name}!</h2>
          <p className="text-gray-500">AI-driven Interviews, Hassle-free Hiring</p>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Logout
      </button>
    </div>
  );
}

export default WelcomeContainer;
