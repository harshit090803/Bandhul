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
    <main className="min-h-screen bg-gray-50 px-6 py-12 text-gray-900">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm text-gray-500">
              Bandhul Gotra
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Set Up Your Family Profile
            </h1>

            <p className="mt-3 text-gray-600">
              Create your person profile so we can connect your
              account to the Bandhul family tree.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                First Name
              </label>

              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="First name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Middle Name
              </label>

              <input
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="Middle name (optional)"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Last Name
              </label>

              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
                placeholder="Last name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Gender
              </label>

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              >
                <option value="UNKNOWN">
                  Prefer not to specify
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

            <div>
              <label className="mb-2 block text-sm font-medium">
                Date of Birth
              </label>

              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              {loading
                ? "Creating Profile..."
                : "Create My Family Profile"}
            </button>

            {message && (
              <p className="rounded-lg bg-gray-100 p-3 text-sm">
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}