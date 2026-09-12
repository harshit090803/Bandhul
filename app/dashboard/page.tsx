import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    profile?.display_name ||
    user.user_metadata?.display_name ||
    "Bandhul Member";

  const email = profile?.email || user.email || "";

  const firstName = displayName.split(" ")[0];

  return (
    <main className="min-h-screen bg-[#f7f3eb] text-[#321d1d]">

      {/* ================= HEADER ================= */}
      <header className="border-b border-[#dfd5c8] bg-[#fffdf8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link href="/dashboard" className="group">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#641f2b]">
              Bandhul Gotra
            </p>

            <p className="mt-1 font-serif text-xl text-[#321d1d]">
              Family Archive
            </p>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#321d1d]">
                {displayName}
              </p>

              <p className="text-xs text-[#746b63]">
                Family Member
              </p>
            </div>

            <LogoutButton />
          </div>

        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#321d1d]">

        {/* Decorative background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(176,138,69,0.28),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(100,31,43,0.8),transparent_45%)]" />

        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full border border-[#b08a45]/15" />
        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-[#b08a45]/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6b878]">
            Welcome to the family archive
          </p>

          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-white sm:text-6xl">
            Good to see you,{" "}
            <span className="text-[#d6b878]">
              {firstName}.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            Explore your family history, preserve the stories of those
            who came before us, and help build the Bandhul family tree
            for generations to come.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              href="/tree"
              className="inline-flex items-center justify-center rounded-full bg-[#b08a45] px-6 py-3 text-sm font-semibold text-[#321d1d] transition hover:-translate-y-0.5 hover:bg-[#c29b55]"
            >
              Explore Family Tree
            </Link>

            <Link
              href="/dashboard/family"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View Family Archive
            </Link>

          </div>

        </div>
      </section>

      {/* ================= MAIN ================= */}
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">

        {/* Section heading */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b08a45]">
            Your Archive
          </p>

          <h2 className="mt-2 font-serif text-3xl text-[#321d1d]">
            Explore Bandhul Gotra
          </h2>
        </div>

        {/* Main cards */}
        <div className="grid gap-5 lg:grid-cols-3">

          {/* Family Tree */}
          <Link
            href="/tree"
            className="group relative overflow-hidden rounded-3xl bg-[#641f2b] p-7 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-white/10" />
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full border border-white/10" />

            <div className="relative">

              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full border border-[#d6b878]/40 bg-[#b08a45]/15">
                <span className="font-serif text-xl text-[#d6b878]">
                  ✦
                </span>
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d6b878]">
                Genealogy
              </p>

              <h3 className="mt-2 font-serif text-2xl">
                Family Tree
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/65">
                Trace generations, discover relationships, and explore
                the lineage of the Bandhul family.
              </p>

              <div className="mt-7 text-sm font-semibold text-[#d6b878]">
                Explore the tree →
              </div>

            </div>
          </Link>

          {/* Family Members */}
          <Link
            href="/dashboard/family"
            className="bandhul-card group rounded-3xl p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#641f2b]/10">
              <span className="font-serif text-xl text-[#641f2b]">
                ♜
              </span>
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b08a45]">
              People
            </p>

            <h3 className="mt-2 font-serif text-2xl text-[#321d1d]">
              Family Members
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#746b63]">
              Browse the people who make up our family archive and
              preserve their stories for future generations.
            </p>

            <div className="mt-7 text-sm font-semibold text-[#641f2b]">
              View family members →
            </div>
          </Link>

          {/* Contributions */}
          <Link
            href="/dashboard/contributions"
            className="bandhul-card group rounded-3xl p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-[#b08a45]/10">
              <span className="font-serif text-xl text-[#b08a45]">
                ✎
              </span>
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b08a45]">
              Your Activity
            </p>

            <h3 className="mt-2 font-serif text-2xl text-[#321d1d]">
              Contributions
            </h3>

            <p className="mt-3 text-sm leading-6 text-[#746b63]">
              See the family information you have added or changed
              throughout the archive.
            </p>

            <div className="mt-7 text-sm font-semibold text-[#641f2b]">
              View contributions →
            </div>
          </Link>

        </div>

        {/* ================= PROFILE STRIP ================= */}
        <section className="mt-10">

          <div className="bandhul-card overflow-hidden rounded-3xl">

            <div className="flex flex-col gap-6 p-7 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-5">

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#641f2b] font-serif text-2xl text-white">
                  {firstName.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b08a45]">
                    Member Account
                  </p>

                  <h3 className="mt-1 font-serif text-2xl text-[#321d1d]">
                    {displayName}
                  </h3>

                  <p className="mt-1 text-sm text-[#746b63]">
                    {email}
                  </p>
                </div>

              </div>

              <Link
                href="/dashboard/family"
                className="bandhul-button-outline"
              >
                Manage Family Profile
              </Link>

            </div>

          </div>

        </section>

        {/* ================= HERITAGE QUOTE ================= */}
        <section className="mt-16">

          <div className="flex items-center gap-4 text-[#b08a45]">
            <div className="h-px flex-1 bg-[#dfd5c8]" />
            <span>✦</span>
            <div className="h-px flex-1 bg-[#dfd5c8]" />
          </div>

          <div className="py-10 text-center">
            <p className="font-serif text-2xl italic text-[#321d1d] sm:text-3xl">
              “A family is not merely a name.
              <br className="hidden sm:block" />
              It is the story we leave behind.”
            </p>

            <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-[#746b63]">
              Bandhul Gotra Family Archive
            </p>
          </div>

          <div className="flex items-center gap-4 text-[#b08a45]">
            <div className="h-px flex-1 bg-[#dfd5c8]" />
            <span>✦</span>
            <div className="h-px flex-1 bg-[#dfd5c8]" />
          </div>

        </section>

      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#321d1d]">
        <div className="mx-auto max-w-7xl px-6 py-8">

          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">

            <div>
              <p className="font-serif text-lg text-white">
                Bandhul Gotra
              </p>

              <p className="mt-1 text-xs text-white/45">
                Preserving our family history for generations.
              </p>
            </div>

            <p className="text-xs text-white/40">
              Family &amp; Genealogy Archive
            </p>

          </div>

        </div>
      </footer>

    </main>
  );
}