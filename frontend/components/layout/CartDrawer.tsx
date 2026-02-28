'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
  const { items, removeItem, itemCount, isDrawerOpen, closeDrawer } = useCart()
  const router = useRouter()

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  const handleCheckout = () => {
    closeDrawer()
    router.push('/checkout/summary')
  }

  if (!isDrawerOpen) return null

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          zIndex: 200,
        }}
        onClick={closeDrawer}
      />
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: '380px',
        backgroundColor: 'var(--bg)',
        borderLeft: '1px solid var(--border)',
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px',
        overflowY: 'auto',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.25em' }}>
            CART
          </span>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--fg-muted)',
              fontSize: '18px',
              cursor: 'pointer',
              lineHeight: 1,
            }}
            onClick={closeDrawer}
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <p style={{
            color: 'var(--fg-muted)',
            fontSize: '11px',
            letterSpacing: '0.15em',
            marginTop: '48px',
            textAlign: 'center',
          }}>
            YOUR CART IS EMPTY
          </p>
        ) : (
          <>
            {items.map((item, index) => (
              <div
                key={`${item.product.id}-${item.size}-${index}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  paddingBottom: '20px',
                  marginBottom: '20px',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '11px', letterSpacing: '0.1em', marginBottom: '4px', textTransform: 'uppercase' }}>
                    {item.product.name}
                  </p>
                  <p style={{ fontSize: '10px', color: 'var(--fg-muted)', letterSpacing: '0.08em' }}>
                    {item.size}&nbsp;·&nbsp;QTY {item.quantity}
                  </p>
                </div>
                <div style={{ textAlign: 'right', minWidth: '80px' }}>
                  <p style={{ fontSize: '11px', marginBottom: '8px' }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--fg-muted)',
                      fontSize: '10px',
                      cursor: 'pointer',
                      letterSpacing: '0.08em',
                      textDecoration: 'underline',
                    }}
                    onClick={() => removeItem(index)}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            ))}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: '20px',
              marginTop: 'auto',
              fontSize: '12px',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}>
              <span>TOTAL</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              style={{
                width: '100%',
                padding: '15px 0',
                backgroundColor: 'var(--fg)',
                color: 'var(--bg)',
                border: 'none',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.25em',
                cursor: 'pointer',
                marginTop: '16px',
              }}
              onClick={handleCheckout}
            >
              CHECKOUT
            </button>
          </>
        )}
      </div>
    </>
  )
}
