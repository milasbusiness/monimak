import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChatClient } from './chat-client'

export const dynamic = 'force-dynamic'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch threads where user is a participant
  const { data: participations } = await supabase
    .from('message_thread_participants')
    .select('thread_id, last_read_at')
    .eq('user_id', user.id)

  const threadIds = (participations || []).map(p => p.thread_id)

  let threads: any[] = []
  let allMessages: any[] = []

  if (threadIds.length > 0) {
    // Get all participants for these threads to find the "other" person
    const { data: allParticipants } = await supabase
      .from('message_thread_participants')
      .select('thread_id, user_id, profiles(id, name, avatar_url)')
      .in('thread_id', threadIds)

    // Get latest message for each thread
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .in('thread_id', threadIds)
      .order('created_at', { ascending: true })

    allMessages = messages || []

    // Build thread objects
    threads = threadIds.map(threadId => {
      const participants = (allParticipants || []).filter(p => p.thread_id === threadId)
      const otherParticipant = participants.find(p => p.user_id !== user.id)
      const threadMessages = allMessages.filter(m => m.thread_id === threadId)
      const lastMessage = threadMessages[threadMessages.length - 1]

      const myParticipation = participations?.find(p => p.thread_id === threadId)
      const unreadCount = threadMessages.filter(
        m => m.sender_id !== user.id &&
             (!myParticipation?.last_read_at || new Date(m.created_at) > new Date(myParticipation.last_read_at))
      ).length

      return {
        id: threadId,
        participantId: otherParticipant?.user_id || '',
        participantName: otherParticipant?.profiles?.name || 'Unknown',
        participantAvatar: otherParticipant?.profiles?.avatar_url || undefined,
        lastMessage: lastMessage?.content || '',
        lastMessageAt: lastMessage?.created_at || new Date().toISOString(),
        unread: unreadCount,
      }
    }).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())
  }

  const formattedMessages = allMessages.map(m => ({
    id: m.id,
    threadId: m.thread_id,
    senderId: m.sender_id,
    content: m.content,
    createdAt: m.created_at,
  }))

  return (
    <ChatClient
      threads={threads}
      messages={formattedMessages}
      currentUserId={user.id}
    />
  )
}
