import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureUrl, splitLines } from "@/lib/portfolio-utils";

type Props = {
  params: Promise<{ slug: string }>;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-zinc-200 px-6 py-8 sm:px-10 sm:py-10">
      <h2 className="text-3xl font-bold tracking-tight text-zinc-950">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={ensureUrl(href)}
      target="_blank"
      rel="noreferrer"
      className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
    >
      {label}
    </a>
  );
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle();

  if (!portfolio) {
    notFound();
  }

  const projects = splitLines(portfolio.projects);
  const skills = splitLines(portfolio.skills);

  return (
    <main className="min-h-screen bg-[#f6f4f1] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-zinc-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
        <section className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 flex-1 flex-col gap-6 sm:flex-row">
              <div className="h-28 w-28 shrink-0 overflow-hidden rounded-[1.75rem] bg-zinc-100">
                {portfolio.photo_url ? (
                  <img
                    src={ensureUrl(portfolio.photo_url)}
                    alt={portfolio.name}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                  portfólio online
                </p>

                <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight text-zinc-950 sm:text-5xl">
                  {portfolio.name}
                </h1>

                {portfolio.title ? (
                  <p className="mt-3 text-xl text-zinc-600">{portfolio.title}</p>
                ) : null}

                {portfolio.bio ? (
                  <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-600">
                    {portfolio.bio}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-2xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
              >
                Ir ao dashboard
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {portfolio.email ? (
              <div className="rounded-3xl bg-zinc-50 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Email</p>
                <p className="mt-3 break-words text-sm text-zinc-900">{portfolio.email}</p>
              </div>
            ) : null}

            {portfolio.whatsapp ? (
              <div className="rounded-3xl bg-zinc-50 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">WhatsApp</p>
                <p className="mt-3 break-words text-sm text-zinc-900">{portfolio.whatsapp}</p>
              </div>
            ) : null}

            {portfolio.city ? (
              <div className="rounded-3xl bg-zinc-50 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Cidade</p>
                <p className="mt-3 break-words text-sm text-zinc-900">{portfolio.city}</p>
              </div>
            ) : null}

            {(portfolio.website || portfolio.linkedin || portfolio.github) ? (
              <div className="rounded-3xl bg-zinc-50 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">Links</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {portfolio.website ? <ExternalLink href={portfolio.website} label="Site" /> : null}
                  {portfolio.linkedin ? <ExternalLink href={portfolio.linkedin} label="LinkedIn" /> : null}
                  {portfolio.github ? <ExternalLink href={portfolio.github} label="GitHub" /> : null}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {projects.length ? (
          <Section title="Projetos">
            <div className="grid gap-4">
              {projects.map((project) => (
                <div
                  key={project}
                  className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 text-zinc-800"
                >
                  {project}
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {skills.length ? (
          <Section title="Habilidades">
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>
        ) : null}
      </div>
    </main>
  );
}
