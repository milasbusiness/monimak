'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { quickReplySchema } from '@/lib/validations'

export async function addQuickReply(creatorId: string, name: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const result = quickReplySchema.safeParse({ name, content })
  if (!result.success) return

  const { name: trimmedName, content: trimmedContent } = result.data

  await supabase.from('quick_reply_templates').insert({
    creator_id: creatorId,
    name: trimmedName,
    content: trimmedContent,
  })

  revalidatePath('/admin/messages')
}

export async function deleteQuickReply(templateId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase.from('quick_reply_templates').delete().eq('id', templateId)

  revalidatePath('/admin/messages')
}
