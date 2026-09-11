export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Bandhul Gotra
        </h1>

        <p className="mt-4 max-w-xl text-lg text-gray-600">
          Connecting generations, preserving our family history.
        </p>

        <div className="mt-8 flex gap-4">
          <a
            href="/login"
            className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            Login
          </a>

          <a
            href="/signup"
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100"
          >
            Join Bandhul
          </a>
        </div>
      </section>
    </main>
  );
}