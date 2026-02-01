import { createClient } from '@/lib/supabase/server'
import { HomeClient } from './home-client'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <HomeClient posts={[]} isLoading={false} />
  }

  // Fetch posts from subscribed creators (RLS will filter based on subscriptions)
  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      creators (
        *,
        profiles (*)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching posts:', error)
    return <HomeClient posts={[]} isLoading={false} />
  }

  return <HomeClient posts={posts || []} isLoading={false} />
}
