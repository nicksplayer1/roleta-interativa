"use client";

import { useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  name: string;
  initialValue?: string;
  label?: string;
};

export default function CoverUploadField({
  name,
  initialValue = "",
  label = "Imagem de capa",
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialValue);
  const [remoteUrl, setRemoteUrl] = useState(initialValue);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(file: File | null) {
    if (!file) return;

    setError(null);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    startTransition(async () => {
      try {
        const supabase = createClient();
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const filePath = `covers/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("invite-covers")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          setError(uploadError.message);
          return;
        }

        const { data } = supabase.storage.from("invite-covers").getPublicUrl(filePath);
        setRemoteUrl(data.publicUrl);
        setPreviewUrl(data.publicUrl);
      } catch {
        setError("Não foi possível enviar a imagem agora.");
      }
    });
  }

  return (
    <div className="space-y-3">
      <label className="mb-2 block text-sm font-medium text-zinc-800">{label}</label>

      <input type="hidden" name={name} value={remoteUrl} readOnly />

      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="h-36 w-full overflow-hidden rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 md:w-64">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Prévia da capa"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center px-4 text-center text-sm text-zinc-500">
                A imagem de capa vai aparecer aqui.
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                disabled={isPending}
              >
                {isPending ? "Enviando..." : "Enviar imagem"}
              </button>

              {previewUrl ? (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl("");
                    setRemoteUrl("");
                    setError(null);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                  className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Remover
                </button>
              ) : null}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                void handleFileChange(file);
              }}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-800">
                Ou cole a URL da imagem
              </label>
              <input
                type="url"
                value={remoteUrl}
                onChange={(e) => {
                  setRemoteUrl(e.target.value);
                  setPreviewUrl(e.target.value);
                }}
                placeholder="https://site.com/minha-capa.jpg"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-zinc-900"
              />
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <p className="text-xs text-zinc-500">PNG, JPG ou WEBP.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
