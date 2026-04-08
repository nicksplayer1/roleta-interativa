"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugifyPortfolioName } from "@/lib/portfolio-utils";

async function generateUniqueSlug(name: string, currentPortfolioId: string) {
  const supabase = await createClient();
  const baseSlug = slugifyPortfolioName(name);
  let slug = baseSlug || `portfolio-${Date.now()}`;

  for (let i = 0; i < 50; i++) {
    const { data } = await supabase
      .from("portfolios")
      .select("id")
      .eq("slug", slug)
      .neq("id", currentPortfolioId)
      .maybeSingle();

    if (!data) return slug;
    slug = `${baseSlug}-${i + 2}`;
  }

  return `${baseSlug}-${Date.now()}`;
}

export async function updatePortfolioAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = String(formData.get("id") || "");
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

  if (!id || !name) {
    redirect("/dashboard");
  }

  const slug = await generateUniqueSlug(name, id);

  const { error } = await supabase
    .from("portfolios")
    .update({
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
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    redirect(`/edit/${id}?error=${encodeURIComponent("Não foi possível salvar as alterações")}`);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/portfolio/${slug}`);
  redirect(`/portfolio/${slug}`);
}
