'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { get } from '@/lib/api'
import { useCart } from '@/context/CartContext'
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
  { id: 'krsm-sage-beanie', name: 'Baby Sage Beanie', price: 30.00, imageUrl: '/images/archive/baby-sage-beanie.png', sizes: ['ONE SIZE'], inStock: true, dropId: 'spring24', description: 'Hand-painted sage beanie.' },
]

export default function OrganizedKhaosPage() {
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const shopRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()

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
          quality={100}
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
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

      {/* DROP LABEL BAR */}
      <div style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 48px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'var(--fg-muted)', textTransform: 'uppercase' }}>
          SPRING 24 — ORGANIZED KHAOS
        </span>
      </div>

      {/* PRODUCT GRID */}
      <div ref={shopRef} style={{ padding: '64px 48px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '48px',
        }}>
          {ARCHIVE_PRODUCTS.map(product => (
            <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
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
                <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{product.name}</p>
                <p style={{ fontSize: '12px', color: 'var(--fg-muted)', letterSpacing: '0.05em' }}>${product.price.toFixed(2)}</p>
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
          ))}
        </div>
      </div>
    </div>
  )
}
