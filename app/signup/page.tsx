import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
      <div className="mx-auto max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">
            Join Bandhul Gotra
          </h1>

          <p className="mt-3 text-gray-600">
            Create your account to become a member and contributor.
          </p>
        </div>

        <SignupForm />

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-medium text-black underline"
          >
            Login
          </a>
        </p>
      </div>
    </main>
  );
}