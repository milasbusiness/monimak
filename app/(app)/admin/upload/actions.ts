'use server'

import { query } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const type = formData.get('type') as 'image' | 'video'
  const mediaUrl = formData.get('mediaUrl') as string
  const thumbnailUrl = formData.get('thumbnailUrl') as string | null
  const caption = formData.get('caption') as string
  const tags = JSON.parse(formData.get('tags') as string || '[]') as string[]
  const visibility = formData.get('visibility') as 'public' | 'subscribers'

  // Get first creator (simplified - no auth)
  const creatorResult = await query('SELECT id, post_count FROM creators LIMIT 1')
  const creator = creatorResult.rows[0]

  if (!creator) {
    throw new Error('No creator found')
  }

  await query(
    `INSERT INTO posts (creator_id, type, media_url, thumbnail_url, caption, tags, visibility)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [creator.id, type, mediaUrl, thumbnailUrl, caption, JSON.stringify(tags), visibility]
  )

  // Increment post count
  await query(
    'UPDATE creators SET post_count = $1 WHERE id = $2',
    [(creator.post_count || 0) + 1, creator.id]
  )

  revalidatePath('/admin')
  revalidatePath('/home')
  redirect('/admin')
}
