'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function Header() {
  const { itemCount, openDrawer } = useCart()

  return (
    <header className="test-tw" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      height: '56px',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      backgroundColor: 'color-mix(in srgb, var(--bg) 80%, transparent)',
      borderBottom: 'none',
    }}>
      {/* Left — Wordmark */}
      <Link href="/" style={{
        fontWeight: 900,
        fontSize: '18px',
        letterSpacing: '0.15em',
        textDecoration: 'none',
        color: 'var(--fg)',
        textTransform: 'uppercase',
      }}>
        KARISMA
      </Link>

      {/* Right — Actions */}
      <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link href="/account" style={{
          fontFamily: 'monospace',
          fontSize: '11px',
          letterSpacing: '0.1em',
          color: 'var(--fg-muted)',
          textDecoration: 'none',
          textTransform: 'uppercase',
        }}>
          ACCOUNT
        </Link>

        <button
          onClick={openDrawer}
          style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            letterSpacing: '0.1em',
            color: 'var(--fg)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textTransform: 'uppercase',
            padding: 0,
          }}
        >
          CART {itemCount > 0 ? `(${itemCount})` : ''}
        </button>
      </nav>
    </header>
  )
}
