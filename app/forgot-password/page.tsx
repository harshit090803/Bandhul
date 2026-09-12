import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#321d1d]">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(176,138,69,0.28),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(100,31,43,0.8),transparent_45%),#321d1d]" />

      <div className="absolute inset-0 bg-black/25" />

      {/* Decorative heritage rings */}
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

            {/* Heading */}
            <div className="mb-8 text-center">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#641f2b]">
                Account Recovery
              </p>

              <h2 className="font-serif text-3xl text-[#321d1d]">
                Forgot Password?
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#746b63]">
                Enter the email address associated with your Bandhul account.
                We&apos;ll send you a secure link to restore access.
              </p>
            </div>

            <ForgotPasswordForm />

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#dfd5c8]" />
              <span className="text-xs text-[#b08a45]">✦</span>
              <div className="h-px flex-1 bg-[#dfd5c8]" />
            </div>

            {/* Back to login */}
            <div className="text-center">
              <Link
                href="/login"
                className="text-sm font-semibold text-[#641f2b] transition hover:text-[#48151e]"
              >
                ← Back to Member Login
              </Link>
            </div>
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