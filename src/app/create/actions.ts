"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

export async function createPortfolioAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const name = String(formData.get("name") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const bio = String(formData.get("bio") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const whatsapp = String(formData.get("whatsapp") || "").trim();
  const linkedin = String(formData.get("linkedin") || "").trim();
  const github = String(formData.get("github") || "").trim();
  const website = String(formData.get("website") || "").trim();
  const photo_url = String(formData.get("photo_url") || "").trim();
  const projects = String(formData.get("projects") || "").trim();
  const skills = String(formData.get("skills") || "").trim();
  const is_public = formData.get("is_public") === "on";

  if (!name) {
    redirect("/create?error=Digite%20seu%20nome");
  }

  const slug = await generateUniqueSlug(name);

  const { error } = await supabase.from("portfolios").insert({
    user_id: user.id,
    slug,
    name,
    title,
    bio,
    city,
    email,
    whatsapp,
    linkedin,
    github,
    website,
    photo_url,
    projects,
    skills,
    is_public,
  });

  if (error) {
    redirect(`/create?error=${encodeURIComponent("Não foi possível criar o portfólio")}`);
  }

  revalidatePath("/dashboard");
  redirect(`/portfolio/${slug}`);
}
