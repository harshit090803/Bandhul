"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "Password reset link sent. Please check your email."
    );

    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-[#321d1d]"
        >
          Email Address
        </label>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full rounded-xl border border-[#dfd5c8] bg-white px-4 py-3 text-sm text-[#321d1d] outline-none transition placeholder:text-[#9b9188] focus:border-[#641f2b] focus:ring-2 focus:ring-[#641f2b]/10"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success */}
      {message && (
        <div className="rounded-xl border border-[#b08a45]/30 bg-[#b08a45]/10 px-4 py-3 text-sm leading-6 text-[#641f2b]">
          {message}
        </div>
      )}

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="bandhul-button w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Sending Reset Link..." : "Send Reset Link"}
      </button>
    </form>
  );
}