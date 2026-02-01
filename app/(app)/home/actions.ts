'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleLike(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Get current likes count
  const { data: post } = await supabase
    .from('posts')
    .select('likes_count')
    .eq('id', postId)
    .single()

  if (!post) {
    throw new Error('Post not found')
  }

  // Increment likes (in a real app, you'd want a likes table)
  const { error } = await supabase
    .from('posts')
    .update({ likes_count: (post.likes_count || 0) + 1 })
    .eq('id', postId)

  if (error) throw error

  revalidatePath('/home')
}

export async function toggleSave(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Check if already saved
  const { data: existing } = await supabase
    .from('saved_posts')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single()

  if (existing) {
    // Remove from saved
    const { error } = await supabase
      .from('saved_posts')
      .delete()
      .eq('id', existing.id)
    
    if (error) throw error
  } else {
    // Add to saved
    const { error } = await supabase
      .from('saved_posts')
      .insert({
        user_id: user.id,
        post_id: postId,
      })
    
    if (error) throw error
  }

  revalidatePath('/home')
  revalidatePath('/library')
}

export async function toggleSubscription(creatorId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  // Get creator's user_id
  const { data: creator } = await supabase
    .from('creators')
    .select('user_id')
    .eq('id', creatorId)
    .single()

  if (!creator) {
    throw new Error('Creator not found')
  }

  // Check if already subscribed
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', user.id)
    .eq('creator_id', creatorId)
    .single()

  if (existing) {
    // Unsubscribe
    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', existing.id)
    
    if (error) throw error

    // Decrement subscriber count
    await supabase.rpc('decrement', {
      table_name: 'creators',
      column_name: 'subscriber_count',
      id: creatorId,
    })
  } else {
    // Subscribe
    const { error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        creator_id: creatorId,
      })
    
    if (error) throw error

    // Increment subscriber count
    await supabase.rpc('increment', {
      table_name: 'creators',
      column_name: 'subscriber_count',
      id: creatorId,
    })
  }

  revalidatePath('/discover')
  revalidatePath('/library')
  revalidatePath('/home')
}
