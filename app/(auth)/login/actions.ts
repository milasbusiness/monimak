'use server'

import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  // Auth removed - just redirect to home
  redirect('/home')
}
