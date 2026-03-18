'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useMediaQuery } from '@/lib/useMediaQuery'
import type { Product } from '@/types'

interface Props {
  product: Product
  relatedProducts?: Product[]
}

function RelatedCard({ related }: { related: Product }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link href={`/products/${related.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', border: '1px solid var(--border)' }}
        >
          <motion.div
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'relative', width: '100%', height: '100%' }}
          >
            <Image
              src={related.imageUrl}
              alt={related.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 767px) 50vw, 12vw"
            />
          </motion.div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}
        >
          {related.name}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
          transition={{ duration: 0.2, ease: 'easeOut', delay: 0.03 }}
          style={{ fontSize: '9px', color: 'var(--fg-muted)', margin: 0 }}
        >
          ${related.price.toFixed(2)}
        </motion.p>
      </div>
    </Link>
  )
}

export default function ProductDetail({ product, relatedProducts = [] }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  // Only used for animation direction — layout handled by CSS
  const isMobile = useMediaQuery('(max-width: 767px)')

  const handleAddToCart = () => {
    if (!selectedSize) return
    addItem({ product, size: selectedSize, quantity: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main className="pdp-layout" style={{
      background: 'var(--bg)',
      color: 'var(--fg)',
    }}>
      {/* LEFT / TOP — Image panel (sticky on desktop, 75vh block on mobile) */}
      <motion.div
        key={product.id}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="pdp-image"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 767px) 100vw, 50vw"
          style={{
            objectFit: 'contain',
            objectPosition: 'center',
          }}
          priority
        />
      </motion.div>

      {/* RIGHT / BOTTOM — Scrollable content panel */}
      <motion.div
        initial={{ opacity: 0, x: isMobile ? 0 : 40, y: isMobile ? 20 : 0 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="pdp-content"
        style={{
          padding: 'var(--pdp-content-pad)',
          display: 'flex',
          flexDirection: 'column',
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

        {/* Size Selection — fills horizontally on mobile */}
        <div
          className="pdp-sizes"
          style={isMobile ? {
            display: 'grid',
            gridTemplateColumns: `repeat(${product.sizes.length}, 1fr)`,
            gap: '8px',
            width: '100vw',
            marginLeft: '-16px',
          } : undefined}
        >
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(prev => prev === size ? null : size)}
              style={{
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

        {/* Spacer — pushes button + related to bottom of viewport (hidden on mobile via CSS) */}
        <div className="pdp-spacer" />

        {/* Add to Cart — full width on both, margin-top on mobile via CSS */}
        <button
          className="pdp-add-btn"
          onClick={handleAddToCart}
          disabled={!selectedSize}
          style={{
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
            <div className="pdp-related-grid">
              {relatedProducts.map((related) => (
                <RelatedCard key={related.id} related={related} />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </main>
  )
}
