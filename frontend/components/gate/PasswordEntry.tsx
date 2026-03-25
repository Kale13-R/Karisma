'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { GateAuthResponse } from '@/types'

export default function PasswordEntry() {
  const [step, setStep] = useState<'email' | 'password'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setStep('password')
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/auth/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data: GateAuthResponse = await response.json()

      if (!response.ok || !data.success) {
        setError(data.error || 'Invalid password')
        return
      }

      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Access denied.')
    } finally {
      setLoading(false)
    }
  }

  const sharedInputStyle: React.CSSProperties = {
    width: '100%',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.4)',
    color: '#fff',
    fontSize: '16px',
    letterSpacing: '0.1em',
    padding: '10px 0',
    outline: 'none',
    textAlign: 'center',
    fontFamily: 'inherit',
  }

  const sharedBtnStyle = (disabled: boolean): React.CSSProperties => ({
    background: 'none',
    border: '1px solid rgba(255,255,255,0.4)',
    color: disabled ? 'rgba(255,255,255,0.4)' : '#fff',
    padding: '10px 40px',
    fontSize: '10px',
    letterSpacing: '0.3em',
    cursor: disabled ? 'default' : 'pointer',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s, color 0.15s',
  })

  return (
    <div
      style={{
        minHeight: '100vh',
        color: '#fff',
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
          color: 'rgba(255,255,255,0.6)',
          textTransform: 'uppercase',
          marginBottom: '48px',
        }}
      >
        KARISMA
      </p>

      {step === 'email' ? (
        <form
          onSubmit={handleEmailSubmit}
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
            id="gate-email"
            name="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="enter email"
            autoFocus
            style={sharedInputStyle}
          />
          <button
            type="submit"
            disabled={!email}
            style={sharedBtnStyle(!email)}
          >
            CONTINUE
          </button>
        </form>
      ) : (
        <form
          onSubmit={handlePasswordSubmit}
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
            id="gate-password"
            name="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="enter password"
            autoFocus
            style={sharedInputStyle}
          />
          <button
            type="submit"
            disabled={loading || !password}
            style={sharedBtnStyle(loading || !password)}
          >
            {loading ? '...' : 'ENTER'}
          </button>
          <button
            type="button"
            onClick={() => { setStep('email'); setError(null) }}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.35)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              fontFamily: 'inherit',
              marginTop: '-8px',
              textDecoration: 'underline',
            }}
          >
            back
          </button>
        </form>
      )}

      {error && (
        <p
          style={{
            marginTop: '24px',
            fontSize: '10px',
            letterSpacing: '0.15em',
            color: '#ff6666',
            textTransform: 'uppercase',
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
}
