'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'


export default function CheckoutSummaryPage() {
  const { items: cart } = useCart()
  const router = useRouter()

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const handleProceed = () => {
    if (cart.length === 0) return
    router.push('/checkout')
  }

  return (
    <>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0a0a0a',
          color: '#f0f0f0',
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {/* Header */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 48px',
            borderBottom: '3px solid #f0f0f0',
          }}
        >
          <button
            onClick={() => router.back()}
            style={{
              background: 'none',
              border: 'none',
              color: '#555',
              fontSize: '11px',
              letterSpacing: '0.2em',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ← BACK
          </button>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.35em',
            }}
          >
            KARISMA
          </span>
          <span style={{ width: '60px' }} />
        </header>

        {/* Content */}
        <main
          style={{
            maxWidth: '760px',
            margin: '0 auto',
            padding: '64px 48px',
          }}
        >
          <p
            style={{
              fontSize: '10px',
              letterSpacing: '0.35em',
              color: '#555',
              marginBottom: '8px',
              textTransform: 'uppercase',
            }}
          >
            ORDER SUMMARY
          </p>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 700,
              letterSpacing: '0.06em',
              marginBottom: '48px',
            }}
          >
            REVIEW YOUR COLLECTION
          </h1>

          {cart.length === 0 ? (
            <p
              style={{
                color: '#444',
                fontSize: '12px',
                letterSpacing: '0.15em',
                paddingTop: '48px',
              }}
            >
              YOUR CART IS EMPTY.{' '}
              <button
                onClick={() => router.push('/')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#888',
                  cursor: 'pointer',
                  fontSize: '12px',
                  letterSpacing: '0.15em',
                  textDecoration: 'underline',
                  fontFamily: 'inherit',
                }}
              >
                RETURN TO ARCHIVE
              </button>
            </p>
          ) : (
            <>
              {/* Item list — thick dividers, no box borders */}
              <div>
                {cart.map((item, i) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '24px',
                      paddingTop: i === 0 ? 0 : '28px',
                      paddingBottom: '28px',
                      borderBottom: '3px solid #f0f0f0',
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      position: 'relative',
                      width: '96px',
                      height: '120px',
                      flexShrink: 0,
                      overflow: 'hidden',
                      backgroundColor: '#111',
                    }}>
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        unoptimized
                        style={{ objectFit: 'cover' }}
                        sizes="96px"
                      />
                    </div>

                    {/* Name + meta */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: '20px',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          marginBottom: '8px',
                        }}
                      >
                        {item.product.name}
                      </p>
                      <p
                        style={{
                          fontSize: '11px',
                          letterSpacing: '0.15em',
                          color: '#666',
                          textTransform: 'uppercase',
                        }}
                      >
                        SIZE {item.size}&nbsp;&nbsp;·&nbsp;&nbsp;QTY {item.quantity}
                      </p>
                    </div>

                    {/* Price */}
                    <p
                      style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        fontFamily: "'Courier New', Courier, monospace",
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  paddingTop: '32px',
                  marginBottom: '48px',
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.3em',
                    color: '#555',
                    textTransform: 'uppercase',
                  }}
                >
                  TOTAL
                </p>
                <p
                  style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    fontFamily: "'Courier New', Courier, monospace",
                  }}
                >
                  ${total.toFixed(2)}
                </p>
              </div>

              {/* Checkout button */}
              <button
                onClick={handleProceed}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '20px 0',
                  backgroundColor: '#f0f0f0',
                  color: '#0a0a0a',
                  border: 'none',
                  borderRadius: 0,
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                PROCEED TO CHECKOUT
              </button>

              <p
                style={{
                  textAlign: 'center',
                  marginTop: '16px',
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  color: '#333',
                }}
              >
                SECURED BY STRIPE
              </p>
            </>
          )}
        </main>
      </div>
    </>
  )
}
