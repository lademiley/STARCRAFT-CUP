import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initSponsors = []

const tierColors = { Platinum: '#E5E4E2', Gold: '#D4AF37', Silver: '#C0C0C0', Bronze: '#CD7F32' }
const blank = { name: '', tier: 'Bronze', value: 0, status: 'Pending', contact: '', email: '', logo: '💼', paidPct: 0 }

export default function SponsorshipManagement() {
  const [sponsors, setSponsors] = useState(initSponsors)
  const [search, setSearch]     = useState('')
  const [tierFilter, setTierFilter] = useState('All')
  const [modal, setModal]       = useState(null)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(blank)

  const filtered = sponsors.filter(s =>
    (tierFilter === 'All' || s.tier === tierFilter) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalValue    = sponsors.filter(s => s.status === 'Active').reduce((sum, s) => sum + s.value, 0)
  const collectedPct  = Math.round(sponsors.reduce((sum, s) => sum + s.value * (s.paidPct / 100), 0) / totalValue * 100) || 0

  const openAdd  = () => { setForm(blank); setModal('add') }
  const openEdit = s => { setEditing(s.id); setForm({ ...s }); setModal('edit') }
  const save     = () => {
    if (modal === 'add') setSponsors(p => [...p, { ...form, id: Date.now(), value: Number(form.value), paidPct: Number(form.paidPct) }])
    else setSponsors(p => p.map(s => s.id === editing ? { ...form, id: editing } : s))
    setModal(null)
  }
  const del = id => { if (confirm('Remove sponsor?')) setSponsors(p => p.filter(s => s.id !== id)) }
  const f   = k  => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const fmt = n  => `₦${(n / 1000000).toFixed(1)}M`

  return (
    <div>
      <ModuleHeader title="Sponsorship Management" subtitle="Sponsor deals and payment tracking" action="Add Sponsor" onAction={openAdd} count={sponsors.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Sponsors"   value={sponsors.length}                               icon="💼" color="#D4AF37" />
        <StatCard label="Total Value"      value={fmt(totalValue)}                               icon="💰" color="#22C55E" />
        <StatCard label="Collected"        value={`${collectedPct}%`}                            icon="✅" color="#3B82F6" change={`${fmt(sponsors.reduce((s, sp) => s + sp.value * (sp.paidPct / 100), 0))} received`} />
        <StatCard label="Platinum Sponsors" value={sponsors.filter(s => s.tier === 'Platinum').length} icon="⭐" color="#E5E4E2" />
      </div>

      <SectionCard title="🤝 Sponsors" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search sponsor..." />
          <select value={tierFilter} onChange={e => setTierFilter(e.target.value)} style={c.select}>
            <option value="All">All Tiers</option>
            {['Platinum','Gold','Silver','Bronze'].map(t => <option key={t}>{t}</option>)}
          </select>
        </ActionRow>
        <Table
          cols={['Sponsor', 'Tier', 'Deal Value', 'Paid %', 'Contact', 'Status', 'Actions']}
          rows={filtered}
          renderRow={(s, i) => (
            <tr key={s.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <td style={{ ...c.td, fontWeight: 700 }}><span style={{ marginRight: 8 }}>{s.logo}</span>{s.name}</td>
              <td style={c.td}><Badge label={s.tier} color={tierColors[s.tier]} /></td>
              <td style={{ ...c.td, fontWeight: 700, color: '#D4AF37' }}>{fmt(s.value)}</td>
              <td style={c.td}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${s.paidPct}%`, background: s.paidPct === 100 ? '#22C55E' : '#F59E0B', borderRadius: 3, transition: 'width 600ms' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: s.paidPct === 100 ? '#22C55E' : '#F59E0B', minWidth: 32 }}>{s.paidPct}%</span>
                </div>
              </td>
              <td style={{ ...c.td, fontSize: '0.75rem' }}>{s.contact}</td>
              <td style={c.td}><Badge label={s.status} color={s.status === 'Active' ? '#22C55E' : '#F59E0B'} /></td>
              <td style={c.td}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(s)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.7rem' }}>✏️</button>
                  <button onClick={() => del(s.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.7rem' }}>🗑️</button>
                </div>
              </td>
            </tr>
          )}
        />
      </SectionCard>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Sponsor' : 'Edit Sponsor'} onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Company Name"><input style={c.input} value={form.name} onChange={f('name')} /></FormField>
            <FormField label="Logo Emoji"><input style={c.input} value={form.logo} onChange={f('logo')} /></FormField>
            <FormField label="Tier">
              <select style={{ ...c.select, width: '100%' }} value={form.tier} onChange={f('tier')}>
                {['Platinum','Gold','Silver','Bronze'].map(t => <option key={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Deal Value (₦)"><input style={c.input} type="number" value={form.value} onChange={f('value')} /></FormField>
            <FormField label="% Paid"><input style={c.input} type="number" min="0" max="100" value={form.paidPct} onChange={f('paidPct')} /></FormField>
            <FormField label="Status">
              <select style={{ ...c.select, width: '100%' }} value={form.status} onChange={f('status')}>
                <option>Active</option><option>Pending</option><option>Inactive</option>
              </select>
            </FormField>
          </div>
          <FormField label="Contact Name"><input style={c.input} value={form.contact} onChange={f('contact')} /></FormField>
          <FormField label="Email"><input style={c.input} value={form.email} onChange={f('email')} /></FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button onClick={() => setModal(null)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={save} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
