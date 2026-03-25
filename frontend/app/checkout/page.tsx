'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, ExpressCheckoutElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '@/context/CartContext'
import { createPaymentIntent } from '@/lib/api'
import type { CartItem } from '@/types'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

/* ─── Shared brutalist styles ─── */
const FONT = "'Inter', 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Courier New', Courier, monospace"

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  backgroundColor: '#111',
  color: '#f0f0f0',
  border: '3px solid #f0f0f0',
  borderRadius: 0,
  fontSize: '13px',
  letterSpacing: '0.05em',
  fontFamily: FONT,
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '10px',
  fontWeight: 700,
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
  color: '#888',
  marginBottom: '8px',
}

const sectionHeader: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 900,
  letterSpacing: '0.3em',
  textTransform: 'uppercase',
  paddingBottom: '16px',
  borderBottom: '3px solid #f0f0f0',
  marginBottom: '24px',
}

/* ─── Payment form (inside Elements provider) ─── */
function PaymentForm({
  shipping,
  cart,
  total,
}: {
  shipping: { firstName: string; lastName: string; email: string; address: string; city: string; state: string; zip: string }
  cart: CartItem[]
  total: number
}) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { clearCart } = useCart()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setError('')

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message || 'Validation failed')
      setProcessing(false)
      return
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
        payment_method_data: {
          billing_details: {
            name: `${shipping.firstName} ${shipping.lastName}`,
            email: shipping.email,
            address: {
              line1: shipping.address,
              city: shipping.city,
              state: shipping.state,
              postal_code: shipping.zip,
            },
          },
        },
      },
    })

    if (confirmError) {
      setError(confirmError.message || 'Payment failed')
      setProcessing(false)
    } else {
      clearCart()
    }
  }

  const onExpressCheckoutConfirm = async () => {
    if (!stripe || !elements) return
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    })
    if (confirmError) {
      setError(confirmError.message || 'Payment failed')
    } else {
      clearCart()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Express checkout — Shop Pay, Apple Pay, Google Pay */}
      <h2 style={sectionHeader}>EXPRESS CHECKOUT</h2>
      <ExpressCheckoutElement
        onConfirm={onExpressCheckoutConfirm}
        options={{
          paymentMethods: {
            applePay: 'auto',
            googlePay: 'auto',
            link: 'auto',
          },
        }}
      />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        margin: '32px 0',
      }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }} />
        <span style={{
          fontSize: '10px',
          letterSpacing: '0.25em',
          color: '#555',
          textTransform: 'uppercase',
        }}>OR PAY WITH CARD</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#333' }} />
      </div>

      <h2 style={sectionHeader}>PAYMENT</h2>
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />
      {error && (
        <p style={{
          color: '#ff4444',
          fontSize: '11px',
          letterSpacing: '0.1em',
          marginTop: '16px',
        }}>
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        style={{
          display: 'block',
          width: '100%',
          padding: '20px 0',
          marginTop: '32px',
          backgroundColor: processing ? '#333' : '#f0f0f0',
          color: processing ? '#666' : '#0a0a0a',
          border: 'none',
          borderRadius: 0,
          fontFamily: MONO,
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          cursor: processing ? 'not-allowed' : 'pointer',
        }}
      >
        {processing ? 'PROCESSING...' : `PAY $${total.toFixed(2)}`}
      </button>
      <p style={{
        textAlign: 'center',
        marginTop: '12px',
        fontSize: '9px',
        letterSpacing: '0.15em',
        color: '#333',
      }}>
        SECURED BY STRIPE
      </p>
    </form>
  )
}

