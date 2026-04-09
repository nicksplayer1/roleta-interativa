import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/logout-button";
import CopyLinkButton from "@/components/dashboard/copy-link-button";
import { ensureUrl } from "@/lib/invite-utils";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: invites } = await supabase
    .from("invites")
    .select("id, slug, title, host_name, event_date, event_time, event_type, cover_image_url, created_at, updated_at, is_public")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Painel de controle</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">Dashboard</h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
                Gerencie seus convites, copie links, duplique versões e edite sua página sempre que quiser.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/create" className="inline-flex h-12 items-center justify-center rounded-2xl bg-zinc-950 px-5 text-sm font-medium text-white hover:bg-zinc-800">
                Novo convite
              </Link>
              <LogoutButton />
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-700">
            Usuário autenticado: <span className="font-medium">{user.email}</span>
          </div>
        </section>

        {!invites?.length ? (
          <section className="rounded-[32px] border border-dashed border-zinc-300 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Nenhum convite ainda</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950">Crie seu primeiro convite agora</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
              Monte uma página bonita com data, local, confirmação de presença e uma capa especial para compartilhar por link.
            </p>
            <div className="mt-8">
              <Link href="/create" className="inline-flex h-12 items-center justify-center rounded-2xl bg-zinc-950 px-6 text-sm font-medium text-white hover:bg-zinc-800">
                Criar meu primeiro convite
              </Link>
            </div>
          </section>
        ) : (
          <div className="space-y-4">
            {invites.map((invite) => {
              const publicLink = siteUrl ? `${ensureUrl(siteUrl)}/invite/${invite.slug}` : `/invite/${invite.slug}`;
              const formattedDate = invite.event_date ? new Intl.DateTimeFormat("pt-BR").format(new Date(`${invite.event_date}T12:00:00`)) : null;

              return (
                <section key={invite.id} className="overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm">
                  <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
                    <div className="bg-zinc-100">
                      {invite.cover_image_url ? (
                        <img src={invite.cover_image_url} alt={invite.title} className="h-full min-h-[180px] w-full object-cover" />
                      ) : (
                        <div className="flex h-full min-h-[180px] items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-50 text-sm uppercase tracking-[0.3em] text-zinc-400">
                          Sem capa
                        </div>
                      )}
                    </div>

                    <div className="p-6 sm:p-7">
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">{invite.title}</h2>
                            <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600">
                              {invite.is_public ? "Público" : "Privado"}
                            </span>
                          </div>

                          {invite.event_type ? <p className="mt-3 text-lg text-zinc-700">{invite.event_type}</p> : null}

                          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
                            {formattedDate ? <span>Evento em {formattedDate}</span> : null}
                            {invite.event_time ? <span>Horário {invite.event_time.slice(0, 5)}</span> : null}
                            <span>
                              Atualizado em{" "}
                              {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(invite.updated_at))}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Link href={`/invite/${invite.slug}`} className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-300 px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50">
                            Ver convite
                          </Link>
                          <Link href={`/edit/${invite.id}`} className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-300 px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50">
                            Editar
                          </Link>
                          <CopyLinkButton url={publicLink} />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
