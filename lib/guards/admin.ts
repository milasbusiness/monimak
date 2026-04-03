import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile }
}

export async function requireCreator() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'creator' && profile?.role !== 'admin') {
    redirect('/home')
  }

  let { data: creator } = await supabase
    .from('creators')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Auto-create creator row if missing (can happen when email confirmation
  // was required during signup and the RLS-blocked insert silently failed)
  if (!creator) {
    const username = user.email!.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_')
    const { data: newCreator, error: createError } = await supabase
      .from('creators')
      .insert({
        user_id: user.id,
        username,
        bio: '',
        subscription_price: 9.99,
      })
      .select()
      .single()

    if (createError || !newCreator) {
      redirect('/home')
    }

    creator = newCreator
  }

  return { user, profile, creator }
}

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/home')
  }

  return { user, profile }
}
