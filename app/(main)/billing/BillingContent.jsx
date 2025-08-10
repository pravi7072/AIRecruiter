"use client";

import { useState } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CREDIT_PACKAGES = [
  { credits: 100, price: 10 },
  { credits: 1000, price: 80 }
];

export default function BillingContent() {
  const [loadingPackage, setLoadingPackage] = useState(null);
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  const handleBuy = async (credits) => {
    setLoadingPackage(credits);
    setError("");
    try {
      const res = await axios.post("/api/checkout-session", {
        credits,
        email: session?.user?.email
      });
      const stripe = await stripePromise;
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        setError(res.data.error || "Failed to start payment.");
      }
    } catch (e) {
      setError("Failed to start payment.");
    } finally {
      setLoadingPackage(null);
    }
  };

  return (
    <main className="max-w-xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Upgrade Credits</h1>

      {success && (
        <div className="mb-4 p-4 bg-green-200 text-green-800 rounded">
          Payment successful! Your credits will update shortly.
        </div>
      )}

      {canceled && (
        <div className="mb-4 p-4 bg-yellow-200 text-yellow-800 rounded">
          Payment canceled. Try again or choose a different plan.
        </div>
      )}

      {error && (
        <div className="mb-4 text-red-600 font-medium">{error}</div>
      )}

      <div className="grid gap-6">
        {CREDIT_PACKAGES.map((pkg) => (
          <div key={pkg.credits} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-lg">{pkg.credits} credits</div>
              <div className="text-gray-900 mt-1 font-bold">${pkg.price}</div>
            </div>
            <button
              className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => handleBuy(pkg.credits)}
              disabled={loadingPackage !== null}
              aria-live="polite"
            >
              {loadingPackage === pkg.credits ? "Processing..." : "Buy"}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
