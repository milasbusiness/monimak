import { createClient } from '@/lib/supabase/server'
import { requireCreator } from '@/lib/guards/admin'
import { AdminDashboardClient } from './admin-client'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  try {
    const { creator } = await requireCreator()
    const supabase = await createClient()

    // Fetch recent posts for this creator
    const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .eq('creator_id', creator.id)
      .order('created_at', { ascending: false })
      .limit(5)

    // Get subscriber count for this creator
    const { count: subscriberCount } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', creator.id)
      .eq('status', 'active')

    // Get total post count
    const { count: postCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('creator_id', creator.id)

    // Get message thread count
    const { count: messageCount } = await supabase
      .from('message_thread_participants')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', creator.user_id)

    // Calculate revenue from subscriptions
    const { data: subs } = await supabase
      .from('subscriptions')
      .select('price_at_time')
      .eq('creator_id', creator.id)
      .eq('status', 'active')

    const totalRevenue = (subs || []).reduce(
      (sum, s) => sum + (Number(s.price_at_time) || 0),
      0
    )

    const stats = {
      totalRevenue,
      subscribers: subscriberCount || 0,
      posts: postCount || 0,
      messages: messageCount || 0,
    }

    return <AdminDashboardClient stats={stats} recentPosts={posts || []} />
  } catch (error) {
    console.error('Error fetching admin data:', error)
    return (
      <AdminDashboardClient
        stats={{ totalRevenue: 0, subscribers: 0, posts: 0, messages: 0 }}
        recentPosts={[]}
      />
    )
  }
}
