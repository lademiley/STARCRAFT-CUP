import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initVols = [
  { id: 1,  name: 'Adaeze Okonkwo',      email: 'adaeze.ok@gmail.com',    role: 'Media Team',    shift: 'Morning', status: 'Approved', applied: '2026-11-10' },
  { id: 2,  name: 'Emeka Nwagbara',      email: 'emeka.nw@gmail.com',     role: 'Security',      shift: 'Evening', status: 'Approved', applied: '2026-11-11' },
  { id: 3,  name: 'Chioma Ezeigbo',      email: 'chioma.ez@yahoo.com',    role: 'Ticketing',     shift: 'Morning', status: 'Pending',  applied: '2026-11-18' },
  { id: 4,  name: 'Femi Adeyemi',        email: 'femi.ad@gmail.com',      role: 'First Aid',     shift: 'Full Day',status: 'Approved', applied: '2026-11-08' },
  { id: 5,  name: 'Grace Oghifo',        email: 'grace.og@gmail.com',     role: 'Hospitality',   shift: 'Morning', status: 'Pending',  applied: '2026-11-20' },
  { id: 6,  name: 'Uche Obiechina',      email: 'uche.ob@outlook.com',    role: 'Stewarding',    shift: 'Evening', status: 'Approved', applied: '2026-11-05' },
  { id: 7,  name: 'Ngozi Akpan',         email: 'ngozi.ak@gmail.com',     role: 'Media Team',    shift: 'Morning', status: 'Pending',  applied: '2026-11-22' },
  { id: 8,  name: 'Bello Aliyu',         email: 'bello.al@gmail.com',     role: 'Security',      shift: 'Evening', status: 'Approved', applied: '2026-11-12' },
  { id: 9,  name: 'Tunde Obaseki',       email: 'tunde.ob@gmail.com',     role: 'Logistics',     shift: 'Full Day',status: 'Approved', applied: '2026-11-07' },
  { id: 10, name: 'Amaka Igwe',          email: 'amaka.ig@yahoo.com',     role: 'Ticketing',     shift: 'Morning', status: 'Pending',  applied: '2026-11-25' },
]

const roleColors = { 'Media Team': '#8B5CF6', Security: '#EF4444', Ticketing: '#3B82F6', 'First Aid': '#EC4899', Hospitality: '#22C55E', Stewarding: '#F59E0B', Logistics: '#14B8A6' }
const blank = { name: '', email: '', role: 'Ticketing', shift: 'Morning', status: 'Pending', applied: '' }

export default function VolunteerManagement() {
  const [vols, setVols]     = useState(initVols)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modal, setModal]   = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm]     = useState(blank)

  const filtered = vols.filter(v =>
    (statusFilter === 'All' || v.status === statusFilter) &&
    (v.name.toLowerCase().includes(search.toLowerCase()) || v.role.toLowerCase().includes(search.toLowerCase()))
  )

  const approve = id => setVols(p => p.map(v => v.id === id ? { ...v, status: 'Approved' } : v))
  const openAdd  = () => { setForm(blank); setModal('add') }
  const openEdit = v => { setEditing(v.id); setForm({ ...v }); setModal('edit') }
  const save     = () => {
    if (modal === 'add') setVols(p => [...p, { ...form, id: Date.now() }])
    else setVols(p => p.map(v => v.id === editing ? { ...form, id: editing } : v))
    setModal(null)
  }
  const del = id => { if (confirm('Remove volunteer?')) setVols(p => p.filter(v => v.id !== id)) }
  const f   = k  => e => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div>
      <ModuleHeader title="Volunteer Management" subtitle="Tournament volunteer applications and shifts" action="Add Volunteer" onAction={openAdd} count={vols.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Volunteers" value={vols.length}                                   icon="🤝" color="#D4AF37" />
        <StatCard label="Approved"          value={vols.filter(v => v.status === 'Approved').length} icon="✅" color="#22C55E" />
        <StatCard label="Pending Review"    value={vols.filter(v => v.status === 'Pending').length}  icon="⏳" color="#F59E0B" change="Needs action" />
        <StatCard label="Roles Covered"     value={[...new Set(vols.map(v => v.role))].length}       icon="🎭" color="#3B82F6" />
      </div>

      <SectionCard title="👥 Volunteer Registry" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search name or role..." />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={c.select}>
            <option value="All">All Status</option>
            <option>Pending</option><option>Approved</option><option>Rejected</option>
          </select>
        </ActionRow>
        <Table
          cols={['Name', 'Email', 'Role', 'Shift', 'Applied', 'Status', 'Actions']}
          rows={filtered}
          renderRow={(v, i) => (
            <tr key={v.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <td style={{ ...c.td, fontWeight: 600 }}>{v.name}</td>
              <td style={{ ...c.td, fontSize: '0.75rem' }}>{v.email}</td>
              <td style={c.td}><Badge label={v.role} color={roleColors[v.role] || '#D4AF37'} /></td>
              <td style={c.td}>{v.shift}</td>
              <td style={{ ...c.td, fontSize: '0.75rem' }}>{v.applied}</td>
              <td style={c.td}><Badge label={v.status} color={v.status === 'Approved' ? '#22C55E' : v.status === 'Pending' ? '#F59E0B' : '#EF4444'} /></td>
              <td style={c.td}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {v.status === 'Pending' && <button onClick={() => approve(v.id)} style={{ ...c.btn, ...c.btnPrimary, padding: '4px 10px', fontSize: '0.7rem' }}>✅ Approve</button>}
                  <button onClick={() => openEdit(v)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.7rem' }}>✏️</button>
                  <button onClick={() => del(v.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.7rem' }}>🗑️</button>
                </div>
              </td>
            </tr>
          )}
        />
      </SectionCard>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Volunteer' : 'Edit Volunteer'} onClose={() => setModal(null)}>
          <FormField label="Full Name"><input style={c.input} value={form.name} onChange={f('name')} /></FormField>
          <FormField label="Email"><input style={c.input} value={form.email} onChange={f('email')} /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Role">
              <select style={{ ...c.select, width: '100%' }} value={form.role} onChange={f('role')}>
                {['Ticketing','Security','Media Team','First Aid','Hospitality','Stewarding','Logistics'].map(r => <option key={r}>{r}</option>)}
              </select>
            </FormField>
            <FormField label="Shift">
              <select style={{ ...c.select, width: '100%' }} value={form.shift} onChange={f('shift')}>
                <option>Morning</option><option>Evening</option><option>Full Day</option>
              </select>
            </FormField>
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
