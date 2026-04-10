"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

export async function deleteInviteAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  await supabase.from("invites").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function duplicateInviteAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: invite } = await supabase
    .from("invites")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!invite) return;

  const duplicateTitle = `${invite.title} - cópia`;
  const slug = await generateUniqueSlug(duplicateTitle);

  const { id: _discardId, created_at: _createdAt, updated_at: _updatedAt, ...rest } = invite;

  await supabase.from("invites").insert({
    ...rest,
    user_id: user.id,
    title: duplicateTitle,
    slug,
  });

  revalidatePath("/dashboard");
}
