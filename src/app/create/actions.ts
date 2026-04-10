"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugifyInviteTitle } from "@/lib/invite-utils";

async function generateUniqueSlug(title: string) {
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

    if (!data) return slug;

    count += 1;
    slug = `${baseSlug}-${count}`;
  }
}

function asString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createInviteAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const title = asString(formData, "title");
  if (!title) {
    redirect("/create?error=Digite o título do convite");
  }

  const slug = await generateUniqueSlug(title);

  const payload = {
    user_id: user.id,
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
  };

  const { error } = await supabase.from("invites").insert(payload);

  if (error) {
    redirect(`/create?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  redirect(`/invite/${slug}`);
}
