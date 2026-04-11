"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import WheelPreview from "@/components/wheel/wheel-preview";
import { getDefaultOptions, makeWheelSlug, normalizeOptions } from "@/lib/wheel-utils";
import type { WheelOption } from "@/types/wheel";

function CreateWheelPageInner() {
  const searchParams = useSearchParams();
  const isSendMode = searchParams.get("mode") === "send";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(
    isSendMode ? "Gire a roleta e veja o resultado." : ""
  );
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [resultMessage, setResultMessage] = useState("Resultado:");
  const [spinSeconds, setSpinSeconds] = useState(4);
  const [isPublic, setIsPublic] = useState(true);
  const [options, setOptions] = useState<WheelOption[]>(getDefaultOptions());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [createdSlug, setCreatedSlug] = useState("");
  const [copied, setCopied] = useState(false);

  const validOptions = useMemo(() => normalizeOptions(options), [options]);

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
    setOptions((prev) =>
      prev.length <= 2 ? prev : prev.filter((_, i) => i !== index)
    );
  }

  function makeEditToken() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random()
      .toString(36)
      .slice(2)}`;
  }

  async function handleSave() {
    if (saving) return;

    setError("");
    setCopied(false);

    if (!title.trim()) {
      setError("Digite um título.");
      return;
    }

    if (validOptions.length < 2) {
      setError("Adicione pelo menos 2 opções.");
      return;
    }

    setSaving(true);

    try {
      const slug = makeWheelSlug(title);
      const editToken = makeEditToken();

      const { error: insertError } = await supabase.from("wheels").insert({
        user_id: null,
        slug,
        title: title.trim(),
        description: description.trim() || null,
        cover_image_url: coverImageUrl.trim() || null,
        options: validOptions,
        result_message: resultMessage.trim() || null,
        spin_seconds: spinSeconds,
        is_public: isPublic,
        created_via: "anonymous",
        edit_token: editToken,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setCreatedSlug(slug);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao salvar a roleta.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function copyCreatedLink() {
    if (!createdSlug || typeof window === "undefined") return;
    const url = `${window.location.origin}/wheel/${createdSlug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
  }

  if (createdSlug) {
    return (
      <main className="min-h-screen bg-[#050114] px-4 py-8 text-white">
        <div className="mx-auto max-w-3xl rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,#16051f_0%,#090316_55%,#071427_100%)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] md:p-8">
          <div className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-emerald-200">
            Roleta criada
          </div>

          <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] md:text-5xl">
            Sua roleta já está pronta para enviar.
          </h1>

          <p className="mt-4 text-lg leading-8 text-white/80">
            Agora você pode copiar o link e mandar para outra pessoa. Ela só vai abrir,
            girar a roleta e ver o resultado.
          </p>

          <div className="mt-6 rounded-[26px] border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.32em] text-white/45">
              Link público
            </div>
            <div className="mt-3 break-all text-base text-cyan-200 md:text-lg">
              {typeof window !== "undefined"
                ? `${window.location.origin}/wheel/${createdSlug}`
                : `/wheel/${createdSlug}`}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={copyCreatedLink}
              className="rounded-full bg-white px-7 py-4 text-base font-semibold text-black transition hover:scale-[1.02]"
            >
              {copied ? "Link copiado" : "Copiar link"}
            </button>

            <Link
              href={`/wheel/${createdSlug}`}
              className="rounded-full border border-white/10 bg-white/5 px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Abrir roleta
            </Link>

            <Link
              href="/"
              className="rounded-full border border-white/10 bg-white/5 px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Voltar
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050114] px-4 py-8 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,#16051f_0%,#090316_55%,#071427_100%)] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] md:p-8">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/70">
            {isSendMode ? "Criar para enviar" : "Criar roleta"}
          </div>

          <h1 className="mt-5 text-4xl font-black tracking-[-0.04em] md:text-5xl">
            {isSendMode
              ? "Monte a roleta e envie o link pronto."
              : "Monte sua roleta personalizada."}
          </h1>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Título
              </label>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/35"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: O que vamos comer hoje?"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Descrição
              </label>
              <textarea
                className="min-h-24 w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/35"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Uma frase curta sobre a roleta"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                URL da capa
              </label>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/35"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="block text-sm font-medium text-white/80">
                  Opções
                </label>
                <button
                  type="button"
                  onClick={addOption}
                  className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/12"
                >
                  + Adicionar opção
                </button>
              </div>

              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="grid gap-3 md:grid-cols-[1fr_110px_110px]">
                    <input
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/35"
                      value={option.label}
                      onChange={(e) => updateOption(index, "label", e.target.value)}
                      placeholder={`Opção ${index + 1}`}
                    />
                    <input
                      type="color"
                      className="h-[52px] w-full rounded-2xl border border-white/10 bg-black/30 px-2 py-2"
                      value={option.color}
                      onChange={(e) => updateOption(index, "color", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/12"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Mensagem final
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-white/35"
                  value={resultMessage}
                  onChange={(e) => setResultMessage(e.target.value)}
                  placeholder="Resultado:"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Tempo do giro
                </label>
                <input
                  type="number"
                  min={2}
                  max={10}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none"
                  value={spinSeconds}
                  onChange={(e) => setSpinSeconds(Number(e.target.value))}
                />
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm text-white/85">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              Deixar pública por link
            </label>

            {error ? <p className="text-sm text-red-300">{error}</p> : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-white px-7 py-4 text-base font-semibold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Salvando..." : isSendMode ? "Salvar e gerar link" : "Salvar roleta"}
              </button>

              <Link
                href="/"
                className="rounded-full border border-white/10 bg-white/5 px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Voltar
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(236,72,153,0.08),rgba(6,182,212,0.10))] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] md:p-8">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/70">
            Prévia
          </div>

          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt="Capa da roleta"
              className="mt-5 h-52 w-full rounded-[28px] object-cover md:h-64"
            />
          ) : null}

          <div className="mt-5">
            <h2 className="text-3xl font-black tracking-[-0.03em]">{title || "Sua roleta"}</h2>
            <p className="mt-3 text-base leading-8 text-white/75">
              {description || "A descrição da roleta vai aparecer aqui."}
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <WheelPreview options={validOptions} />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.32em] text-white/45">Opções</div>
              <div className="mt-2 text-2xl font-black">{validOptions.length}</div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.32em] text-white/45">Tempo</div>
              <div className="mt-2 text-2xl font-black">{spinSeconds}s</div>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.32em] text-white/45">Modo</div>
              <div className="mt-2 text-2xl font-black">{isSendMode ? "Enviar" : "Normal"}</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function CreateWheelPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#050114] px-4 py-8 text-white">
          <div className="mx-auto max-w-3xl rounded-[34px] border border-white/10 bg-white/5 p-8 text-center text-lg">
            Carregando criação da roleta...
          </div>
        </main>
      }
    >
      <CreateWheelPageInner />
    </Suspense>
  );
}
