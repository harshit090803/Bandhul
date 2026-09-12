import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#321d1d]">

      {/* Temporary heritage background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(176,138,69,0.28),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(100,31,43,0.8),transparent_45%),#321d1d]" />

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Decorative rings */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full border border-[#d5b46d]/20" />
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full border border-[#d5b46d]/10" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full border border-[#d5b46d]/20" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Brand */}
          <div className="mb-8 text-center text-white">

            <Link href="/" className="inline-block">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#d5b46d] text-xl text-[#d5b46d]">
                ✦
              </div>

              <div className="mt-4 font-serif text-2xl font-bold tracking-[0.12em]">
                BANDHUL GOTRA
              </div>

              <div className="mt-1 text-[9px] font-bold tracking-[0.35em] text-[#d5b46d]">
                FAMILY ARCHIVE
              </div>
            </Link>

          </div>

          {/* Login Card */}
          <div className="rounded-3xl border border-white/20 bg-[#fffdf8]/90 p-7 shadow-2xl backdrop-blur-xl sm:p-9">

            <div className="mb-7 text-center">
              <p className="text-xs font-bold tracking-[0.25em] text-[#9a7134]">
                MEMBER ACCESS
              </p>

              <h1 className="mt-3 font-serif text-4xl font-bold text-[#321d1d]">
                Welcome Back
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#746b63]">
                Enter your details to continue to the
                Bandhul family archive.
              </p>
            </div>

            <LoginForm />

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#dfd5c8]" />
              <span className="text-sm text-[#b08a45]">✦</span>
              <div className="h-px flex-1 bg-[#dfd5c8]" />
            </div>

            <p className="text-center text-sm text-[#746b63]">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-[#641f2b] underline decoration-[#b08a45] underline-offset-4 transition hover:text-[#48151e]"
              >
                Join Bandhul
              </Link>
            </p>

          </div>

          {/* Footer */}
          <p className="mt-7 text-center font-serif text-sm italic text-white/60">
            Our family. Our story. Our legacy.
          </p>

        </div>
      </div>
    </main>
  );
}