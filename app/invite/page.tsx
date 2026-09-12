"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function InvitePage() {
  const supabase = createClient();
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadInvite() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!mounted) return;

      if (!user) {
        setError(
          "This invitation could not be opened. Please use the invitation link from your email."
        );
        setLoading(false);
        return;
      }

      setEmail(user.email ?? "");
      setReady(true);
      setLoading(false);
    }

    loadInvite();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSaving(true);

    const { error: passwordError } =
      await supabase.auth.updateUser({
        password,
      });

    if (passwordError) {
      setError(passwordError.message);
      setSaving(false);
      return;
    }

    // Link the authenticated user to the existing Person record.
    const response = await fetch("/api/invitations/accept", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error ?? "Could not activate your family account.");
      setSaving(false);
      return;
    }

    setMessage(
      "Your Bandhul account has been activated successfully."
    );

    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 1200);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#321d1d] text-white">
        <p className="text-sm text-white/70">
          Opening your Bandhul invitation...
        </p>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#321d1d] px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(176,138,69,0.28),transparent_35%),radial-gradient(circle_at_85%_85%,rgba(100,31,43,0.85),transparent_45%),#321d1d]" />

      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full border border-[#b08a45]/20" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full border border-[#b08a45]/20" />

      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-white/20 bg-[#fffdf8]/95 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#641f2b]">
            Bandhul Gotra
          </p>

          <h1 className="mt-3 font-serif text-4xl text-[#321d1d]">
            Join Your Family Archive
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#746b63]">
            Your family has invited you to create your Bandhul
            account.
          </p>

          {email && (
            <p className="mt-2 text-sm font-semibold text-[#641f2b]">
              {email}
            </p>
          )}
        </div>

        {!ready ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {error}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-[#321d1d]"
              >
                Choose a Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="w-full rounded-xl border border-[#dfd5c8] bg-white px-4 py-3 text-sm text-[#321d1d] outline-none transition placeholder:text-[#9b9188] focus:border-[#641f2b] focus:ring-2 focus:ring-[#641f2b]/10"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-[#321d1d]"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
                minLength={8}
                placeholder="Enter the password again"
                className="w-full rounded-xl border border-[#dfd5c8] bg-white px-4 py-3 text-sm text-[#321d1d] outline-none transition placeholder:text-[#9b9188] focus:border-[#641f2b] focus:ring-2 focus:ring-[#641f2b]/10"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="bandhul-button w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Activating Your Account..."
                : "Join Bandhul"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center font-serif text-sm italic text-[#746b63]">
          Every name carries a generation.
        </p>
      </div>
    </main>
  );
}