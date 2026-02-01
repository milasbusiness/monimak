import { query } from "@/lib/db";
import { AdminDashboardClient } from "./admin-client";

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  try {
    // Fetch recent posts
    const postsResult = await query(`
      SELECT * FROM posts
      ORDER BY created_at DESC
      LIMIT 5
    `);

    // Calculate stats
    const subscriptionsResult = await query(`
      SELECT COUNT(*) as count FROM subscriptions
    `);

    const stats = {
      totalRevenue: (parseInt(subscriptionsResult.rows[0]?.count || '0')) * 9.99,
      subscribers: parseInt(subscriptionsResult.rows[0]?.count || '0'),
      posts: postsResult.rows.length,
      messages: 0,
    };

    return <AdminDashboardClient stats={stats} recentPosts={postsResult.rows || []} />;
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return <AdminDashboardClient stats={{ totalRevenue: 0, subscribers: 0, posts: 0, messages: 0 }} recentPosts={[]} />;
  }
}
