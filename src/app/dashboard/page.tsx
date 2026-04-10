import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteInviteAction, duplicateInviteAction } from "./actions";
import LogoutButton from "@/components/auth/logout-button";
import CopyLinkButton from "@/components/dashboard/copy-link-button";
import { formatEventDateCompact } from "@/lib/invite-utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: invites } = await supabase
    .from("invites")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Convite interativo
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">
                Dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
                Gerencie seus convites, copie links, duplique versões e edite cada página quando quiser.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/create"
                className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Novo convite
              </Link>
              <LogoutButton />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-700">
            Usuário autenticado: <span className="font-medium">{user.email}</span>
          </div>
        </section>

        {!invites?.length ? (
          <section className="rounded-[2rem] border border-dashed border-zinc-300 bg-white p-10 text-center shadow-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Nenhum convite ainda
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950">
              Crie seu primeiro convite agora
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              Monte uma página bonita com capa, data, local, link de confirmação e informações do evento.
            </p>
            <Link
              href="/create"
              className="mt-8 inline-flex rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Criar meu primeiro convite
            </Link>
          </section>
        ) : (
          <div className="grid gap-5">
            {invites.map((invite) => {
              const publicUrl = `/invite/${invite.slug}`;

              return (
                <article
                  key={invite.id}
                  className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
                          {invite.title}
                        </h2>
                        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
                          {invite.is_public ? "Público" : "Privado"}
                        </span>
                        {invite.event_type ? (
                          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600">
                            {invite.event_type}
                          </span>
                        ) : null}
                      </div>

                      {invite.description ? (
                        <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
                          {invite.description}
                        </p>
                      ) : null}

                      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
                        {invite.event_date ? (
                          <span>Data: {formatEventDateCompact(invite.event_date)}</span>
                        ) : null}
                        {invite.event_time ? <span>Hora: {invite.event_time}</span> : null}
                        {invite.location_name ? <span>Local: {invite.location_name}</span> : null}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 lg:justify-end">
                      <Link
                        href={publicUrl}
                        className="rounded-xl border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                      >
                        Ver convite
                      </Link>

                      <Link
                        href={`/edit/${invite.id}`}
                        className="rounded-xl border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                      >
                        Editar
                      </Link>

                      <CopyLinkButton path={publicUrl} />

                      <form action={duplicateInviteAction}>
                        <input type="hidden" name="id" value={invite.id} />
                        <button
                          type="submit"
                          className="rounded-xl border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                        >
                          Duplicar
                        </button>
                      </form>

                      <form action={deleteInviteAction}>
                        <input type="hidden" name="id" value={invite.id} />
                        <button
                          type="submit"
                          className="rounded-xl border border-red-200 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          Excluir
                        </button>
                      </form>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
