'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import Marquee from '@/components/ui/Marquee'
import { get } from '@/lib/api'
import type { Product } from '@/types'

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const SIZE_LABELS: Record<string, string> = {
  S: 'Small',
  M: 'Medium',
  L: 'Large',
  XL: 'Extra Large',
  XS: 'Extra Small',
  'ONE SIZE': 'One Size',
}

function ArchiveCard({ product, selectedSize, onSelectSize }: {
  product: Product
  selectedSize?: string
  onSelectSize: (size: string) => void
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!selectedSize) return
    addItem({ product, size: selectedSize, quantity: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.div variants={cardVariants}>
      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div>
          <motion.div
            style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', cursor: 'pointer' }}
            whileHover="hover"
            initial="rest"
          >
            <motion.div
              variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ position: 'relative', width: '100%', height: '100%', opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                unoptimized
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                onLoad={() => setImageLoaded(true)}
              />
            </motion.div>

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
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${product.sizes.length}, 1fr)`, gap: '0px', marginTop: '8px' }}>
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={e => { e.preventDefault(); onSelectSize(size) }}
                  onMouseEnter={e => {
                    if (selectedSize !== size) {
                      e.currentTarget.style.background = 'var(--hover-grey, #e0e0e0)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (selectedSize !== size) {
                      e.currentTarget.style.background = 'none'
                    }
                  }}
                  style={{
                    background: selectedSize === size ? 'var(--fg)' : 'none',
                    color: selectedSize === size ? 'var(--bg)' : 'var(--fg)',
                    border: '1px solid var(--border)',
                    padding: '8px 0',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    transition: 'background 0.15s ease',
                  }}
                >
                  {SIZE_LABELS[size] || size}
                </button>
              ))}
            </div>
          )}
          {product.inStock && selectedSize && (
            <button
              onClick={handleAddToCart}
              style={{
                width: '100%',
                height: '44px',
                marginTop: '8px',
                background: added ? 'transparent' : 'var(--fg)',
                color: added ? 'var(--fg)' : 'var(--bg)',
                border: added ? '1px solid var(--border)' : 'none',
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: 'monospace',
                cursor: 'pointer',
                transition: 'background 0.2s, color 0.2s, border 0.2s',
              }}
            >
              {added ? 'ADDED TO COLLECTION' : 'ADD TO YOUR COLLECTION'}
            </button>
          )}
        </div>
      </Link>
    </motion.div>
  )
}

export default function OrganizedKhaosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const shopRef = useRef<HTMLDivElement>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(false)
    let cancelled = false

    const attempt = async (tries = 5, delay = 3000) => {
      for (let i = 0; i < tries; i++) {
        try {
          const data = await get<Product[]>('/products?drop=spring24')
          if (!cancelled) {
            setProducts(data)
            setLoading(false)
          }
          return
        } catch {
          if (i < tries - 1) {
            await new Promise(r => setTimeout(r, delay))
          }
        }
      }
      if (!cancelled) {
        setError(true)
        setLoading(false)
      }
    }

    attempt()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const selectSize = (productId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }))
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'var(--fg-muted)' }}>LOADING</span>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: '24px' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '0.2em', color: 'var(--fg-muted)' }}>
          FAILED TO LOAD
        </p>
        <button
          onClick={fetchProducts}
          style={{
            fontFamily: 'monospace',
            fontSize: '10px',
            letterSpacing: '0.15em',
            background: 'var(--fg)',
            color: 'var(--bg)',
            border: 'none',
            padding: '12px 32px',
            cursor: 'pointer',
          }}
        >
          RETRY
        </button>
      </div>
    )
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
          {products.map(product => (
            <ArchiveCard
              key={product.id}
              product={product}
              selectedSize={selectedSizes[product.id]}
              onSelectSize={(size) => selectSize(product.id, size)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
