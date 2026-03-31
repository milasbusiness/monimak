'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { messageSchema } from '@/lib/validations'

export async function sendMessage(threadId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const result = messageSchema.safeParse({ content })
  if (!result.success) return

  const trimmed = result.data.content

  await supabase.from('messages').insert({
    thread_id: threadId,
    sender_id: user.id,
    content: trimmed,
  })

  revalidatePath('/chat')
}

export async function markThreadRead(threadId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('message_thread_participants')
    .update({ last_read_at: new Date().toISOString() })
    .eq('thread_id', threadId)
    .eq('user_id', user.id)

  revalidatePath('/chat')
}
