'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { post } from '@/lib/api'
import type { GateAuthResponse, GatePasswordPayload } from '@/types'

export default function PasswordEntry() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await post<GateAuthResponse>('/auth/gate', {
        password,
      } as GatePasswordPayload)

      if (response.success) {
        router.push('/')
      } else {
        setError(response.error || 'Access denied.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Access denied.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        color: 'var(--fg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        padding: '24px',
      }}
    >
      <p
        style={{
          fontSize: '11px',
          letterSpacing: '0.45em',
          color: 'var(--fg-muted)',
          textTransform: 'uppercase',
          marginBottom: '48px',
        }}
      >
        KARISMA
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          width: '100%',
          maxWidth: '320px',
        }}
      >
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="enter password"
          autoFocus
          style={{
            width: '100%',
            background: 'none',
            border: 'none',
            borderBottom: '1px solid var(--border)',
            color: 'var(--fg)',
            fontSize: '14px',
            letterSpacing: '0.1em',
            padding: '10px 0',
            outline: 'none',
            textAlign: 'center',
            fontFamily: 'inherit',
          }}
        />

        <button
          type="submit"
          disabled={loading || !password}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            color: loading || !password ? 'var(--fg-muted)' : 'var(--fg)',
            padding: '10px 40px',
            fontSize: '10px',
            letterSpacing: '0.3em',
            cursor: loading || !password ? 'default' : 'pointer',
            fontFamily: 'inherit',
            transition: 'border-color 0.15s, color 0.15s',
          }}
        >
          {loading ? '...' : 'ENTER'}
        </button>
      </form>

      {error && (
        <p
          style={{
            marginTop: '24px',
            fontSize: '10px',
            letterSpacing: '0.15em',
            color: '#ff4444',
            textTransform: 'uppercase',
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
}
