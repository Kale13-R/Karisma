'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SuccessContent() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')
  // Show last 8 chars of session ID as the display order reference
  const orderRef = sessionId
    ? sessionId.replace(/^cs_/, '').slice(-8).toUpperCase()
    : '--------'

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#f0f0f0',
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
        padding: '24px',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(56px, 12vw, 120px)',
          fontWeight: 700,
          letterSpacing: '0.06em',
          lineHeight: 1,
          textAlign: 'center',
        }}
      >
        THANK YOU
      </h1>

      <p
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: '11px',
          letterSpacing: '0.3em',
          color: '#555',
          textTransform: 'uppercase',
        }}
      >
        ORDER #{orderRef}
      </p>

      <p
        style={{
          fontSize: '11px',
          letterSpacing: '0.15em',
          color: '#444',
          maxWidth: '320px',
          textAlign: 'center',
          lineHeight: 1.8,
        }}
      >
        YOUR ORDER HAS BEEN CONFIRMED.
        <br />
        A RECEIPT WILL BE SENT SHORTLY.
      </p>

      <a
        href="/"
        style={{
          marginTop: '16px',
          fontSize: '10px',
          letterSpacing: '0.35em',
          color: '#888',
          textTransform: 'uppercase',
          textDecoration: 'none',
          borderBottom: '1px solid #333',
          paddingBottom: '2px',
        }}
      >
        RETURN TO ARCHIVE
      </a>
    </main>
  )
}

// useSearchParams requires a Suspense boundary in Next.js App Router
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  )
}
