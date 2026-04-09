"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  normalizeText,
  slugifyPortfolioName,
} from "@/lib/portfolio-utils";

async function generateUniqueSlug(name: string) {
  const supabase = await createClient();
  const baseSlug = slugifyPortfolioName(name) || "portfolio";

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data } = await supabase
      .from("portfolios")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) return slug;

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function createPortfolio(formData: FormData) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/login?error=Faça login para criar seu portfólio.");
  }

  const name = normalizeText(formData.get("name"));
  const title = normalizeText(formData.get("title"));
  const bio = normalizeText(formData.get("bio"));
  const city = normalizeText(formData.get("city"));
  const email = normalizeText(formData.get("email"));
  const whatsapp = normalizeText(formData.get("whatsapp"));
  const linkedin = normalizeText(formData.get("linkedin"));
  const github = normalizeText(formData.get("github"));
  const website = normalizeText(formData.get("website"));
  const photoUrl = normalizeText(formData.get("photo_url"));
  const projects = normalizeText(formData.get("projects"));
  const skills = normalizeText(formData.get("skills"));
  const isPublic = formData.get("is_public") === "on";

  if (!name) {
    redirect("/create?error=Preencha o nome.");
  }

  const slug = await generateUniqueSlug(name);

  const { error } = await supabase.from("portfolios").insert({
    user_id: authData.user.id,
    slug,
    name,
    title: title || null,
    bio: bio || null,
    city: city || null,
    email: email || null,
    whatsapp: whatsapp || null,
    linkedin: linkedin || null,
    github: github || null,
    website: website || null,
    photo_url: photoUrl || null,
    projects: projects || null,
    skills: skills || null,
    is_public: isPublic,
  });

  if (error) {
    redirect(`/create?error=${encodeURIComponent("Não foi possível criar o portfólio.")}`);
  }

  redirect(`/portfolio/${slug}`);
}
