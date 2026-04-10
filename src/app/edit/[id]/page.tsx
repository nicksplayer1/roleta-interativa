"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import WheelPreview from "@/components/wheel/wheel-preview";
import { getDefaultOptions, normalizeOptions } from "@/lib/wheel-utils";
import { supabase } from "@/lib/supabase/client";
import type { WheelOption, WheelRow } from "@/types/wheel";

export default function EditWheelPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [resultMessage, setResultMessage] = useState("Resultado sorteado:");
  const [spinSeconds, setSpinSeconds] = useState(4);
  const [isPublic, setIsPublic] = useState(true);
  const [options, setOptions] = useState<WheelOption[]>(getDefaultOptions());

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validOptions = useMemo(() => normalizeOptions(options), [options]);

  useEffect(() => {
    let active = true;

    async function loadWheel() {
      if (!id) return;

      setLoading(true);
      setError("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (!active) return;
        setError("Você precisa estar logado.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("wheels")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (!active) return;

      if (error || !data) {
        setError("Não foi possível carregar essa roleta.");
        setLoading(false);
        return;
      }

      const wheel = data as unknown as WheelRow;

      setTitle(wheel.title ?? "");
      setDescription(wheel.description ?? "");
      setCoverImageUrl(wheel.cover_image_url ?? "");
      setResultMessage(wheel.result_message ?? "Resultado sorteado:");
      setSpinSeconds(wheel.spin_seconds ?? 4);
      setIsPublic(Boolean(wheel.is_public));
      setOptions(
        Array.isArray(wheel.options) && wheel.options.length > 0
          ? wheel.options
          : getDefaultOptions()
      );
      setLoading(false);
    }

    loadWheel();

    return () => {
      active = false;
    };
  }, [id]);

  function updateOption(index: number, field: "label" | "color", value: string) {
    setOptions((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  function addOption() {
    setOptions((prev) => [
      ...prev,
      { label: `Opção ${prev.length + 1}`, color: "#8b5cf6" },
    ]);
  }

  function removeOption(index: number) {
    setOptions((prev) => {
      if (prev.length <= 2) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSave() {
    if (!id) return;

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Digite um título.");
      return;
    }

    if (validOptions.length < 2) {
      setError("Adicione pelo menos 2 opções válidas.");
      return;
    }

    if (!Number.isFinite(spinSeconds) || spinSeconds < 2 || spinSeconds > 10) {
      setError("O tempo de giro deve ficar entre 2 e 10 segundos.");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      setError("Você precisa estar logado.");
      return;
    }

    const { error } = await supabase
      .from("wheels")
      .update({
        title: title.trim(),
        description: description.trim() || null,
        cover_image_url: coverImageUrl.trim() || null,
        options: validOptions,
        result_message: resultMessage.trim() || null,
        spin_seconds: spinSeconds,
        is_public: isPublic,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Roleta salva com sucesso.");
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="rounded-3xl border p-6 shadow-sm">Carregando roleta...</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Editar roleta</h1>
          <p className="mt-2 text-sm text-gray-500">
            Ajuste as opções, a capa e as configurações da sua roleta.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-2xl border px-4 py-3 text-sm"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-2xl bg-black px-4 py-3 text-sm text-white disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar roleta"}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-6 rounded-3xl border p-6 shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-medium">Título</label>
            <input
              className="w-full rounded-2xl border px-4 py-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Qual filme vamos ver hoje?"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <textarea
              className="min-h-24 w-full rounded-2xl border px-4 py-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Uma frase curta sobre sua roleta"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">URL da capa</label>
            <input
              className="w-full rounded-2xl border px-4 py-3"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Opções</label>
              <button
                type="button"
                onClick={addOption}
                className="rounded-xl border px-3 py-2 text-sm"
              >
                + Adicionar
              </button>
            </div>

            {options.map((option, index) => (
              <div key={index} className="grid grid-cols-[1fr_100px_90px] gap-2">
                <input
                  className="rounded-2xl border px-4 py-3"
                  value={option.label}
                  onChange={(e) => updateOption(index, "label", e.target.value)}
                  placeholder={`Opção ${index + 1}`}
                />
                <input
                  type="color"
                  className="h-[50px] w-full rounded-2xl border px-2 py-2"
                  value={option.color}
                  onChange={(e) => updateOption(index, "color", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="rounded-2xl border px-3 py-3 text-sm"
                >
                  Remover
                </button>
              </div>
            ))}

            <p className="text-xs text-gray-500">
              A roleta precisa ter pelo menos 2 opções válidas.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mensagem final</label>
              <input
                className="w-full rounded-2xl border px-4 py-3"
                value={resultMessage}
                onChange={(e) => setResultMessage(e.target.value)}
                placeholder="Resultado sorteado:"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tempo do giro (2 a 10s)</label>
              <input
                type="number"
                min={2}
                max={10}
                className="w-full rounded-2xl border px-4 py-3"
                value={spinSeconds}
                onChange={(e) => setSpinSeconds(Number(e.target.value))}
              />
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Deixar público por link
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-green-600">{success}</p> : null}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-2xl bg-black px-4 py-3 text-white disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar roleta"}
          </button>
        </section>

        <section className="space-y-6 rounded-3xl border p-6 shadow-sm">
          <h2 className="text-2xl font-bold">Prévia</h2>

          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt="Capa da roleta"
              className="h-52 w-full rounded-3xl object-cover"
            />
          ) : null}

          <div>
            <h3 className="text-2xl font-semibold">{title || "Sua roleta"}</h3>
            <p className="mt-2 text-sm text-gray-500">
              {description || "A descrição vai aparecer aqui."}
            </p>
          </div>

          <WheelPreview options={validOptions} />
        </section>
      </div>
    </main>
  );
}
