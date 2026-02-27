'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Product, CartItem } from '@/types'

interface Props {
  product: Product
}

export default function ProductDetail({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    if (!selectedSize) return
    const existing = JSON.parse(sessionStorage.getItem('karisma_cart') || '[]') as CartItem[]
    const item: CartItem = { product, size: selectedSize, quantity: 1 }
    const updated = [...existing, item]
    sessionStorage.setItem('karisma_cart', JSON.stringify(updated))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'row',
      minHeight: '100vh',
      height: '100vh',
      background: 'var(--bg)',
      color: 'var(--fg)',
      overflow: 'hidden',
    }}>
      {/* LEFT — Image Panel */}
      <motion.div
        layoutId={`product-image-${product.id}`}
        style={{
          flex: '0 0 50%',
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
          priority
          sizes="50vw"
        />
      </motion.div>

      {/* RIGHT — Content Panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          flex: '0 0 50%',
          height: '100%',
          overflowY: 'auto',
          padding: 'clamp(32px, 5vw, 64px)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg)',
        }}
      >
        <div>
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 72px)',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            lineHeight: 1.05,
            color: 'var(--fg)',
            margin: 0,
          }}>
            {product.name}
          </h1>

          <p style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--fg-muted)', marginTop: '16px' }}>
            ${product.price.toFixed(2)}
          </p>

          <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--fg-muted)', marginTop: '32px', maxWidth: '420px' }}>
            {product.description}
          </p>

          <div style={{ display: 'flex', gap: '8px', marginTop: '48px' }}>
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  width: '48px',
                  height: '48px',
                  border: selectedSize === size ? '3px solid var(--fg)' : '1px solid var(--border)',
                  background: selectedSize === size ? 'var(--fg)' : 'transparent',
                  color: selectedSize === size ? 'var(--bg)' : 'var(--fg-muted)',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!selectedSize}
          style={{
            marginTop: 'auto',
            width: '100%',
            height: '56px',
            background: selectedSize ? 'var(--fg)' : 'var(--border)',
            color: 'var(--bg)',
            fontFamily: 'monospace',
            letterSpacing: '0.15em',
            fontSize: '13px',
            border: 'none',
            cursor: selectedSize ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s',
          }}
        >
          {added ? 'ADDED TO COLLECTION' : 'ADD TO YOUR COLLECTION'}
        </button>
      </motion.div>
    </main>
  )
}
