import Link from "next/link";
import { redirect } from "next/navigation";
import WheelCardActions from "@/components/dashboard/wheel-card-actions";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: wheels } = await supabase
    .from("wheels")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const total = wheels?.length ?? 0;
  const publicCount = wheels?.filter((wheel) => wheel.is_public).length ?? 0;
  const privateCount = total - publicCount;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050016] text-white">
      <div className="relative isolate mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-8%] top-14 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="absolute right-[-8%] bottom-10 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.14),transparent_30%),radial-gradient(circle_at_bottom,rgba(6,182,212,0.12),transparent_28%)]" />
        </div>

        <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur md:p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/75">
                Dashboard premium
              </span>
              <h1 className="mt-5 text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                Suas roletas com
                <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent"> cara de produto de verdade.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                Gerencie, edite, duplique e publique tudo com o mesmo visual forte da home. Sem painel apagado e sem layout genérico.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/create"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
              >
                Criar nova roleta
              </Link>
              <Link
                href="/"
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Ver home
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <MetricCard label="Total" value={String(total)} helper="Roletas criadas" />
            <MetricCard label="Públicas" value={String(publicCount)} helper="Abertas por link" />
            <MetricCard label="Privadas" value={String(privateCount)} helper="Visíveis só para você" />
          </div>
        </section>

        {total === 0 ? (
          <section className="mt-8 rounded-[32px] border border-dashed border-white/10 bg-white/[0.03] p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur">
            <p className="text-xs uppercase tracking-[0.32em] text-white/45">Começo rápido</p>
            <h2 className="mt-4 text-3xl font-black">Sua primeira roleta ainda não foi criada.</h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-white/65">
              Abra o editor premium, adicione as fatias e publique uma versão bonita em poucos minutos.
            </p>
            <Link
              href="/create"
              className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02]"
            >
              Criar primeira roleta
            </Link>
          </section>
        ) : (
          <section className="mt-8 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {wheels?.map((wheel) => (
              <article
                key={wheel.id}
                className="group overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur transition hover:-translate-y-1 hover:border-white/15"
              >
                {wheel.cover_image_url ? (
                  <img
                    src={wheel.cover_image_url}
                    alt={wheel.title}
                    className="h-44 w-full rounded-[28px] object-cover"
                  />
                ) : (
                  <div className="flex h-44 items-end rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(236,72,153,0.18),rgba(6,182,212,0.12))] p-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-white/45">Sem capa</p>
                      <p className="mt-2 text-lg font-bold text-white">{wheel.title}</p>
                    </div>
                  </div>
                )}

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/45">Roleta</p>
                    <h2 className="mt-2 line-clamp-2 text-2xl font-black leading-tight">{wheel.title}</h2>
                  </div>

                  <span
                    className={`rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                      wheel.is_public
                        ? "border border-emerald-400/20 bg-emerald-500/10 text-emerald-200"
                        : "border border-white/10 bg-white/10 text-white/70"
                    }`}
                  >
                    {wheel.is_public ? "Pública" : "Privada"}
                  </span>
                </div>

                <p className="mt-3 line-clamp-3 min-h-[72px] text-sm leading-7 text-white/62">
                  {wheel.description || "Sem descrição ainda. Edite esta roleta para deixá-la com uma apresentação mais forte."}
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <MiniMetric label="Fatias" value={String(wheel.options?.length ?? 0)} />
                  <MiniMetric label="Giro" value={`${wheel.spin_seconds ?? 4}s`} />
                  <MiniMetric label="Slug" value={wheel.slug} small />
                </div>

                <WheelCardActions id={wheel.id} slug={wheel.slug} title={wheel.title} />
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 px-5 py-5">
      <p className="text-[11px] uppercase tracking-[0.26em] text-white/45">{label}</p>
      <p className="mt-3 text-4xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm text-white/55">{helper}</p>
    </div>
  );
}

function MiniMetric({ label, value, small = false }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">{label}</p>
      <p className={`mt-2 font-semibold text-white ${small ? "truncate text-sm" : "text-base"}`}>{value}</p>
    </div>
  );
}
