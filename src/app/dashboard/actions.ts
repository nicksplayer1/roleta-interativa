"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugifyPortfolioName } from "@/lib/portfolio-utils";

async function generateUniqueSlug(name: string) {
  const supabase = await createClient();
  const baseSlug = slugifyPortfolioName(name);
  let slug = baseSlug || `portfolio-${Date.now()}`;

  for (let i = 0; i < 50; i++) {
    const { data } = await supabase
      .from("portfolios")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) return slug;
    slug = `${baseSlug}-${i + 2}`;
  }

  return `${baseSlug}-${Date.now()}`;
}

export async function deletePortfolioAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") || "");

  await supabase.from("portfolios").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/dashboard");
}

export async function duplicatePortfolioAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") || "");

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!portfolio) {
    revalidatePath("/dashboard");
    return;
  }

  const newName = `${portfolio.name} Cópia`;
  const slug = await generateUniqueSlug(newName);

  await supabase.from("portfolios").insert({
    user_id: user.id,
    slug,
    name: newName,
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
