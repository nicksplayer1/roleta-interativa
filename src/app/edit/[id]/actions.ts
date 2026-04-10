"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugifyInviteTitle } from "@/lib/invite-utils";

function asString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

async function generateUniqueSlug(title: string, currentInviteId: string) {
  const supabase = await createClient();
  const baseSlug = slugifyInviteTitle(title) || "convite";
  let slug = baseSlug;
  let count = 1;

  while (true) {
    const { data } = await supabase
      .from("invites")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!data || data.id === currentInviteId) return slug;

    count += 1;
    slug = `${baseSlug}-${count}`;
  }
}

export async function updateInviteAction(formData: FormData) {
  const supabase = await createClient();
  const id = asString(formData, "id");

  if (!id) redirect("/dashboard?error=Convite inválido");

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) redirect("/login");

  const title = asString(formData, "title");
  if (!title) redirect(`/edit/${id}?error=Digite o título do convite`);

  const slug = await generateUniqueSlug(title, id);

  const payload = {
    slug,
    title,
    host_name: asString(formData, "host_name"),
    event_type: asString(formData, "event_type"),
    description: asString(formData, "description"),
    event_date: asString(formData, "event_date") || null,
    event_time: asString(formData, "event_time") || null,
    location_name: asString(formData, "location_name"),
    location_address: asString(formData, "location_address"),
    map_link: asString(formData, "map_link"),
    cover_image_url: asString(formData, "cover_image_url"),
    theme: asString(formData, "theme") || "elegante",
    rsvp_link: asString(formData, "rsvp_link"),
    gift_link: asString(formData, "gift_link"),
    dress_code: asString(formData, "dress_code"),
    is_public: formData.get("is_public") === "on",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("invites")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    redirect(`/edit/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  revalidatePath(`/invite/${slug}`);
  redirect(`/invite/${slug}`);
}
