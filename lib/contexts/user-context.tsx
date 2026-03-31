'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser } from '@supabase/supabase-js'

type Profile = {
  id: string
  email: string
  name: string
  avatar_url: string | null
  role: 'user' | 'creator' | 'admin'
  created_at: string
  updated_at: string
}

type UserContextType = {
  user: SupabaseUser | null
  profile: Profile | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
})

function getSupabaseClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null
  }
  return createClient()
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = getSupabaseClient()

  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setProfile(data as Profile | null)
  }, [supabase])

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (user) {
          await fetchProfile(user.id)
        }
      } catch {
        // Supabase client not available
      }
      setIsLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) {
          await fetchProfile(currentUser.id)
        } else {
          setProfile(null)
        }
        setIsLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile])

  const signOut = async () => {
    await fetch('/auth/signout', { method: 'POST' })
    setUser(null)
    setProfile(null)
  }

  return (
    <UserContext.Provider value={{ user, profile, isLoading, signOut }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
