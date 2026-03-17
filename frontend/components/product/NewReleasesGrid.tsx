'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { get } from '@/lib/api'
import { useCart } from '@/context/CartContext'
import type { Product } from '@/types'

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'new-red-tee',
    name: 'KARISMA — Red',
    price: 148.00,
    imageUrl: '/images/new/new-release-red-tee.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    description: 'Limited SS26 release.',
    dropId: 'ss26-new',
  },
  {
    id: 'new-black-tee',
    name: 'KARISMA — Black',
    price: 148.00,
    imageUrl: '/images/new/new-release-black-tee.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    description: 'Limited SS26 release.',
    dropId: 'ss26-new',
  },
]

export default function NewReleasesGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  useEffect(() => {
    get<Product[]>('/products?drop=ss26-new')
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  const selectSize = (productId: string, size: string) =>
    setSelectedSizes(prev => ({ ...prev, [productId]: size }))

  const addToCart = (product: Product) => {
    const size = selectedSizes[product.id]
    if (!size) return
    addItem({ product, size, quantity: 1 })
  }

  const displayed = products.length > 0 ? products : FALLBACK_PRODUCTS

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--fg-muted)' }}>
        LOADING
      </div>
    )
  }

  return (
    <div className="home-grid">
      {displayed.map((product) => (
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
            {/* Size selector and add-to-cart belong at product detail — grid shows name + price only */}
          </div>
        </Link>
      ))}
    </div>
  )
}
