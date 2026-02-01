'use server'

import { query } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function toggleLike(postId: string) {
  const result = await query('SELECT likes_count FROM posts WHERE id = $1', [postId])
  const post = result.rows[0]

  if (!post) {
    throw new Error('Post not found')
  }

  await query(
    'UPDATE posts SET likes_count = $1 WHERE id = $2',
    [(post.likes_count || 0) + 1, postId]
  )

  revalidatePath('/home')
}

export async function toggleSave(postId: string) {
  // Simplified - no auth, so we can't track per-user saves
  revalidatePath('/home')
  revalidatePath('/library')
}

export async function toggleSubscription(creatorId: string) {
  // Simplified - no auth, so we can't track per-user subscriptions
  revalidatePath('/discover')
  revalidatePath('/library')
  revalidatePath('/home')
}
