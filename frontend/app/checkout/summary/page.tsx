'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createCheckoutSession } from '@/lib/api'
import type { CartItem } from '@/types'

// Glitch animation keyframes injected as a style tag
const GLITCH_CSS = `
@keyframes glitch-skew {
  0%, 100% { transform: skewX(0deg); }
  10% { transform: skewX(-4deg); }
  20% { transform: skewX(4deg); }
  30% { transform: skewX(-2deg); }
  40% { transform: skewX(2deg); }
  50% { transform: skewX(-4deg); }
  60% { transform: skewX(0deg); }
}
@keyframes glitch-clip-1 {
  0%, 100% { clip-path: inset(40% 0 55% 0); transform: translate(-4px, 0); }
  20%       { clip-path: inset(10% 0 80% 0); transform: translate(4px, 0); }
  40%       { clip-path: inset(60% 0 20% 0); transform: translate(-4px, 0); }
  60%       { clip-path: inset(25% 0 60% 0); transform: translate(4px, 0); }
  80%       { clip-path: inset(80% 0 5%  0); transform: translate(-4px, 0); }
}
@keyframes glitch-clip-2 {
  0%, 100% { clip-path: inset(60% 0 20% 0); transform: translate(4px, 0); color: #c8b89a; }
  20%       { clip-path: inset(85% 0 5%  0); transform: translate(-4px, 0); }
  40%       { clip-path: inset(15% 0 70% 0); transform: translate(4px, 0); color: #c8b89a; }
  60%       { clip-path: inset(50% 0 35% 0); transform: translate(-4px, 0); }
  80%       { clip-path: inset(5%  0 90% 0); transform: translate(4px, 0); }
}
@keyframes scanline {
  0%   { transform: translateY(-100vh); }
  100% { transform: translateY(100vh); }
}
.glitch-text {
  position: relative;
  animation: glitch-skew 0.8s infinite linear alternate-reverse;
}
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  font: inherit;
  color: inherit;
}
.glitch-text::before {
  animation: glitch-clip-1 0.6s infinite linear alternate-reverse;
}
.glitch-text::after {
  animation: glitch-clip-2 0.5s infinite linear alternate-reverse;
}
`

function ProcessingOverlay() {
  return (
    <>
      <style>{GLITCH_CSS}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#0a0a0a',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          overflow: 'hidden',
        }}
      >
        {/* Scanline sweep */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(transparent 50%, rgba(200,184,154,0.03) 50%)',
            backgroundSize: '100% 4px',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '2px',
            backgroundColor: 'rgba(200,184,154,0.15)',
            animation: 'scanline 1.8s linear infinite',
          }}
        />

        <p
          className="glitch-text"
          data-text="PROCESSING TRANSACTION"
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: 'clamp(14px, 3vw, 22px)',
            letterSpacing: '0.35em',
            color: '#f0f0f0',
            textTransform: 'uppercase',
            userSelect: 'none',
          }}
        >
          PROCESSING TRANSACTION
        </p>

        <p
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: '10px',
            letterSpacing: '0.25em',
            color: '#444',
            textTransform: 'uppercase',
          }}
        >
          DO NOT CLOSE THIS WINDOW
        </p>
      </div>
    </>
  )
}

export default function CheckoutSummaryPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('karisma_cart')
      if (stored) setCart(JSON.parse(stored))
    } catch {
      // sessionStorage unavailable
    }
  }, [])

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const handleProceed = async () => {
    if (cart.length === 0) return
    setIsProcessing(true)
    setError(null)
    try {
      const { checkout_url } = await createCheckoutSession(cart, window.location.origin)
      window.location.href = checkout_url
    } catch (err) {
      setIsProcessing(false)
      setError(err instanceof Error ? err.message : 'Payment setup failed. Try again.')
    }
  }

  return (
    <>
      {isProcessing && <ProcessingOverlay />}

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
            borderBottom: '1px solid #1a1a1a',
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
            REVIEW YOUR DROP
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
              {/* Item list — King Spider style: thick dividers, no box borders */}
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
                      borderBottom: '4px solid #f0f0f0',
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

              {error && (
                <p
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    color: '#c8b89a',
                    marginBottom: '24px',
                  }}
                >
                  {error}
                </p>
              )}

              {/* Proceed button — full-width, white block with dark monospace text */}
              <button
                onClick={handleProceed}
                disabled={isProcessing}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '20px 0',
                  backgroundColor: '#f0f0f0',
                  color: '#0a0a0a',
                  border: 'none',
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.35em',
                  textTransform: 'uppercase',
                  cursor: isProcessing ? 'default' : 'pointer',
                  opacity: isProcessing ? 0.6 : 1,
                }}
              >
                PROCEED TO PAYMENT
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
