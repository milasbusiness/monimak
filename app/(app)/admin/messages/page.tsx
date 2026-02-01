import { requireCreator } from '@/lib/guards/admin'
import { AdminMessagesClient } from './messages-client'

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic'

export default async function AdminMessagesPage() {
  await requireCreator()
  return <AdminMessagesClient />
}
