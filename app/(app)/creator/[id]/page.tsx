import { createClient } from '@/lib/supabase/server'
import { CreatorProfileClient } from './creator-profile-client'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CreatorProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch creator with profile
  const { data: creator } = await supabase
    .from('creators')
    .select('*, profiles(*)')
    .eq('id', params.id)
    .single()

  if (!creator) {
    notFound()
  }

  // Fetch creator's posts
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('creator_id', params.id)
    .order('created_at', { ascending: false })

  // Check if current user is subscribed
  let isSubscribed = false
  let likedPostIds: string[] = []
  let savedPostIds: string[] = []

  if (user) {
    const [subResult, likesResult, savesResult] = await Promise.all([
      supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .eq('creator_id', params.id)
        .eq('status', 'active')
        .single(),
      supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user.id),
      supabase
        .from('saved_posts')
        .select('post_id')
        .eq('user_id', user.id),
    ])

    isSubscribed = !!subResult.data
    likedPostIds = (likesResult.data || []).map(l => l.post_id)
    savedPostIds = (savesResult.data || []).map(s => s.post_id)
  }

  // Convert to component format
  const creatorData = {
    id: creator.id,
    name: creator.profiles.name,
    username: creator.username,
    avatar: creator.profiles.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.profiles.name)}`,
    banner: creator.banner_url || undefined,
    bio: creator.bio || '',
    subscriberCount: creator.subscriber_count || 0,
    postCount: creator.post_count || 0,
    subscriptionPrice: Number(creator.subscription_price) || 0,
    isVerified: creator.is_verified || false,
    tags: creator.tags || [],
  }

  const postsData = (posts || []).map(post => ({
    id: post.id,
    creatorId: post.creator_id,
    type: post.type as 'image' | 'video',
    mediaUrl: post.media_url,
    thumbnailUrl: post.thumbnail_url || undefined,
    caption: post.caption || '',
    tags: post.tags || [],
    visibility: post.visibility as 'public' | 'subscribers',
    isLocked: post.visibility === 'subscribers',
    likes: post.likes_count || 0,
    comments: post.comments_count || 0,
    createdAt: new Date(post.created_at || 0),
  }))

  return (
    <CreatorProfileClient
      creator={creatorData}
      posts={postsData}
      isSubscribed={isSubscribed}
      likedPostIds={likedPostIds}
      savedPostIds={savedPostIds}
    />
  )
}
