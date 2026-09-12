"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMessage("");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  async function handleUpdatePassword(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Password updated successfully. Redirecting...");

    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 1500);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#321d1d]">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(176,138,69,0.28),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(100,31,43,0.8),transparent_45%),#321d1d]" />

      <div className="absolute inset-0 bg-black/25" />

      {/* Decorative rings */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full border border-[#b08a45]/20" />
      <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full border border-[#b08a45]/15" />

      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full border border-[#b08a45]/20" />
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full border border-[#b08a45]/15" />

      {/* Main */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Brand */}
          <div className="mb-8 text-center text-white">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#d6b878]">
              Bandhul Gotra
            </div>

            <h1 className="font-serif text-3xl tracking-wide">
              Family Archive
            </h1>

            <div className="mx-auto mt-4 flex max-w-[220px] items-center gap-3 text-[#b08a45]">
              <div className="h-px flex-1 bg-[#b08a45]/40" />
              <span className="text-sm">✦</span>
              <div className="h-px flex-1 bg-[#b08a45]/40" />
            </div>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-white/20 bg-[#fffdf8]/90 p-7 shadow-2xl backdrop-blur-xl sm:p-9">

            <div className="mb-8 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#641f2b]">
                Secure Access
              </p>

              <h2 className="font-serif text-3xl text-[#321d1d]">
                Set New Password
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#746b63]">
                Choose a new password for your Bandhul Gotra account.
              </p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#321d1d]"
                >
                  New Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#dfd5c8] bg-white px-4 py-3 text-sm text-[#321d1d] outline-none transition placeholder:text-[#9b9188] focus:border-[#641f2b] focus:ring-2 focus:ring-[#641f2b]/10"
                  placeholder="Enter new password"
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
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[#dfd5c8] bg-white px-4 py-3 text-sm text-[#321d1d] outline-none transition placeholder:text-[#9b9188] focus:border-[#641f2b] focus:ring-2 focus:ring-[#641f2b]/10"
                  placeholder="Confirm new password"
                />
              </div>

              {message && (
                <div className="rounded-xl border border-[#dfd5c8] bg-[#f7f3eb] px-4 py-3 text-sm text-[#641f2b]">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="bandhul-button w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          </div>

          {/* Footer quote */}
          <p className="mt-7 text-center font-serif text-sm italic text-white/60">
            Our family. Our story. Our legacy.
          </p>
        </div>
      </div>
    </main>
  );
}