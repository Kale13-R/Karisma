'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import NewReleasesGrid from '@/components/product/NewReleasesGrid'

export default function HomePage() {
  const shopRef = useRef<HTMLDivElement>(null)

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh' }}>

      {/* HERO — full screen */}
      <div style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <Image
          src="/images/heroes/new-releases-hero.png"
          alt="Karisma"
          fill
          sizes="100vw"
          style={{ objectFit: 'contain', objectPosition: 'center' }}
          priority
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.6) 100%)',
        }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}
        >
          <p style={{
            fontSize: '11px',
            letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.55)',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>SUMMER 2026</p>
          <div style={{ position: 'relative', marginBottom: '52px' }}>
            <span style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontWeight: 900,
              fontSize: 'clamp(72px, 16vw, 160px)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.08)',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              userSelect: 'none',
            }}>
              NEW RELEASES
            </span>
            <h1 style={{
              position: 'relative',
              fontWeight: 900,
              fontSize: 'clamp(48px, 10vw, 96px)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#fff',
              lineHeight: 1,
            }}>
              NEW RELEASES
            </h1>
          </div>
          <button
            onClick={scrollToShop}
            style={{
              border: '1px solid rgba(255,255,255,0.8)',
              background: 'transparent',
              color: '#fff',
              padding: '14px 52px',
              fontSize: '11px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#fff'
              e.currentTarget.style.color = '#000'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#fff'
            }}
          >
            SHOP
          </button>
        </motion.div>
      </div>

      {/* PRODUCT GRID */}
      <div ref={shopRef} style={{ padding: 'var(--section-pad)', maxWidth: '1400px', margin: '0 auto' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'var(--fg-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>SUMMER 2026 DROP</p>
        <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '48px' }}>NEW ARRIVALS</h2>
        <NewReleasesGrid />
      </div>

    </div>
  )
}
