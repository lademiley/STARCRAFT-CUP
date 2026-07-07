import React, { useState, useEffect } from 'react'
import { ModuleHeader, SectionCard, Badge, StatCard } from './shared'

function StatusBadge({ status }) {
  const map = {
    pending:   { label: 'Pending',   color: '#F59E0B' },
    confirmed: { label: 'Confirmed', color: '#22C55E' },
    rejected:  { label: 'Rejected',  color: '#EF4444' },
  }
  const s = map[status] || map.pending
  return <Badge label={s.label} color={s.color} />
}

export default function PaymentOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState(null)
  const [toast, setToast] = useState('')

  const load = () => {
    fetch('/api/orders')
      .then(r => r.ok ? r.json() : { orders: [] })
      .then(d => { setOrders(d.orders || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const confirm = async (id) => {
    setActionLoading(id + '_confirm')
    const res = await fetch(`/api/orders/${id}/confirm`, { method: 'PATCH' })
    if (res.ok) { load(); showToast('✅ Payment confirmed — QR code activated on fan profile') }
    setActionLoading(null)
  }

  const reject = async (id) => {
    setActionLoading(id + '_reject')
    const res = await fetch(`/api/orders/${id}/reject`, { method: 'PATCH' })
    if (res.ok) { load(); showToast('❌ Order rejected') }
    setActionLoading(null)
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const pendingCount = orders.filter(o => o.status === 'pending').length
  const confirmedCount = orders.filter(o => o.status === 'confirmed').length
  const totalRevenue = orders.filter(o => o.status === 'confirmed').reduce((s, o) => s + o.total, 0)

  return (
    <div style={{ position: 'relative' }}>
      <ModuleHeader title="Payment Orders" subtitle="Review fan bank transfers and confirm tickets" />

      {toast && (
        <div style={{ position: 'fixed', top: 24, right: 24, background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 10, padding: '12px 20px', zIndex: 9999, fontFamily: 'var(--font-secondary)', fontSize: '0.85rem', color: '#fff', boxShadow: '0 8px 30px rgba(0,0,0,0.6)' }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Orders" value={orders.length} icon="📦" color="#3B82F6" />
        <StatCard label="Pending Review" value={pendingCount} icon="⏳" color="#F59E0B" change={pendingCount > 0 ? 'Needs action' : 'All clear'} />
        <StatCard label="Confirmed" value={confirmedCount} icon="✅" color="#22C55E" />
        <StatCard label="Revenue Confirmed" value={`₦${totalRevenue.toLocaleString()}`} icon="💰" color="#D4AF37" />
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['all','All'], ['pending','Pending'], ['confirmed','Confirmed'], ['rejected','Rejected']].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setFilter(v)}
            style={{
              padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.78rem',
              background: filter === v ? 'var(--gold)' : 'rgba(255,255,255,0.06)',
              color: filter === v ? '#000' : 'rgba(255,255,255,0.6)',
              transition: 'all 200ms',
            }}
          >{l}{v === 'pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}</button>
        ))}
        <button onClick={load} style={{ marginLeft: 'auto', padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'var(--font-secondary)' }}>
          🔄 Refresh
        </button>
      </div>

      {loading && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 40 }}>Loading orders…</p>}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>No {filter !== 'all' ? filter : ''} orders yet.</p>
        </div>
      )}

      {filtered.map(order => (
        <div key={order.id} style={{ background: 'rgba(255,255,255,0.03)', border: order.status === 'pending' ? '1px solid rgba(245,158,11,0.3)' : order.status === 'confirmed' ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(239,68,68,0.2)', borderRadius: 14, marginBottom: 16, overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem' }}>{order.ref}</span>
                <StatusBadge status={order.status} />
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
                Fan: <strong style={{ color: 'rgba(255,255,255,0.75)' }}>{order.userName}</strong> · {order.userEmail}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>
                Submitted: {new Date(order.createdAt).toLocaleString('en-NG')}
                {order.confirmedAt && ` · Confirmed: ${new Date(order.confirmedAt).toLocaleString('en-NG')}`}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--gold)', fontWeight: 900 }}>₦{order.total.toLocaleString()}</span>
              {order.status === 'pending' && (
                <>
                  <button
                    onClick={() => confirm(order.id)}
                    disabled={!!actionLoading}
                    style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(34,197,94,0.4)', background: 'rgba(34,197,94,0.2)', color: '#22C55E', fontFamily: 'var(--font-secondary)', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 200ms' }}
                  >
                    {actionLoading === order.id + '_confirm' ? '…' : '✅ Confirm Payment'}
                  </button>
                  <button
                    onClick={() => reject(order.id)}
                    disabled={!!actionLoading}
                    style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontFamily: 'var(--font-secondary)', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 200ms' }}
                  >
                    {actionLoading === order.id + '_reject' ? '…' : '❌ Reject'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Ticket items */}
          <div style={{ padding: '14px 22px' }}>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < order.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 2 }}>
                    {item.fixture.homeTeam} vs {item.fixture.awayTeam}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                    {item.fixture.round} · {item.fixture.date} {item.fixture.time} · {item.fixture.venue}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase' }}>{item.tier}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}> × {item.qty}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
