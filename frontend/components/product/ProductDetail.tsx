'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { getColorVariants } from '@/lib/colorVariants'
import type { Product } from '@/types'

const SIZE_LABELS: Record<string, string> = {
  S: 'Small',
  M: 'Medium',
  L: 'Large',
  XL: 'Extra Large',
  XS: 'Extra Small',
  'ONE SIZE': 'One Size',
}

interface Props {
  product: Product
  colorVariantProducts?: Record<string, Product>
  relatedProducts?: Product[]
}

function RelatedCard({ related }: { related: Product }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <Link href={`/products/${related.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
        <div style={{ position: 'relative', width: '100%', height: '100%', opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }}>
          <Image
            src={related.imageUrl}
            alt={related.name}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 767px) 50vw, 12vw"
            onLoad={() => setLoaded(true)}
          />
        </div>
      </motion.div>
    </Link>
  )
}

export default function ProductDetail({ product, colorVariantProducts = {}, relatedProducts = [] }: Props) {
  const [activeProduct, setActiveProduct] = useState<Product>(product)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const [shippingOpen, setShippingOpen] = useState(false)
  const [careOpen, setCareOpen] = useState(false)
  const [sizeFitOpen, setSizeFitOpen] = useState(false)
  const { addItem } = useCart()

  // Color variants
  const variantGroup = getColorVariants(activeProduct.id)
  const currentVariant = variantGroup?.variants.find((v) => v.productId === activeProduct.id)

  const handleColorSelect = (productId: string) => {
    if (productId === activeProduct.id) return
    const next = colorVariantProducts[productId]
    if (next) {
      setActiveProduct(next)
      setSelectedSize(null)
      window.history.replaceState(null, '', `/products/${productId}`)
    }
  }

  const dropdownBtnStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 0',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--fg)',
    fontFamily: 'monospace',
    fontSize: '13px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
  }

  const dropdownBodyStyle: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: 1.7,
    color: 'var(--fg-muted)',
    paddingBottom: '16px',
    margin: 0,
  }

  const handleAddToCart = () => {
    if (!selectedSize) return
    addItem({ product: activeProduct, size: selectedSize, quantity: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <main className="pdp-layout" style={{
      background: 'var(--bg)',
      color: 'var(--fg)',
    }}>
      {/* LEFT / TOP — Image panel (sticky on desktop, 75vh block on mobile) */}
      <div className="pdp-image">
        {variantGroup ? variantGroup.variants.map((variant) => {
          const vp = colorVariantProducts[variant.productId]
          if (!vp) return null
          const isActive = variant.productId === activeProduct.id
          return (
            <Image
              key={variant.productId}
              src={vp.imageUrl}
              alt={vp.name}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              style={{
                objectFit: 'contain',
                objectPosition: 'center',
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.25s ease',
              }}
              priority={isActive}
            />
          )
        }) : (
          <Image
            src={activeProduct.imageUrl}
            alt={activeProduct.name}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            style={{ objectFit: 'contain', objectPosition: 'center' }}
            priority
          />
        )}
      </div>

      {/* RIGHT / BOTTOM — Scrollable content panel */}
      <div
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
          {variantGroup ? variantGroup.displayName : activeProduct.name}
        </h1>

        <p style={{ fontFamily: 'monospace', fontSize: '16px', color: 'var(--fg-muted)', marginTop: '12px' }}>
          ${activeProduct.price.toFixed(2)}
        </p>

        <p style={{ fontSize: '18px', lineHeight: 1.8, color: 'var(--fg-muted)', marginTop: '20px' }}>
          {activeProduct.description}
        </p>

        {/* Color Selection */}
        {variantGroup && (
          <div style={{ marginTop: '24px' }}>
            <p style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: 'var(--fg-muted)',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              COLOR — {currentVariant?.colorName?.toUpperCase() || ''}
            </p>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {variantGroup.variants.map((variant) => {
                const isActive = variant.productId === activeProduct.id
                return (
                  <button
                    key={variant.productId}
                    onClick={() => handleColorSelect(variant.productId)}
                    aria-label={`Select ${variant.colorName}`}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: variant.hex,
                      border: isActive ? '2px solid var(--fg)' : '2px solid transparent',
                      outline: isActive ? '2px solid var(--fg)' : 'none',
                      outlineOffset: '3px',
                      cursor: isActive ? 'default' : 'pointer',
                      transition: 'outline 0.15s ease, border 0.15s ease',
                      padding: 0,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.outline = '2px solid var(--fg-muted)'
                        e.currentTarget.style.outlineOffset = '3px'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.outline = 'none'
                      }
                    }}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Size Selection — full width grid */}
        <div className="pdp-sizes">
          {activeProduct.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(prev => prev === size ? null : size)}
              onMouseEnter={e => {
                if (selectedSize !== size) {
                  e.currentTarget.style.background = 'var(--hover-grey, #e0e0e0)'
                }
              }}
              onMouseLeave={e => {
                if (selectedSize !== size) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
              style={{
                border: selectedSize === size ? '3px solid var(--fg)' : '1px solid var(--border)',
                background: selectedSize === size ? 'var(--fg)' : 'transparent',
                color: selectedSize === size ? 'var(--bg)' : 'var(--fg-muted)',
                fontFamily: 'monospace',
                fontSize: '14px',
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'background 0.15s ease',
              }}
            >
              {SIZE_LABELS[size] || size}
            </button>
          ))}
        </div>

        {/* Size & Fit Dropdown */}
        <div style={{ borderTop: '1px solid var(--border)', marginTop: '24px' }}>
          <button onClick={() => setSizeFitOpen(prev => !prev)} style={dropdownBtnStyle}>
            SIZE & FIT
            <span style={{
              transition: 'transform 0.2s ease',
              transform: sizeFitOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              fontSize: '12px',
            }}>
              ▼
            </span>
          </button>
          {sizeFitOpen && (
            <p style={dropdownBodyStyle}>Your text here</p>
          )}
        </div>

        {/* Shipping & Returns Dropdown */}
        <div style={{ borderTop: '1px solid var(--border)' }}>
          <button onClick={() => setShippingOpen(prev => !prev)} style={dropdownBtnStyle}>
            SHIPPING & RETURNS
            <span style={{
              transition: 'transform 0.2s ease',
              transform: shippingOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              fontSize: '12px',
            }}>
              ▼
            </span>
          </button>
          {shippingOpen && (
            <p style={dropdownBodyStyle}>Your text here</p>
          )}
        </div>

        {/* Product Care Dropdown */}
        <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setCareOpen(prev => !prev)} style={dropdownBtnStyle}>
            PRODUCT CARE
            <span style={{
              transition: 'transform 0.2s ease',
              transform: careOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              fontSize: '12px',
            }}>
              ▼
            </span>
          </button>
          {careOpen && (
            <p style={dropdownBodyStyle}>Your text here</p>
          )}
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
      </div>
    </main>
  )
}
