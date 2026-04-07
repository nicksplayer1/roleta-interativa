import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureUrl, splitLines } from "@/lib/resume-utils";
import DownloadPdfButton from "@/components/resume/download-pdf-button";

type Props = {
  params: Promise<{ slug: string }>;
};

type ResumeRecord = {
  id: string;
  slug: string;
  is_public: boolean | null;
  name: string;
  role: string | null;
  summary: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  linkedin: string | null;
  portfolio: string | null;
  experience: string | null;
  education: string | null;
  skills: string | null;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-zinc-200 px-6 py-8 sm:px-10">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">{title}</h2>
      <div className="mt-4 text-zinc-700">{children}</div>
    </section>
  );
}

export default async function ResumePublicPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: resume, error } = await supabase
    .from("resumes")
    .select(
      "id, slug, is_public, name, role, summary, phone, email, city, linkedin, portfolio, experience, education, skills"
    )
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle<ResumeRecord>();

  if (error || !resume) {
    notFound();
  }

  const experienceItems = splitLines(resume.experience);
  const educationItems = splitLines(resume.education);
  const skillsItems = splitLines(resume.skills);

  const linkedinUrl = ensureUrl(resume.linkedin);
  const portfolioUrl = ensureUrl(resume.portfolio);

  const hasContactInfo =
    resume.email || resume.phone || resume.city || linkedinUrl || portfolioUrl;

  return (
    <main className="min-h-screen bg-zinc-100 px-3 py-4 sm:px-6 sm:py-8 print:bg-white print:px-0 print:py-0">
      <article className="resume-sheet mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm print:max-w-none print:rounded-none print:border-0 print:shadow-none">
        <header className="px-6 py-8 sm:px-10 sm:py-10 print:px-8 print:py-8">
          <div className="no-print mb-8 flex flex-wrap items-center justify-end gap-3 print:hidden">
            <Link
              href="/dashboard"
              className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50"
            >
              Ir ao dashboard
            </Link>
            <DownloadPdfButton />
          </div>

          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
            Currículo online
          </p>

          <div className="mt-4 grid gap-6 sm:grid-cols-[1.4fr_0.8fr] sm:items-start">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl print:text-4xl">
                {resume.name}
              </h1>
              {resume.role ? (
                <p className="mt-3 text-xl text-zinc-600 print:text-lg">{resume.role}</p>
              ) : null}
            </div>

            {hasContactInfo ? (
              <div className="rounded-2xl bg-zinc-50 p-5 text-sm text-zinc-700 print:border print:border-zinc-200 print:bg-white">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                  Contato
                </p>
                <div className="space-y-2">
                  {resume.email ? (
                    <p>
                      <span className="font-medium text-zinc-950">Email:</span> {resume.email}
                    </p>
                  ) : null}
                  {resume.phone ? (
                    <p>
                      <span className="font-medium text-zinc-950">Telefone:</span> {resume.phone}
                    </p>
                  ) : null}
                  {resume.city ? (
                    <p>
                      <span className="font-medium text-zinc-950">Cidade:</span> {resume.city}
                    </p>
                  ) : null}
                  {linkedinUrl ? (
                    <p>
                      <span className="font-medium text-zinc-950">LinkedIn:</span>{" "}
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="break-all text-zinc-700 underline underline-offset-4 hover:text-zinc-950"
                      >
                        {resume.linkedin}
                      </a>
                    </p>
                  ) : null}
                  {portfolioUrl ? (
                    <p>
                      <span className="font-medium text-zinc-950">Portfólio:</span>{" "}
                      <a
                        href={portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="break-all text-zinc-700 underline underline-offset-4 hover:text-zinc-950"
                      >
                        {resume.portfolio}
                      </a>
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </header>

        {resume.summary ? (
          <Section title="Resumo">
            <p className="whitespace-pre-line text-[17px] leading-8 text-zinc-700">
              {resume.summary}
            </p>
          </Section>
        ) : null}

        {experienceItems.length > 0 ? (
          <Section title="Experiência">
            <ul className="space-y-3">
              {experienceItems.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="rounded-2xl bg-zinc-50 px-4 py-4 text-[16px] leading-7 text-zinc-800"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {educationItems.length > 0 ? (
          <Section title="Formação">
            <ul className="space-y-3">
              {educationItems.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="rounded-2xl bg-zinc-50 px-4 py-4 text-[16px] leading-7 text-zinc-800"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {skillsItems.length > 0 ? (
          <Section title="Habilidades">
            <div className="flex flex-wrap gap-3">
              {skillsItems.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="rounded-full border border-zinc-300 bg-zinc-950 px-4 py-2 text-sm font-medium text-white print:bg-white print:text-zinc-900"
                >
                  {item}
                </span>
              ))}
            </div>
          </Section>
        ) : null}
      </article>
    </main>
  );
}
