"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import WheelPreview from "@/components/wheel/wheel-preview";
import { getDefaultOptions, makeWheelSlug, normalizeOptions } from "@/lib/wheel-utils";
import { supabase } from "@/lib/supabase/client";
import type { WheelOption } from "@/types/wheel";

type EditorData = {
  id?: string;
  title?: string | null;
  description?: string | null;
  cover_image_url?: string | null;
  options?: WheelOption[] | null;
  result_message?: string | null;
  spin_seconds?: number | null;
  is_public?: boolean | null;
};

type Props = {
  mode: "create" | "edit";
  initialData?: EditorData;
};

export default function PremiumWheelEditor({ mode, initialData }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image_url ?? "");
  const [resultMessage, setResultMessage] = useState(initialData?.result_message ?? "Resultado sorteado:");
  const [spinSeconds, setSpinSeconds] = useState(initialData?.spin_seconds ?? 4);
  const [isPublic, setIsPublic] = useState(initialData?.is_public ?? true);
  const [options, setOptions] = useState<WheelOption[]>(
    initialData?.options && initialData.options.length > 0 ? initialData.options : getDefaultOptions()
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validOptions = useMemo(() => normalizeOptions(options), [options]);

  function updateOption(index: number, field: "label" | "color", value: string) {
    setOptions((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  function addOption() {
    setOptions((prev) => [
      ...prev,
      {
        label: `Opção ${prev.length + 1}`,
        color: ["#fb7185", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899"][prev.length % 6],
      },
    ]);
  }

  function removeOption(index: number) {
    if (options.length <= 2) {
      setError("A roleta precisa de pelo menos 2 opções.");
      return;
    }
    setOptions((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Digite um título para a roleta.");
      return;
    }

    if (validOptions.length < 2) {
      setError("Adicione pelo menos 2 opções válidas.");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      setError("Você precisa estar logado para salvar.");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      cover_image_url: coverImageUrl.trim() || null,
      options: validOptions,
      result_message: resultMessage.trim() || null,
      spin_seconds: Math.max(2, Math.min(12, Number(spinSeconds) || 4)),
      is_public: isPublic,
    };

    if (mode === "create") {
      const { error } = await supabase.from("wheels").insert({
        user_id: user.id,
        slug: makeWheelSlug(title),
        ...payload,
      });

      setSaving(false);

      if (error) {
        setError(error.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
      return;
    }

    const { error } = await supabase
      .from("wheels")
      .update(payload)
      .eq("id", initialData?.id)
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Roleta salva com sucesso.");
    router.refresh();
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050016] text-white">
      <div className="relative isolate mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-10%] top-10 h-64 w-64 rounded-full bg-fuchsia-600/20 blur-3xl" />
          <div className="absolute right-[-10%] bottom-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.14),transparent_28%),radial-gradient(circle_at_bottom,rgba(6,182,212,0.14),transparent_28%)]" />
        </div>

        <section className="mb-8 rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/75">
                {mode === "create" ? "Criar roleta premium" : "Editar roleta premium"}
              </span>
              <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                A mesma energia da home,
                <span className="bg-gradient-to-r from-fuchsia-400 to-cyan-300 bg-clip-text text-transparent"> agora no painel de criação.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                Monte sua roleta com visual forte, prévia ao vivo e edição rápida. Sem tela sem graça e sem cara de clone.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[420px]">
              <InfoChip label="Modo" value={mode === "create" ? "Nova roleta" : "Edição ativa"} />
              <InfoChip label="Opções" value={`${validOptions.length} fatias`} />
              <InfoChip label="Acesso" value={isPublic ? "Pública" : "Privada"} />
            </div>
          </div>
        </section>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur md:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/55">Editor</p>
                <h2 className="mt-2 text-2xl font-bold">Personalize sua roleta</h2>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Salvando..." : mode === "create" ? "Salvar roleta" : "Salvar alterações"}
              </button>
            </div>

            <div className="grid gap-8 xl:grid-cols-[1fr_1fr]">
              <div className="space-y-6">
                <Field label="Título da roleta">
                  <input
                    className="w-full rounded-3xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-fuchsia-400/60"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: O que vamos fazer hoje?"
                  />
                </Field>

                <Field label="Descrição curta">
                  <textarea
                    className="min-h-[120px] w-full rounded-3xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-fuchsia-400/60"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explique rapidamente a ideia da roleta"
                  />
                </Field>

                <Field label="URL da capa">
                  <input
                    className="w-full rounded-3xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-fuchsia-400/60"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Mensagem do resultado">
                    <input
                      className="w-full rounded-3xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-fuchsia-400/60"
                      value={resultMessage}
                      onChange={(e) => setResultMessage(e.target.value)}
                      placeholder="Resultado sorteado:"
                    />
                  </Field>

                  <Field label="Tempo do giro (2 a 12)">
                    <input
                      type="number"
                      min={2}
                      max={12}
                      className="w-full rounded-3xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-fuchsia-400/60"
                      value={spinSeconds}
                      onChange={(e) => setSpinSeconds(Number(e.target.value))}
                    />
                  </Field>
                </div>

                <label className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-black/30 px-5 py-4 text-sm text-white/80">
                  <span>
                    <strong className="block text-base text-white">Deixar pública por link</strong>
                    <span className="mt-1 block text-white/50">Quem tiver o link poderá abrir a roleta.</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-5 w-5 rounded border-white/30 bg-transparent"
                  />
                </label>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/50">Fatias</p>
                    <h3 className="mt-2 text-xl font-bold">Opções da roleta</h3>
                  </div>

                  <button
                    type="button"
                    onClick={addOption}
                    className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    + Adicionar
                  </button>
                </div>

                <div className="max-h-[560px] space-y-3 overflow-auto pr-1">
                  {options.map((option, index) => (
                    <div
                      key={`${option.label}-${index}`}
                      className="grid grid-cols-[1fr_90px_92px] items-center gap-3 rounded-3xl border border-white/10 bg-black/25 p-3"
                    >
                      <input
                        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-fuchsia-400/60"
                        value={option.label}
                        onChange={(e) => updateOption(index, "label", e.target.value)}
                        placeholder={`Opção ${index + 1}`}
                      />

                      <input
                        type="color"
                        value={option.color}
                        onChange={(e) => updateOption(index, "color", e.target.value)}
                        className="h-[50px] w-full cursor-pointer rounded-2xl border border-white/10 bg-transparent p-1"
                      />

                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-500/15"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {(error || success) && (
              <div className="mt-5 rounded-3xl border border-white/10 bg-black/25 px-5 py-4 text-sm">
                {error ? <p className="text-red-300">{error}</p> : null}
                {success ? <p className="text-emerald-300">{success}</p> : null}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Voltar ao dashboard
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Salvando..." : mode === "create" ? "Salvar roleta" : "Salvar alterações"}
              </button>
            </div>
          </section>

          <aside className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur md:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">Prévia viva</p>
                <h2 className="mt-2 text-2xl font-bold">Veja antes de salvar</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                Premium preview
              </span>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(236,72,153,0.08),rgba(6,182,212,0.08))] p-4 sm:p-5">
              {coverImageUrl ? (
                <img
                  src={coverImageUrl}
                  alt="Capa da roleta"
                  className="mb-5 h-56 w-full rounded-[28px] object-cover"
                />
              ) : (
                <div className="mb-5 flex h-56 items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-black/20 text-center text-sm text-white/40">
                  A capa aparece aqui quando você colar uma URL.
                </div>
              )}

              <div className="mb-5">
                <h3 className="text-3xl font-black leading-tight">{title || "Sua roleta premium"}</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  {description || "A descrição vai aparecer aqui para mostrar como sua roleta será apresentada."}
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-black/25 p-4">
                <WheelPreview options={validOptions} />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <PreviewCard label="Resultado" value={resultMessage || "Resultado sorteado:"} />
                <PreviewCard label="Tempo" value={`${spinSeconds || 4}s`} />
                <PreviewCard label="Status" value={isPublic ? "Pública" : "Privada"} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">{label}</label>
      {children}
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.26em] text-white/45">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
  );
}

function PreviewCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}
