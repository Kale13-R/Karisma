'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { GateAuthResponse } from '@/types'

type Step = 'email' | 'transitioning' | 'password'

export default function PasswordEntry() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailClass, setEmailClass] = useState('gate-fade-in')
  const [passwordClass, setPasswordClass] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Auto-focus password input once it flies in
  useEffect(() => {
    if (step === 'password') {
      const t = setTimeout(() => {
        document.getElementById('gate-password')?.focus()
      }, 300)
      return () => clearTimeout(t)
    }
  }, [step])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email to continue.')
      return
    }

    // Step 1: fade email out
    setEmailClass('gate-fade-out')
    setStep('transitioning')

    // Step 2: after email fades, fly password up
    setTimeout(() => {
      setStep('password')
      setPasswordClass('gate-fly-up')
    }, 320)
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
        setError(data.error || 'Invalid password.')
        return
      }

      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Access denied.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.35)',
    color: '#fff',
    fontSize: '16px',
    letterSpacing: '0.12em',
    padding: '12px 0',
    outline: 'none',
    textAlign: 'center',
    fontFamily: 'inherit',
    caretColor: '#fff',
  }

  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    background: 'none',
    border: '1px solid rgba(255,255,255,0.35)',
    color: disabled ? 'rgba(255,255,255,0.3)' : '#fff',
    padding: '11px 44px',
    fontSize: '10px',
    letterSpacing: '0.35em',
    cursor: disabled ? 'default' : 'pointer',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, color 0.2s',
    marginTop: '8px',
  })

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        padding: '24px',
        position: 'relative',
      }}
    >
      {/* Brand */}
      <p
        className="gate-fade-in"
        style={{
          fontSize: '11px',
          letterSpacing: '0.5em',
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          marginBottom: '56px',
          userSelect: 'none',
        }}
      >
        KARISMA
      </p>

      {/* Email step */}
      {(step === 'email' || step === 'transitioning') && (
        <form
          onSubmit={handleEmailSubmit}
          className={emailClass}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '28px',
            width: '100%',
            maxWidth: '300px',
            position: step === 'transitioning' ? 'absolute' : 'relative',
          }}
        >
          <input
            id="gate-email"
            name="email"
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError(null) }}
            placeholder="EMAIL"
            autoFocus
            autoComplete="email"
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={!email}
            style={btnStyle(!email)}
          >
            CONTINUE
          </button>
        </form>
      )}

      {/* Password step — flies up from below */}
      {step === 'password' && (
        <form
          onSubmit={handlePasswordSubmit}
          className={passwordClass}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '28px',
            width: '100%',
            maxWidth: '300px',
          }}
        >
          <input
            id="gate-password"
            name="password"
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(null) }}
            placeholder="PASSWORD"
            autoComplete="current-password"
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={loading || !password}
            style={btnStyle(loading || !password)}
          >
            {loading ? '—' : 'ENTER'}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep('email')
              setEmailClass('gate-fade-in')
              setPasswordClass('')
              setError(null)
              setPassword('')
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.3)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              fontFamily: 'inherit',
              marginTop: '-12px',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            back
          </button>
        </form>
      )}

      {/* Error */}
      {error && (
        <p
          style={{
            marginTop: '28px',
            fontSize: '10px',
            letterSpacing: '0.18em',
            color: 'rgba(255, 120, 120, 0.9)',
            textTransform: 'uppercase',
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
}
