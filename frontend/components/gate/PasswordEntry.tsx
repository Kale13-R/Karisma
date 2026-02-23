'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { post } from '@/lib/api'
import type { GateAuthResponse } from '@/types'

export default function PasswordEntry() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await post<GateAuthResponse>('/auth/gate', { password })
      if (res.success) {
        router.push('/')
      } else {
        setError(res.error ?? 'Invalid password')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        disabled={loading}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Verifying...' : 'Enter'}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  )
}
