import type { Database } from './database.types'
import type { Creator, Post } from './types'

type DbCreator = Database['public']['Tables']['creators']['Row'] & {
  profiles: Database['public']['Tables']['profiles']['Row']
}

type DbPost = Database['public']['Tables']['posts']['Row']

export function convertCreator(creator: DbCreator): Creator {
  return {
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
}

export function convertPost(post: DbPost): Post {
  return {
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
  }
}
