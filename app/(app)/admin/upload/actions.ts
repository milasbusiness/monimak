'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createPostSchema } from '@/lib/validations'

export async function createPost(formData: FormData) {
  const supabase = await createClient()

  // Verify authenticated creator
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: creator } = await supabase
    .from('creators')
    .select('id, post_count')
    .eq('user_id', user.id)
    .single()

  if (!creator) {
    throw new Error('Creator profile not found')
  }

  const raw = {
    type: formData.get('type'),
    mediaUrl: formData.get('mediaUrl'),
    thumbnailUrl: formData.get('thumbnailUrl') || null,
    caption: (formData.get('caption') as string)?.trim(),
    tags: JSON.parse(formData.get('tags') as string || '[]'),
    visibility: formData.get('visibility'),
  }

  const result = createPostSchema.safeParse(raw)
  if (!result.success) {
    throw new Error(result.error.issues[0]?.message || 'Invalid input')
  }

  const { type, mediaUrl, thumbnailUrl, caption, tags, visibility } = result.data

  const { error } = await supabase
    .from('posts')
    .insert({
      creator_id: creator.id,
      type,
      media_url: mediaUrl,
      thumbnail_url: thumbnailUrl || null,
      caption,
      tags,
      visibility,
    })

  if (error) {
    throw new Error(`Failed to create post: ${error.message}`)
  }

  // Increment post count
  await supabase
    .from('creators')
    .update({ post_count: (creator.post_count || 0) + 1 })
    .eq('id', creator.id)

  revalidatePath('/admin')
  revalidatePath('/home')
  redirect('/admin')
}
