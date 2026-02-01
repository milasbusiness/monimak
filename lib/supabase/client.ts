import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseConfig } from '@/lib/utils'

export function createClient() {
  const { url, anonKey } = getSupabaseConfig()
  return createBrowserClient(url, anonKey)
}
