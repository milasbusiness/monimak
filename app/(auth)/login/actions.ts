'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema } from '@/lib/validations'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const raw = {
    email: (formData.get('email') as string)?.trim().toLowerCase(),
    password: formData.get('password') as string,
  }

  const result = loginSchema.safeParse(raw)
  if (!result.success) {
    const msg = result.error.issues[0]?.message || 'Invalid input'
    redirect(`/login?error=${encodeURIComponent(msg)}`)
  }

  const { email, password } = result.data

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // Get user's profile to determine role-based redirect
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'creator' || profile?.role === 'admin') {
      redirect('/admin')
    }
  }

  redirect('/home')
}
