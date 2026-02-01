import { createClient } from '@/lib/supabase/server'
import { DiscoverClient } from './discover-client'

export default async function DiscoverPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch all creators
  const { data: creators, error } = await supabase
    .from('creators')
    .select(`
      *,
      profiles (*)
    `)
    .order('subscriber_count', { ascending: false })

  if (error) {
    console.error('Error fetching creators:', error)
    return <DiscoverClient creators={[]} />
  }

  // Fetch user's subscriptions if logged in
  let userSubscriptions: string[] = []
  if (user) {
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('creator_id')
      .eq('user_id', user.id)
    
    userSubscriptions = subscriptions?.map(s => s.creator_id) || []
  }

  return <DiscoverClient creators={creators || []} userSubscriptions={userSubscriptions} />
}
