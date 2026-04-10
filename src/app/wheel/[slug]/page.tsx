import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LiveWheel from "@/components/wheel/live-wheel";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function PublicWheelPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: wheel } = await supabase
    .from("wheels")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .single();

  if (!wheel) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="overflow-hidden rounded-[32px] border border-black/10 bg-gradient-to-b from-white to-gray-50 shadow-sm">
        {wheel.cover_image_url ? (
          <img
            src={wheel.cover_image_url}
            alt={wheel.title}
            className="h-64 w-full object-cover md:h-80"
          />
        ) : null}

        <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
          <section className="space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-gray-400">
                Roleta interativa
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-950 md:text-4xl">
                {wheel.title}
              </h1>
              {wheel.description ? (
                <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
                  {wheel.description}
                </p>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
                  Opções
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-950">
                  {wheel.options?.length || 0}
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
                  Tempo de giro
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-950">
                  {wheel.spin_seconds || 4}s
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-900">Itens da roleta</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {(wheel.options || []).map(
                  (item: { label: string; color: string }, index: number) => (
                    <span
                      key={`${item.label}-${index}`}
                      className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-sm font-medium text-gray-800"
                    >
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color || "#3b82f6" }}
                      />
                      {item.label}
                    </span>
                  )
                )}
              </div>
            </div>
          </section>

          <section>
            <LiveWheel
              title={wheel.title}
              options={wheel.options || []}
              resultMessage={wheel.result_message}
              spinSeconds={wheel.spin_seconds || 4}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
