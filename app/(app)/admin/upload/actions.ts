'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get creator profile
  const { data: creator } = await supabase
    .from('creators')
    .select('id, post_count')
    .eq('user_id', user.id)
    .single()

  if (!creator) {
    throw new Error('Creator profile not found')
  }

  const type = formData.get('type') as 'image' | 'video'
  const mediaUrl = formData.get('mediaUrl') as string
  const thumbnailUrl = formData.get('thumbnailUrl') as string | null
  const caption = formData.get('caption') as string
  const tags = JSON.parse(formData.get('tags') as string || '[]') as string[]
  const visibility = formData.get('visibility') as 'public' | 'subscribers'

  const { error } = await supabase
    .from('posts')
    .insert({
      creator_id: creator.id,
      type,
      media_url: mediaUrl,
      thumbnail_url: thumbnailUrl,
      caption,
      tags,
      visibility,
    })

  if (error) {
    throw error
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
