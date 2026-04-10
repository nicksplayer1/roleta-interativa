import { notFound, redirect } from "next/navigation";
import PremiumWheelEditor from "@/components/wheel/premium-wheel-editor";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditWheelPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: wheel } = await supabase
    .from("wheels")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!wheel) {
    notFound();
  }

  return <PremiumWheelEditor mode="edit" initialData={wheel} />;
}
