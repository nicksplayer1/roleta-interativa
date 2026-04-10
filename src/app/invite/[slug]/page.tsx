import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  buildMapHref,
  ensureUrl,
  formatEventDate,
  getInviteCountdownLabel,
} from "@/lib/invite-utils";
import CopyInviteLinkButton from "@/components/invite/copy-invite-link-button";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function InvitePublicPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: invite } = await supabase
    .from("invites")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle();

  if (!invite) {
    notFound();
  }

  const currentUrl = `/invite/${slug}`;
  const mapHref = buildMapHref(invite.map_link, invite.location_address, invite.location_name);
  const rsvpHref = ensureUrl(invite.rsvp_link);
  const giftHref = ensureUrl(invite.gift_link);
  const countdownLabel = getInviteCountdownLabel(invite.event_date, invite.event_time);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#faf7f2_0%,#fff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
            <div className="p-8 sm:p-10">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs uppercase tracking-[0.3em] text-zinc-500">
                  Convite online
                </span>
                {invite.event_type ? (
                  <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs uppercase tracking-[0.25em] text-zinc-500">
                    {invite.event_type}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                {invite.title}
              </h1>

              {invite.host_name ? (
                <p className="mt-4 text-lg text-zinc-700">
                  Um convite especial de <span className="font-medium">{invite.host_name}</span>
                </p>
              ) : null}

              {invite.description ? (
                <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-600">
                  {invite.description}
                </p>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                {rsvpHref ? (
                  <a
                    href={rsvpHref}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
                  >
                    Confirmar presença
                  </a>
                ) : null}

                {mapHref ? (
                  <a
                    href={mapHref}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                  >
                    Ver mapa
                  </a>
                ) : null}

                <CopyInviteLinkButton url={currentUrl} />
              </div>
            </div>

            <div className="relative min-h-[280px] border-t border-zinc-200 bg-zinc-100 lg:min-h-full lg:border-l lg:border-t-0">
              {invite.cover_image_url ? (
                <img
                  src={invite.cover_image_url}
                  alt={invite.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-8 text-center text-sm uppercase tracking-[0.3em] text-zinc-500">
                  Adicione uma capa para deixar o convite ainda mais bonito
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Detalhes do evento</p>

            <div className="mt-6 grid gap-5">
              {invite.event_date ? (
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">Data</p>
                  <p className="mt-2 text-lg font-medium text-zinc-950">{formatEventDate(invite.event_date)}</p>
                </div>
              ) : null}

              {invite.event_time ? (
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">Hora</p>
                  <p className="mt-2 text-lg font-medium text-zinc-950">{invite.event_time}</p>
                </div>
              ) : null}

              {invite.location_name ? (
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">Local</p>
                  <p className="mt-2 text-lg font-medium text-zinc-950">{invite.location_name}</p>
                </div>
              ) : null}

              {invite.location_address ? (
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">Endereço</p>
                  <p className="mt-2 whitespace-pre-line text-base leading-7 text-zinc-600">
                    {invite.location_address}
                  </p>
                </div>
              ) : null}

              {countdownLabel ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                  <p className="text-sm font-medium text-zinc-900">{countdownLabel}</p>
                </div>
              ) : null}
            </div>
          </article>

          <article className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Informações extras</p>

            <div className="mt-6 grid gap-5">
              {invite.dress_code ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                    Traje / observação
                  </p>
                  <p className="mt-2 whitespace-pre-line text-base leading-7 text-zinc-700">
                    {invite.dress_code}
                  </p>
                </div>
              ) : null}

              {giftHref ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                    Lista de presentes
                  </p>
                  <a
                    href={giftHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white"
                  >
                    Abrir lista
                  </a>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-zinc-300 px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                >
                  Ir ao dashboard
                </Link>
                {rsvpHref ? (
                  <a
                    href={rsvpHref}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-zinc-950 px-4 py-3 text-sm font-medium text-white hover:bg-zinc-800"
                  >
                    Confirmar agora
                  </a>
                ) : null}
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
