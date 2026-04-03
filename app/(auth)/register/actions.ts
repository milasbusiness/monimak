'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { registerSchema } from '@/lib/validations'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const raw = {
    name: (formData.get('name') as string)?.trim(),
    email: (formData.get('email') as string)?.trim().toLowerCase(),
    password: formData.get('password') as string,
    isCreator: formData.get('isCreator') === 'on',
  }

  const result = registerSchema.safeParse(raw)
  if (!result.success) {
    const msg = result.error.issues[0]?.message || 'Invalid input'
    redirect(`/register?error=${encodeURIComponent(msg)}`)
  }

  const { name, email, password, isCreator } = result.data

  const role = isCreator ? 'creator' : 'user'

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      },
    },
  })

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`)
  }

  // If signing up as creator, create the creator profile row.
  // Note: when email confirmation is required, no session exists yet so
  // auth.uid() is null and this insert may fail due to RLS.
  // requireCreator() handles auto-creation on first login as a fallback.
  if (isCreator && data.user && data.session) {
    const username = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_')

    const { error: creatorError } = await supabase.from('creators').insert({
      user_id: data.user.id,
      username,
      bio: '',
      subscription_price: 9.99,
    })

    if (creatorError) {
      console.error('Failed to create creator row during signup:', creatorError)
    }
  }

  redirect('/login?message=Check your email to confirm your account')
}
