import { notFound } from 'next/navigation'
import ProductDetail from '@/components/product/ProductDetail'

async function getProduct(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
    { cache: 'no-store' }
  )
  if (!res.ok) return null
  return res.json()
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
