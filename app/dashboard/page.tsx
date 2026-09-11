import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
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
  .single();

  const displayName =
    profile?.display_name ||
    user.user_metadata?.display_name ||
    "Bandhul Member";

  const email =
    profile?.email ||
    user.email ||
    "";

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">
              Bandhul Gotra
            </h1>

            <p className="text-sm text-gray-500">
              Family & Genealogy
            </p>
          </div>

          <LogoutButton />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm text-gray-500">
            Welcome to Bandhul Gotra
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {displayName}
          </h2>

          <p className="mt-2 text-gray-600">
            {email}
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <a
              href="/tree"
              className="rounded-xl border p-6 transition hover:bg-gray-50"
            >
              <h3 className="text-lg font-semibold">
                Family Tree
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Explore our family genealogy.
              </p>
            </a>

            <Link href="/dashboard/family" className="rounded-xl border p-6 transition hover:bg-gray-50">
              <h3 className="text-lg font-semibold">
                Family Members
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Add and manage family members.
              </p>
            </Link>

            <a
              href="/dashboard/contributions"
              className="rounded-xl border p-6 transition hover:bg-gray-50"
            >
              <h3 className="text-lg font-semibold">
                Contributions
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                See changes you have contributed.
              </p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}