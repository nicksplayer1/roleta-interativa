"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { makeWheelSlug } from "@/lib/wheel-utils";

type Props = {
  id: string;
  slug: string;
  title: string;
};

export default function WheelCardActions({ id, slug, title }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<"duplicate" | "delete" | null>(null);

  async function handleCopy() {
    const url = `${window.location.origin}/wheel/${slug}`;
    await navigator.clipboard.writeText(url);
  }

  async function handleDuplicate() {
    setBusy("duplicate");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setBusy(null);
      return;
    }

    const { data: original, error: fetchError } = await supabase
      .from("wheels")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !original) {
      setBusy(null);
      return;
    }

    await supabase.from("wheels").insert({
      user_id: user.id,
      slug: makeWheelSlug(`${original.title} copia`),
      title: `${original.title} (cópia)`,
      description: original.description,
      cover_image_url: original.cover_image_url,
      options: original.options,
      result_message: original.result_message,
      spin_seconds: original.spin_seconds,
      is_public: original.is_public,
    });

    setBusy(null);
    router.refresh();
  }

  async function handleDelete() {
    const confirmDelete = window.confirm(`Excluir a roleta \"${title}\"?`);
    if (!confirmDelete) return;

    setBusy("delete");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setBusy(null);
      return;
    }

    await supabase.from("wheels").delete().eq("id", id).eq("user_id", user.id);

    setBusy(null);
    router.refresh();
  }

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <Link
        href={`/wheel/${slug}`}
        className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
      >
        Abrir
      </Link>

      <Link
        href={`/edit/${id}`}
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        Editar
      </Link>

      <button
        type="button"
        onClick={handleCopy}
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        Copiar link
      </button>

      <button
        type="button"
        onClick={handleDuplicate}
        disabled={busy !== null}
        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
      >
        {busy === "duplicate" ? "Duplicando..." : "Duplicar"}
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={busy !== null}
        className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/15 disabled:opacity-60"
      >
        {busy === "delete" ? "Excluindo..." : "Excluir"}
      </button>
    </div>
  );
}
