'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ProductDetail from '@/components/product/ProductDetail'
import { get } from '@/lib/api'
import { getColorVariants } from '@/lib/colorVariants'
import type { Product } from '@/types'

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [colorVariantProducts, setColorVariantProducts] = useState<Record<string, Product>>({})
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    get<Product>(`/products/${id}`)
      .then((p) => {
        setProduct(p)

        const variantGroup = getColorVariants(id)
        const variantIds = new Set(variantGroup?.variants.map((v) => v.productId) ?? [])

        // Seed the current product immediately so the image renders without waiting for siblings
        setColorVariantProducts({ [id]: p })

        // Prefetch sibling color variants so switching is instant (no navigation)
        if (variantGroup) {
          const siblings = variantGroup.variants.filter((v) => v.productId !== id)
          Promise.all(siblings.map((v) => get<Product>(`/products/${v.productId}`))).then(
            (fetched) => {
              const map: Record<string, Product> = { [id]: p }
              fetched.forEach((fp) => { map[fp.id] = fp })
              setColorVariantProducts(map)
            }
          ).catch(() => {})
        }

        get<Product[]>(`/products?drop=${p.dropId}`)
          .then((all) => {
            setRelatedProducts(
              all.filter((r) => r.id !== id && !variantIds.has(r.id)).slice(0, 4)
            )
          })
          .catch(() => {})
      })
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

  return <ProductDetail product={product} colorVariantProducts={colorVariantProducts} relatedProducts={relatedProducts} />
}
