import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-950">
      <section className="mx-auto grid min-h-screen max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-2">
        <div className="max-w-2xl">
          <p className="mb-5 text-xs uppercase tracking-[0.45em] text-neutral-500">
            ROLETA INTERATIVA
          </p>

          <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Crie uma roleta bonita,
            <br />
            rápida e pronta
            <br />
            para compartilhar.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-600">
            Monte roletas personalizadas para decisões, desafios, sorteios,
            brincadeiras e conteúdo para redes sociais em poucos minutos.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/create"
              className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Criar roleta
            </Link>

            <Link
              href="/login"
              className="rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-medium text-neutral-900 transition hover:bg-neutral-100"
            >
              Entrar
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm">
          <p className="mb-5 text-xs uppercase tracking-[0.35em] text-neutral-400">
            EXEMPLO
          </p>

          <div className="rounded-[2rem] bg-neutral-50 p-6">
            <div className="rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                ROLETA ESPECIAL
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight">
                O que vamos comer hoje?
              </h2>

              <p className="mt-3 text-neutral-600">
                Pizza • Hambúrguer • Sushi • Açaí
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                    USO
                  </p>
                  <p className="mt-2 text-sm text-neutral-700">
                    Sorteios, desafios e decisões rápidas
                  </p>
                </div>

                <div className="rounded-2xl bg-neutral-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
                    LINK
                  </p>
                  <p className="mt-2 text-sm text-neutral-700">
                    Público ou privado por URL
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700">
                  Girar agora
                </span>
                <span className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700">
                  Editar opções
                </span>
                <span className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700">
                  Copiar link
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
