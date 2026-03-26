'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export default function Header() {
  const pathname = usePathname()
  const { itemCount, openDrawer } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  if (pathname === '/gate') return null

  return (
    <div ref={menuRef}>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--header-px)',
        height: '56px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        backgroundColor: 'color-mix(in srgb, var(--bg) 80%, transparent)',
      }}>
        {/* Left — Bunny mascot toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
          aria-label="Toggle navigation menu"
        >
          <Image
            src="/images/bunny-mascot.png"
            alt="Karisma"
            width={36}
            height={36}
            style={{ objectFit: 'contain', filter: 'brightness(1.2)', width: '36px', height: '36px' }}
          />
        </button>

        {/* Center — Wordmark (fills full header height) */}
        <Link href="/" style={{
          fontWeight: 900,
          fontSize: 'var(--header-wordmark)',
          letterSpacing: '0.15em',
          textDecoration: 'none',
          color: 'var(--fg)',
          textTransform: 'uppercase',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
        }}>
          KARISMA
        </Link>

        {/* Right — Actions */}
        <nav style={{ display: 'flex', gap: 'var(--nav-gap)', alignItems: 'center' }}>
          <Link
            href="/account"
            className="desktop-only"
            style={{
              fontSize: '13px',
              letterSpacing: '0.1em',
              color: 'var(--fg)',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            ACCOUNT
          </Link>
          <button
            onClick={openDrawer}
            style={{
              fontFamily: 'monospace',
              fontSize: '13px',
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

      {/* Dropdown Menu Panel */}
      <div className="header-dropdown" data-open={menuOpen}>
        <div className="header-dropdown-inner">
          {/* NEW RELEASES column */}
          <div>
            <Link
              href="/new-releases"
              style={{
                fontWeight: 900,
                fontSize: '14px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#0a0a0a',
                textDecoration: 'none',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              NEW RELEASES
            </Link>
          </div>

          {/* SHOP ALL column */}
          <div>
            <span
              style={{
                fontWeight: 900,
                fontSize: '14px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#0a0a0a',
                display: 'block',
                marginBottom: '12px',
                cursor: 'default',
              }}
            >
              SHOP ALL
            </span>
            <Link
              href="/organized-khaos"
              style={{
                fontSize: '12px',
                letterSpacing: '0.06em',
                color: '#666',
                textDecoration: 'none',
                display: 'block',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#0a0a0a')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
            >
              Organized Khaos
            </Link>
          </div>

          {/* ACCOUNT — mobile only */}
          <div className="mobile-only">
            <Link
              href="/account"
              style={{
                fontWeight: 900,
                fontSize: '14px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#0a0a0a',
                textDecoration: 'none',
                display: 'block',
              }}
            >
              ACCOUNT
            </Link>
          </div>

        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 98,
            backgroundColor: 'rgba(0,0,0,0.4)',
            transition: 'opacity 0.3s',
          }}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </div>
  )
}
