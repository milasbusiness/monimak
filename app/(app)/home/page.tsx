import { createClient } from '@/lib/supabase/server'
import { HomeClient } from './home-client'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch posts with creator info
    const { data: posts } = await supabase
      .from('posts')
      .select('*, creators(*, profiles(*))')
      .order('created_at', { ascending: false })
      .limit(50)

    // Fetch user's liked and saved post IDs
    let likedPostIds: string[] = []
    let savedPostIds: string[] = []

    if (user) {
      const [likesResult, savesResult] = await Promise.all([
        supabase.from('post_likes').select('post_id').eq('user_id', user.id),
        supabase.from('saved_posts').select('post_id').eq('user_id', user.id),
      ])

      likedPostIds = (likesResult.data || []).map(l => l.post_id)
      savedPostIds = (savesResult.data || []).map(s => s.post_id)
    }

    return (
      <HomeClient
        posts={posts || []}
        likedPostIds={likedPostIds}
        savedPostIds={savedPostIds}
        isLoading={false}
      />
    )
  } catch (error) {
    console.error('Error fetching posts:', error)
    return <HomeClient posts={[]} likedPostIds={[]} savedPostIds={[]} isLoading={false} />
  }
}
