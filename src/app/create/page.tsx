import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createPortfolio } from "./actions";

type Props = {
  searchParams?: Promise<{ error?: string }>;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-sm font-medium text-zinc-800">
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="min-h-[120px] w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500"
    />
  );
}

export default async function CreatePage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  const params = (await searchParams) ?? {};

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              Portfólio instantâneo
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
              Criar novo portfólio
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base">
              Monte uma página pessoal bonita para compartilhar seus projetos,
              links, bio e habilidades em poucos minutos.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-300 px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
          >
            Voltar ao dashboard
          </Link>
        </div>

        <form action={createPortfolio} className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          {params.error ? (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {params.error}
            </div>
          ) : null}

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-semibold text-zinc-950">Identidade</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Essas informações aparecem no topo da sua página pública.
                </p>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <FieldLabel>Nome completo *</FieldLabel>
                    <Input name="name" placeholder="Ex.: Ana Souza" required />
                  </div>

                  <div className="sm:col-span-2">
                    <FieldLabel>Título profissional</FieldLabel>
                    <Input
                      name="title"
                      placeholder="Ex.: Designer de Produto, Desenvolvedor Front-end"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FieldLabel>Bio</FieldLabel>
                    <Textarea
                      name="bio"
                      placeholder="Escreva uma apresentação curta sobre você, sua especialidade e o tipo de projeto que desenvolve."
                    />
                  </div>

                  <div>
                    <FieldLabel>Cidade</FieldLabel>
                    <Input name="city" placeholder="Ex.: São Paulo, SP" />
                  </div>

                  <div>
                    <FieldLabel>Foto (URL)</FieldLabel>
                    <Input
                      name="photo_url"
                      placeholder="https://seusite.com/foto.jpg"
                    />
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-zinc-950">Contato e links</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Coloque apenas os canais que quer exibir.
                </p>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel>Email</FieldLabel>
                    <Input name="email" type="email" placeholder="voce@email.com" />
                  </div>

                  <div>
                    <FieldLabel>WhatsApp</FieldLabel>
                    <Input name="whatsapp" placeholder="Ex.: 64992606140" />
                  </div>

                  <div>
                    <FieldLabel>LinkedIn</FieldLabel>
                    <Input name="linkedin" placeholder="linkedin.com/in/seu-link" />
                  </div>

                  <div>
                    <FieldLabel>GitHub</FieldLabel>
                    <Input name="github" placeholder="github.com/seu-usuario" />
                  </div>

                  <div className="sm:col-span-2">
                    <FieldLabel>Site / portfólio externo</FieldLabel>
                    <Input name="website" placeholder="seusite.com" />
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-semibold text-zinc-950">Conteúdo</h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Separe projetos e habilidades por linha para ficar mais bonito.
                </p>

                <div className="mt-5 space-y-5">
                  <div>
                    <FieldLabel>Projetos</FieldLabel>
                    <Textarea
                      name="projects"
                      placeholder={"Landing page para clínica\nDashboard de analytics\nLoja virtual com checkout"}
                    />
                  </div>

                  <div>
                    <FieldLabel>Habilidades</FieldLabel>
                    <Textarea
                      name="skills"
                      placeholder={"UI Design\nUX Research\nReact\nNext.js"}
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-950">
                      Visibilidade pública
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-zinc-600">
                      Deixe ligado para que sua página possa ser aberta pelo link.
                    </p>
                  </div>

                  <label className="inline-flex items-center gap-3 text-sm font-medium text-zinc-800">
                    <input
                      type="checkbox"
                      name="is_public"
                      defaultChecked
                      className="h-4 w-4 rounded border-zinc-300"
                    />
                    Público
                  </label>
                </div>
              </section>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-300 px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-zinc-950 px-6 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Criar portfólio
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
