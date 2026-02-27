'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { get } from '@/lib/api'
import type { Product, CartItem } from '@/types'

const s = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#f0f0f0',
    fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  } as React.CSSProperties,
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 48px',
    borderBottom: '1px solid #1a1a1a',
    position: 'sticky',
    top: 0,
    backgroundColor: '#0a0a0a',
    zIndex: 100,
  } as React.CSSProperties,
  logo: {
    fontSize: '18px',
    fontWeight: 700,
    letterSpacing: '0.25em',
  } as React.CSSProperties,
  cartBtn: {
    background: 'none',
    border: '1px solid #2a2a2a',
    color: '#f0f0f0',
    padding: '8px 18px',
    fontSize: '10px',
    letterSpacing: '0.2em',
    cursor: 'pointer',
  } as React.CSSProperties,
  main: {
    padding: '64px 48px',
    maxWidth: '1400px',
    margin: '0 auto',
  } as React.CSSProperties,
  dropLabel: {
    fontSize: '10px',
    letterSpacing: '0.3em',
    color: '#555',
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
  imagePlaceholder: {
    backgroundColor: '#111',
    aspectRatio: '4 / 5',
    border: '1px solid #1a1a1a',
  } as React.CSSProperties,
  productName: {
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  } as React.CSSProperties,
  price: {
    fontSize: '12px',
    color: '#888',
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  sizes: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  } as React.CSSProperties,
  addBtn: {
    border: '1px solid #f0f0f0',
    background: 'none',
    color: '#f0f0f0',
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
    color: '#444',
  } as React.CSSProperties,
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    zIndex: 200,
  } as React.CSSProperties,
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100vh',
    width: '380px',
    backgroundColor: '#0d0d0d',
    borderLeft: '1px solid #1a1a1a',
    zIndex: 201,
    display: 'flex',
    flexDirection: 'column',
    padding: '32px',
    overflowY: 'auto',
  } as React.CSSProperties,
  drawerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  } as React.CSSProperties,
  drawerTitle: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.25em',
  } as React.CSSProperties,
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '18px',
    cursor: 'pointer',
    lineHeight: 1,
  } as React.CSSProperties,
  cartItemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '20px',
    marginBottom: '20px',
    borderBottom: '1px solid #1a1a1a',
  } as React.CSSProperties,
  cartItemLeft: {
    flex: 1,
  } as React.CSSProperties,
  cartItemName: {
    fontSize: '11px',
    letterSpacing: '0.1em',
    marginBottom: '4px',
    textTransform: 'uppercase',
  } as React.CSSProperties,
  cartItemMeta: {
    fontSize: '10px',
    color: '#555',
    letterSpacing: '0.08em',
  } as React.CSSProperties,
  cartItemRight: {
    textAlign: 'right',
    minWidth: '80px',
  } as React.CSSProperties,
  cartItemPrice: {
    fontSize: '11px',
    marginBottom: '8px',
  } as React.CSSProperties,
  removeBtn: {
    background: 'none',
    border: 'none',
    color: '#444',
    fontSize: '10px',
    cursor: 'pointer',
    letterSpacing: '0.08em',
    textDecoration: 'underline',
  } as React.CSSProperties,
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '20px',
    marginTop: 'auto',
    fontSize: '12px',
    letterSpacing: '0.12em',
    fontWeight: 600,
  } as React.CSSProperties,
  checkoutBtn: {
    width: '100%',
    padding: '15px 0',
    backgroundColor: '#f0f0f0',
    color: '#0a0a0a',
    border: 'none',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.25em',
    cursor: 'pointer',
    marginTop: '16px',
  } as React.CSSProperties,
  emptyCart: {
    color: '#444',
    fontSize: '11px',
    letterSpacing: '0.15em',
    marginTop: '48px',
    textAlign: 'center',
  } as React.CSSProperties,
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.size === size)
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { product, size, quantity: 1 }]
    })
    setCartOpen(true)
  }

  const removeFromCart = (productId: string, size: string) => {
    setCart(prev => prev.filter(i => !(i.product.id === productId && i.size === size)))
  }

  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0)
  const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const router = useRouter()

  const handleCheckout = () => {
    sessionStorage.setItem('karisma_cart', JSON.stringify(cart))
    router.push('/checkout/summary')
  }

  return (
    <div style={s.page}>
      <header style={s.header}>
        <span style={s.logo}>KARISMA</span>
        <button style={s.cartBtn} onClick={() => setCartOpen(true)}>
          CART&nbsp;({itemCount})
        </button>
      </header>

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
                <div style={s.imagePlaceholder} />
                <p style={s.productName}>{product.name}</p>
                <p style={s.price}>${product.price.toFixed(2)}</p>
                <div style={s.sizes}>
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => selectSize(product.id, size)}
                      style={{
                        background: selectedSizes[product.id] === size ? '#f0f0f0' : 'none',
                        color: selectedSizes[product.id] === size ? '#0a0a0a' : '#f0f0f0',
                        border: '1px solid #2a2a2a',
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
                  onClick={() => addToCart(product)}
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

      {cartOpen && (
        <>
          <div style={s.overlay} onClick={() => setCartOpen(false)} />
          <div style={s.drawer}>
            <div style={s.drawerHeader}>
              <span style={s.drawerTitle}>CART</span>
              <button style={s.closeBtn} onClick={() => setCartOpen(false)}>
                ×
              </button>
            </div>

            {cart.length === 0 ? (
              <p style={s.emptyCart}>YOUR CART IS EMPTY</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={`${item.product.id}-${item.size}`} style={s.cartItemRow}>
                    <div style={s.cartItemLeft}>
                      <p style={s.cartItemName}>{item.product.name}</p>
                      <p style={s.cartItemMeta}>
                        {item.size}&nbsp;·&nbsp;QTY {item.quantity}
                      </p>
                    </div>
                    <div style={s.cartItemRight}>
                      <p style={s.cartItemPrice}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        style={s.removeBtn}
                        onClick={() => removeFromCart(item.product.id, item.size)}
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                ))}
                <div style={s.totalRow}>
                  <span>TOTAL</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button style={s.checkoutBtn} onClick={handleCheckout}>
                  CHECKOUT
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
