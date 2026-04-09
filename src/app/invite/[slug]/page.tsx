import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CopyLinkButton from "@/components/dashboard/copy-link-button";
import { countdownParts, ensureUrl, formatDateBr, formatThemeLabel, formatTimeBr } from "@/lib/invite-utils";

type Props = {
  params: Promise<{ slug: string }>;
};

function chipClass(theme: string | null) {
  const map: Record<string, string> = {
    elegante: "bg-zinc-950 text-white",
    romantico: "bg-rose-100 text-rose-700",
    infantil: "bg-sky-100 text-sky-700",
    minimalista: "bg-zinc-100 text-zinc-700",
    festa: "bg-amber-100 text-amber-700",
  };

  return map[theme || "elegante"] || "bg-zinc-950 text-white";
}

export default async function InvitePublicPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: invite } = await supabase
    .from("invites")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle();

  if (!invite) notFound();

  const countdown = countdownParts(invite.event_date, invite.event_time);
  const publicUrl = `/invite/${invite.slug}`;

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-zinc-200 bg-white shadow-sm">
        <section className="relative">
          {invite.cover_image_url ? (
            <div className="relative h-[280px] sm:h-[360px]">
              <img src={invite.cover_image_url} alt={invite.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
            </div>
          ) : (
            <div className="h-[220px] bg-gradient-to-br from-zinc-100 via-zinc-50 to-white sm:h-[260px]" />
          )}

          <div className="absolute right-4 top-4 flex flex-wrap gap-2 sm:right-6 sm:top-6">
            <Link href="/dashboard" className="inline-flex h-11 items-center justify-center rounded-2xl bg-white/90 px-4 text-sm font-medium text-zinc-900 backdrop-blur hover:bg-white">
              Ir ao dashboard
            </Link>
            <CopyLinkButton url={publicUrl} />
          </div>

          <div className="relative z-10 -mt-16 px-5 pb-6 sm:px-8 sm:pb-8">
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[32px] border border-zinc-200 bg-white/95 p-6 shadow-sm backdrop-blur sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.35em] text-zinc-500">Convite público</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${chipClass(invite.theme)}`}>
                    {formatThemeLabel(invite.theme)}
                  </span>
                </div>

                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">{invite.title}</h1>

                {invite.event_type ? <p className="mt-4 text-lg text-zinc-700 sm:text-2xl">{invite.event_type}</p> : null}
                {invite.description ? <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-600 sm:text-lg">{invite.description}</p> : null}

                <div className="mt-8 flex flex-wrap gap-3">
                  {invite.rsvp_link ? (
                    <a href={ensureUrl(invite.rsvp_link)} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center rounded-2xl bg-zinc-950 px-5 text-sm font-medium text-white hover:bg-zinc-800">
                      Confirmar presença
                    </a>
                  ) : null}

                  {invite.gift_link ? (
                    <a href={ensureUrl(invite.gift_link)} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-300 px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50">
                      Ver lista de presentes
                    </a>
                  ) : null}

                  {invite.map_link ? (
                    <a href={ensureUrl(invite.map_link)} target="_blank" rel="noreferrer" className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-300 px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50">
                      Abrir mapa
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[32px] border border-zinc-200 bg-white/95 p-6 shadow-sm backdrop-blur sm:p-8">
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Detalhes</p>

                  <div className="mt-5 space-y-4 text-zinc-700">
                    {invite.host_name ? (
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Anfitrião</p>
                        <p className="mt-2 text-lg font-medium text-zinc-900">{invite.host_name}</p>
                      </div>
                    ) : null}

                    {invite.event_date ? (
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Data</p>
                        <p className="mt-2 text-lg font-medium text-zinc-900">{formatDateBr(invite.event_date)}</p>
                      </div>
                    ) : null}

                    {invite.event_time ? (
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Horário</p>
                        <p className="mt-2 text-lg font-medium text-zinc-900">{formatTimeBr(invite.event_time)}</p>
                      </div>
                    ) : null}

                    {invite.location_name ? (
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Local</p>
                        <p className="mt-2 text-lg font-medium text-zinc-900">{invite.location_name}</p>
                        {invite.location_address ? <p className="mt-1 text-sm leading-7 text-zinc-600">{invite.location_address}</p> : null}
                      </div>
                    ) : null}

                    {invite.dress_code ? (
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Dress code</p>
                        <p className="mt-2 text-lg font-medium text-zinc-900">{invite.dress_code}</p>
                      </div>
                    ) : null}
                  </div>
                </div>

                {countdown ? (
                  <div className="rounded-[32px] border border-zinc-200 bg-zinc-950 p-6 text-white shadow-sm sm:p-8">
                    <p className="text-xs uppercase tracking-[0.35em] text-white/70">Contagem regressiva</p>

                    {countdown.isPast ? (
                      <p className="mt-4 text-2xl font-semibold">O evento já começou.</p>
                    ) : (
                      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                        <div className="rounded-2xl bg-white/10 px-3 py-4">
                          <p className="text-3xl font-semibold">{countdown.days}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/70">Dias</p>
                        </div>
                        <div className="rounded-2xl bg-white/10 px-3 py-4">
                          <p className="text-3xl font-semibold">{countdown.hours}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/70">Horas</p>
                        </div>
                        <div className="rounded-2xl bg-white/10 px-3 py-4">
                          <p className="text-3xl font-semibold">{countdown.minutes}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/70">Min</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
