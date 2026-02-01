'use client'

import { createContext, useContext, useState } from 'react'

type User = {
  id: string
  email: string
  name?: string
}

type Profile = {
  id: string
  role?: string
}

type UserContextType = {
  user: User | null
  profile: Profile | null
  isLoading: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  isLoading: false,
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading] = useState(false)

  return (
    <UserContext.Provider value={{ user, profile, isLoading }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)
