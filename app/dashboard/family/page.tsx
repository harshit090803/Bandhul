import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function FamilyPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Find the Person linked to the current account
  const { data: accountLink } = await supabase
    .from("person_accounts")
    .select("person_id")
    .eq("user_id", user.id)
    .maybeSingle();

  let myPerson = null;

  if (accountLink?.person_id) {
    const { data } = await supabase
      .from("people")
      .select("*")
      .eq("id", accountLink.person_id)
      .eq("is_deleted", false)
      .maybeSingle();

    myPerson = data;
  }

  // Get all family members
  const { data: people } = await supabase
    .from("people")
    .select("*")
    .eq("is_deleted", false)
    .order("first_name", { ascending: true });

  const members = people ?? [];

  function getFullName(person: any) {
    return [person.first_name, person.middle_name, person.last_name]
      .filter(Boolean)
      .join(" ");
  }

  function getLifeStatus(status: string) {
    if (status === "DECEASED") {
      return "Deceased";
    }

    if (status === "ALIVE") {
      return "Alive";
    }

    return "Status unknown";
  }

  return (
    <main className="min-h-screen bg-[#f7f3eb] text-[#321d1d]">

      {/* Header */}
      <header className="border-b border-[#dfd5c8] bg-[#fffdf8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link href="/dashboard" className="group">
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#641f2b]">
              Bandhul Gotra
            </p>

            <p className="mt-1 font-serif text-xl text-[#321d1d]">
              Family Archive
            </p>
          </Link>

          <Link
            href="/dashboard"
            className="text-sm font-semibold text-[#641f2b] transition hover:text-[#48151e]"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-14">

        {/* Page intro */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#b08a45]">
              The Family
            </p>

            <h1 className="mt-2 font-serif text-4xl text-[#321d1d] sm:text-5xl">
              Family Members
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#746b63]">
              A living archive of the Bandhul family — preserving the names,
              relationships, and stories of those who came before us and
              those who carry the family forward.
            </p>
          </div>

          <Link
            href="/dashboard/family/add"
            className="bandhul-button shrink-0"
          >
            + Add Family Member
          </Link>
        </div>

        {/* Decorative divider */}
        <div className="my-10 flex items-center gap-4 text-[#b08a45]">
          <div className="h-px flex-1 bg-[#dfd5c8]" />
          <span className="text-sm">✦</span>
          <div className="h-px flex-1 bg-[#dfd5c8]" />
        </div>

        {/* Your profile */}
        {myPerson && (
          <section className="mb-10">

            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#641f2b]">
                Your Place in the Family
              </p>
            </div>

            <div className="bandhul-card overflow-hidden rounded-2xl">

              <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">

                <div className="flex items-center gap-5">

                  {/* Initial */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#641f2b] font-serif text-2xl text-white">
                    {myPerson.first_name?.charAt(0)?.toUpperCase() || "B"}
                  </div>

                  <div>
                    <p className="font-serif text-2xl text-[#321d1d]">
                      {getFullName(myPerson)}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-[#f7f3eb] px-3 py-1 font-semibold text-[#641f2b]">
                        {getLifeStatus(myPerson.life_status)}
                      </span>

                      {myPerson.gender &&
                        myPerson.gender !== "UNKNOWN" && (
                          <span className="rounded-full border border-[#dfd5c8] px-3 py-1 text-[#746b63]">
                            {myPerson.gender.charAt(0) +
                              myPerson.gender.slice(1).toLowerCase()}
                          </span>
                        )}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/dashboard/family/${myPerson.id}`}
                  className="bandhul-button-outline"
                >
                  View Profile
                </Link>

              </div>
            </div>
          </section>
        )}

        {/* Members heading */}
        <section>

          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#641f2b]">
                Archive
              </p>

              <h2 className="mt-1 font-serif text-2xl text-[#321d1d]">
                All Family Members
              </h2>
            </div>

            {/* Search - visual for now */}
            <div className="w-full sm:w-72">
              <input
                type="search"
                placeholder="Search family members..."
                className="w-full rounded-xl border border-[#dfd5c8] bg-[#fffdf8] px-4 py-3 text-sm text-[#321d1d] outline-none transition placeholder:text-[#9b9188] focus:border-[#641f2b] focus:ring-2 focus:ring-[#641f2b]/10"
              />
            </div>

          </div>

          {members.length === 0 ? (

            /* Empty state */
            <div className="bandhul-card rounded-3xl px-6 py-16 text-center sm:px-12">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#b08a45]/40 bg-[#b08a45]/10">
                <span className="font-serif text-3xl text-[#b08a45]">
                  ✦
                </span>
              </div>

              <h3 className="mt-6 font-serif text-2xl text-[#321d1d]">
                The archive is waiting to be written
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#746b63]">
                Family members will appear here as the Bandhul family
                archive grows. Even a name and a relationship can help
                preserve a generation for those who come after us.
              </p>

              <Link
                href="/dashboard/family/add-member"
                className="bandhul-button mt-7"
              >
                Add a Family Member
              </Link>

            </div>

          ) : (

            /* Members grid */
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {members.map((person) => (
                <Link
                  key={person.id}
                  href={`/dashboard/family/${person.id}`}
                  className="bandhul-card group rounded-2xl p-6 transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#641f2b] font-serif text-xl text-white">
                      {person.first_name?.charAt(0)?.toUpperCase() || "B"}
                    </div>

                    <span className="rounded-full bg-[#f7f3eb] px-3 py-1 text-[11px] font-semibold text-[#641f2b]">
                      {getLifeStatus(person.life_status)}
                    </span>

                  </div>

                  <h3 className="mt-5 font-serif text-xl text-[#321d1d] transition group-hover:text-[#641f2b]">
                    {getFullName(person)}
                  </h3>

                  {person.date_of_birth && (
                    <p className="mt-2 text-xs text-[#746b63]">
                      Born{" "}
                      {new Date(
                        person.date_of_birth
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}

                  <div className="mt-5 border-t border-[#dfd5c8] pt-4 text-xs font-semibold text-[#641f2b]">
                    View family profile →
                  </div>

                </Link>
              ))}

            </div>
          )}
        </section>

        {/* Bottom heritage note */}
        <div className="mt-16 text-center">
          <div className="mx-auto flex max-w-xs items-center gap-3 text-[#b08a45]">
            <div className="h-px flex-1 bg-[#dfd5c8]" />
            <span>✦</span>
            <div className="h-px flex-1 bg-[#dfd5c8]" />
          </div>

          <p className="mt-5 font-serif text-sm italic text-[#746b63]">
            A name remembered is a story preserved.
          </p>
        </div>

      </div>
    </main>
  );
}