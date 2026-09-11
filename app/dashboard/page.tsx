import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <p className="text-sm text-gray-500">
            Welcome to Bandhul Gotra
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            {profile?.display_name || "Bandhul Member"}
          </h1>

          <p className="mt-2 text-gray-600">
            {profile?.email || user.email}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border p-6">
              <h2 className="font-semibold">
                Family Tree
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Explore the Bandhul family tree.
              </p>
            </div>

            <div className="rounded-xl border p-6">
              <h2 className="font-semibold">
                Family Members
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                Add and manage family members.
              </p>
            </div>

            <div className="rounded-xl border p-6">
              <h2 className="font-semibold">
                Contributions
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                View your contributions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}