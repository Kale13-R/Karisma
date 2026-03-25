'use client'

import { useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion } from 'framer-motion'
import NewReleasesGrid from '@/components/product/NewReleasesGrid'
import Marquee from '@/components/ui/Marquee'

export default function HomePage() {
  const shopRef = useRef<HTMLDivElement>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    // Calculate once while element is in natural flow position
    const threshold = el.getBoundingClientRect().top + window.scrollY - 56
    let isStuck = false
    const onScroll = () => {
      const shouldStick = window.scrollY >= threshold
      if (shouldStick === isStuck) return
      isStuck = shouldStick
      setStuck(shouldStick)
      document.body.classList.toggle('hide-fixed-marquee', shouldStick)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.body.classList.remove('hide-fixed-marquee')
    }
  }, [])

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

      <div ref={sentinelRef} style={{ visibility: stuck ? 'hidden' : 'visible' }}>
        <Marquee text="KARISMA · SUMMER 2026 · NEW RELEASE · DROP NOW · KARISMA WORLDWIDE ·" />
      </div>

      {stuck && createPortal(
        <div style={{ position: 'fixed', top: 56, left: 0, right: 0, zIndex: 100 }}>
          <Marquee text="KARISMA · SUMMER 2026 · NEW RELEASE · DROP NOW · KARISMA WORLDWIDE ·" />
        </div>,
        document.body
      )}

      {/* PRODUCT GRID */}
      <div ref={shopRef} style={{ padding: '32px 48px 80px', maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '48px' }} className="drop-title">NEW ARRIVALS</h2>
        <NewReleasesGrid />
      </div>

    </div>
  )
}
