'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useIsMobile } from '@/lib/useIsMobile'
import type { Product } from '@/types'

interface Props {
  product: Product
  relatedProducts?: Product[]
}

export default function ProductDetail({ product, relatedProducts = [] }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const isMobile = useIsMobile()

  const handleAddToCart = () => {
    if (!selectedSize) return
    addItem({ product, size: selectedSize, quantity: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main style={{
      display: isMobile ? 'flex' : 'grid',
      flexDirection: isMobile ? 'column' : undefined,
      gridTemplateColumns: isMobile ? undefined : '1fr 1fr',
      background: 'var(--bg)',
      color: 'var(--fg)',
      alignItems: 'start',
    }}>
      {/* LEFT / TOP — Image panel (sticky on desktop, 75vh block on mobile) */}
      <motion.div
        layoutId={`product-image-${product.id}`}
        style={{
          position: isMobile ? 'relative' : 'sticky',
          top: isMobile ? undefined : '56px',
          height: isMobile ? '75vh' : 'calc(100vh - 56px)',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes={isMobile ? '100vw' : '50vw'}
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
          }}
          priority
        />
      </motion.div>

      {/* RIGHT — Scrollable content panel */}
      <motion.div
        initial={{ opacity: 0, x: isMobile ? 0 : 40, y: isMobile ? 20 : 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          padding: isMobile ? '24px 16px 40px' : 'clamp(24px, 3vw, 48px)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: isMobile ? 'auto' : 'calc(100vh - 56px)',
        }}
      >
        {/* Product Info */}
        <h1 style={{
          fontSize: 'clamp(28px, 4vw, 56px)',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          lineHeight: 1.05,
          color: 'var(--fg)',
          margin: 0,
        }}>
          {product.name}
        </h1>

        <p style={{ fontFamily: 'monospace', fontSize: '16px', color: 'var(--fg-muted)', marginTop: '12px' }}>
          ${product.price.toFixed(2)}
        </p>

        <p style={{ fontSize: '18px', lineHeight: 1.8, color: 'var(--fg-muted)', marginTop: '20px' }}>
          {product.description}
        </p>

        {/* Size Selection */}
        <div style={{ display: 'flex', gap: isMobile ? '8px' : '10px', marginTop: '28px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(prev => prev === size ? null : size)}
              style={{
                width: isMobile ? '52px' : '64px',
                height: isMobile ? '52px' : '64px',
                border: selectedSize === size ? '3px solid var(--fg)' : '1px solid var(--border)',
                background: selectedSize === size ? 'var(--fg)' : 'transparent',
                color: selectedSize === size ? 'var(--bg)' : 'var(--fg-muted)',
                fontFamily: 'monospace',
                fontSize: '14px',
                cursor: 'pointer',
                letterSpacing: '0.05em',
              }}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Spacer — pushes button + related to bottom of viewport (desktop only) */}
        {!isMobile && <div style={{ flex: '1 1 auto' }} />}

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize}
          style={{
            width: '100%',
            height: '56px',
            marginTop: isMobile ? '20px' : undefined,
            background: selectedSize ? 'var(--fg)' : 'transparent',
            color: selectedSize ? 'var(--bg)' : 'var(--fg-muted)',
            border: selectedSize ? 'none' : '1px solid var(--border)',
            fontFamily: 'monospace',
            letterSpacing: '0.15em',
            fontSize: '12px',
            cursor: selectedSize ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s, color 0.2s, border 0.2s',
          }}
        >
          {added ? 'ADDED TO COLLECTION' : 'ADD TO YOUR COLLECTION'}
        </button>

        {/* Related Products — visible at bottom of viewport on load */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '36px' }}>
            <p style={{
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              color: 'var(--fg-muted)',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              RELATED PRODUCTS
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: isMobile ? '10px' : '12px',
              paddingBottom: '40px',
            }}>
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/products/${related.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'relative',
                      aspectRatio: '3/4',
                      overflow: 'hidden',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <Image
                      src={related.imageUrl}
                      alt={related.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="12vw"
                    />
                  </motion.div>
                  <p style={{
                    fontSize: '9px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginTop: '6px',
                    color: 'var(--fg-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {related.name}
                  </p>
                  <p style={{
                    fontSize: '9px',
                    color: 'var(--fg-muted)',
                    opacity: 0.6,
                  }}>
                    ${related.price.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </main>
  )
}
