import { createClient } from './client'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm']

const BUCKET_LIMITS: Record<string, { maxSize: number; allowedTypes: string[] }> = {
  avatars: { maxSize: 5 * 1024 * 1024, allowedTypes: ALLOWED_IMAGE_TYPES },
  banners: { maxSize: 10 * 1024 * 1024, allowedTypes: ALLOWED_IMAGE_TYPES },
  'post-media': {
    maxSize: 100 * 1024 * 1024,
    allowedTypes: [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES],
  },
}

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
}

export async function uploadFile(
  bucket: string,
  folder: string,
  file: File
): Promise<{ url: string; path: string }> {
  const limits = BUCKET_LIMITS[bucket]
  if (!limits) {
    throw new Error(`Unknown bucket: ${bucket}`)
  }

  if (file.size > limits.maxSize) {
    const maxMB = Math.round(limits.maxSize / (1024 * 1024))
    throw new Error(`File too large. Maximum size is ${maxMB}MB`)
  }

  if (!limits.allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed for ${bucket}`)
  }

  const timestamp = Date.now()
  const safeName = sanitizeFilename(file.name)
  const path = `${folder}/${timestamp}-${safeName}`

  const supabase = createClient()

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: urlData, error: urlError } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60) // 1 hour expiry

  if (urlError || !urlData?.signedUrl) {
    throw new Error('Failed to generate signed URL')
  }

  return { url: urlData.signedUrl, path }
}

export async function getSignedUrl(bucket: string, path: string): Promise<string> {
  const supabase = createClient()
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 60) // 1 hour expiry

  if (error || !data?.signedUrl) {
    throw new Error('Failed to generate signed URL')
  }

  return data.signedUrl
}
