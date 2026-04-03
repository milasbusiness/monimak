import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let initialIsCreator = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    initialIsCreator = profile?.role === "creator" || profile?.role === "admin";
  }

  return <AppShell initialIsCreator={initialIsCreator}>{children}</AppShell>;
}
