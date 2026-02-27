'use client'

import { useState } from 'react'
import Image from 'next/image'
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
    sessionStorage.setItem('karisma_cart', JSON.stringify([...existing, item]))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main style={{ display: 'flex', height: '100vh', background: '#f5f5f0' }}>
      {/* LEFT — Image Panel */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* RIGHT — Content Panel */}
      <div style={{
        flex: 1,
        padding: '64px',
        display: 'flex',
        flexDirection: 'column',
        background: '#f5f5f0',
      }}>
        <div>
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 72px)',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            lineHeight: 1.05,
            color: '#0a0a0a',
            margin: 0,
          }}>
            {product.name}
          </h1>

          <p style={{ fontFamily: 'monospace', fontSize: '14px', color: '#888', marginTop: '16px' }}>
            ${product.price.toFixed(2)}
          </p>

          <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#6b6b6b', marginTop: '32px', maxWidth: '420px' }}>
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
                  border: selectedSize === size ? '3px solid #0a0a0a' : '1px solid #ccc',
                  background: selectedSize === size ? '#0a0a0a' : 'transparent',
                  color: selectedSize === size ? '#f0f0f0' : '#888',
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
            background: selectedSize ? '#0a0a0a' : '#ccc',
            color: '#f0f0f0',
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
      </div>
    </main>
  )
}
