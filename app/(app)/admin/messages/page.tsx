import { createClient } from '@/lib/supabase/server'
import { requireCreator } from '@/lib/guards/admin'
import { AdminMessagesClient } from './messages-client'

export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
  const { creator } = await requireCreator()
  const supabase = await createClient()

  // Fetch quick reply templates for this creator
  const { data: templates } = await supabase
    .from('quick_reply_templates')
    .select('*')
    .eq('creator_id', creator.id)
    .order('created_at', { ascending: false })

  // Get message thread count
  const { count: threadCount } = await supabase
    .from('message_thread_participants')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', creator.user_id)

  return (
    <AdminMessagesClient
      templates={templates || []}
      creatorId={creator.id}
      threadCount={threadCount || 0}
    />
  )
}
