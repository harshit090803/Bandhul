"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AddFamilyProfilePage() {
  const supabase = createClient();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("UNKNOWN");
  const [lifeStatus, setLifeStatus] = useState("ALIVE");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
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

    const { data: person, error: personError } = await supabase
      .from("people")
      .insert({
        first_name: firstName,
        middle_name: middleName || null,
        last_name: lastName || null,
        gender,
        life_status: lifeStatus,
        date_of_birth: dateOfBirth || null,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single();

    if (personError) {
      setMessage(personError.message);
      setLoading(false);
      return;
    }

    const { error: linkError } = await supabase
      .from("person_accounts")
      .insert({
        person_id: person.id,
        user_id: user.id,
      });

    if (linkError) {
      setMessage(linkError.message);
      setLoading(false);
      return;
    }

    await supabase.from("contributions").insert({
      user_id: user.id,
      action: "LINK",
      entity_type: "ACCOUNT",
      entity_id: person.id,
      description: "Created and linked their family profile.",
      new_data: person,
    });

    router.push("/dashboard/family");
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
        <div className="mx-auto max-w-2xl">

          {/* Brand */}
          <div className="mb-8 text-center text-white">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-[#d6b878]">
              Bandhul Gotra
            </p>

            <h1 className="font-serif text-3xl tracking-wide sm:text-4xl">
              Family Archive
            </h1>

            <div className="mx-auto mt-4 flex max-w-[220px] items-center gap-3 text-[#b08a45]">
              <div className="h-px flex-1 bg-[#b08a45]/40" />
              <span className="text-sm">✦</span>
              <div className="h-px flex-1 bg-[#b08a45]/40" />
            </div>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-white/20 bg-[#fffdf8]/95 p-7 shadow-2xl backdrop-blur-xl sm:p-10">

            {/* Header */}
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#641f2b]">
                Family Identity
              </p>

              <h2 className="mt-2 font-serif text-3xl text-[#321d1d]">
                Set Up Your Family Profile
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#746b63]">
                Create your person profile so your account can be connected
                to the Bandhul family tree.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Name */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-semibold text-[#321d1d]"
                  >
                    First Name
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

              {/* Last Name */}
              <div>
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
                  placeholder="Last name"
                  className="w-full rounded-xl border border-[#dfd5c8] bg-white px-4 py-3 text-sm text-[#321d1d] outline-none transition placeholder:text-[#9b9188] focus:border-[#641f2b] focus:ring-2 focus:ring-[#641f2b]/10"
                />
              </div>

              {/* Gender + Life Status */}
              <div className="grid gap-5 sm:grid-cols-2">

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
                      Prefer not to specify
                    </option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

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
                    <option value="ALIVE">Alive</option>
                    <option value="DECEASED">Deceased</option>
                    <option value="UNKNOWN">Unknown</option>
                  </select>
                </div>

              </div>

              {/* Date of Birth */}
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

                <p className="mt-2 text-xs leading-5 text-[#746b63]">
                  You can leave this blank if the date is unknown.
                </p>
              </div>

              {/* Information box */}
              <div className="rounded-2xl border border-[#b08a45]/25 bg-[#b08a45]/10 p-5">
                <div className="flex gap-3">
                  <div className="mt-0.5 text-[#b08a45]">
                    ✦
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-[#641f2b]">
                      Don&apos;t know every detail?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#746b63]">
                      That&apos;s completely fine. Family records can be
                      incomplete. Names and relationships are valuable
                      even when dates and other details are unknown.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error / message */}
              {message && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                  {message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="bandhul-button w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Creating Profile..."
                  : "Create My Family Profile"}
              </button>

            </form>

            {/* Bottom note */}
            <div className="mt-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#dfd5c8]" />
              <span className="text-xs text-[#b08a45]">✦</span>
              <div className="h-px flex-1 bg-[#dfd5c8]" />
            </div>

            <p className="mt-5 text-center text-xs leading-5 text-[#746b63]">
              Your profile connects your account to your place in the
              Bandhul family tree.
            </p>
          </div>

          {/* Quote */}
          <p className="mt-7 text-center font-serif text-sm italic text-white/60">
            Our family. Our story. Our legacy.
          </p>

        </div>
      </div>
    </main>
  );
}