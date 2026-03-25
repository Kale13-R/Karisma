'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { GateAuthResponse } from '@/types'

type Step = 'email' | 'transitioning' | 'password'

const LockClosed = () => (
  <svg width="16" height="20" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="11" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="11" cy="18" r="1.5" fill="currentColor" />
  </svg>
)

const LockOpen = () => (
  <svg width="16" height="20" viewBox="0 0 22 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="11" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 11V7a5 5 0 0 1 10 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="11" cy="18" r="1.5" fill="currentColor" />
  </svg>
)

export default function PasswordEntry() {
  const [step, setStep]             = useState<Step>('email')
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [emailClass, setEmailClass] = useState('gate-fade-in')
  const [pwClass, setPwClass]       = useState('')
  const [error, setError]           = useState<string | null>(null)
  const [loading, setLoading]       = useState(false)
  const router = useRouter()

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  useEffect(() => {
    if (step === 'password') {
      const t = setTimeout(() => document.getElementById('gate-password')?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [step])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!emailValid) { setError('Enter a valid email to continue.'); return }
    setEmailClass('gate-fade-out')
    setStep('transitioning')
    setTimeout(() => { setStep('password'); setPwClass('gate-fade-in') }, 300)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/gate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })
      const data: GateAuthResponse = await res.json()
      if (!res.ok || !data.success) { setError(data.error || 'Invalid password.'); return }
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Access denied.')
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    setStep('email')
    setEmailClass('gate-fade-in')
    setPwClass('')
    setError(null)
    setPassword('')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'none',
    border: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.3)',
    color: '#fff',
    fontSize: '16px',
    letterSpacing: '0.12em',
    padding: '12px 0',
    outline: 'none',
    textAlign: 'center',
    fontFamily: 'inherit',
    caretColor: '#fff',
  }

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
      }}
    >
      {/* Brand */}
      <p
        className="gate-fade-in"
        style={{
          fontSize: '11px',
          letterSpacing: '0.5em',
          color: 'rgba(255,255,255,0.45)',
          textTransform: 'uppercase',
          marginBottom: '52px',
          userSelect: 'none',
        }}
      >
        KARISMA
      </p>

      {/* ── EMAIL STEP ── */}
      {(step === 'email' || step === 'transitioning') && (
        <div
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
          <form
            onSubmit={handleEmailSubmit}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', width: '100%' }}
          >
            <input
              id="gate-email"
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
              disabled={!emailValid}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.3)',
                color: emailValid ? '#fff' : 'rgba(255,255,255,0.25)',
                padding: '11px 44px',
                fontSize: '10px',
                letterSpacing: '0.35em',
                cursor: emailValid ? 'pointer' : 'default',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s, color 0.2s',
              }}
            >
              CONTINUE
            </button>
          </form>

          {/* Lock icon + label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '4px',
              color: emailValid ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.18)',
              transition: 'color 0.4s ease',
            }}
          >
            {emailValid ? <LockOpen /> : <LockClosed />}
            <span style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              Drop Password
            </span>
          </div>
        </div>
      )}

      {/* ── PASSWORD STEP ── */}
      {step === 'password' && (
        <div
          className={pwClass}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '28px',
            width: '100%',
            maxWidth: '300px',
          }}
        >
          <form
            onSubmit={handlePasswordSubmit}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '28px', width: '100%' }}
          >
            <input
              id="gate-password"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(null) }}
              placeholder="PASSWORD"
              autoComplete="current-password"
              style={inputStyle}
            />

            {/* ← back and ENTER on the same row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={goBack}
                aria-label="Back to email"
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.45)',
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s, color 0.2s',
                  flexShrink: 0,
                }}
              >
                ←
              </button>
              <button
                type="submit"
                disabled={loading || !password}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: (loading || !password) ? 'rgba(255,255,255,0.25)' : '#fff',
                  padding: '11px 44px',
                  fontSize: '10px',
                  letterSpacing: '0.35em',
                  cursor: (loading || !password) ? 'default' : 'pointer',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.2s, color 0.2s',
                }}
              >
                {loading ? '—' : 'ENTER'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{
          marginTop: '28px',
          fontSize: '10px',
          letterSpacing: '0.18em',
          color: 'rgba(255,110,110,0.9)',
          textTransform: 'uppercase',
        }}>
          {error}
        </p>
      )}
    </div>
  )
}
