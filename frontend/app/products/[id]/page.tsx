'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import ProductDetail from '@/components/product/ProductDetail'
import { get } from '@/lib/api'
import { getColorVariants } from '@/lib/colorVariants'
import type { Product } from '@/types'

// Module-level cache — survives soft navigations within the same browser session
const productCache = new Map<string, Product>()

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [colorVariantProducts, setColorVariantProducts] = useState<Record<string, Product>>({})
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setNotFound(false)

    const variantGroup = getColorVariants(id)
    const variantIds = new Set(variantGroup?.variants.map((v) => v.productId) ?? [])

    // If already cached (e.g. back button or sibling variant navigation), skip fetch entirely
    const cached = productCache.get(id)
    if (cached) {
      setProduct(cached)
      if (variantGroup) {
        const map: Record<string, Product> = {}
        variantGroup.variants.forEach((v) => {
          const c = productCache.get(v.productId)
          if (c) map[v.productId] = c
        })
        setColorVariantProducts(map)
      } else {
        setColorVariantProducts({ [id]: cached })
      }
      return
    }

    // Fresh fetch
    setProduct(null)
    setColorVariantProducts({})

    get<Product>(`/products/${id}`)
      .then((p) => {
        productCache.set(id, p)
        setProduct(p)
        setColorVariantProducts({ [id]: p })

        // Prefetch siblings so color switching is instant
        if (variantGroup) {
          const siblings = variantGroup.variants.filter((v) => v.productId !== id)
          Promise.all(siblings.map((v) => get<Product>(`/products/${v.productId}`))).then(
            (fetched) => {
              const map: Record<string, Product> = { [id]: p }
              fetched.forEach((fp) => {
                productCache.set(fp.id, fp)
                map[fp.id] = fp
              })
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
