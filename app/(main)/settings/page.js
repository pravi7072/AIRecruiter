"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2Icon } from "lucide-react";

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Populate form on session load
  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
      });
    }
  }, [session]);

  if (status === "loading") return <p className="flex justify-center items-center"><Loader2Icon/></p>;
  if (!session) return <p>Please sign in to access your settings.</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await axios.put("/api/user/update", formData);
      if (res.data.success) {
        setSuccessMsg("Profile updated successfully!");

        // Immediately refresh client session data so UI updates without logout/login
        await update();

        // Optionally, refresh the page data
        // router.refresh();
      } else {
        setErrorMsg(res.data.error || "Failed to update profile.");
      }
    } catch (error) {
      setErrorMsg(error?.response?.data?.error || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

      {successMsg && (
        <div className="mb-4 text-green-700 bg-green-100 p-3 rounded">{successMsg}</div>
      )}
      {errorMsg && (
        <div className="mb-4 text-red-700 bg-red-100 p-3 rounded">{errorMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="text-gray-700 font-semibold">Name</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-semibold">Email</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </label>

        <label className="block">
          <span className="text-gray-700 font-semibold">Profile Image URL</span>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded bg-indigo-600 text-white py-2 font-semibold ${
            loading ? "opacity-60 cursor-not-allowed" : "hover:bg-indigo-700"
          } transition`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}
