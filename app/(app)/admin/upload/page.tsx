import { requireCreator } from '@/lib/guards/admin'
import { AdminUploadClient } from './upload-client'

export default async function AdminUploadPage() {
  await requireCreator()
  return <AdminUploadClient />
}
