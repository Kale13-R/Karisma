'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/types'

interface Props {
  product: Product
  relatedProducts?: Product[]
}

export default function ProductDetail({ product, relatedProducts = [] }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (!selectedSize) return
    addItem({ product, size: selectedSize, quantity: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      height: 'calc(100vh - 56px)',
      background: 'var(--bg)',
      color: 'var(--fg)',
      overflow: 'hidden',
    }}>
      {/* LEFT — Image Panel */}
      <motion.div
        layoutId={`product-image-${product.id}`}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          unoptimized
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
          }}
          priority
        />
      </motion.div>

      {/* RIGHT — Content Panel */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          padding: 'clamp(24px, 3vw, 48px)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Product Info */}
        <div style={{ flex: '0 0 auto' }}>
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

          <p style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--fg-muted)', marginTop: '12px' }}>
            ${product.price.toFixed(2)}
          </p>

          <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--fg-muted)', marginTop: '20px' }}>
            {product.description}
          </p>

          {/* Size Selection — centered */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px', justifyContent: 'center' }}>
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

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize}
          style={{
            flex: '0 0 auto',
            marginTop: '24px',
            width: '100%',
            height: '48px',
            background: selectedSize ? 'var(--fg)' : 'var(--border)',
            color: 'var(--bg)',
            fontFamily: 'monospace',
            letterSpacing: '0.15em',
            fontSize: '12px',
            border: 'none',
            cursor: selectedSize ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s',
          }}
        >
          {added ? 'ADDED TO COLLECTION' : 'ADD TO YOUR COLLECTION'}
        </button>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div style={{ flex: '0 0 auto', marginTop: 'auto', paddingTop: '24px' }}>
            <p style={{
              fontSize: '10px',
              letterSpacing: '0.25em',
              color: 'var(--fg-muted)',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              RELATED PRODUCTS
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
            }}>
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  href={`/products/${related.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{
                    position: 'relative',
                    aspectRatio: '3/4',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                  }}>
                    <Image
                      src={related.imageUrl}
                      alt={related.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="12vw"
                    />
                  </div>
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
