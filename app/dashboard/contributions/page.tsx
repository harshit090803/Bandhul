import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ContributionsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: contributions } = await supabase
    .from("contributions")
    .select(
      `
        id,
        action,
        entity_type,
        entity_id,
        description,
        created_at
      `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const activity = contributions ?? [];

  function getActionLabel(action: string) {
    switch (action) {
      case "CREATE":
        return "Created";

      case "UPDATE":
        return "Updated";

      case "DELETE":
        return "Removed";

      case "RESTORE":
        return "Restored";

      case "LINK":
        return "Linked";

      default:
        return action;
    }
  }

  function getEntityLabel(entityType: string) {
    switch (entityType) {
      case "PERSON":
        return "Family Member";

      case "RELATIONSHIP":
        return "Relationship";

      case "CONTACT":
        return "Contact Information";

      case "ACCOUNT":
        return "Family Profile";

      default:
        return entityType;
    }
  }

  function getActionSymbol(action: string) {
    switch (action) {
      case "CREATE":
        return "+";

      case "UPDATE":
        return "✎";

      case "DELETE":
        return "−";

      case "RESTORE":
        return "↻";

      case "LINK":
        return "↔";

      default:
        return "✦";
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatTime(date: string) {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <main className="min-h-screen bg-[#f7f3eb] text-[#321d1d]">

      {/* ================= HEADER ================= */}
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
            className="text-sm font-semibold text-[#641f2b] transition hover:text-[#48151e]"
          >
            ← Dashboard
          </Link>

        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-[#321d1d]">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(176,138,69,0.28),transparent_35%),radial-gradient(circle_at_85%_80%,rgba(100,31,43,0.8),transparent_45%)]" />

        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full border border-[#b08a45]/15" />

        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-[#b08a45]/10" />

        <div className="relative mx-auto max-w-7xl px-6 py-14 sm:py-16">

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6b878]">
            Archive History
          </p>

          <h1 className="mt-3 font-serif text-4xl text-white sm:text-5xl">
            Your Contributions
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">
            A record of the changes you have made to the Bandhul family
            archive. Every contribution helps preserve our family history.
          </p>

        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16">

        {/* Summary */}
        <div className="mb-10 grid gap-5 sm:grid-cols-2">

          <div className="bandhul-card rounded-2xl p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b08a45]">
              Total Contributions
            </p>

            <p className="mt-2 font-serif text-4xl text-[#321d1d]">
              {activity.length}
            </p>

            <p className="mt-2 text-sm text-[#746b63]">
              Changes recorded by your account
            </p>
          </div>

          <div className="bandhul-card rounded-2xl p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b08a45]">
              Your Role
            </p>

            <p className="mt-2 font-serif text-2xl text-[#321d1d]">
              Family Contributor
            </p>

            <p className="mt-2 text-sm text-[#746b63]">
              Helping preserve the Bandhul family archive
            </p>
          </div>

        </div>

        {/* Divider */}
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#dfd5c8]" />
          <span className="text-xs text-[#b08a45]">✦</span>
          <div className="h-px flex-1 bg-[#dfd5c8]" />
        </div>

        {/* Timeline */}
        <section>

          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#641f2b]">
              Activity
            </p>

            <h2 className="mt-1 font-serif text-2xl text-[#321d1d]">
              Contribution History
            </h2>
          </div>

          {activity.length === 0 ? (

            /* Empty state */
            <div className="bandhul-card rounded-3xl px-6 py-16 text-center">

              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#b08a45]/40 bg-[#b08a45]/10">
                <span className="font-serif text-3xl text-[#b08a45]">
                  ✦
                </span>
              </div>

              <h3 className="mt-6 font-serif text-2xl text-[#321d1d]">
                Your story has not been written yet
              </h3>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#746b63]">
                When you add or update information in the family archive,
                your contributions will appear here.
              </p>

              <Link
                href="/dashboard/family/add-member"
                className="bandhul-button mt-7"
              >
                Add a Family Member
              </Link>

            </div>

          ) : (

            <div className="relative">

              {/* Timeline line */}
              <div className="absolute bottom-5 left-6 top-5 w-px bg-[#dfd5c8] sm:left-7" />

              <div className="space-y-6">

                {activity.map((item) => (
                  <div
                    key={item.id}
                    className="relative flex gap-5 sm:gap-6"
                  >

                    {/* Timeline icon */}
                    <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#b08a45]/40 bg-[#fffdf8] font-serif text-lg text-[#641f2b] shadow-sm sm:h-14 sm:w-14">
                      {getActionSymbol(item.action)}
                    </div>

                    {/* Contribution card */}
                    <div className="bandhul-card min-w-0 flex-1 rounded-2xl p-5 sm:p-6">

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                        <div>
                          <div className="flex flex-wrap items-center gap-2">

                            <span className="rounded-full bg-[#641f2b]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#641f2b]">
                              {getActionLabel(item.action)}
                            </span>

                            <span className="text-xs text-[#9b9188]">
                              {getEntityLabel(item.entity_type)}
                            </span>

                          </div>

                          <p className="mt-3 text-sm leading-6 text-[#321d1d]">
                            {item.description ||
                              `${getActionLabel(item.action)} a ${getEntityLabel(
                                item.entity_type
                              )}.`}
                          </p>
                        </div>

                        <div className="shrink-0 text-left sm:text-right">
                          <p className="text-xs font-semibold text-[#746b63]">
                            {formatDate(item.created_at)}
                          </p>

                          <p className="mt-1 text-[11px] text-[#9b9188]">
                            {formatTime(item.created_at)}
                          </p>
                        </div>

                      </div>

                      {/* Entity reference */}
                      {item.entity_id && (
                        <div className="mt-4 border-t border-[#dfd5c8] pt-3">
                          <p className="text-[11px] uppercase tracking-[0.12em] text-[#9b9188]">
                            Archive Record
                          </p>

                          <p className="mt-1 truncate font-mono text-[11px] text-[#746b63]">
                            {item.entity_id}
                          </p>
                        </div>
                      )}

                    </div>

                  </div>
                ))}

              </div>

            </div>
          )}

        </section>

        {/* Bottom quote */}
        <div className="mt-16 text-center">

          <div className="mx-auto flex max-w-xs items-center gap-3 text-[#b08a45]">
            <div className="h-px flex-1 bg-[#dfd5c8]" />
            <span>✦</span>
            <div className="h-px flex-1 bg-[#dfd5c8]" />
          </div>

          <p className="mt-5 font-serif text-sm italic text-[#746b63]">
            Every contribution becomes part of our family&apos;s story.
          </p>

        </div>

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