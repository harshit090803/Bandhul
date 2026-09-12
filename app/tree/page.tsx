import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FamilyTree from "@/components/family/FamilyTree";

export default async function TreePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: people } = await supabase
    .from("people")
    .select(
      "id, first_name, middle_name, last_name, gender, life_status, date_of_birth"
    )
    .eq("is_deleted", false);

  const { data: relationships } = await supabase
    .from("relationships")
    .select(
      "id, person_a_id, person_b_id, relationship_type"
    );

  return (
    <main className="min-h-screen bg-[#f7f3eb] text-[#321d1d]">

      {/* Header */}
      <header className="border-b border-[#dfd5c8] bg-[#fffdf8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link href="/dashboard">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#641f2b]">
              Bandhul Gotra
            </p>

            <p className="mt-1 font-serif text-xl text-[#321d1d]">
              Family Archive
            </p>
          </Link>

          <Link
            href="/dashboard"
            className="text-sm font-semibold text-[#641f2b] hover:text-[#48151e]"
          >
            ← Dashboard
          </Link>

        </div>
      </header>

      {/* Intro */}
      <section className="bg-[#321d1d]">
        <div className="mx-auto max-w-7xl px-6 py-12">

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6b878]">
            Genealogy
          </p>

          <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
            The Bandhul Family Tree
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
            Explore the generations of the Bandhul family and
            discover the relationships that connect us.
          </p>

        </div>
      </section>

      {/* Tree */}
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 sm:py-10">

        <FamilyTree
          people={people ?? []}
          relationships={relationships ?? []}
        />

        {/* Legend */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-6 text-xs text-[#746b63]">

          <div className="flex items-center gap-2">
            <span className="h-0.5 w-7 bg-[#641f2b]" />
            <span>Parent / Child</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-0.5 w-7 bg-[#b08a45]" />
            <span>Spouse</span>
          </div>

          <span className="text-[#b08a45]">
            Drag · Scroll · Zoom · Explore
          </span>

        </div>

      </div>

    </main>
  );
}