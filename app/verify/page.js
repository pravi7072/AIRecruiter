"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const Verify = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Verifying...");
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      const res = await fetch(`/api/auth/verify?token=${token}`);
      const data = await res.json();
      if (res.ok) {
        setMessage("Email verified successfully! Redirecting...");
        setTimeout(() => router.push("/auth/signin"), 2000);
      } else {
        setMessage(data.error || "Verification failed.");
      }
    };
    if (token) verifyEmail();
  }, [token]);

  return <div className="text-center mt-20 text-xl">{message}</div>;
};

export default Verify;
