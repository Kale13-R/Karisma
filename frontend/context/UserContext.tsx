'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User, AccountAuthResponse } from '@/types'

interface UserContextValue {
  user: User | null
  loading: boolean
  register: (email: string, password: string) => Promise<AccountAuthResponse>
  login: (email: string, password: string) => Promise<AccountAuthResponse>
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/accounts/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then((data: AccountAuthResponse | null) => {
        if (data?.success && data.user) setUser(data.user)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const register = async (email: string, password: string): Promise<AccountAuthResponse> => {
    const res = await fetch('/api/accounts/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    const data: AccountAuthResponse = await res.json()
    if (data.success && data.user) setUser(data.user)
    return data
  }

  const login = async (email: string, password: string): Promise<AccountAuthResponse> => {
    const res = await fetch('/api/accounts/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    const data: AccountAuthResponse = await res.json()
    if (data.success && data.user) setUser(data.user)
    return data
  }

  const logout = async () => {
    await fetch('/api/accounts/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
