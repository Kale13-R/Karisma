'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function HomePage() {
  const router = useRouter()

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* HERO — full screen, NEW RELEASES background */}
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
          quality={100}
          style={{ objectFit: 'cover', objectPosition: 'center' }}
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
          }}>SS26</p>
          <h1 style={{
            fontWeight: 900,
            fontSize: 'clamp(48px, 10vw, 96px)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#fff',
            marginBottom: '52px',
            lineHeight: 1,
          }}>
            NEW RELEASES
          </h1>
          <button
            onClick={() => router.push('/new-releases')}
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

    </div>
  )
}
