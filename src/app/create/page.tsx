import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createInviteAction } from "./actions";
import CoverUploadField from "@/components/invite/cover-upload-field";

function inputClassName() {
  return "w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500";
}

function textareaClassName() {
  return "min-h-[140px] w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500";
}

type Props = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function CreatePage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const params = searchParams ? await searchParams : undefined;
  const error = params?.error;

  return (
    <main className="min-h-screen bg-zinc-50 px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Convite interativo</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                Criar novo convite
              </h1>
              <p className="mt-4 text-lg leading-8 text-zinc-600">
                Monte uma página bonita para compartilhar data, local, capa e confirmação de presença em poucos minutos.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-300 px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Voltar ao dashboard
            </Link>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form action={createInviteAction} className="space-y-6">
          <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-semibold text-zinc-950">Informações do evento</h2>
              <p className="mt-2 text-sm leading-7 text-zinc-600">
                Essas informações aparecem no topo da página pública.
              </p>

              <div className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-900">Título do evento *</label>
                  <input name="title" className={inputClassName()} placeholder="Ex.: Aniversário da Maria" required />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-900">Nome do anfitrião</label>
                    <input name="host_name" className={inputClassName()} placeholder="Ex.: Família Souza" />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-900">Tipo de evento</label>
                    <input name="event_type" className={inputClassName()} placeholder="Ex.: Casamento, aniversário, chá" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-900">Descrição</label>
                  <textarea name="description" className={textareaClassName()} placeholder="Escreva uma mensagem curta e bonita para o convite." />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-900">Data do evento</label>
                    <input name="event_date" type="date" className={inputClassName()} />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-900">Horário</label>
                    <input name="event_time" type="time" className={inputClassName()} />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-900">Local</label>
                  <input name="location_name" className={inputClassName()} placeholder="Ex.: Salão Jardim Imperial" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-900">Endereço</label>
                  <input name="location_address" className={inputClassName()} placeholder="Rua, número, bairro e cidade" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-900">Link do mapa</label>
                  <input name="map_link" className={inputClassName()} placeholder="Cole o link do Google Maps" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <section className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold text-zinc-950">Visual do convite</h2>
                <p className="mt-2 text-sm leading-7 text-zinc-600">
                  Escolha a capa e o estilo principal do convite.
                </p>

                <div className="mt-8 space-y-5">
                  <CoverUploadField inputName="cover_image_url" />

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-900">Tema visual</label>
                    <select name="theme" className={inputClassName()} defaultValue="elegante">
                      <option value="elegante">Elegante</option>
                      <option value="romantico">Romântico</option>
                      <option value="infantil">Infantil</option>
                      <option value="minimalista">Minimalista</option>
                      <option value="festa">Festa</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-900">Dress code</label>
                    <input name="dress_code" className={inputClassName()} placeholder="Ex.: Esporte fino, branco, casual" />
                  </div>
                </div>
              </section>

              <section className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="text-2xl font-semibold text-zinc-950">Botões úteis</h2>
                <p className="mt-2 text-sm leading-7 text-zinc-600">
                  Opcionalmente adicione confirmação de presença e lista de presentes.
                </p>

                <div className="mt-8 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-900">Link para confirmar presença</label>
                    <input name="rsvp_link" className={inputClassName()} placeholder="Ex.: WhatsApp, formulário ou página externa" />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-900">Lista de presentes / presente online</label>
                    <input name="gift_link" className={inputClassName()} placeholder="Ex.: link da lista ou presente digital" />
                  </div>
                </div>
              </section>
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-end gap-3 rounded-[32px] border border-zinc-200 bg-white p-5 shadow-sm">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-300 px-5 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-zinc-950 px-6 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Criar convite
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
