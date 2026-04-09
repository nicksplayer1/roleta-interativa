"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugifyInviteTitle } from "@/lib/invite-utils";

async function generateUniqueSlug(title: string) {
  const supabase = await createClient();
  const baseSlug = slugifyInviteTitle(title) || "convite";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data } = await supabase
      .from("invites")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!data) return slug;

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

export async function createInviteAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const title = String(formData.get("title") || "").trim();
  if (!title) redirect("/create?error=Informe o título do evento");

  const slug = await generateUniqueSlug(title);

  const payload = {
    user_id: user.id,
    slug,
    title,
    host_name: String(formData.get("host_name") || "").trim() || null,
    event_type: String(formData.get("event_type") || "").trim() || null,
    description: String(formData.get("description") || "").trim() || null,
    event_date: String(formData.get("event_date") || "").trim() || null,
    event_time: String(formData.get("event_time") || "").trim() || null,
    location_name: String(formData.get("location_name") || "").trim() || null,
    location_address: String(formData.get("location_address") || "").trim() || null,
    map_link: String(formData.get("map_link") || "").trim() || null,
    cover_image_url: String(formData.get("cover_image_url") || "").trim() || null,
    theme: String(formData.get("theme") || "").trim() || "elegante",
    rsvp_link: String(formData.get("rsvp_link") || "").trim() || null,
    gift_link: String(formData.get("gift_link") || "").trim() || null,
    dress_code: String(formData.get("dress_code") || "").trim() || null,
    is_public: true,
  };

  const { error } = await supabase.from("invites").insert(payload);
  if (error) redirect(`/create?error=${encodeURIComponent("Não foi possível criar o convite")}`);

  redirect(`/invite/${slug}`);
}