/* ─── Main checkout page ─── */
export default function CheckoutPage() {
  const router = useRouter()
  const { items: cartItems } = useCart()
  const [clientSecret, setClientSecret] = useState('')
  const [loading, setLoading] = useState(true)
  const [initError, setInitError] = useState('')

  // Shipping form state
  const [shipping, setShipping] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  })

  const total = cartItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  // Create PaymentIntent on mount
  useEffect(() => {
    if (cartItems.length === 0) {
      setLoading(false)
      return
    }

    createPaymentIntent(cartItems)
      .then((res) => {
        setClientSecret(res.client_secret)
        setLoading(false)
      })
      .catch((err) => {
        setInitError(err.message || 'Failed to initialize payment')
        setLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const updateField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setShipping((prev) => ({ ...prev, [field]: e.target.value }))
  }

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: MONO,
        fontSize: '12px',
        letterSpacing: '0.3em',
      }}>
        LOADING...
      </div>
    )
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        fontFamily: FONT,
      }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.25em', color: '#555' }}>
          YOUR CART IS EMPTY
        </p>
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'none',
            border: '3px solid #f0f0f0',
            borderRadius: 0,
            color: '#f0f0f0',
            padding: '14px 40px',
            fontFamily: MONO,
            fontSize: '11px',
            letterSpacing: '0.25em',
            cursor: 'pointer',
          }}
        >
          RETURN TO ARCHIVE
        </button>
      </div>
    )
  }

  // Init error
  if (initError) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0a0a0a',
        color: '#ff4444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: MONO,
        fontSize: '12px',
        letterSpacing: '0.15em',
        padding: '24px',
        textAlign: 'center',
      }}>
        {initError}
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: '#f0f0f0',
      fontFamily: FONT,
    }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 48px',
        borderBottom: '3px solid #f0f0f0',
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            color: '#555',
            fontSize: '11px',
            letterSpacing: '0.2em',
            cursor: 'pointer',
            fontFamily: FONT,
          }}
        >
          ← BACK
        </button>
        <span style={{
          fontSize: '12px',
          fontWeight: 900,
          letterSpacing: '0.35em',
        }}>
          KARISMA
        </span>
        <span style={{ width: '60px' }} />
      </header>

      {/* 60/40 Split */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '3fr 2fr',
        minHeight: 'calc(100vh - 73px)',
      }}>
        {/* LEFT — Shipping + Contact + Payment */}
        <div style={{
          padding: '48px',
          borderRight: '3px solid #f0f0f0',
          overflowY: 'auto',
        }}>
          {/* CONTACT */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={sectionHeader}>CONTACT</h2>
            <div>
              <label style={labelStyle}>EMAIL</label>
              <input
                type="email"
                required
                value={shipping.email}
                onChange={updateField('email')}
                placeholder="you@email.com"
                style={inputStyle}
              />
            </div>
          </div>

          {/* SHIPPING */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={sectionHeader}>SHIPPING</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>FIRST NAME</label>
                <input
                  type="text"
                  required
                  value={shipping.firstName}
                  onChange={updateField('firstName')}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>LAST NAME</label>
                <input
                  type="text"
                  required
                  value={shipping.lastName}
                  onChange={updateField('lastName')}
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <label style={labelStyle}>ADDRESS</label>
              <input
                type="text"
                required
                value={shipping.address}
                onChange={updateField('address')}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px', marginTop: '16px' }}>
              <div>
                <label style={labelStyle}>CITY</label>
                <input
                  type="text"
                  required
                  value={shipping.city}
                  onChange={updateField('city')}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>STATE</label>
                <input
                  type="text"
                  required
                  value={shipping.state}
                  onChange={updateField('state')}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>ZIP</label>
                <input
                  type="text"
                  required
                  value={shipping.zip}
                  onChange={updateField('zip')}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* PAYMENT (Stripe Payment Element) */}
          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#f0f0f0',
                    colorBackground: '#111',
                    colorText: '#f0f0f0',
                    colorDanger: '#ff4444',
                    fontFamily: FONT,
                    borderRadius: '0px',
                    spacingUnit: '4px',
                  },
                  rules: {
                    '.Input': {
                      border: '3px solid #f0f0f0',
                      borderRadius: '0px',
                      backgroundColor: '#111',
                      fontSize: '13px',
                      letterSpacing: '0.05em',
                    },
                    '.Input:focus': {
                      borderColor: '#fff',
                      boxShadow: 'none',
                    },
                    '.Label': {
                      fontSize: '10px',
                      fontWeight: '700',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      color: '#888',
                    },
                    '.Tab': {
                      border: '3px solid #333',
                      borderRadius: '0px',
                      backgroundColor: '#111',
                    },
                    '.Tab--selected': {
                      border: '3px solid #f0f0f0',
                      backgroundColor: '#1a1a1a',
                    },
                  },
                },
              }}
            >
              <PaymentForm shipping={shipping} cart={cartItems} total={total} />
            </Elements>
          )}
        </div>

        {/* RIGHT — Sticky Order Summary */}
        <div style={{
          padding: '48px',
          position: 'sticky',
          top: 0,
          height: 'fit-content',
          maxHeight: '100vh',
          overflowY: 'auto',
        }}>
          <h2 style={sectionHeader}>ORDER SUMMARY</h2>

          {/* Items */}
          <div>
            {cartItems.map((item, i) => (
              <div
                key={`${item.product.id}-${item.size}`}
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  paddingTop: i === 0 ? 0 : '20px',
                  paddingBottom: '20px',
                  borderBottom: '3px solid #f0f0f0',
                }}
              >
                {/* Thumbnail */}
                <div style={{
                  position: 'relative',
                  width: '80px',
                  height: '100px',
                  flexShrink: 0,
                  overflow: 'hidden',
                  backgroundColor: '#111',
                  border: '3px solid #f0f0f0',
                }}>
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    unoptimized
                    style={{ objectFit: 'cover' }}
                    sizes="80px"
                  />
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '6px',
                  }}>
                    {item.product.name}
                  </p>
                  <p style={{
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    color: '#666',
                    textTransform: 'uppercase',
                  }}>
                    SIZE {item.size} · QTY {item.quantity}
                  </p>
                </div>

                {/* Price */}
                <p style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: MONO,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Subtotal / Total */}
          <div style={{
            paddingTop: '24px',
            borderTop: 'none',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '12px',
            }}>
              <span style={{
                fontSize: '10px',
                letterSpacing: '0.25em',
                color: '#666',
                textTransform: 'uppercase',
              }}>
                SUBTOTAL
              </span>
              <span style={{
                fontSize: '13px',
                fontFamily: MONO,
              }}>
                ${total.toFixed(2)}
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: '12px',
            }}>
              <span style={{
                fontSize: '10px',
                letterSpacing: '0.25em',
                color: '#666',
                textTransform: 'uppercase',
              }}>
                SHIPPING
              </span>
              <span style={{
                fontSize: '13px',
                fontFamily: MONO,
                color: '#666',
              }}>
                CALCULATED AT NEXT STEP
              </span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingTop: '20px',
              borderTop: '3px solid #f0f0f0',
            }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
              }}>
                TOTAL
              </span>
              <span style={{
                fontSize: '24px',
                fontWeight: 700,
                fontFamily: MONO,
              }}>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
