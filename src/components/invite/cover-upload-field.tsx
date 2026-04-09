"use client";

import { useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  inputName: string;
  defaultValue?: string | null;
  label?: string;
};

export default function CoverUploadField({
  inputName,
  defaultValue,
  label = "Imagem de capa",
}: Props) {
  const [imageUrl, setImageUrl] = useState(defaultValue ?? "");
  const [isUploading, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFileChange(file: File | null) {
    if (!file) return;

    startTransition(async () => {
      const supabase = createClient();
      const extension = file.name.split(".").pop() || "jpg";
      const filePath = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

      const { error } = await supabase.storage
        .from("invite-covers")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        alert("Não foi possível enviar a imagem.");
        return;
      }

      const { data } = supabase.storage.from("invite-covers").getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
    });
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-900">{label}</label>
        <input type="hidden" name={inputName} value={imageUrl} readOnly />

        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Cole a URL da imagem de capa"
          className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-2xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
        >
          {isUploading ? "Enviando..." : "Enviar imagem"}
        </button>

        {imageUrl ? (
          <button
            type="button"
            onClick={() => setImageUrl("")}
            className="rounded-2xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Remover capa
          </button>
        ) : null}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
      />

      <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-zinc-50">
        {imageUrl ? (
          <img src={imageUrl} alt="Prévia da capa" className="h-52 w-full object-cover" />
        ) : (
          <div className="flex h-52 items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-50 text-sm text-zinc-400">
            Prévia da capa
          </div>
        )}
      </div>
    </div>
  );
}
