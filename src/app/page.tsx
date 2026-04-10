import Link from "next/link";
import HeroLiveWheel from "@/components/wheel/hero-live-wheel";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05010a] text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.22),transparent_30%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.18),transparent_30%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.18),transparent_35%)]" />
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24">
          <header className="mb-10 flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-zinc-300">Roleta Interativa</p>
            </div>

            <nav className="flex items-center gap-2">
              <Link
                href="/create"
                className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
              >
                Criar minha roleta
              </Link>
            </nav>
          </header>

          <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-fuchsia-200">
                visual forte + demo imediata
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                Uma roleta chamativa,
                <span className="block bg-gradient-to-r from-fuchsia-400 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
                  viva e pronta para girar.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
                Nada de layout com cara de clone. Aqui a pessoa entra e já vê a roleta girando,
                entende o produto em segundos e vai direto para criar a própria versão.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/create"
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
                >
                  Criar roleta agora
                </Link>
                <a
                  href="#demo"
                  className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Ver demo ao vivo
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Uso</p>
                  <p className="mt-2 text-base font-semibold text-white">Decisões, sorteios e desafios</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Acesso</p>
                  <p className="mt-2 text-base font-semibold text-white">Sem precisar login para entender</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-400">Impacto</p>
                  <p className="mt-2 text-base font-semibold text-white">Cara de produto mais premium</p>
                </div>
              </div>
            </div>

            <div id="demo" className="relative">
              <HeroLiveWheel />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
