'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { get } from '@/lib/api'
import type { Product } from '@/types'

// Color variants that should be combined into a single card
const COLOR_VARIANT_GROUPS: Record<string, { displayName: string; primaryId: string; variants: string[] }> = {
  'karisma-drop-1': {
    displayName: 'KARISMA DROP 1',
    primaryId: 'new-black-tee',
    variants: ['new-black-tee', 'new-red-tee'],
  },
}

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'new-black-tee',
    name: 'KARISMA DROP 1',
    price: 148.00,
    imageUrl: '/images/new/new-release-black-tee.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    description: 'Limited SS26 release.',
    dropId: 'ss26-new',
  },
]

/** Combine color variants into a single card, using the primary variant's image */
function combineVariants(products: Product[]): Product[] {
  const variantIds = new Set<string>()
  const combined: Product[] = []

  // Build a lookup of which product IDs belong to a group
  for (const group of Object.values(COLOR_VARIANT_GROUPS)) {
    for (const vid of group.variants) {
      variantIds.add(vid)
    }
  }

  // Add combined cards for each group
  for (const group of Object.values(COLOR_VARIANT_GROUPS)) {
    const primary = products.find((p) => p.id === group.primaryId)
    if (primary) {
      combined.push({ ...primary, name: group.displayName })
    }
  }

  // Add non-variant products as-is
  for (const p of products) {
    if (!variantIds.has(p.id)) {
      combined.push(p)
    }
  }

  return combined
}

function CardItem({ product }: { product: Product }) {
  return (
    <motion.div variants={cardVariants}>
      <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <motion.div
          style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden', cursor: 'pointer' }}
          whileHover="hover"
          initial="rest"
        >
          <motion.div
            variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ position: 'relative', width: '100%', height: '100%' }}
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
        </motion.div>
      </Link>
    </motion.div>
  )
}

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

function ProductCard({ product }: { product: Product }) {
  const [imageLoaded, setImageLoaded] = useState(false)

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
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
          </motion.div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function NewReleasesGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    let cancelled = false

    const attempt = async (tries = 5, delay = 3000) => {
      for (let i = 0; i < tries; i++) {
        try {
          const data = await get<Product[]>('/products?drop=ss26-new')
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
        setLoading(false)
      }
    }

    attempt()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const displayed = combineVariants(products.length > 0 ? products : FALLBACK_PRODUCTS)

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px', fontSize: '10px', letterSpacing: '0.3em', color: 'var(--fg-muted)' }}>
        LOADING
      </div>
    )
  }

  return (
    <motion.div
      className="home-grid"
      variants={gridVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {displayed.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  )
}
