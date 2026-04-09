import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CopyLinkButton from "@/components/dashboard/copy-link-button";
import DeletePortfolioButton from "@/components/dashboard/delete-portfolio-button";
import { deletePortfolio, duplicatePortfolio } from "./actions";
import LogoutButton from "@/components/auth/logout-button";

type Props = {
  searchParams?: Promise<{ error?: string; success?: string }>;
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default async function DashboardPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/login");
  }

  const params = (await searchParams) ?? {};

  const { data: portfolios } = await supabase
    .from("portfolios")
    .select("id, slug, name, title, is_public, created_at, updated_at")
    .eq("user_id", authData.user.id)
    .order("updated_at", { ascending: false });

  const appUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Painel de controle
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
                Gerencie seus portfólios, copie links, duplique versões e edite
                sua página sempre que quiser.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/create"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-zinc-950 px-5 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Novo portfólio
              </Link>
              <LogoutButton />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
            Usuário autenticado: <span className="font-medium">{authData.user.email}</span>
          </div>

          {params.error ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {params.error}
            </div>
          ) : null}

          {params.success ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {params.success}
            </div>
          ) : null}
        </section>

        {!portfolios || portfolios.length === 0 ? (
          <section className="rounded-[28px] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Nenhum portfólio ainda
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-zinc-950">
              Crie sua primeira página agora
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-600 sm:text-base">
              Monte uma apresentação bonita com bio, projetos, habilidades e
              links principais para compartilhar com clientes ou recrutadores.
            </p>
            <Link
              href="/create"
              className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-zinc-950 px-6 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Criar meu primeiro portfólio
            </Link>
          </section>
        ) : (
          <section className="space-y-4">
            {portfolios.map((portfolio) => {
              const publicUrl = appUrl
                ? `${appUrl}/portfolio/${portfolio.slug}`
                : `/portfolio/${portfolio.slug}`;

              return (
                <article
                  key={portfolio.id}
                  className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                          {portfolio.name}
                        </h2>
                        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
                          {portfolio.is_public ? "Público" : "Privado"}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-zinc-600 sm:text-base">
                        {portfolio.title || "Sem título profissional"}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
                        <span>Criado em {formatDate(portfolio.created_at)}</span>
                        <span>Atualizado em {formatDate(portfolio.updated_at)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 xl:justify-end">
                      <Link
                        href={`/portfolio/${portfolio.slug}`}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-300 px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                      >
                        Ver portfólio
                      </Link>

                      <Link
                        href={`/edit/${portfolio.id}`}
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-300 px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                      >
                        Editar
                      </Link>

                      <CopyLinkButton url={publicUrl} />

                      <form action={duplicatePortfolio}>
                        <input type="hidden" name="id" value={portfolio.id} />
                        <button
                          type="submit"
                          className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-300 px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
                        >
                          Duplicar
                        </button>
                      </form>

                      <DeletePortfolioButton action={deletePortfolio} id={portfolio.id} />
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
