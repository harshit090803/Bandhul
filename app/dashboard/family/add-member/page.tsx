"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddFamilyMemberPage() {
  const supabase = createClient();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");

  const [gender, setGender] = useState("UNKNOWN");
  const [lifeStatus, setLifeStatus] = useState("UNKNOWN");

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateOfDeath, setDateOfDeath] = useState("");

  const [birthPlace, setBirthPlace] = useState("");
  const [deathPlace, setDeathPlace] = useState("");

  const [occupation, setOccupation] = useState("");
  const [biography, setBiography] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: person, error } = await supabase
      .from("people")
      .insert({
        first_name: firstName.trim(),
        middle_name: middleName.trim() || null,
        last_name: lastName.trim() || null,

        gender,
        life_status: lifeStatus,

        date_of_birth: dateOfBirth || null,
        date_of_death: dateOfDeath || null,

        birth_place: birthPlace.trim() || null,
        death_place: deathPlace.trim() || null,

        occupation: occupation.trim() || null,
        biography: biography.trim() || null,

        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    // Record the contribution
    const { error: contributionError } = await supabase
      .from("contributions")
      .insert({
        user_id: user.id,
        action: "CREATE",
        entity_type: "PERSON",
        entity_id: person.id,
        description: `Added ${[
          firstName,
          middleName,
          lastName,
        ]
          .filter(Boolean)
          .join(" ")} to the family archive.`,
        new_data: person,
      });

    if (contributionError) {
      console.error(
        "Contribution recording failed:",
        contributionError
      );
    }

    router.push(`/dashboard/family/${person.id}`);
    router.refresh();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#321d1d]">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(176,138,69,0.28),transparent_35%),radial-gradient(circle_at_85%_85%,rgba(100,31,43,0.85),transparent_45%),#321d1d]" />

      <div className="absolute inset-0 bg-black/20" />

      {/* Decorative rings */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full border border-[#b08a45]/20" />
      <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full border border-[#b08a45]/15" />

      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full border border-[#b08a45]/20" />
      <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full border border-[#b08a45]/15" />

      <div className="relative z-10 px-6 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">

          {/* Top navigation */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/dashboard/family"
              className="text-sm font-semibold text-white/70 transition hover:text-white"
            >
              ← Family Archive
            </Link>

            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d6b878]">
              Bandhul Gotra
            </p>
          </div>

          {/* Main card */}
          <div className="rounded-3xl border border-white/20 bg-[#fffdf8]/95 p-7 shadow-2xl backdrop-blur-xl sm:p-10">

            {/* Heading */}
            <div className="mb-9">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#641f2b]">
                Family Archive
              </p>

              <h1 className="mt-2 font-serif text-4xl text-[#321d1d]">
                Add Family Member
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#746b63]">
                Preserve a member of the Bandhul family. You do not
                need to know every detail — even a name and a family
                relationship can preserve a generation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* ================= NAME ================= */}
              <section>
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b08a45]">
                    Identity
                  </p>

                  <h2 className="mt-1 font-serif text-xl text-[#321d1d]">
                    Name
                  </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-semibold text-[#321d1d]"
                    >
                      First Name *
                    </label>

                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="First name"
                      className="w-full rounded-xl border border-[#dfd5c8] bg-white px-4 py-3 text-sm text-[#321d1d] outline-none transition placeholder:text-[#9b9188] focus:border-[#641f2b] focus:ring-2 focus:ring-[#641f2b]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="middleName"
                      className="mb-2 block text-sm font-semibold text-[#321d1d]"
                    >
                      Middle Name
                    </label>

                    <input
                      id="middleName"
                      type="text"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                      placeholder="Optional"
                      className="w-full rounded-xl border border-[#dfd5c8] bg-white px-4 py-3 text-sm text-[#321d1d] outline-none transition placeholder:text-[#9b9188] focus:border-[#641f2b] focus:ring-2 focus:ring-[#641f2b]/10"
                    />
                  </div>

                </div>

                <div className="mt-5">
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-semibold text-[#321d1d]"
                  >
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Optional"
                    className="w-full rounded-xl border border-[#dfd5c8] bg-white px-4 py-3 text-sm text-[#321d1d] outline-none transition placeholder:text-[#9b9188] focus:border-[#641f2b] focus:ring-2 focus:ring-[#641f2b]/10"
                  />
                </div>
              </section>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-[#dfd5c8]" />
                <span className="text-xs text-[#b08a45]">✦</span>
                <div className="h-px flex-1 bg-[#dfd5c8]" />
              </div>

              {/* ================= STATUS ================= */}
              <section>
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b08a45]">
                    Basic Information
                  </p>

                  <h2 className="mt-1 font-serif text-xl text-[#321d1d]">
                    Life & Identity
                  </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  {/* Gender */}
                  <div>
                    <label
                      htmlFor="gender"
                      className="mb-2 block text-sm font-semibold text-[#321d1d]"
                    >
                      Gender
                    </label>

                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full rounded-xl border border-[#dfd5c8] bg-white px-4 py-3 text-sm text-[#321d1d] outline-none transition focus:border-[#641f2b] focus:ring-2 focus:ring-[#641f2b]/10"
                    >
                      <option value="UNKNOWN">
                        Unknown / Not specified
                      </option>

                      <option value="MALE">
                        Male
                      </option>

                      <option value="FEMALE">
                        Female
                      </option>

                      <option value="OTHER">
                        Other
                      </option>
                    </select>
                  </div>

                  {/* Life Status */}
                  <div>
                    <label
                      htmlFor="lifeStatus"
                      className="mb-2 block text-sm font-semibold text-[#321d1d]"
                    >
                      Life Status
                    </label>

                    <select
                      id="lifeStatus"
                      value={lifeStatus}
                      onChange={(e) => setLifeStatus(e.target.value)}
                      className="w-full rounded-xl border border-[#dfd5c8] bg-white px-4 py-3 text-sm text-[#321d1d] outline-none transition focus:border-[#641f2b] focus:ring-2 focus:ring-[#641f2b]/10"
                    >
                      <option value="UNKNOWN">
                        Unknown
                      </option>

                      <option value="ALIVE">
                        Alive
                      </option>

                      <option value="DECEASED">
                        Deceased
                      </option>
                    </select>
                  </div>

                </div>

                {/* Dates */}
                <div className="mt-5 grid gap-5 sm:grid-cols-2">

                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="mb-2 block text-sm font-semibold text-[#321d1d]"
                    >
                      Date of Birth
                      <span className="ml-2 text-xs font-normal text-[#9b9188]">
                        Optional
                      </span>
                    </label>

                    <input
                      id="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full rounded-xl border border-[#dfd5c8] bg-white px-4 py-3 text-sm text-[#321d1d] outline-none transition focus:border-[#641f2b] focus:ring-2 focus:ring-[#641f2b]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="dateOfDeath"
                      className="mb-2 block text-sm font-semibold text-[#321d1d]"
                    >
                      Date of Death
                      <span className="ml-2 text-xs font-normal text-[#9b9188]">
                        Optional
                      </span>
                    </label>

                    <input
                      id="dateOfDeath"
                      type="date"
                      value={dateOfDeath}
                      onChange={(e) => setDateOfDeath(e.target.value)}
                      className="w-full rounded-xl border border-[#dfd5c8] bg-white px-4 py-3 text-sm text-[#321d1d] outline-none transition focus:border-[#641f2b] focus:ring-2 focus:ring-[#641f2b]/10"
                    />
                  </div>

                </div>

                {/* Status explanation */}
                <div className="mt-5 rounded-2xl border border-[#b08a45]/25 bg-[#b08a45]/10 p-5">
                  <p className="text-sm font-semibold text-[#641f2b]">
                    Historical information is welcome.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#746b63]">
                    If you only know that someone is deceased, simply
                    select &quot;Deceased&quot;. Their dates can remain
                    blank. We never require information that the family
                    does not know.
                  </p>
                </div>
              </section>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-[#dfd5c8]" />
                <span className="text-xs text-[#b08a45]">✦</span>
                <div className="h-px flex-1 bg-[#dfd5c8]" />
              </div>

              {/* ================= PLACES ================= */}
              <section>
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b08a45]">
                    History
                  </p>

                  <h2 className="mt-1 font-serif text-xl text-[#321d1d]">
                    Places
                  </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label
                      htmlFor="birthPlace"
                      className="mb-2 block text-sm font-semibold text-[#321d1d]"
                    >
                      Birth Place
                    </label>

                    <input
                      id="birthPlace"
                      type="text"
                      value={birthPlace}
                      onChange={(e) => setBirthPlace(e.target.value)}
                      placeholder="Optional"
                      className="w-full rounded-xl border border-[#dfd5c8] bg-white px-4 py-3 text-sm text-[#321d1d] outline-none transition placeholder:text-[#9b9188] focus:border-[#641f2b] focus:ring-2 focus:ring-[#641f2b]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="deathPlace"
                      className="mb-2 block text-sm font-semibold text-[#321d1d]"
                    >
                      Death Place
                    </label>

                    <input
                      id="deathPlace"
                      type="text"
                      value={deathPlace}
                      onChange={(e) => setDeathPlace(e.target.value)}
                      placeholder="Optional"
                      className="w-full rounded-xl border border-[#dfd5c8] bg-white px-4 py-3 text-sm text-[#321d1d] outline-none transition placeholder:text-[#9b9188] focus:border-[#641f2b] focus:ring-2 focus:ring-[#641f2b]/10"
                    />
                  </div>

                </div>
              </section>

              {/* ================= STORY ================= */}
              <section>
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b08a45]">
                    Legacy
                  </p>

                  <h2 className="mt-1 font-serif text-xl text-[#321d1d]">
                    Their Story
                  </h2>
                </div>

                {/* Occupation */}
                <div>
                  <label
                    htmlFor="occupation"
                    className="mb-2 block text-sm font-semibold text-[#321d1d]"
                  >
                    Occupation
                    <span className="ml-2 text-xs font-normal text-[#9b9188]">
                      Optional
                    </span>
                  </label>

                  <input
                    id="occupation"
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="For example: Farmer, Teacher, Businessman"
                    className="w-full rounded-xl border border-[#dfd5c8] bg-white px-4 py-3 text-sm text-[#321d1d] outline-none transition placeholder:text-[#9b9188] focus:border-[#641f2b] focus:ring-2 focus:ring-[#641f2b]/10"
                  />
                </div>

                {/* Biography */}
                <div className="mt-5">
                  <label
                    htmlFor="biography"
                    className="mb-2 block text-sm font-semibold text-[#321d1d]"
                  >
                    Biography / Family Notes
                    <span className="ml-2 text-xs font-normal text-[#9b9188]">
                      Optional
                    </span>
                  </label>

                  <textarea
                    id="biography"
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                    rows={5}
                    placeholder="Anything the family remembers about this person..."
                    className="w-full resize-none rounded-xl border border-[#dfd5c8] bg-white px-4 py-3 text-sm leading-6 text-[#321d1d] outline-none transition placeholder:text-[#9b9188] focus:border-[#641f2b] focus:ring-2 focus:ring-[#641f2b]/10"
                  />
                </div>
              </section>

              {/* Error */}
              {message && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                  {message}
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">

                <Link
                  href="/dashboard/family"
                  className="bandhul-button-outline w-full"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="bandhul-button w-full disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Preserving Family Record..."
                    : "Add to Family Archive"}
                </button>

              </div>

            </form>
          </div>

          {/* Footer quote */}
          <p className="mt-7 text-center font-serif text-sm italic text-white/60">
            Every name carries a generation.
          </p>

        </div>
      </div>
    </main>
  );
}