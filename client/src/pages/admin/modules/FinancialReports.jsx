import React, { useState, useEffect } from 'react'
import { c, StatCard, SectionCard, Badge } from './shared'

const revenue = [
  { category: 'Sponsorships',  amount: 85000000, pct: 62, color: '#D4AF37' },
  { category: 'Ticket Sales',  amount: 28000000, pct: 20, color: '#3B82F6' },
  { category: 'Merchandise',   amount: 12000000, pct: 9,  color: '#22C55E' },
  { category: 'Media Rights',  amount: 8000000,  pct: 6,  color: '#EC4899' },
  { category: 'Gate Receipts', amount: 4000000,  pct: 3,  color: '#F59E0B' },
]

const expenses = [
  { category: 'Venue Costs',    amount: 18000000, pct: 30, color: '#EF4444' },
  { category: 'Player Prizes',  amount: 15000000, pct: 25, color: '#F97316' },
  { category: 'Operations',     amount: 12000000, pct: 20, color: '#8B5CF6' },
  { category: 'Marketing',      amount: 8000000,  pct: 13, color: '#14B8A6' },
  { category: 'Staff & Security',amount: 7200000, pct: 12, color: '#6366F1' },
]

const transactions = [
  { id: 1, date: '2026-12-13', desc: 'Ticket sales — QF day batch',        type: 'Income',  amount: 4200000,  status: 'Confirmed' },
  { id: 2, date: '2026-12-11', desc: 'Access Bank sponsorship Q4',          type: 'Income',  amount: 7500000,  status: 'Confirmed' },
  { id: 3, date: '2026-12-10', desc: 'Stadium hire — Ugbowo (Group stage)', type: 'Expense', amount: -3500000, status: 'Paid' },
  { id: 4, date: '2026-12-09', desc: 'Merchandise sales (Week 2)',          type: 'Income',  amount: 2100000,  status: 'Confirmed' },
  { id: 5, date: '2026-12-07', desc: 'Security staff — Weeks 1 & 2',       type: 'Expense', amount: -1800000, status: 'Paid' },
  { id: 6, date: '2026-12-05', desc: 'MTN Nigeria sponsorship installment', type: 'Income',  amount: 4000000,  status: 'Confirmed' },
  { id: 7, date: '2026-12-03', desc: 'Medical supplies & first aid',        type: 'Expense', amount: -620000,  status: 'Paid' },
]

const fmt = n => `₦${(Math.abs(n) / 1000000).toFixed(1)}M`
const totalRevenue  = revenue.reduce((s, r) => s + r.amount, 0)
const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
const netProfit     = totalRevenue - totalExpenses

export default function FinancialReports() {
  const [period, setPeriod]   = useState('This Season')
  const [ticketRevenue, setTicketRevenue] = useState(0)

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.ok ? r.json() : { orders: [] })
      .then(d => {
        const confirmed = (d.orders || []).filter(o => o.status === 'confirmed')
        setTicketRevenue(confirmed.reduce((s, o) => s + o.total, 0))
      })
      .catch(() => {})
  }, [])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>Financial Reports</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>StarCraft Cup 2026 — Revenue, expenses, and profit tracking</p>
        </div>
        <select value={period} onChange={e => setPeriod(e.target.value)} style={c.select}>
          <option>This Season</option><option>December 2026</option><option>November 2026</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Revenue"   value={fmt(totalRevenue)}   icon="💰" color="#22C55E" change="+12% vs target" />
        <StatCard label="Total Expenses"  value={fmt(totalExpenses)}  icon="📤" color="#EF4444" change="On budget" />
        <StatCard label="Net Profit"      value={fmt(netProfit)}      icon="📈" color="#D4AF37" change="Surplus" />
        <StatCard label="Online Ticket Rev" value={ticketRevenue > 0 ? `₦${ticketRevenue.toLocaleString()}` : '₦0 (live)'} icon="🎫" color="#3B82F6" change="From payment orders" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <SectionCard title="💰 Revenue Breakdown" action="">
          {revenue.map(r => (
            <div key={r.category} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: '0.8rem', color: '#fff' }}>{r.category}</span>
                <span style={{ fontSize: '0.8rem', color: r.color, fontWeight: 700 }}>{fmt(r.amount)}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${r.pct}%`, background: r.color, borderRadius: 3, transition: 'width 600ms' }} />
              </div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{r.pct}% of total</div>
            </div>
          ))}
        </SectionCard>
        <SectionCard title="📤 Expense Breakdown" action="">
          {expenses.map(e => (
            <div key={e.category} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: '0.8rem', color: '#fff' }}>{e.category}</span>
                <span style={{ fontSize: '0.8rem', color: e.color, fontWeight: 700 }}>{fmt(e.amount)}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${e.pct}%`, background: e.color, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{e.pct}% of total</div>
            </div>
          ))}
        </SectionCard>
      </div>

      <SectionCard title="📋 Recent Transactions" action="">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{['Date','Description','Type','Amount','Status'].map(h => <th key={h} style={c.th}>{h}</th>)}</tr></thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={t.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                  <td style={c.td}>{t.date}</td>
                  <td style={{ ...c.td, fontWeight: 500 }}>{t.desc}</td>
                  <td style={c.td}><Badge label={t.type} color={t.type === 'Income' ? '#22C55E' : '#EF4444'} /></td>
                  <td style={{ ...c.td, fontWeight: 700, color: t.amount > 0 ? '#22C55E' : '#EF4444' }}>
                    {t.amount > 0 ? '+' : ''}{fmt(t.amount)}
                  </td>
                  <td style={c.td}><Badge label={t.status} color="#3B82F6" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 16, padding: '14px 16px', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700 }}>Season Net Position</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#22C55E' }}>+{fmt(netProfit)} Surplus</span>
        </div>
      </SectionCard>
    </div>
  )
}
