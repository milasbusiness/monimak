import { createClient } from '@/lib/supabase/server'
import { DiscoverClient } from './discover-client'

export const dynamic = 'force-dynamic'

export default async function DiscoverPage() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: creators } = await supabase
      .from('creators')
      .select('*, profiles(*)')
      .order('subscriber_count', { ascending: false })

    let userSubscriptions: string[] = []
    if (user) {
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('creator_id')
        .eq('user_id', user.id)
        .eq('status', 'active')

      userSubscriptions = (subs || []).map(s => s.creator_id)
    }

    return <DiscoverClient creators={creators || []} userSubscriptions={userSubscriptions} />
  } catch (error) {
    console.error('Error fetching creators:', error)
    return <DiscoverClient creators={[]} userSubscriptions={[]} />
  }
}
