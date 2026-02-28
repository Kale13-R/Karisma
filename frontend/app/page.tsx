'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { get } from '@/lib/api'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/types'

const s = {
  page: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg)',
    color: 'var(--fg)',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  } as React.CSSProperties,
  main: {
    padding: '64px 48px',
    maxWidth: '1400px',
    margin: '0 auto',
  } as React.CSSProperties,
  dropLabel: {
    fontSize: '10px',
    letterSpacing: '0.3em',
    color: 'var(--fg-muted)',
    marginBottom: '8px',
    textTransform: 'uppercase',
  } as React.CSSProperties,
  dropTitle: {
    fontSize: '28px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    marginBottom: '48px',
  } as React.CSSProperties,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '48px',
  } as React.CSSProperties,
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  } as React.CSSProperties,
  productName: {
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  } as React.CSSProperties,
  price: {
    fontSize: '12px',
    color: 'var(--fg-muted)',
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  sizes: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  } as React.CSSProperties,
  addBtn: {
    border: '1px solid var(--fg)',
    background: 'none',
    color: 'var(--fg)',
    padding: '11px 0',
    fontSize: '10px',
    letterSpacing: '0.2em',
    cursor: 'pointer',
    width: '100%',
    marginTop: '4px',
    transition: 'background 0.15s, color 0.15s',
  } as React.CSSProperties,
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
    fontSize: '10px',
    letterSpacing: '0.3em',
    color: 'var(--fg-muted)',
  } as React.CSSProperties,
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    get<Product[]>('/products')
      .then(setProducts)
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false))
  }, [])

  const selectSize = (productId: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }))
  }

  const addToCart = (product: Product) => {
    const size = selectedSizes[product.id]
    if (!size) return
    addItem({ product, size, quantity: 1 })
  }

  return (
    <div style={s.page}>
      <main style={s.main}>
        <p style={s.dropLabel}>SS26 DROP</p>
        <h1 style={s.dropTitle}>NEW ARRIVALS</h1>

        {loading && <div style={s.loading}>LOADING</div>}
        {error && <div style={{ ...s.loading, color: '#c8b89a' }}>{error}</div>}

        {!loading && !error && (
          <div style={s.grid}>
            {products.map(product => (
              <Link key={product.id} href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={s.card}>
                <motion.div
                  layoutId={`product-image-${product.id}`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', border: '1px solid var(--border)' }}
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </motion.div>
                <p style={s.productName}>{product.name}</p>
                <p style={s.price}>${product.price.toFixed(2)}</p>
                <div style={s.sizes}>
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={(e) => { e.preventDefault(); selectSize(product.id, size) }}
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
                    ...s.addBtn,
                    opacity: selectedSizes[product.id] ? 1 : 0.4,
                  }}
                  onClick={(e) => { e.preventDefault(); addToCart(product) }}
                  disabled={!selectedSizes[product.id]}
                >
                  ADD TO CART
                </button>
              </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
