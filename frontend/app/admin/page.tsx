'use client'

import { useState, useEffect, useCallback } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type Order = {
  id: number
  stripe_session_id: string
  customer_email: string
  total: number
  status: string
  created_at: string | null
}

type Config = {
  drop_timestamp: string
  gate_password: string
}

// Brutalist utility styles — white bg, black mono text
const mono = "'Courier New', Courier, monospace"

const s = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    color: '#000000',
    fontFamily: mono,
    padding: '48px',
    maxWidth: '1100px',
    margin: '0 auto',
  } as React.CSSProperties,
  header: {
    borderBottom: '4px solid #000',
    paddingBottom: '16px',
    marginBottom: '48px',
  } as React.CSSProperties,
  title: {
    fontSize: '24px',
    fontWeight: 900,
    letterSpacing: '0.2em',
    margin: 0,
  } as React.CSSProperties,
  subtitle: {
    fontSize: '10px',
    letterSpacing: '0.3em',
    color: '#666',
    marginTop: '4px',
  } as React.CSSProperties,
  section: {
    marginBottom: '56px',
  } as React.CSSProperties,
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 900,
    letterSpacing: '0.35em',
    borderBottom: '2px solid #000',
    paddingBottom: '8px',
    marginBottom: '24px',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '12px',
  } as React.CSSProperties,
  th: {
    textAlign: 'left' as const,
    fontSize: '9px',
    letterSpacing: '0.2em',
    fontWeight: 900,
    paddingBottom: '10px',
    borderBottom: '2px solid #000',
  } as React.CSSProperties,
  td: {
    padding: '12px 0',
    borderBottom: '1px solid #ddd',
    verticalAlign: 'top' as const,
  } as React.CSSProperties,
  input: {
    display: 'block',
    width: '100%',
    fontFamily: mono,
    fontSize: '12px',
    padding: '8px 0',
    border: 'none',
    borderBottom: '2px solid #000',
    background: 'none',
    outline: 'none',
    marginBottom: '24px',
    letterSpacing: '0.05em',
  } as React.CSSProperties,
  label: {
    fontSize: '9px',
    fontWeight: 900,
    letterSpacing: '0.25em',
    display: 'block',
    marginBottom: '6px',
  } as React.CSSProperties,
  btn: {
    fontFamily: mono,
    fontSize: '10px',
    fontWeight: 900,
    letterSpacing: '0.25em',
    padding: '12px 32px',
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  } as React.CSSProperties,
  btnOutline: {
    fontFamily: mono,
    fontSize: '10px',
    fontWeight: 900,
    letterSpacing: '0.25em',
    padding: '12px 32px',
    backgroundColor: '#fff',
    color: '#000',
    border: '2px solid #000',
    cursor: 'pointer',
  } as React.CSSProperties,
  error: {
    fontSize: '10px',
    letterSpacing: '0.1em',
    color: '#cc0000',
    marginTop: '8px',
  } as React.CSSProperties,
  success: {
    fontSize: '10px',
    letterSpacing: '0.1em',
    color: '#006600',
    marginTop: '8px',
  } as React.CSSProperties,
  keyGate: {
    maxWidth: '400px',
    margin: '20vh auto 0',
    padding: '48px',
    border: '4px solid #000',
  } as React.CSSProperties,
  empty: {
    fontSize: '11px',
    letterSpacing: '0.15em',
    color: '#999',
    padding: '24px 0',
  } as React.CSSProperties,
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('')
  const [keyInput, setKeyInput] = useState('')
  const [keyError, setKeyError] = useState('')

  const [orders, setOrders] = useState<Order[]>([])
  const [config, setConfig] = useState<Config | null>(null)
  const [dropTimestamp, setDropTimestamp] = useState('')
  const [gatePassword, setGatePassword] = useState('')

  const [configMsg, setConfigMsg] = useState('')
  const [configError, setConfigError] = useState('')
  const [loadingOrders, setLoadingOrders] = useState(false)

  const fetchOrders = useCallback(async (key: string) => {
    setLoadingOrders(true)
    try {
      const res = await fetch(`${API}/api/admin/orders`, {
        credentials: 'include',
        headers: { 'X-Admin-Key': key },
      })
      if (!res.ok) throw new Error()
      setOrders(await res.json())
    } catch {
      // silently fail — key check already validates on auth
    } finally {
      setLoadingOrders(false)
    }
  }, [])

  const authenticate = async () => {
    setKeyError('')
    const res = await fetch(`${API}/api/admin/config`, {
      credentials: 'include',
      headers: { 'X-Admin-Key': keyInput },
    })
    if (res.ok) {
      const data: Config = await res.json()
      setConfig(data)
      setDropTimestamp(data.drop_timestamp || '')
      setAdminKey(keyInput)
      fetchOrders(keyInput)
    } else {
      setKeyError('INVALID KEY')
    }
  }

  const updateConfig = async () => {
    setConfigMsg('')
    setConfigError('')
    const body: { drop_timestamp?: string; gate_password?: string } = {}
    if (dropTimestamp !== config?.drop_timestamp) body.drop_timestamp = dropTimestamp
    if (gatePassword) body.gate_password = gatePassword

    if (Object.keys(body).length === 0) {
      setConfigMsg('NOTHING TO UPDATE')
      return
    }

    const res = await fetch(`${API}/api/admin/config`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Key': adminKey,
      },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setConfigMsg('SAVED')
      setGatePassword('')
      if (body.drop_timestamp !== undefined) {
        setConfig(prev => prev ? { ...prev, drop_timestamp: body.drop_timestamp! } : prev)
      }
    } else {
      setConfigError('UPDATE FAILED')
    }
  }

  // Key entry gate
  if (!adminKey) {
    return (
      <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', fontFamily: mono }}>
        <div style={s.keyGate}>
          <p style={{ fontSize: '9px', letterSpacing: '0.35em', marginBottom: '32px', fontWeight: 900 }}>
            KARISMA // ADMIN ACCESS
          </p>
          <label style={s.label}>X-ADMIN-KEY</label>
          <input
            type="password"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && authenticate()}
            style={s.input}
            autoFocus
          />
          <button style={s.btn} onClick={authenticate}>
            ENTER
          </button>
          {keyError && <p style={s.error}>{keyError}</p>}
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <h1 style={s.title}>KARISMA // ADMIN</h1>
        <p style={s.subtitle}>CONTROL PANEL — INTERNAL USE ONLY</p>
      </div>

      {/* Control Panel */}
      <div style={s.section}>
        <p style={s.sectionTitle}>CONTROL PANEL</p>

        <div style={{ maxWidth: '480px' }}>
          <label style={s.label}>NEXT DROP TIME (ISO 8601)</label>
          <input
            type="text"
            value={dropTimestamp}
            onChange={e => setDropTimestamp(e.target.value)}
            placeholder="e.g. 2026-03-01T00:00:00Z"
            style={s.input}
          />

          <label style={s.label}>GATE PASSWORD (LEAVE BLANK TO KEEP CURRENT)</label>
          <input
            type="password"
            value={gatePassword}
            onChange={e => setGatePassword(e.target.value)}
            placeholder="new password"
            style={s.input}
          />

          <button style={s.btn} onClick={updateConfig}>
            UPDATE CONFIG
          </button>
          {configMsg && <p style={s.success}>{configMsg}</p>}
          {configError && <p style={s.error}>{configError}</p>}
        </div>
      </div>

      {/* Orders Table */}
      <div style={s.section}>
        <p style={s.sectionTitle}>
          ORDERS ({orders.length})
          &nbsp;&nbsp;
          <button
            style={{ ...s.btnOutline, padding: '4px 12px', fontSize: '8px' }}
            onClick={() => fetchOrders(adminKey)}
          >
            REFRESH
          </button>
        </p>

        {loadingOrders ? (
          <p style={s.empty}>LOADING...</p>
        ) : orders.length === 0 ? (
          <p style={s.empty}>NO ORDERS YET.</p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                {['ID', 'EMAIL', 'TOTAL', 'STATUS', 'DATE'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td style={s.td}>#{order.id}</td>
                  <td style={s.td}>{order.customer_email || '—'}</td>
                  <td style={s.td}>${order.total?.toFixed(2) ?? '—'}</td>
                  <td style={{ ...s.td, fontWeight: 900, letterSpacing: '0.1em' }}>
                    {order.status?.toUpperCase()}
                  </td>
                  <td style={{ ...s.td, color: '#666', fontSize: '10px' }}>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
