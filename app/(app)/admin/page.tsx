import { requireCreator } from "@/lib/guards/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminDashboardClient } from "./admin-client";

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  await requireCreator();
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  // Get creator profile
  const { data: creator } = await supabase
    .from('creators')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!creator) {
    return null;
  }

  // Fetch creator's posts
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('creator_id', creator.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Calculate stats
  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('creator_id')
    .eq('creator_id', creator.id);

  const stats = {
    totalRevenue: (subscriptions?.length || 0) * 9.99, // Simplified calculation
    subscribers: subscriptions?.length || 0,
    posts: posts?.length || 0,
    messages: 0, // Not implemented yet
  };

  return <AdminDashboardClient stats={stats} recentPosts={posts || []} />;
}
