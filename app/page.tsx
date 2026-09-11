import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[#dfd5c8] bg-[#fffdf8]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="font-serif text-xl font-bold tracking-wide text-[#641f2b]">
              BANDHUL
            </div>

            <div className="text-[10px] font-semibold tracking-[0.3em] text-[#8b8178]">
              GOTRA
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-5 py-2.5 text-sm font-semibold text-[#641f2b] transition hover:bg-[#f1e9df] sm:block"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-full bg-[#641f2b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#48151e]"
            >
              Join Bandhul
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-24 sm:pt-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#b08a45]/10 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="bandhul-label">
            Family • Heritage • Generations
          </p>

          <div className="bandhul-divider mx-auto mt-6 max-w-md">
            <span className="text-lg">✦</span>
          </div>

          <h1 className="mt-7 text-6xl font-bold leading-[1.05] tracking-tight text-[#321d1d] sm:text-7xl md:text-8xl">
            Bandhul
            <br />
            <span className="text-[#641f2b]">Gotra</span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[#746b63] sm:text-xl">
            Connecting generations, preserving our family history,
            and keeping the story of the Bandhul family alive.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="bandhul-button"
            >
              Explore the Family Tree
            </Link>

            <Link
              href="/signup"
              className="bandhul-button-outline"
            >
              Join the Family
            </Link>
          </div>
        </div>
      </section>

      {/* Heritage statement */}
      <section className="px-6 pb-24">
        <div className="bandhul-card mx-auto max-w-5xl rounded-3xl p-8 sm:p-12">
          <div className="grid gap-10 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div>
              <p className="bandhul-label">
                Our Purpose
              </p>

              <h2 className="mt-4 text-3xl font-bold text-[#321d1d]">
                One family.
                <br />
                Many generations.
              </h2>
            </div>

            <div className="hidden h-24 w-px bg-[#dfd5c8] md:block" />

            <p className="text-base leading-8 text-[#746b63]">
              Bandhul Gotra is a living family archive. It is a
              place where generations can be connected, family
              relationships can be preserved, and future members
              can discover where they come from.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="bandhul-label">
              The Archive
            </p>

            <h2 className="mt-3 text-4xl font-bold text-[#321d1d]">
              Preserve what matters
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              number="01"
              title="Family Tree"
              text="Explore generations of the Bandhul family and discover the relationships connecting them."
            />

            <FeatureCard
              number="02"
              title="Family Members"
              text="Build a living record of the people who make up our family, past and present."
            />

            <FeatureCard
              number="03"
              title="Family History"
              text="Preserve stories, biographies, photographs and memories for generations to come."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#dfd5c8] bg-[#321d1d] px-6 py-10 text-center text-[#f7f3eb]">
        <div className="font-serif text-xl font-bold tracking-wide">
          BANDHUL GOTRA
        </div>

        <p className="mt-2 text-sm text-[#d2c4b8]">
          Our family. Our story. Our legacy.
        </p>
      </footer>
    </main>
  );
}

function FeatureCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="bandhul-card group rounded-2xl p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <span className="font-serif text-3xl font-bold text-[#b08a45]">
          {number}
        </span>

        <span className="text-xl text-[#b08a45] transition-transform duration-300 group-hover:rotate-45">
          ✦
        </span>
      </div>

      <h3 className="mt-8 text-2xl font-bold text-[#321d1d]">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-[#746b63]">
        {text}
      </p>
    </div>
  );
}