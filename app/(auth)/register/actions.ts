'use server'

import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  // Auth removed - just redirect to home
  redirect('/home')
}
