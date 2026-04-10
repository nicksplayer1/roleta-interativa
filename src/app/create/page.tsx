import Link from "next/link";
import { createInviteAction } from "./actions";
import CoverUploadField from "@/components/invite/cover-upload-field";

const inputClassName =
  "w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400";
const textareaClassName = () =>
  `${inputClassName} min-h-[140px] resize-y`;

type Props = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function CreateInvitePage({ searchParams }: Props) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Convite interativo
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">
                Criar novo convite
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
                Monte uma página linda para compartilhar data, local, capa e confirmação de presença do evento.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Voltar ao dashboard
            </Link>
          </div>
        </section>

        {resolvedSearchParams?.error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {resolvedSearchParams.error}
          </div>
        ) : null}

        <form action={createInviteAction} className="grid gap-6">
          <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Identidade</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Essas informações aparecem no topo da página do convite.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Título do convite *
                  </label>
                  <input
                    name="title"
                    className={inputClassName}
                    placeholder="Ex.: Casamento de Ana e Lucas"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Nome do anfitrião
                  </label>
                  <input
                    name="host_name"
                    className={inputClassName}
                    placeholder="Ex.: Família Souza"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Tipo de evento
                  </label>
                  <input
                    name="event_type"
                    className={inputClassName}
                    placeholder="Ex.: aniversário, casamento, chá de bebê"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Descrição
                  </label>
                  <textarea
                    name="description"
                    className={textareaClassName()}
                    placeholder="Escreva um texto curto convidando as pessoas para esse momento especial."
                  />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Capa</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Você pode enviar uma imagem ou colar um link direto.
                  </p>
                </div>

                <CoverUploadField name="cover_image_url" initialValue="" label="Imagem de capa" />

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">Tema</label>
                  <select name="theme" defaultValue="elegante" className={inputClassName}>
                    <option value="elegante">Elegante</option>
                    <option value="romantico">Romântico</option>
                    <option value="moderno">Moderno</option>
                    <option value="infantil">Infantil</option>
                  </select>
                </div>

                <label className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
                  <input
                    type="checkbox"
                    name="is_public"
                    defaultChecked
                    className="h-4 w-4 rounded border-zinc-300"
                  />
                  Deixar este convite público por link
                </label>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                    Data e local
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Essas informações ficam em destaque na página pública.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-800">Data</label>
                    <input type="date" name="event_date" className={inputClassName} />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-zinc-800">Hora</label>
                    <input type="time" name="event_time" className={inputClassName} />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Nome do local
                  </label>
                  <input
                    name="location_name"
                    className={inputClassName}
                    placeholder="Ex.: Espaço Jardim Azul"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Endereço
                  </label>
                  <textarea
                    name="location_address"
                    className={textareaClassName()}
                    placeholder="Rua, número, bairro, cidade"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Link do mapa
                  </label>
                  <input
                    name="map_link"
                    className={inputClassName}
                    placeholder="Link do Google Maps"
                  />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
                    Links extras
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Confirmação de presença, lista de presentes e observações.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Link para confirmar presença
                  </label>
                  <input
                    name="rsvp_link"
                    className={inputClassName}
                    placeholder="Link do WhatsApp, formulário ou site"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Link da lista de presentes
                  </label>
                  <input
                    name="gift_link"
                    className={inputClassName}
                    placeholder="Opcional"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-800">
                    Traje / observação
                  </label>
                  <textarea
                    name="dress_code"
                    className={textareaClassName()}
                    placeholder="Ex.: branco e bege / traje esporte fino / evento infantil"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <Link
                href="/dashboard"
                className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Criar convite
              </button>
            </div>
          </section>
        </form>
      </div>
    </main>
  );
}
