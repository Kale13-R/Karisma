'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'

type Tab = 'login' | 'register'

export default function AccountPage() {
  const { user, loading, login, register, logout } = useUser()
  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const res = tab === 'login'
        ? await login(email, password)
        : await register(email, password)
      if (!res.success) {
        setError(res.error || 'Something went wrong')
      } else {
        router.push('/')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/gate')
  }

  if (loading) return null

  const baseStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: 'var(--bg)',
    color: 'var(--fg)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
    fontFamily: "'Courier New', Courier, monospace",
  }

  // ── Logged in view ──────────────────────────────────────────
  if (user) {
    return (
      <div style={baseStyle}>
        <p style={{ fontSize: '10px', letterSpacing: '0.4em', color: 'var(--fg-muted)', marginBottom: '8px' }}>
          ACCOUNT
        </p>
        <h1 style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '0.1em', marginBottom: '4px' }}>
          {user.email.toUpperCase()}
        </h1>
        <p style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'var(--fg-muted)', marginBottom: '48px' }}>
          MEMBER SINCE {user.created_at}
        </p>

        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            color: 'var(--fg-muted)',
            padding: '10px 32px',
            fontSize: '10px',
            letterSpacing: '0.2em',
            cursor: 'pointer',
          }}
        >
          SIGN OUT
        </button>
      </div>
    )
  }

  // ── Auth form ────────────────────────────────────────────────
  return (
    <div style={baseStyle}>
      <p style={{ fontSize: '10px', letterSpacing: '0.4em', color: 'var(--fg-muted)', marginBottom: '40px' }}>
        KARISMA
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '32px', marginBottom: '40px' }}>
        {(['login', 'register'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(null) }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '11px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              color: tab === t ? 'var(--fg)' : 'var(--fg-muted)',
              borderBottom: tab === t ? '1px solid var(--fg)' : '1px solid transparent',
              paddingBottom: '6px',
            }}
          >
            {t === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '320px' }}
      >
        <input
          type="email"
          placeholder="EMAIL"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            background: 'none',
            border: 'none',
            borderBottom: '1px solid var(--border)',
            color: 'var(--fg)',
            fontSize: '12px',
            letterSpacing: '0.1em',
            padding: '10px 0',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <input
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={8}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: '1px solid var(--border)',
            color: 'var(--fg)',
            fontSize: '12px',
            letterSpacing: '0.1em',
            padding: '10px 0',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />

        {error && (
          <p style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#ff6666', margin: 0 }}>
            {error.toUpperCase()}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            background: 'none',
            border: '1px solid var(--fg)',
            color: submitting ? 'var(--fg-muted)' : 'var(--fg)',
            padding: '12px 0',
            fontSize: '10px',
            letterSpacing: '0.25em',
            cursor: submitting ? 'default' : 'pointer',
            fontFamily: 'inherit',
            marginTop: '8px',
          }}
        >
          {submitting ? '...' : tab === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
        </button>
      </form>
    </div>
  )
}
