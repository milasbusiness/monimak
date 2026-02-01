import { createClient } from '@/lib/supabase/server'
import { LibraryClient } from './library-client'

export default async function LibraryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <LibraryClient subscriptions={[]} savedPosts={[]} />
  }

  // Fetch user's subscriptions
  const { data: subscriptions, error: subError } = await supabase
    .from('subscriptions')
    .select(`
      creator_id,
      creators (
        *,
        profiles (*)
      )
    `)
    .eq('user_id', user.id)

  // Fetch user's saved posts
  const { data: savedPosts, error: savedError } = await supabase
    .from('saved_posts')
    .select(`
      post_id,
      posts (
        *,
        creators (
          *,
          profiles (*)
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const subscriptionsData = subscriptions?.map(s => s.creators).filter(Boolean) || []
  const savedPostsData = savedPosts?.map(sp => sp.posts).filter(Boolean) || []

  return (
    <LibraryClient
      subscriptions={subscriptionsData as any}
      savedPosts={savedPostsData as any}
    />
  )
}
