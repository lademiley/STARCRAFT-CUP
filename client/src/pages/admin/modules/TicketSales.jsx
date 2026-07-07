import React, { useState, useEffect } from 'react'
import { c, StatCard, SectionCard, Badge } from './shared'

const stadiumCapacity = { Regular: 3000, VIP: 1200, VVIP: 200 }

export default function TicketSales() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.ok ? r.json() : { orders: [] })
      .then(d => { setOrders(d.orders || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const confirmed = orders.filter(o => o.status === 'confirmed')
  const totalRevenue = confirmed.reduce((s, o) => s + o.total, 0)
  const totalTickets = confirmed.reduce((s, o) => s + o.items.reduce((t, i) => t + Number(i.qty), 0), 0)
  const pendingCount = orders.filter(o => o.status === 'pending').length

  // Tier breakdown
  const tierCounts = { Regular: 0, VIP: 0, VVIP: 0 }
  confirmed.forEach(o => o.items.forEach(item => {
    const tier = item.tier?.charAt(0).toUpperCase() + item.tier?.slice(1).toLowerCase()
    if (tierCounts[tier] !== undefined) tierCounts[tier] += Number(item.qty)
  }))

  const tierColors = { Regular: '#3B82F6', VIP: '#D4AF37', VVIP: '#EC4899' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>Ticket Sales</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>Live ticket revenue from confirmed payment orders</p>
        </div>
        <a href="#payments" onClick={e => { e.preventDefault() }} style={{ ...c.btn, ...c.btnGhost, textDecoration: 'none', padding: '8px 16px', fontSize: '0.78rem' }}>
          → Manage Payment Orders
        </a>
      </div>

      {loading && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 40 }}>Loading sales data…</p>}

      {!loading && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
            <StatCard label="Total Revenue"      value={`₦${totalRevenue.toLocaleString()}`} icon="💰" color="#22C55E" change="Confirmed payments" />
            <StatCard label="Tickets Confirmed"  value={totalTickets}                          icon="🎫" color="#D4AF37" />
            <StatCard label="Pending Orders"     value={pendingCount}                          icon="⏳" color="#F59E0B" change={pendingCount > 0 ? 'Awaiting review' : 'All clear'} />
            <StatCard label="Total Orders"       value={orders.length}                         icon="📦" color="#3B82F6" />
          </div>

          {/* Tier breakdown */}
          <SectionCard title="🎫 Sales by Tier" action="">
            {totalTickets === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🎟️</div>
                <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>No confirmed ticket sales yet.</p>
                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>Ticket revenue appears here once payment orders are confirmed in the Payment Orders module.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {Object.entries(tierCounts).map(([tier, sold]) => {
                  const capacity = stadiumCapacity[tier]
                  const pct = capacity > 0 ? Math.min(100, Math.round(sold / capacity * 100)) : 0
                  return (
                    <div key={tier}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Badge label={tier} color={tierColors[tier]} />
                          <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{sold} / {capacity.toLocaleString()} sold</span>
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: tierColors[tier] }}>{pct}% full</span>
                      </div>
                      <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: tierColors[tier], borderRadius: 4, transition: 'width 600ms' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </SectionCard>

          {/* Recent confirmed orders */}
          {confirmed.length > 0 && (
            <SectionCard title="✅ Recent Confirmed Sales" action="">
              {confirmed.slice(0, 8).map((o, i) => (
                <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < Math.min(confirmed.length, 8) - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{o.userName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{o.ref} · {new Date(o.confirmedAt || o.createdAt).toLocaleDateString('en-NG')}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#D4AF37' }}>₦{o.total.toLocaleString()}</div>
                </div>
              ))}
            </SectionCard>
          )}
        </>
      )}
    </div>
  )
}
