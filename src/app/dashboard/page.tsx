import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/logout-button";
import CopyLinkButton from "@/components/dashboard/copy-link-button";
import { deletePortfolioAction, duplicatePortfolioAction } from "./actions";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: portfolios } = await supabase
    .from("portfolios")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#f6f4f1] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:p-8">
          <div className="flex flex-col gap-5 border-b border-zinc-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-950">Dashboard</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
                Gerencie seus portfólios, copie links, edite e exclua quando quiser.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/create"
                className="rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Novo portfólio
              </Link>
              <LogoutButton />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-700">
            Usuário autenticado: <span className="font-medium">{user.email}</span>
          </div>
        </section>

        {!portfolios?.length ? (
          <section className="rounded-[2rem] border border-zinc-200 bg-white p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">vazio por enquanto</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
              Você ainda não criou nenhum portfólio
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-zinc-600">
              Comece criando sua página pessoal com bio, links, projetos e habilidades.
            </p>
            <Link
              href="/create"
              className="mt-6 inline-flex rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Criar primeiro portfólio
            </Link>
          </section>
        ) : null}

        {portfolios?.map((portfolio) => (
          <section
            key={portfolio.id}
            className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
                    {portfolio.name}
                  </h2>

                  <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
                    {portfolio.is_public ? "Público" : "Privado"}
                  </span>
                </div>

                {portfolio.title ? (
                  <p className="mt-3 text-lg text-zinc-600">{portfolio.title}</p>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
                  <span>Criado em {formatDate(portfolio.created_at)}</span>
                  <span>Atualizado em {formatDate(portfolio.updated_at)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link
                  href={`/portfolio/${portfolio.slug}`}
                  className="rounded-2xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                >
                  Ver portfólio
                </Link>

                <Link
                  href={`/edit/${portfolio.id}`}
                  className="rounded-2xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                >
                  Editar
                </Link>

                <CopyLinkButton path={`/portfolio/${portfolio.slug}`} />

                <form action={duplicatePortfolioAction}>
                  <input type="hidden" name="id" value={portfolio.id} />
                  <button
                    type="submit"
                    className="rounded-2xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                  >
                    Duplicar
                  </button>
                </form>

                <form action={deletePortfolioAction}>
                  <input type="hidden" name="id" value={portfolio.id} />
                  <button
                    type="submit"
                    className="rounded-2xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Excluir
                  </button>
                </form>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
