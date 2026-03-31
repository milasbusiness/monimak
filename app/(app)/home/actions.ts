'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function toggleLike(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check if already liked
  const { data: existing } = await supabase
    .from('post_likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single()

  if (existing) {
    await supabase.from('post_likes').delete().eq('id', existing.id)
  } else {
    await supabase.from('post_likes').insert({ user_id: user.id, post_id: postId })
  }

  revalidatePath('/home')
}

export async function toggleSave(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: existing } = await supabase
    .from('saved_posts')
    .select('id')
    .eq('user_id', user.id)
    .eq('post_id', postId)
    .single()

  if (existing) {
    await supabase.from('saved_posts').delete().eq('id', existing.id)
  } else {
    await supabase.from('saved_posts').insert({ user_id: user.id, post_id: postId })
  }

  revalidatePath('/home')
  revalidatePath('/library')
}

export async function toggleSubscription(creatorId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: existing } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', user.id)
    .eq('creator_id', creatorId)
    .single()

  if (existing) {
    await supabase.from('subscriptions').delete().eq('id', existing.id)
  } else {
    // Get creator's current subscription price
    const { data: creator } = await supabase
      .from('creators')
      .select('subscription_price')
      .eq('id', creatorId)
      .single()

    await supabase.from('subscriptions').insert({
      user_id: user.id,
      creator_id: creatorId,
      status: 'active',
      price_at_time: creator?.subscription_price ?? 0,
    })
  }

  revalidatePath('/discover')
  revalidatePath('/library')
  revalidatePath('/home')
}
