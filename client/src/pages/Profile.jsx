import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const BANK = {
  name: 'First Bank Nigeria',
  accountName: 'StarCraft Cup 2026 Tournament Committee',
  accountNumber: '3085762491',
}

function qrUrl(data, size = 220) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&bgcolor=1a0103&color=D4AF37&margin=10`
}

function qrData(order, item) {
  return [
    `STARCRAFT CUP 2026`,
    `REF:${order.ref}`,
    `TICKET:${item.tier.toUpperCase()}`,
    `MATCH:${item.fixture.homeTeam} vs ${item.fixture.awayTeam}`,
    `DATE:${item.fixture.date} ${item.fixture.time}`,
    `VENUE:${item.fixture.venue}`,
    `FAN:${order.userName}`,
    `EMAIL:${order.userEmail}`,
  ].join('|')
}

function StatusBadge({ status }) {
  const map = {
    pending:   { label: 'Awaiting Confirmation', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
    confirmed: { label: 'Payment Confirmed ✓',   color: '#22C55E', bg: 'rgba(34,197,94,0.12)'  },
    rejected:  { label: 'Payment Rejected',       color: '#EF4444', bg: 'rgba(239,68,68,0.12)'  },
  }
  const s = map[status] || map.pending
  return (
    <span style={{
      padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem',
      fontFamily: 'var(--font-secondary)', fontWeight: 800, letterSpacing: '0.5px',
      color: s.color, background: s.bg, border: `1px solid ${s.color}44`,
    }}>{s.label}</span>
  )
}

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const imgRefs = useRef({})

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetch('/api/orders/my', { credentials: 'include' })
      .then(r => r.ok ? r.json() : { orders: [] })
      .then(d => { setOrders(d.orders || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  const handleDownloadQr = async (order, item, idx) => {
    const url = qrUrl(qrData(order, item), 400)
    const link = document.createElement('a')
    link.href = url
    link.download = `ticket-${order.ref}-${idx + 1}.png`
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!user) return null

  const confirmedCount = orders.filter(o => o.status === 'confirmed').length
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const totalTickets = orders.filter(o => o.status === 'confirmed').reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.qty, 0), 0)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0d0102 0%, #2a0406 60%, #0d0102 100%)', paddingBottom: 80 }}>
      {/* Hero band */}
      <div style={{ background: 'linear-gradient(90deg, rgba(212,175,55,0.08) 0%, rgba(139,14,18,0.3) 50%, rgba(212,175,55,0.08) 100%)', borderBottom: '1px solid rgba(212,175,55,0.15)', padding: '100px 0 32px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '0.72rem', letterSpacing: '3px', color: 'rgba(212,175,55,0.6)', textTransform: 'uppercase', marginBottom: 6 }}>Fan Portal</div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,4vw,2.5rem)', margin: 0 }}>
              👤 My <span style={{ color: 'var(--gold)' }}>Profile</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: 8, marginBottom: 0 }}>{user.name} · {user.email}</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/tickets" className="btn btn-primary btn-sm">🎫 Buy More Tickets</Link>
            <button onClick={() => { logout(); navigate('/login') }} className="btn btn-secondary btn-sm">Sign Out</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px' }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 36 }}>
          {[
            { label: 'Confirmed Bookings', value: confirmedCount, icon: '✅', color: '#22C55E' },
            { label: 'Tickets to Attend', value: totalTickets, icon: '🎫', color: '#D4AF37' },
            { label: 'Awaiting Confirmation', value: pendingCount, icon: '⏳', color: '#F59E0B' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ fontSize: '2rem' }}>{s.icon}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: s.color, fontWeight: 900, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-secondary)', marginTop: 4 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <h3 style={{ color: 'var(--gold)', fontFamily: 'var(--font-secondary)', fontSize: '0.78rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20 }}>
          My Bookings
        </h3>

        {loading && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>Loading…</p>}

        {!loading && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎫</div>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>You haven't purchased any tickets yet.</p>
            <Link to="/tickets" className="btn btn-primary" style={{ justifyContent: 'center' }}>Browse Matches & Buy Tickets</Link>
          </div>
        )}

        {orders.map(order => (
          <div key={order.id} style={{ background: 'rgba(255,255,255,0.03)', border: order.status === 'confirmed' ? '1px solid rgba(34,197,94,0.25)' : order.status === 'rejected' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(245,158,11,0.2)', borderRadius: 14, marginBottom: 20, overflow: 'hidden' }}>
            {/* Order header */}
            <div
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              style={{ padding: '20px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>Booking #{order.ref}</span>
                  <StatusBadge status={order.status} />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                  {order.items.reduce((s, i) => s + i.qty, 0)} ticket{order.items.reduce((s, i) => s + i.qty, 0) !== 1 ? 's' : ''} ·
                  Placed {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--gold)', fontWeight: 900 }}>₦{order.total.toLocaleString()}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem' }}>{expandedOrder === order.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {expandedOrder === order.id && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px' }}>
                {/* Bank transfer reminder for pending */}
                {order.status === 'pending' && (
                  <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, padding: '16px 20px', marginBottom: 24 }}>
                    <div style={{ fontFamily: 'var(--font-secondary)', fontWeight: 800, color: '#F59E0B', marginBottom: 8, fontSize: '0.8rem', letterSpacing: '1px' }}>
                      ⏳ AWAITING PAYMENT CONFIRMATION
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: 0 }}>
                      Transfer <strong style={{ color: '#fff' }}>₦{order.total.toLocaleString()}</strong> to{' '}
                      <strong style={{ color: '#fff' }}>{BANK.accountName}</strong> · {BANK.name} · <strong style={{ color: 'var(--gold)' }}>{BANK.accountNumber}</strong> using reference <strong style={{ color: 'var(--gold)' }}>{order.ref}</strong>.
                      Your QR code ticket(s) will appear here and be sent to your email once confirmed.
                    </p>
                  </div>
                )}

                {order.status === 'rejected' && (
                  <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, padding: '16px 20px', marginBottom: 24 }}>
                    <div style={{ fontFamily: 'var(--font-secondary)', fontWeight: 800, color: '#EF4444', marginBottom: 6, fontSize: '0.8rem' }}>
                      ❌ PAYMENT COULD NOT BE CONFIRMED
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: 0 }}>
                      Please contact us at <strong style={{ color: 'var(--gold)' }}>tickets@starcraftcup.ng</strong> quoting reference <strong>{order.ref}</strong>.
                    </p>
                  </div>
                )}

                {/* Ticket items */}
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', marginBottom: 6 }}>
                          {item.fixture.homeTeam} vs {item.fixture.awayTeam}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>
                          📅 {new Date(item.fixture.date).toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'long' })} · {item.fixture.time}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>
                          📍 {item.fixture.venue}
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)', color: 'var(--gold)', padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontFamily: 'var(--font-secondary)', fontWeight: 700 }}>
                            {item.tier.toUpperCase()} STAND
                          </span>
                          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', alignSelf: 'center' }}>× {item.qty}</span>
                        </div>
                      </div>

                      {/* QR code for confirmed tickets */}
                      {order.status === 'confirmed' && (
                        <div style={{ textAlign: 'center', flexShrink: 0 }}>
                          <div style={{ background: '#1a0103', border: '2px solid rgba(212,175,55,0.4)', borderRadius: 12, padding: 8, display: 'inline-block', marginBottom: 10 }}>
                            <img
                              src={qrUrl(qrData(order, item))}
                              alt="Ticket QR Code"
                              width={140}
                              height={140}
                              style={{ display: 'block', borderRadius: 6 }}
                            />
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>Scan at gate</div>
                          <button
                            onClick={() => handleDownloadQr(order, item, idx)}
                            className="btn btn-secondary btn-sm"
                            style={{ justifyContent: 'center', width: '100%', fontSize: '0.75rem' }}
                          >
                            ⬇️ Download QR
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
