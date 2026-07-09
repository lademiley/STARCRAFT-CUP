import React, { useState, useEffect } from 'react'
import { c, StatCard, SectionCard, Badge } from './shared'

const topScorers = []

const activity = []

const typeColor = { match: '#3B82F6', user: '#22C55E', finance: '#F59E0B', content: '#EC4899', people: '#8B5CF6' }

const revenueData = []

export default function DashboardAnalytics() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.ok ? r.json() : { orders: [] })
      .then(d => setOrders(d.orders || []))
      .catch(() => {})
  }, [])

  const confirmedRevenue = orders.filter(o => o.status === 'confirmed').reduce((s, o) => s + o.total, 0)
  const pendingOrders = orders.filter(o => o.status === 'pending').length

  const stats = [
    { label: 'Registered Teams',   value: '0',  icon: '🏆', change: '—', color: '#D4AF37' },
    { label: 'Registered Players', value: '0',  icon: '👤', change: '—', color: '#3B82F6' },
    { label: 'Matches Played',     value: '0',  icon: '⚽', change: '—', color: '#22C55E' },
    { label: 'Ticket Revenue',     value: confirmedRevenue > 0 ? `₦${(confirmedRevenue/1000).toFixed(0)}K` : '₦0', icon: '🎫', change: pendingOrders > 0 ? `${pendingOrders} pending` : '—', color: '#F59E0B' },
    { label: 'Individual Registrations', value: '0',  icon: '👥', change: '—', color: '#EC4899' },
    { label: 'Active Sponsors',    value: '0',  icon: '💼', change: '—', color: '#8B5CF6' },
    { label: 'Volunteers',         value: '0',  icon: '🤝', change: '—', color: '#14B8A6' },
    { label: 'News Articles',      value: '0',  icon: '📰', change: '—', color: '#F97316' },
  ]

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...c.card, borderTop: `3px solid ${s.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{ fontSize: '1.8rem' }}>{s.icon}</span>
              <span style={{ ...c.badge, background: `${s.color}20`, color: s.color, border: `1px solid ${s.color}30` }}>↑</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: '0.7rem', color: s.color, fontWeight: 600 }}>{s.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 24 }}>
        <SectionCard title="📈 Monthly Ticket Revenue (₦)" action="">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 180, padding: '0 0 8px' }}>
            {revenueData.map(({ month, val }) => (
              <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>{Math.round(val * 0.9)}K</div>
                <div style={{
                  flex: 1, width: '100%', maxHeight: `${val}%`, alignSelf: 'flex-end',
                  background: val === 100 ? 'linear-gradient(180deg,#D4AF37,#8C6A12)' : 'linear-gradient(180deg,rgba(212,175,55,0.5),rgba(212,175,55,0.15))',
                  borderRadius: '4px 4px 0 0', minHeight: 8,
                  border: val === 100 ? '1px solid #D4AF37' : '1px solid rgba(212,175,55,0.2)',
                }} />
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{month}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: 8, textAlign: 'center' }}>Dec 2026 — peak month (tournament group stage)</div>
        </SectionCard>

        <SectionCard title="🥇 Golden Boot Race" action="">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topScorers.map((p, i) => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, background: i === 0 ? 'linear-gradient(135deg,#D4AF37,#8C6A12)' : i === 1 ? 'rgba(192,192,192,0.2)' : i === 2 ? 'rgba(158,91,40,0.2)' : 'rgba(255,255,255,0.08)', color: i === 0 ? '#000' : '#fff' }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{p.name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{p.team}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Badge label={`${p.goals} ⚽`} color="#22C55E" />
                  <Badge label={`${p.rating}★`} color="#D4AF37" />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="🕐 Recent Activity" action="">
        {activity.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: i < activity.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: typeColor[a.type] || '#D4AF37' }} />
            <div style={{ width: 80, fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>{a.time}</div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{a.event}</span>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginLeft: 8 }}>— {a.detail}</span>
            </div>
          </div>
        ))}
      </SectionCard>
    </div>
  )
}
