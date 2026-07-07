import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Modal, FormField, ModuleHeader } from './shared'

const initVenues = [
  { id: 1, name: 'Ugbowo Campus Main Bowl', city: 'Benin City', capacity: 5000, surface: 'Natural Grass', status: 'Operational', facilities: 'Floodlights, Dressing Rooms, Media Box, First Aid Post', matchesHosted: 36, contact: 'UNIBEN Sports Dept — 070 1234 5678' },
  { id: 2, name: 'Ogbemudia Stadium',       city: 'Benin City', capacity: 22000, surface: 'Natural Grass', status: 'Operational', facilities: 'Full Media Suite, VIP Box, Electronic Scoreboard, 4 Dressing Rooms', matchesHosted: 1, contact: 'Edo State Sports Commission — 070 9876 5432' },
]

const blank = { name: '', city: '', capacity: 0, surface: 'Natural Grass', status: 'Operational', facilities: '', matchesHosted: 0, contact: '' }

export default function StadiumManagement() {
  const [venues, setVenues] = useState(initVenues)
  const [modal, setModal]   = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm]     = useState(blank)

  const openAdd  = () => { setForm(blank); setModal('add') }
  const openEdit = v => { setEditing(v.id); setForm({ ...v }); setModal('edit') }
  const save     = () => {
    if (modal === 'add') setVenues(p => [...p, { ...form, id: Date.now(), capacity: Number(form.capacity), matchesHosted: Number(form.matchesHosted) }])
    else setVenues(p => p.map(v => v.id === editing ? { ...form, id: editing } : v))
    setModal(null)
  }
  const del = id => { if (confirm('Remove venue?')) setVenues(p => p.filter(v => v.id !== id)) }
  const f   = k  => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const totalCapacity = venues.reduce((s, v) => s + Number(v.capacity), 0)

  return (
    <div>
      <ModuleHeader title="Stadium Management" subtitle="Tournament venues — StarCraft Cup 2026" action="Add Venue" onAction={openAdd} count={venues.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Venues"    value={venues.length}    icon="🏟️" color="#D4AF37" />
        <StatCard label="Total Capacity"  value={totalCapacity.toLocaleString()} icon="👥" color="#3B82F6" />
        <StatCard label="Operational"     value={venues.filter(v => v.status === 'Operational').length} icon="✅" color="#22C55E" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {venues.map(v => (
          <div key={v.id} style={{ ...c.sectionCard, marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Cinzel',serif", fontSize: '1rem', fontWeight: 700 }}>🏟️ {v.name}</span>
                  <Badge label={v.status} color="#22C55E" />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>📍 {v.city} · 📞 {v.contact}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => openEdit(v)} style={{ ...c.btn, ...c.btnGhost, padding: '5px 12px', fontSize: '0.75rem' }}>✏️ Edit</button>
                <button onClick={() => del(v.id)} style={{ ...c.btn, ...c.btnDanger, padding: '5px 12px', fontSize: '0.75rem' }}>🗑️</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14, marginBottom: 14 }}>
              {[
                ['Capacity', v.capacity.toLocaleString(), '#3B82F6'],
                ['Surface', v.surface, '#22C55E'],
                ['Matches Hosted', v.matchesHosted, '#D4AF37'],
              ].map(([label, value, color]) => (
                <div key={label} style={{ ...c.card, padding: 14 }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{label}</div>
                  <div style={{ fontWeight: 800, color, fontSize: '1.1rem' }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
              <span style={{ color: 'rgba(255,255,255,0.3)', marginRight: 6 }}>Facilities:</span>{v.facilities}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Venue' : 'Edit Venue'} onClose={() => setModal(null)}>
          <FormField label="Venue Name"><input style={c.input} value={form.name} onChange={f('name')} placeholder="Stadium / Ground name" /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="City"><input style={c.input} value={form.city} onChange={f('city')} /></FormField>
            <FormField label="Capacity"><input style={c.input} type="number" value={form.capacity} onChange={f('capacity')} /></FormField>
            <FormField label="Surface">
              <select style={{ ...c.select, width: '100%' }} value={form.surface} onChange={f('surface')}>
                <option>Natural Grass</option><option>Artificial Turf</option><option>Hybrid</option>
              </select>
            </FormField>
            <FormField label="Status">
              <select style={{ ...c.select, width: '100%' }} value={form.status} onChange={f('status')}>
                <option>Operational</option><option>Under Maintenance</option><option>Closed</option>
              </select>
            </FormField>
          </div>
          <FormField label="Facilities"><input style={c.input} value={form.facilities} onChange={f('facilities')} placeholder="e.g. Floodlights, Dressing Rooms..." /></FormField>
          <FormField label="Contact"><input style={c.input} value={form.contact} onChange={f('contact')} /></FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button onClick={() => setModal(null)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={save} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Venue</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
