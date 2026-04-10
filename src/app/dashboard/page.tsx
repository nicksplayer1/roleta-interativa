 import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <main className="p-8">Faça login.</main>;
  }

  const { data: wheels } = await supabase
    .from("wheels")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Minhas roletas</h1>
          <p className="mt-2 text-sm text-gray-500">Gerencie suas roletas personalizadas.</p>
        </div>
        <Link href="/create" className="rounded-2xl bg-black px-4 py-3 text-white">
          Nova roleta
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {wheels?.map((wheel) => (
          <div key={wheel.id} className="rounded-3xl border p-5 shadow-sm">
            <h2 className="text-xl font-semibold">{wheel.title}</h2>
            <p className="mt-2 text-sm text-gray-500">
              {(wheel.options?.length || 0)} opções
            </p>
            <p className="mt-2 text-xs text-gray-400">
              {wheel.is_public ? "Pública" : "Privada"}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/wheel/${wheel.slug}`} className="rounded-xl border px-3 py-2 text-sm">
                Abrir
              </Link>
              <Link href={`/edit/${wheel.id}`} className="rounded-xl border px-3 py-2 text-sm">
                Editar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}