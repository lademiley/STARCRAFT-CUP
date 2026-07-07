import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initSponsors = [
  { id: 1, name: 'Edo State Government', tier: 'Platinum', value: 30000000, logo: '🏛️', contact: 'Gov. Relations Office', email: 'sports@edostate.gov.ng', status: 'Active', category: 'Government' },
  { id: 2, name: 'First Bank Nigeria', tier: 'Platinum', value: 20000000, logo: '🏦', contact: 'Mr. Adeyemi Folawiyo', email: 'sponsorship@firstbank.ng', status: 'Active', category: 'Banking' },
  { id: 3, name: 'MTN Nigeria', tier: 'Gold', value: 12000000, logo: '📶', contact: 'Ms. Kemi Ade', email: 'csr@mtn.ng', status: 'Active', category: 'Telecom' },
  { id: 4, name: 'Dangote Group', tier: 'Gold', value: 10000000, logo: '🏭', contact: 'PR Team', email: 'pr@dangote.com', status: 'Active', category: 'Conglomerate' },
  { id: 5, name: 'Zenith Bank', tier: 'Gold', value: 8000000, logo: '💳', contact: 'Mr. Emeka Nwosu', email: 'marketing@zenithbank.com', status: 'Active', category: 'Banking' },
  { id: 6, name: 'GTBank', tier: 'Gold', value: 15000000, logo: '🏧', contact: 'Mr. Ade Balogun', email: 'sponsor@gtb.com', status: 'Negotiating', category: 'Banking' },
  { id: 7, name: 'Indomie Nigeria', tier: 'Silver', value: 4000000, logo: '🍜', contact: 'Marketing Dept', email: 'marketing@dufil.com', status: 'Active', category: 'Food & Beverage' },
  { id: 8, name: 'Pepsi Nigeria', tier: 'Silver', value: 5000000, logo: '🥤', contact: 'Mr. Femi Babatunde', email: 'sponsorship@pepsi.ng', status: 'Active', category: 'Beverages' },
]

const tierColor = { Platinum: '#E5E7EB', Gold: '#D4AF37', Silver: '#9CA3AF', Bronze: '#9E5B28' }
const blank = { name: '', tier: 'Gold', value: 5000000, logo: '🏢', contact: '', email: '', status: 'Negotiating', category: '' }

export default function SponsorshipManagement() {
  const [sponsors, setSponsors] = useState(initSponsors)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('All')

  const filtered = sponsors.filter(s =>
    (tierFilter === 'All' || s.tier === tierFilter) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  )
  const totalValue = sponsors.filter(s => s.status === 'Active').reduce((sum, s) => sum + s.value, 0)
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const openEdit = s => { setForm({ ...s }); setEditing(s.id); setModal(true) }
  const handleSave = () => {
    if (editing) setSponsors(prev => prev.map(s => s.id === editing ? { ...form, id: editing, value: Number(form.value) } : s))
    else setSponsors(prev => [...prev, { ...form, id: Date.now(), value: Number(form.value) }])
    setModal(false); setEditing(null)
  }
  const handleDelete = id => { if (confirm('Remove sponsor?')) setSponsors(prev => prev.filter(s => s.id !== id)) }

  const fmt = n => `₦${(n / 1000000).toFixed(1)}M`

  return (
    <div>
      <ModuleHeader title="Sponsorship Management" subtitle="Manage tournament sponsors and deals" action="Add Sponsor" onAction={() => { setForm(blank); setEditing(null); setModal(true) }} count={sponsors.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Sponsors" value={sponsors.length} icon="💼" color="#D4AF37" />
        <StatCard label="Total Value" value={fmt(totalValue)} icon="💰" color="#22C55E" />
        <StatCard label="Platinum Tier" value={sponsors.filter(s => s.tier === 'Platinum').length} icon="💎" color="#E5E7EB" />
        <StatCard label="Negotiating" value={sponsors.filter(s => s.status === 'Negotiating').length} icon="🤝" color="#F59E0B" />
      </div>

      {/* Tier breakdown */}
      {['Platinum', 'Gold', 'Silver'].map(tier => {
        const tierSponsors = sponsors.filter(s => s.tier === tier)
        if (!tierSponsors.length) return null
        return (
          <SectionCard key={tier} title={`${tier === 'Platinum' ? '💎' : tier === 'Gold' ? '🥇' : '🥈'} ${tier} Sponsors`} action="">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {tierSponsors.map(s => (
                <div key={s.id} style={{ ...c.card, borderLeft: `3px solid ${tierColor[s.tier]}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{ fontSize: '2rem' }}>{s.logo}</span>
                    <Badge label={s.status} color={s.status === 'Active' ? '#22C55E' : '#F59E0B'} />
                  </div>
                  <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: 2 }}>{s.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{s.category} · {s.contact}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: tierColor[s.tier], marginBottom: 12 }}>{fmt(s.value)}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(s)} style={{ ...c.btn, ...c.btnGhost, flex: 1, fontSize: '0.72rem' }}>✏️ Edit</button>
                    <button onClick={() => handleDelete(s.id)} style={{ ...c.btn, ...c.btnDanger, padding: '8px 12px', fontSize: '0.72rem' }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )
      })}

      {modal && (
        <Modal title={editing ? 'Edit Sponsor' : 'Add Sponsor'} onClose={() => { setModal(false); setEditing(null) }}>
          <FormField label="Company Name"><input style={c.input} value={form.name} onChange={set('name')} /></FormField>
          <FormField label="Logo Emoji"><input style={c.input} value={form.logo} onChange={set('logo')} /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Tier">
              <select style={{ ...c.select, width: '100%' }} value={form.tier} onChange={set('tier')}>
                <option>Platinum</option><option>Gold</option><option>Silver</option><option>Bronze</option>
              </select>
            </FormField>
            <FormField label="Deal Value (₦)"><input style={c.input} type="number" value={form.value} onChange={set('value')} /></FormField>
          </div>
          <FormField label="Category"><input style={c.input} value={form.category} onChange={set('category')} placeholder="Banking, Telecom, etc." /></FormField>
          <FormField label="Contact Person"><input style={c.input} value={form.contact} onChange={set('contact')} /></FormField>
          <FormField label="Email"><input style={c.input} type="email" value={form.email} onChange={set('email')} /></FormField>
          <FormField label="Status">
            <select style={{ ...c.select, width: '100%' }} value={form.status} onChange={set('status')}>
              <option>Active</option><option>Negotiating</option><option>Expired</option>
            </select>
          </FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => { setModal(false); setEditing(null) }} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={handleSave} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Sponsor</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
