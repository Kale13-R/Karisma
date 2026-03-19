import type { CartItem } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Deduplicates simultaneous GET requests for the same URL.
// AnimatePresence (React 18 concurrent mode) can double-mount page components,
// causing useEffect to fire twice. This ensures only one network request fires.
const inFlight = new Map<string, Promise<unknown>>()

export async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.detail || error.error || 'Request failed')
  }
  return res.json()
}

export function get<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`
  if (inFlight.has(url)) return inFlight.get(url) as Promise<T>

  const promise = fetch(url, { credentials: 'include' })
    .then((res) => {
      if (!res.ok) throw new Error('Request failed')
      return res.json() as Promise<T>
    })
    .finally(() => inFlight.delete(url))

  inFlight.set(url, promise)
  return promise
}

export async function createCheckoutSession(
  cartItems: CartItem[],
  baseUrl: string
): Promise<{ checkout_url: string }> {
  return post<{ checkout_url: string }>('/api/checkout/session', {
    cart_items: cartItems,
    base_url: baseUrl,
  })
}
