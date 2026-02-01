import { requireCreator } from '@/lib/guards/admin'
import { AdminMessagesClient } from './messages-client'

export default async function AdminMessagesPage() {
  await requireCreator()
  return <AdminMessagesClient />
}
