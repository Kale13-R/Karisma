'use client'

import { usePathname } from 'next/navigation'

const CONTENT = 'KARISMA ARCHIVE 2026 \u2014 WORLDWIDE SHIPPING \u2014 DROP 001 STATUS: PENDING'
const SEPARATOR = '\u00A0\u00A0\u00A0\u2022\u00A0\u00A0\u00A0'

/**
 * Infinite horizontal marquee ticker.
 * Sits below the header. Bold, all-caps monospace.
 * Uses CSS animation (keyframes defined in globals.css).
 */
export default function Marquee() {
  const pathname = usePathname()

  if (pathname === '/gate') return null

  // Duplicate content enough times to fill wide screens
  const repeated = Array(6).fill(`${CONTENT}${SEPARATOR}`).join('')

  return (
    <div style={{
      position: 'fixed',
      top: 56,
      left: 0,
      right: 0,
      zIndex: 99,
      overflow: 'hidden',
      backgroundColor: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      height: 28,
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{
        display: 'flex',
        whiteSpace: 'nowrap',
        animation: 'marquee 60s linear infinite',
        willChange: 'transform',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--fg-muted)',
        }}>
          {repeated}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--fg-muted)',
        }}>
          {repeated}
        </span>
      </div>
    </div>
  )
}
