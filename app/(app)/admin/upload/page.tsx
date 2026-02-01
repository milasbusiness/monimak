import { requireCreator } from '@/lib/guards/admin'
import { AdminUploadClient } from './upload-client'

// Force dynamic rendering since this page requires authentication
export const dynamic = 'force-dynamic'

export default async function AdminUploadPage() {
  await requireCreator()
  return <AdminUploadClient />
}
