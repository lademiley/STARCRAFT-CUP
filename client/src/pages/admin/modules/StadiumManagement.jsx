import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initStadiums = [
  { id: 1, name: 'Samuel Ogbemudia Stadium', city: 'Benin City', capacity: 20000, surface: 'Grass', status: 'Operational', matches: 8, facilities: 'VIP Lounge, Press Box, Floodlights, Medical Bay' },
  { id: 2, name: 'University of Benin Bowl', city: 'Ugbowo, Benin City', capacity: 10000, surface: 'Artificial Turf', status: 'Operational', matches: 6, facilities: 'Press Box, Floodlights, Parking' },
  { id: 3, name: 'Ogbe Stadium', city: 'Benin City', capacity: 15000, surface: 'Grass', status: 'Under Maintenance', matches: 0, facilities: 'Floodlights, Parking, Canteen' },
  { id: 4, name: 'Oba Ovonramwen Square', city: 'Benin City', capacity: 5000, surface: 'Artificial Turf', status: 'Operational', matches: 2, facilities: 'Basic Facilities' },
]

const blank = { name: '', city: '', capacity: 5000, surface: 'Grass', status: 'Operational', matches: 0, facilities: '' }

export default function StadiumManagement() {
  const [stadiums, setStadiums] = useState(initStadiums)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = stadiums.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const openEdit = s => { setForm({ ...s }); setEditing(s.id); setModal(true) }
  const handleSave = () => {
    if (editing) setStadiums(prev => prev.map(s => s.id === editing ? { ...form, id: editing, capacity: Number(form.capacity), matches: Number(form.matches) } : s))
    else setStadiums(prev => [...prev, { ...form, id: Date.now(), capacity: Number(form.capacity), matches: Number(form.matches) }])
    setModal(false); setEditing(null)
  }
  const handleDelete = id => { if (confirm('Remove stadium?')) setStadiums(prev => prev.filter(s => s.id !== id)) }

  return (
    <div>
      <ModuleHeader title="Stadium Management" subtitle="Manage all tournament venues" action="Add Stadium" onAction={() => { setForm(blank); setEditing(null); setModal(true) }} count={stadiums.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Venues" value={stadiums.length} icon="🏟️" color="#D4AF37" />
        <StatCard label="Operational" value={stadiums.filter(s => s.status === 'Operational').length} icon="✅" color="#22C55E" />
        <StatCard label="Total Capacity" value={stadiums.reduce((s, v) => s + v.capacity, 0).toLocaleString()} icon="👥" color="#3B82F6" />
        <StatCard label="Matches Hosted" value={stadiums.reduce((s, v) => s + v.matches, 0)} icon="📅" color="#F59E0B" />
      </div>

      {/* Stadium Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, marginBottom: 24 }}>
        {stadiums.map(s => (
          <div key={s.id} style={{ ...c.card, borderTop: `3px solid ${s.status === 'Operational' ? '#22C55E' : '#F59E0B'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem', marginBottom: 4 }}>🏟️ {s.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{s.city}</div>
              </div>
              <Badge label={s.status} color={s.status === 'Operational' ? '#22C55E' : '#F59E0B'} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
              {[
                { label: 'Capacity', val: s.capacity.toLocaleString() },
                { label: 'Surface', val: s.surface },
                { label: 'Matches', val: s.matches },
              ].map(({ label, val }) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37' }}>{val}</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginBottom: 14 }}>🏗️ {s.facilities}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => openEdit(s)} style={{ ...c.btn, ...c.btnGhost, flex: 1, justifyContent: 'center', display: 'flex', fontSize: '0.75rem' }}>✏️ Edit</button>
              <button onClick={() => handleDelete(s.id)} style={{ ...c.btn, ...c.btnDanger, padding: '8px 12px', fontSize: '0.75rem' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={editing ? 'Edit Stadium' : 'Add Stadium'} onClose={() => { setModal(false); setEditing(null) }}>
          <FormField label="Stadium Name"><input style={c.input} value={form.name} onChange={set('name')} placeholder="Samuel Ogbemudia Stadium" /></FormField>
          <FormField label="City / Location"><input style={c.input} value={form.city} onChange={set('city')} placeholder="Benin City" /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Capacity"><input style={c.input} type="number" value={form.capacity} onChange={set('capacity')} /></FormField>
            <FormField label="Surface">
              <select style={{ ...c.select, width: '100%' }} value={form.surface} onChange={set('surface')}>
                <option>Grass</option><option>Artificial Turf</option><option>Hybrid</option>
              </select>
            </FormField>
          </div>
          <FormField label="Status">
            <select style={{ ...c.select, width: '100%' }} value={form.status} onChange={set('status')}>
              <option>Operational</option><option>Under Maintenance</option><option>Closed</option>
            </select>
          </FormField>
          <FormField label="Facilities"><textarea style={{ ...c.input, minHeight: 72, resize: 'vertical' }} value={form.facilities} onChange={set('facilities')} placeholder="VIP Lounge, Press Box, Floodlights..." /></FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => { setModal(false); setEditing(null) }} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={handleSave} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Stadium</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
