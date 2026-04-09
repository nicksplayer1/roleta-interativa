"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugifyPortfolioName } from "@/lib/portfolio-utils";

async function generateDuplicateSlug(name: string) {
  const supabase = await createClient();
  const baseSlug = `${slugifyPortfolioName(name) || "portfolio"}-copy`;

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

export async function deletePortfolio(formData: FormData) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/login");
  }

  const id = String(formData.get("id") || "");
  if (!id) return;

  await supabase
    .from("portfolios")
    .delete()
    .eq("id", id)
    .eq("user_id", authData.user.id);

  revalidatePath("/dashboard");
}

export async function duplicatePortfolio(formData: FormData) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    redirect("/login");
  }

  const id = String(formData.get("id") || "");
  if (!id) return;

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("*")
    .eq("id", id)
    .eq("user_id", authData.user.id)
    .single();

  if (!portfolio) return;

  const newSlug = await generateDuplicateSlug(portfolio.name);

  await supabase.from("portfolios").insert({
    user_id: authData.user.id,
    slug: newSlug,
    name: portfolio.name,
    title: portfolio.title,
    bio: portfolio.bio,
    city: portfolio.city,
    email: portfolio.email,
    whatsapp: portfolio.whatsapp,
    linkedin: portfolio.linkedin,
    github: portfolio.github,
    website: portfolio.website,
    photo_url: portfolio.photo_url,
    projects: portfolio.projects,
    skills: portfolio.skills,
    is_public: portfolio.is_public,
  });

  revalidatePath("/dashboard");
}
