'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Marquee from '@/components/ui/Marquee'
import type { Product } from '@/types'

// All SPRING 24 / Organized Khaos archive products
// Includes existing 9 products + karisma.live items
const ARCHIVE_PRODUCTS = [
  { id: 'karisma-archive-001', name: 'Karisma Archive 001', price: 148.00, imageUrl: '/images/IMG_8709.png', sizes: ['S','M','L','XL'], inStock: true, dropId: 'spring24', description: 'Cut from brushed fleece in a colour that refuses definition.' },
  { id: 'karisma-archive-002', name: 'Karisma Archive 002', price: 68.00, imageUrl: '/images/IMG_8711.png', sizes: ['S','M','L','XL'], inStock: true, dropId: 'spring24', description: 'Heavyweight 280gsm cotton, washed until the black becomes something else.' },
  { id: 'karisma-archive-003', name: 'Karisma Archive 003', price: 218.00, imageUrl: '/images/IMG_8712.png', sizes: ['S','M','L','XL'], inStock: true, dropId: 'spring24', description: 'Structured where structure matters.' },
  { id: 'karisma-archive-004', name: 'Karisma Archive 004', price: 128.00, imageUrl: '/images/IMG_8713.png', sizes: ['S','M','L','XL'], inStock: true, dropId: 'spring24', description: 'Tapered from the knee. Side-zip ankles close like a statement.' },
  { id: 'karisma-archive-005', name: 'Karisma Archive 005', price: 98.00, imageUrl: '/images/IMG_8715.png', sizes: ['S','M','L','XL'], inStock: true, dropId: 'spring24', description: 'The shirt as a proposition.' },
  { id: 'karisma-archive-006', name: 'Karisma Archive 006', price: 158.00, imageUrl: '/images/IMG_8726.png', sizes: ['S','M','L','XL'], inStock: true, dropId: 'spring24', description: 'A second study in weight.' },
  { id: 'karisma-archive-007', name: 'Karisma Archive 007', price: 72.00, imageUrl: '/images/IMG_8728.png', sizes: ['S','M','L','XL'], inStock: true, dropId: 'spring24', description: 'What remains after intention is stripped away.' },
  { id: 'karisma-archive-008', name: 'Karisma Archive 008', price: 228.00, imageUrl: '/images/IMG_8736.png', sizes: ['S','M','L','XL'], inStock: true, dropId: 'spring24', description: 'Lighter than the first.' },
  { id: 'karisma-archive-009', name: 'Karisma Archive 009', price: 138.00, imageUrl: '/images/IMG_8742.png', sizes: ['S','M','L','XL'], inStock: true, dropId: 'spring24', description: 'Wide through the thigh, drawn in at the ankle.' },
  // karisma.live additions
  { id: 'krsm-snapback-green', name: 'RismaSnapBack — Green', price: 35.00, imageUrl: '/images/archive/risma-snapback-green.png', sizes: ['ONE SIZE'], inStock: true, dropId: 'spring24', description: 'Hand-painted trucker snapback. One of a kind.' },
  { id: 'krsm-logo-hoodie', name: 'Logo Hoodie', price: 40.00, imageUrl: '/images/archive/logo-hoodie.png', sizes: ['S','M','L','XL'], inStock: true, dropId: 'spring24', description: 'Classic Karisma logo hoodie.' },
  { id: 'krsm-trenches-tee', name: 'Made in The Trenches Tee', price: 50.00, imageUrl: '/images/archive/made-in-trenches-tee.png', sizes: ['S','M','L','XL'], inStock: false, dropId: 'spring24', description: 'Made in The Trenches. Sold out.' },
  { id: 'krsm-lavender-zip', name: 'Baby Lavender Crop Zip Up', price: 70.00, imageUrl: '/images/archive/baby-lavender-crop-zip.png', sizes: ['XS','S','M'], inStock: false, dropId: 'spring24', description: 'Baby lavender crop zip up hoodie.' },
  { id: 'krsm-white-hoodie', name: 'WhiteMARS Long Sleeve', price: 65.00, imageUrl: '/images/archive/white-banned-hoodie.png', sizes: ['S','M','L','XL'], inStock: false, dropId: 'spring24', description: 'WhiteMARS long sleeve graphic tee.' },
  { id: 'krsm-black-hoodie', name: 'BlackMars Long Sleeve', price: 65.00, imageUrl: '/images/archive/black-banned-shirt.png', sizes: ['S','M','L','XL'], inStock: false, dropId: 'spring24', description: 'BlackMars long sleeve tee.' },
  { id: 'krsm-blue-hoodie', name: 'Blue KOLOSSAL Hoodie', price: 60.00, imageUrl: '/images/archive/blue-colossal-hoodie.png', sizes: ['S','M','L','XL'], inStock: false, dropId: 'spring24', description: 'Blue KOLOSSAL heavyweight hoodie.' },
  { id: 'krsm-marisma', name: 'Marisma :)', price: 50.00, imageUrl: '/images/archive/marisma.png', sizes: ['S','M','L','XL'], inStock: true, dropId: 'spring24', description: 'Marisma graphic tee.' },
]

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function OrganizedKhaosPage() {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const shopRef = useRef<HTMLDivElement>(null)


  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const selectSize = (productId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }))
  }

  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <Image
          src="/images/heroes/organized-khaos-hero.png"
          alt="Organized Khaos"
          fill
          unoptimized
          style={{ objectFit: 'contain', objectPosition: 'center' }}
          priority
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)'
        }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <p style={{
            fontSize: '11px',
            letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.6)',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>SPRING 24 — ARCHIVE</p>
          <h1 style={{
            fontWeight: 900,
            fontSize: 'clamp(40px, 8vw, 80px)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#fff',
            marginBottom: '48px',
            lineHeight: 1,
          }}>
            ORGANIZED KHAOS
          </h1>
          <button
            onClick={scrollToShop}
            style={{
              border: '1px solid rgba(255,255,255,0.7)',
              background: 'transparent',
              color: '#fff',
              padding: '14px 48px',
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
        </div>
      </div>

      {/* MARQUEE */}
      <Marquee text="KARISMA · SPRING 24 · ORGANIZED KHAOS · ARCHIVE · KARISMA WORLDWIDE · " />

      {/* DROP LABEL BAR */}
      <div style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '14px var(--ok-label-px)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'var(--fg-muted)', textTransform: 'uppercase' }}>
          SPRING 24 — ORGANIZED KHAOS
        </span>
      </div>

      {/* PRODUCT GRID */}
      <div ref={shopRef} style={{ padding: 'var(--ok-section-pad)', maxWidth: '1400px', margin: '0 auto' }}>
        <motion.div
          className="ok-grid"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {ARCHIVE_PRODUCTS.map(product => (
            <motion.div key={product.id} variants={cardVariants}>
              <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <motion.div
                    style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', cursor: 'pointer' }}
                    whileHover="hover"
                    initial="rest"
                  >
                    <motion.div
                      variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
                      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                      style={{ position: 'relative', width: '100%', height: '100%' }}
                    >
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        unoptimized
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </motion.div>

                    {/* Hover overlay — slides up from bottom */}
                    <motion.div
                      variants={{ rest: { opacity: 0, y: 16 }, hover: { opacity: 1, y: 0 } }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                        padding: '24px 16px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                      }}
                    >
                      <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', color: '#fff', textTransform: 'uppercase' }}>
                        {product.name}
                      </p>
                      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em', fontFamily: 'monospace' }}>
                        ${product.price.toFixed(2)}
                      </p>
                    </motion.div>

                    {/* Sold out overlay — always visible */}
                    {!product.inStock && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#aaa', textTransform: 'uppercase' }}>SOLD OUT</span>
                      </div>
                    )}
                  </motion.div>

                  {product.inStock && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {product.sizes.map(size => (
                        <button
                          key={size}
                          onClick={e => { e.preventDefault(); selectSize(product.id, size) }}
                          style={{
                            background: selectedSizes[product.id] === size ? 'var(--fg)' : 'none',
                            color: selectedSizes[product.id] === size ? 'var(--bg)' : 'var(--fg)',
                            border: '1px solid var(--border)',
                            padding: '5px 10px',
                            fontSize: '10px',
                            letterSpacing: '0.1em',
                            cursor: 'pointer',
                            minWidth: '36px',
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
