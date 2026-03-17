'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { get } from '@/lib/api'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/types'

export default function NewReleasesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const shopRef = useRef<HTMLDivElement>(null)

  const { addItem } = useCart()

  useEffect(() => {
    get<Product[]>('/products?drop=ss26-new')
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const selectSize = (productId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }))
  }

  const addToCart = (product: Product) => {
    const size = selectedSizes[product.id]
    if (!size) return
    addItem({ product, size, quantity: 1 })
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
          alt="New Releases"
          fill
          sizes="100vw"
          style={{ objectFit: 'contain', objectPosition: 'center' }}
          priority
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.55) 100%)'
        }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <p style={{
            fontSize: '11px',
            letterSpacing: '0.35em',
            color: 'rgba(255,255,255,0.6)',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>SS26</p>
          <div style={{ position: 'relative', marginBottom: '48px' }}>
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

      {/* PRODUCT GRID */}
      <div ref={shopRef} style={{ padding: '80px 48px', maxWidth: '1400px', margin: '0 auto' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'var(--fg-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>SS26 DROP</p>
        <h2 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '48px' }}>NEW ARRIVALS</h2>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--fg-muted)' }}>
            LOADING
          </div>
        )}

        {!loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '48px',
          }}>
            {/* Use API products if available, otherwise fall back to hardcoded */}
            {(products.length > 0 ? products : [
              {
                id: 'new-red-tee',
                name: 'KARISMA — Red',
                price: 148.00,
                imageUrl: '/images/new/new-release-red-tee.jpg',
                sizes: ['S', 'M', 'L', 'XL'],
                inStock: true,
                description: 'Karisma.',
                dropId: 'ss26-new',
              },
              {
                id: 'new-black-tee',
                name: 'KARISMA — Black',
                price: 148.00,
                imageUrl: '/images/new/new-release-black-tee.jpg',
                sizes: ['S', 'M', 'L', 'XL'],
                inStock: true,
                description: 'Karisma.',
                dropId: 'ss26-new',
              },
            ] as Product[]).map((product) => (
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
                  </motion.div>
                  <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{product.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--fg-muted)', letterSpacing: '0.05em' }}>${product.price.toFixed(2)}</p>
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
                  <button
                    style={{
                      border: '1px solid var(--fg)',
                      background: 'none',
                      color: 'var(--fg)',
                      padding: '11px 0',
                      fontSize: '10px',
                      letterSpacing: '0.2em',
                      cursor: 'pointer',
                      width: '100%',
                      opacity: selectedSizes[product.id] ? 1 : 0.4,
                    }}
                    onClick={e => { e.preventDefault(); addToCart(product as Product) }}
                    disabled={!selectedSizes[product.id]}
                  >
                    ADD TO CART
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
