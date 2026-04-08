import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f6f4f1] text-zinc-950">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="grid w-full gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              portfólio instantâneo
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Crie um portfólio bonito, rápido e pronto para compartilhar.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600 sm:text-lg">
              Monte sua página pessoal com bio, links, habilidades e projetos em poucos
              minutos. Edite quando quiser e compartilhe por link.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/create"
                className="rounded-2xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Criar portfólio
              </Link>

              <Link
                href="/login"
                className="rounded-2xl border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
              >
                Entrar
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
              exemplo
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-[120px_1fr]">
              <div className="h-28 w-28 rounded-3xl bg-zinc-100" />

              <div>
                <h2 className="text-2xl font-bold text-zinc-950">Ana Souza</h2>
                <p className="mt-1 text-zinc-600">Designer de Produto</p>

                <div className="mt-4 grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="font-medium text-zinc-900">Bio</p>
                    <p className="mt-1">Foco em interfaces claras, acessíveis e conversão.</p>
                  </div>

                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="font-medium text-zinc-900">Links</p>
                    <p className="mt-1">LinkedIn, GitHub, Behance e site pessoal.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                  Projetos
                </p>
                <p className="mt-2 text-sm text-zinc-700">Landing pages, apps e e-commerce.</p>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                  Skills
                </p>
                <p className="mt-2 text-sm text-zinc-700">UI, UX, protótipos e pesquisa.</p>
              </div>

              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                  Link
                </p>
                <p className="mt-2 text-sm text-zinc-700">site.com/portfolio/ana-souza</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
