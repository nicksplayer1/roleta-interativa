import { notFound } from "next/navigation";
import WheelPreview from "@/components/wheel/wheel-preview";
import { createClient } from "@/lib/supabase/server";

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
    <main className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-3xl border p-6 shadow-sm">
        {wheel.cover_image_url ? (
          <img
            src={wheel.cover_image_url}
            alt={wheel.title}
            className="mb-6 h-64 w-full rounded-3xl object-cover"
          />
        ) : null}

        <h1 className="text-3xl font-bold">{wheel.title}</h1>

        {wheel.description ? (
          <p className="mt-3 text-gray-600">{wheel.description}</p>
        ) : null}

        <div className="mt-8 flex justify-center">
          <WheelPreview options={wheel.options || []} />
        </div>

        <div className="mt-8 text-center">
          <button className="rounded-2xl bg-black px-6 py-3 text-white">
            Girar
          </button>
        </div>
      </div>
    </main>
  );
}