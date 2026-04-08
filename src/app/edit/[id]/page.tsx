import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePortfolioAction } from "./actions";

type Props = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
};

function inputClassName() {
  return "w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500";
}

function textareaClassName() {
  return "min-h-[140px] w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-500";
}

export default async function EditPortfolioPage({ params, searchParams }: Props) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!portfolio) {
    notFound();
  }

  const query = await searchParams;
  const error = query?.error;

  return (
    <main className="min-h-screen bg-[#f6f4f1] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:p-8">
        <div className="flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
              editar portfólio
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">
              Editar portfólio
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              Atualize seus dados, projetos, links e apresentação visual.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-2xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
          >
            Voltar ao dashboard
          </Link>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form action={updatePortfolioAction} className="mt-8 space-y-8">
          <input type="hidden" name="id" value={portfolio.id} />

          <section className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-900">
                Nome completo *
              </label>
              <input
                name="name"
                type="text"
                required
                defaultValue={portfolio.name ?? ""}
                className={inputClassName()}
                placeholder="Seu nome"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-900">
                Título profissional
              </label>
              <input
                name="title"
                type="text"
                defaultValue={portfolio.title ?? ""}
                className={inputClassName()}
                placeholder="Designer, desenvolvedor, social media..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-900">Bio</label>
              <textarea
                name="bio"
                defaultValue={portfolio.bio ?? ""}
                className={textareaClassName()}
                placeholder="Descreva quem você é, no que trabalha e o que entrega."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900">Cidade</label>
              <input
                name="city"
                type="text"
                defaultValue={portfolio.city ?? ""}
                className={inputClassName()}
                placeholder="Sua cidade"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900">Email</label>
              <input
                name="email"
                type="email"
                defaultValue={portfolio.email ?? ""}
                className={inputClassName()}
                placeholder="voce@email.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900">WhatsApp</label>
              <input
                name="whatsapp"
                type="text"
                defaultValue={portfolio.whatsapp ?? ""}
                className={inputClassName()}
                placeholder="(64) 99999-9999"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900">Foto (URL)</label>
              <input
                name="photo_url"
                type="text"
                defaultValue={portfolio.photo_url ?? ""}
                className={inputClassName()}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900">LinkedIn</label>
              <input
                name="linkedin"
                type="text"
                defaultValue={portfolio.linkedin ?? ""}
                className={inputClassName()}
                placeholder="linkedin.com/in/seu-link"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900">GitHub</label>
              <input
                name="github"
                type="text"
                defaultValue={portfolio.github ?? ""}
                className={inputClassName()}
                placeholder="github.com/seuusuario"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900">Site</label>
              <input
                name="website"
                type="text"
                defaultValue={portfolio.website ?? ""}
                className={inputClassName()}
                placeholder="seusite.com"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-900">
                Projetos
              </label>
              <textarea
                name="projects"
                defaultValue={portfolio.projects ?? ""}
                className={textareaClassName()}
                placeholder={"Um projeto por linha\nLanding page para X\nApp para Y\nLoja virtual para Z"}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-900">
                Habilidades
              </label>
              <textarea
                name="skills"
                defaultValue={portfolio.skills ?? ""}
                className={textareaClassName()}
                placeholder={"Uma habilidade por linha\nUI Design\nNext.js\nCopywriting"}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <label className="flex items-center gap-3 text-sm font-medium text-zinc-900">
              <input
                name="is_public"
                type="checkbox"
                defaultChecked={portfolio.is_public ?? true}
                className="h-4 w-4 rounded border-zinc-300"
              />
              Deixar portfólio público
            </label>
          </section>

          <div className="flex flex-wrap justify-end gap-3 border-t border-zinc-200 pt-6">
            <Link
              href="/dashboard"
              className="rounded-2xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
