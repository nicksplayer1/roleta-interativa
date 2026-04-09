import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CopyLinkButton from "@/components/dashboard/copy-link-button";
import { ensureUrl, splitLines } from "@/lib/portfolio-utils";

type Props = {
  params: Promise<{ slug: string }>;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-zinc-200 px-6 py-8 sm:px-10 sm:py-10">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-11 items-center justify-center rounded-2xl border border-zinc-300 px-4 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
    >
      {label}
    </a>
  );
}

export default async function PortfolioPublicPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!portfolio) {
    notFound();
  }

  const projects = splitLines(portfolio.projects);
  const skills = splitLines(portfolio.skills);
  const currentUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/portfolio/${portfolio.slug}`;

  const socialItems = [
    portfolio.linkedin ? { label: "LinkedIn", href: ensureUrl(portfolio.linkedin) } : null,
    portfolio.github ? { label: "GitHub", href: ensureUrl(portfolio.github) } : null,
    portfolio.website ? { label: "Site", href: ensureUrl(portfolio.website) } : null,
    portfolio.email ? { label: "Email", href: `mailto:${portfolio.email}` } : null,
    portfolio.whatsapp
      ? { label: "WhatsApp", href: `https://wa.me/${portfolio.whatsapp.replace(/\D/g, "")}` }
      : null,
  ].filter(Boolean) as Array<{ label: string; href: string }>;

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 sm:px-6 sm:py-10 print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-zinc-200 bg-white shadow-sm print:max-w-full print:rounded-none print:border-0 print:shadow-none">
        <section className="px-6 py-8 sm:px-10 sm:py-10 print:px-8 print:py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between print:hidden">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Portfólio público
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
                {portfolio.name}
              </h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-zinc-300 px-5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
              >
                Ir ao dashboard
              </Link>
              <CopyLinkButton url={currentUrl} />
            </div>
          </div>

          <div className="mt-2 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] print:mt-0 print:grid-cols-[1.25fr_0.75fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                Portfólio instantâneo
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-[0.95] tracking-tight text-zinc-950 sm:text-6xl print:text-4xl">
                {portfolio.name}
              </h2>
              {portfolio.title ? (
                <p className="mt-5 text-lg text-zinc-600 sm:text-2xl print:text-lg">
                  {portfolio.title}
                </p>
              ) : null}

              {portfolio.bio ? (
                <p className="mt-6 max-w-3xl text-sm leading-7 text-zinc-700 sm:text-base print:max-w-none print:text-sm print:leading-6">
                  {portfolio.bio}
                </p>
              ) : null}

              {socialItems.length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-3 print:hidden">
                  {socialItems.map((item) => (
                    <SocialLink key={item.label} href={item.href} label={item.label} />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-[28px] border border-zinc-200 bg-zinc-50 p-5 print:rounded-[20px] print:bg-white">
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white print:h-16 print:w-16">
                  {portfolio.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ensureUrl(portfolio.photo_url)}
                      alt={portfolio.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.25em] text-zinc-400">
                      Foto
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                    Contato
                  </p>
                  <div className="mt-3 space-y-2 text-sm text-zinc-700">
                    {portfolio.email ? <p><span className="font-medium text-zinc-950">Email:</span> {portfolio.email}</p> : null}
                    {portfolio.whatsapp ? <p><span className="font-medium text-zinc-950">WhatsApp:</span> {portfolio.whatsapp}</p> : null}
                    {portfolio.city ? <p><span className="font-medium text-zinc-950">Cidade:</span> {portfolio.city}</p> : null}
                    {portfolio.website ? (
                      <p>
                        <span className="font-medium text-zinc-950">Site:</span>{" "}
                        <a
                          href={ensureUrl(portfolio.website)}
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-4"
                        >
                          {portfolio.website}
                        </a>
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {projects.length > 0 ? (
          <Section title="Projetos em destaque">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {projects.map((project, index) => (
                <div
                  key={`${project}-${index}`}
                  className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                    Projeto {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-3 text-base leading-7 text-zinc-800">{project}</p>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {skills.length > 0 ? (
          <Section title="Habilidades">
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-800"
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
