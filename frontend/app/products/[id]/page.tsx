'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ProductDetail from '@/components/product/ProductDetail'
import { get } from '@/lib/api'
import type { Product } from '@/types'

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    get<Product>(`/products/${id}`)
      .then(setProduct)
      .catch(() => setNotFound(true))
  }, [id])

  if (notFound) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--bg)',
        color: 'var(--fg-muted)',
        fontSize: '11px',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
      }}>
        PRODUCT NOT FOUND
      </div>
    )
  }

  if (!product) return null

  return <ProductDetail product={product} />
}
