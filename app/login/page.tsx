import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-gray-900">
      <div className="mx-auto max-w-md">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold">
            Welcome Back
          </h1>

          <p className="mt-3 text-gray-600">
            Login to your Bandhul Gotra account.
          </p>
        </div>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-black underline"
          >
            Join Bandhul
          </a>
        </p>
      </div>
    </main>
  );
}