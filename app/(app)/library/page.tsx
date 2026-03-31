import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LibraryClient } from './library-client'

export const dynamic = 'force-dynamic'

export default async function LibraryPage() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // Fetch user's subscriptions with creator info
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('creators(*, profiles(*))')
      .eq('user_id', user.id)
      .eq('status', 'active')

    // Fetch user's saved posts with creator info
    const { data: savedPosts } = await supabase
      .from('saved_posts')
      .select('posts(*, creators(*, profiles(*)))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    // Extract the nested objects
    const creatorsData = (subscriptions || [])
      .map(s => s.creators)
      .filter(Boolean)

    const postsData = (savedPosts || [])
      .map(s => s.posts)
      .filter(Boolean)

    return (
      <LibraryClient
        subscriptions={creatorsData as any[]}
        savedPosts={postsData as any[]}
      />
    )
  } catch (error) {
    console.error('Error fetching library data:', error)
    return <LibraryClient subscriptions={[]} savedPosts={[]} />
  }
}
