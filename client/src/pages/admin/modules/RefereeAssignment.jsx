import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initReferees = []

const gradeColors = { FIFA: '#D4AF37', CAF: '#3B82F6', NFF: '#22C55E' }
const blank = { name: '', grade: 'NFF', matches: 0, region: '', status: 'Available', phone: '' }

export default function RefereeAssignment() {
  const [refs, setRefs]   = useState(initReferees)
  const [search, setSearch] = useState('')
  const [modal, setModal]  = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm]    = useState(blank)

  const filtered = refs.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.region.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd  = () => { setForm(blank); setModal('add') }
  const openEdit = r => { setEditing(r.id); setForm({ ...r }); setModal('edit') }
  const save     = () => {
    if (modal === 'add') setRefs(p => [...p, { ...form, id: Date.now(), matches: Number(form.matches) }])
    else setRefs(p => p.map(r => r.id === editing ? { ...form, id: editing } : r))
    setModal(null)
  }
  const del = id => { if (confirm('Remove referee?')) setRefs(p => p.filter(r => r.id !== id)) }
  const f   = k  => e => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div>
      <ModuleHeader title="Referee Assignment" subtitle="Official registry and match assignments" action="Add Official" onAction={openAdd} count={refs.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Officials" value={refs.length}                                  icon="🟡" color="#D4AF37" />
        <StatCard label="Available"       value={refs.filter(r => r.status === 'Available').length} icon="✅" color="#22C55E" />
        <StatCard label="Assigned"        value={refs.filter(r => r.status === 'Assigned').length}  icon="📋" color="#3B82F6" />
        <StatCard label="FIFA / CAF"      value={refs.filter(r => r.grade !== 'NFF').length}        icon="⭐" color="#F59E0B" />
      </div>

      <SectionCard title="👔 Officials Registry" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search name or region..." />
        </ActionRow>
        <Table
          cols={['Name', 'Grade', 'Region', 'Matches', 'Phone', 'Status', 'Actions']}
          rows={filtered}
          renderRow={(r, i) => (
            <tr key={r.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <td style={{ ...c.td, fontWeight: 600 }}>{r.name}</td>
              <td style={c.td}><Badge label={r.grade} color={gradeColors[r.grade] || '#D4AF37'} /></td>
              <td style={c.td}>{r.region}</td>
              <td style={{ ...c.td, fontWeight: 700, color: '#D4AF37' }}>{r.matches}</td>
              <td style={{ ...c.td, fontSize: '0.75rem' }}>{r.phone}</td>
              <td style={c.td}><Badge label={r.status} color={r.status === 'Available' ? '#22C55E' : '#F59E0B'} /></td>
              <td style={c.td}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(r)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.7rem' }}>✏️</button>
                  <button onClick={() => del(r.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.7rem' }}>🗑️</button>
                </div>
              </td>
            </tr>
          )}
        />
      </SectionCard>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Official' : 'Edit Official'} onClose={() => setModal(null)}>
          <FormField label="Full Name"><input style={c.input} value={form.name} onChange={f('name')} placeholder="Referee name" /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Grade">
              <select style={{ ...c.select, width: '100%' }} value={form.grade} onChange={f('grade')}>
                <option>FIFA</option><option>CAF</option><option>NFF</option>
              </select>
            </FormField>
            <FormField label="Status">
              <select style={{ ...c.select, width: '100%' }} value={form.status} onChange={f('status')}>
                <option>Available</option><option>Assigned</option><option>Unavailable</option>
              </select>
            </FormField>
            <FormField label="Region"><input style={c.input} value={form.region} onChange={f('region')} placeholder="City" /></FormField>
            <FormField label="Phone"><input style={c.input} value={form.phone} onChange={f('phone')} placeholder="+234..." /></FormField>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button onClick={() => setModal(null)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={save} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
