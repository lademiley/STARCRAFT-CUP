import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initReferees = [
  { id: 1, name: 'James Okafor', level: 'FIFA', location: 'Benin City', matches: 8, status: 'Available', phone: '08012345678' },
  { id: 2, name: 'Paul Agbakoba', level: 'NFF A', location: 'Warri', matches: 6, status: 'Available', phone: '08023456789' },
  { id: 3, name: 'Ehis Omoregie', level: 'NFF A', location: 'Benin City', matches: 7, status: 'Assigned', phone: '08034567890' },
  { id: 4, name: 'Tom Adaeze', level: 'NFF B', location: 'Asaba', matches: 5, status: 'Available', phone: '08045678901' },
  { id: 5, name: 'John Onyeka', level: 'NFF B', location: 'Sapele', matches: 4, status: 'Unavailable', phone: '08056789012' },
  { id: 6, name: 'Chris Agoro', level: 'State', location: 'Ekpoma', matches: 3, status: 'Available', phone: '08067890123' },
]

const initAssignments = [
  { id: 1, fixture: 'Edo Warriors vs Benin Royals', date: '2027-03-20', referee: 'James Okafor', assistant1: 'Paul Agbakoba', assistant2: 'Tom Adaeze', fourth: 'Chris Agoro', status: 'Confirmed' },
  { id: 2, fixture: 'Oredo United vs Delta Eagles', date: '2027-03-20', referee: 'Ehis Omoregie', assistant1: 'Tom Adaeze', assistant2: 'Chris Agoro', fourth: 'John Onyeka', status: 'Pending' },
  { id: 3, fixture: 'Ugbowo Stars vs Uromi FC', date: '2027-03-22', referee: 'Paul Agbakoba', assistant1: 'James Okafor', assistant2: 'Chris Agoro', fourth: 'Ehis Omoregie', status: 'Confirmed' },
]

const levelColor = { FIFA: '#D4AF37', 'NFF A': '#22C55E', 'NFF B': '#3B82F6', State: '#8B5CF6' }
const blank = { name: '', level: 'NFF A', location: '', matches: 0, status: 'Available', phone: '' }

export default function RefereeAssignment() {
  const [referees, setReferees] = useState(initReferees)
  const [assignments, setAssignments] = useState(initAssignments)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = referees.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSave = () => {
    if (editing) setReferees(prev => prev.map(r => r.id === editing ? { ...form, id: editing, matches: Number(form.matches) } : r))
    else setReferees(prev => [...prev, { ...form, id: Date.now(), matches: Number(form.matches) }])
    setModal(null); setEditing(null)
  }
  const handleDelete = id => { if (confirm('Remove referee?')) setReferees(prev => prev.filter(r => r.id !== id)) }
  const openEdit = r => { setForm({ ...r }); setEditing(r.id); setModal('ref') }

  return (
    <div>
      <ModuleHeader title="Referee Assignment" subtitle="Manage officials and match assignments" action="Add Referee" onAction={() => { setForm(blank); setEditing(null); setModal('ref') }} count={referees.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Referees" value={referees.length} icon="🟡" color="#D4AF37" />
        <StatCard label="Available" value={referees.filter(r => r.status === 'Available').length} icon="✅" color="#22C55E" />
        <StatCard label="Assigned" value={referees.filter(r => r.status === 'Assigned').length} icon="📌" color="#3B82F6" />
        <StatCard label="FIFA Grade" value={referees.filter(r => r.level === 'FIFA').length} icon="⭐" color="#F59E0B" />
      </div>

      <SectionCard title="👥 Match Assignments" action="">
        {assignments.map((a, i) => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < assignments.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{a.fixture}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{a.date} · Referee: {a.referee}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>AR1: {a.assistant1} · AR2: {a.assistant2} · 4th: {a.fourth}</div>
            </div>
            <Badge label={a.status} color={a.status === 'Confirmed' ? '#22C55E' : '#F59E0B'} />
          </div>
        ))}
      </SectionCard>

      <SectionCard title="🟡 Referee Registry" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search referees..." />
        </ActionRow>
        <Table
          cols={['Name', 'Level', 'Location', 'Matches', 'Phone', 'Status', 'Actions']}
          rows={filtered}
          renderRow={(r, i) => (
            <tr key={r.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <td style={{ ...c.td, fontWeight: 600 }}>{r.name}</td>
              <td style={c.td}><Badge label={r.level} color={levelColor[r.level] || '#D4AF37'} /></td>
              <td style={c.td}>{r.location}</td>
              <td style={c.td}>{r.matches}</td>
              <td style={c.td}>{r.phone}</td>
              <td style={c.td}><Badge label={r.status} color={r.status === 'Available' ? '#22C55E' : r.status === 'Assigned' ? '#3B82F6' : '#EF4444'} /></td>
              <td style={c.td}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(r)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.72rem' }}>✏️</button>
                  <button onClick={() => handleDelete(r.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.72rem' }}>🗑️</button>
                </div>
              </td>
            </tr>
          )}
        />
      </SectionCard>

      {modal === 'ref' && (
        <Modal title={editing ? 'Edit Referee' : 'Add Referee'} onClose={() => { setModal(null); setEditing(null) }}>
          <FormField label="Full Name"><input style={c.input} value={form.name} onChange={set('name')} placeholder="James Okafor" /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Level">
              <select style={{ ...c.select, width: '100%' }} value={form.level} onChange={set('level')}>
                <option>FIFA</option><option>NFF A</option><option>NFF B</option><option>State</option>
              </select>
            </FormField>
            <FormField label="Status">
              <select style={{ ...c.select, width: '100%' }} value={form.status} onChange={set('status')}>
                <option>Available</option><option>Assigned</option><option>Unavailable</option>
              </select>
            </FormField>
          </div>
          <FormField label="Location"><input style={c.input} value={form.location} onChange={set('location')} /></FormField>
          <FormField label="Phone"><input style={c.input} value={form.phone} onChange={set('phone')} /></FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => { setModal(null); setEditing(null) }} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={handleSave} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
