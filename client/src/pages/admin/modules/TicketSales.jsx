import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader } from './shared'

const initTickets = [
  { id: 1, match: 'QF1: Edo Warriors vs Benin Royals', date: '2027-03-20', venue: 'Ogbemudia Stadium', vipTotal: 500, vipSold: 412, vipPrice: 5000, regularTotal: 3000, regularSold: 2840, regularPrice: 2000, studentTotal: 2000, studentSold: 1680, studentPrice: 1000, status: 'On Sale' },
  { id: 2, match: 'QF2: Oredo United vs Delta Eagles', date: '2027-03-20', venue: 'Ogbemudia Stadium', vipTotal: 500, vipSold: 388, vipPrice: 5000, regularTotal: 3000, regularSold: 2210, regularPrice: 2000, studentTotal: 2000, studentSold: 1490, studentPrice: 1000, status: 'On Sale' },
  { id: 3, match: 'QF3: Ugbowo Stars vs Uromi FC', date: '2027-03-22', venue: 'UNIBEN Bowl', vipTotal: 200, vipSold: 142, vipPrice: 4000, regularTotal: 1500, regularSold: 980, regularPrice: 1500, studentTotal: 1000, studentSold: 720, studentPrice: 800, status: 'On Sale' },
  { id: 4, match: 'SF1: TBD vs TBD', date: '2027-04-05', venue: 'Ogbemudia Stadium', vipTotal: 500, vipSold: 180, vipPrice: 8000, regularTotal: 3000, regularSold: 650, regularPrice: 3000, studentTotal: 2000, studentSold: 220, studentPrice: 1500, status: 'On Sale' },
  { id: 5, match: 'Grand Final: TBD vs TBD', date: '2027-04-20', venue: 'Ogbemudia Stadium', vipTotal: 500, vipSold: 0, vipPrice: 15000, regularTotal: 5000, regularSold: 0, regularPrice: 5000, studentTotal: 3000, studentSold: 0, studentPrice: 2000, status: 'Coming Soon' },
]

const totalRevenue = initTickets.reduce((s, t) => s + t.vipSold * t.vipPrice + t.regularSold * t.regularPrice + t.studentSold * t.studentPrice, 0)
const totalSold = initTickets.reduce((s, t) => s + t.vipSold + t.regularSold + t.studentSold, 0)
const totalCapacity = initTickets.reduce((s, t) => s + t.vipTotal + t.regularTotal + t.studentTotal, 0)

export default function TicketSales() {
  const [tickets] = useState(initTickets)

  const matchRevenue = t => t.vipSold * t.vipPrice + t.regularSold * t.regularPrice + t.studentSold * t.studentPrice
  const matchCapacity = t => t.vipTotal + t.regularTotal + t.studentTotal
  const matchSold = t => t.vipSold + t.regularSold + t.studentSold
  const fillPct = t => Math.round(matchSold(t) / matchCapacity(t) * 100)
  const fmt = n => `₦${(n / 1000000).toFixed(2)}M`

  return (
    <div>
      <ModuleHeader title="Ticket Sales" subtitle="Track ticket inventory and revenue" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Revenue" value={fmt(totalRevenue)} icon="🎫" color="#D4AF37" change="All matches" />
        <StatCard label="Tickets Sold" value={totalSold.toLocaleString()} icon="✅" color="#22C55E" />
        <StatCard label="Total Capacity" value={totalCapacity.toLocaleString()} icon="🏟️" color="#3B82F6" />
        <StatCard label="Fill Rate" value={`${Math.round(totalSold/totalCapacity*100)}%`} icon="📊" color="#F59E0B" />
      </div>

      {tickets.map(t => (
        <SectionCard key={t.id} title={`⚽ ${t.match}`} action="">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>{t.date} · {t.venue}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Badge label={t.status} color={t.status === 'On Sale' ? '#22C55E' : '#F59E0B'} />
              <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700 }}>Revenue: {fmt(matchRevenue(t))}</span>
            </div>
          </div>

          {/* Fill rate bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
              <span>{matchSold(t).toLocaleString()} sold</span>
              <span>{fillPct(t)}% filled</span>
              <span>{matchCapacity(t).toLocaleString()} total</span>
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${fillPct(t)}%`, background: fillPct(t) > 85 ? '#22C55E' : fillPct(t) > 50 ? '#D4AF37' : '#EF4444', borderRadius: 4, transition: 'width 600ms' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
            {[
              { type: 'VIP', sold: t.vipSold, total: t.vipTotal, price: t.vipPrice, color: '#D4AF37' },
              { type: 'Regular', sold: t.regularSold, total: t.regularTotal, price: t.regularPrice, color: '#3B82F6' },
              { type: 'Student', sold: t.studentSold, total: t.studentTotal, price: t.studentPrice, color: '#22C55E' },
            ].map(cat => (
              <div key={cat.type} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 12, borderTop: `2px solid ${cat.color}` }}>
                <div style={{ fontSize: '0.7rem', color: cat.color, fontWeight: 700, marginBottom: 6 }}>{cat.type}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{cat.sold}/{cat.total}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>₦{cat.price.toLocaleString()} each</div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 8, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round(cat.sold/cat.total*100)}%`, background: cat.color, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  )
}
