import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initVols = [
  { id: 1, name: 'Adaeze Okonkwo', role: 'Media Team', email: 'adaeze@gmail.com', phone: '08011111111', status: 'Approved', shift: 'Morning', registered: '2027-01-10' },
  { id: 2, name: 'Chukwuebuka Nweke', role: 'Ground Crew', email: 'cbuka@gmail.com', phone: '08022222222', status: 'Approved', shift: 'Afternoon', registered: '2027-01-12' },
  { id: 3, name: 'Ngozi Akhigbe', role: 'Registration Desk', email: 'ngozi@gmail.com', phone: '08033333333', status: 'Pending', shift: 'Full Day', registered: '2027-02-01' },
  { id: 4, name: 'Emmanuel Idahosa', role: 'Security Support', email: 'emma.id@gmail.com', phone: '08044444444', status: 'Approved', shift: 'Evening', registered: '2027-01-20' },
  { id: 5, name: 'Precious Omoruyi', role: 'First Aid', email: 'precious@gmail.com', phone: '08055555555', status: 'Approved', shift: 'Morning', registered: '2027-01-18' },
  { id: 6, name: 'Kelvin Agbamu', role: 'Hospitality', email: 'kelvin@gmail.com', phone: '08066666666', status: 'Pending', shift: 'Afternoon', registered: '2027-02-10' },
  { id: 7, name: 'Tina Ehigie', role: 'IT Support', email: 'tina.it@gmail.com', phone: '08077777777', status: 'Rejected', shift: 'Full Day', registered: '2027-01-30' },
  { id: 8, name: 'Francis Osagie', role: 'Media Team', email: 'franc@gmail.com', phone: '08088888888', status: 'Pending', shift: 'Morning', registered: '2027-02-14' },
]

const roles = ['Media Team', 'Ground Crew', 'Registration Desk', 'Security Support', 'First Aid', 'Hospitality', 'IT Support', 'Ball Boy/Girl', 'Event Photography']
const statusColor = { Approved: '#22C55E', Pending: '#F59E0B', Rejected: '#EF4444' }
const blank = { name: '', role: roles[0], email: '', phone: '', status: 'Pending', shift: 'Morning', registered: '' }

export default function VolunteerManagement() {
  const [vols, setVols] = useState(initVols)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = vols.filter(v =>
    (statusFilter === 'All' || v.status === statusFilter) &&
    (v.name.toLowerCase().includes(search.toLowerCase()) || v.role.toLowerCase().includes(search.toLowerCase()))
  )
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const openEdit = v => { setForm({ ...v }); setEditing(v.id); setModal(true) }
  const handleSave = () => {
    if (editing) setVols(prev => prev.map(v => v.id === editing ? { ...form, id: editing } : v))
    else setVols(prev => [...prev, { ...form, id: Date.now() }])
    setModal(false); setEditing(null)
  }
  const handleDelete = id => { if (confirm('Remove volunteer?')) setVols(prev => prev.filter(v => v.id !== id)) }
  const approve = id => setVols(prev => prev.map(v => v.id === id ? { ...v, status: 'Approved' } : v))
  const reject = id => setVols(prev => prev.map(v => v.id === id ? { ...v, status: 'Rejected' } : v))

  return (
    <div>
      <ModuleHeader title="Volunteer Management" subtitle="Manage volunteer applications and assignments" action="Add Volunteer" onAction={() => { setForm(blank); setEditing(null); setModal(true) }} count={vols.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Volunteers" value={vols.length} icon="🤝" color="#D4AF37" />
        <StatCard label="Approved" value={vols.filter(v => v.status === 'Approved').length} icon="✅" color="#22C55E" />
        <StatCard label="Pending" value={vols.filter(v => v.status === 'Pending').length} icon="⏳" color="#F59E0B" change="Needs review" />
        <StatCard label="Rejected" value={vols.filter(v => v.status === 'Rejected').length} icon="❌" color="#EF4444" />
      </div>

      <SectionCard title="🤝 Volunteer Registry" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search volunteers..." />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={c.select}>
            <option value="All">All Status</option>
            <option>Approved</option><option>Pending</option><option>Rejected</option>
          </select>
        </ActionRow>
        <Table
          cols={['Name', 'Role', 'Email', 'Shift', 'Registered', 'Status', 'Actions']}
          rows={filtered}
          renderRow={(v, i) => (
            <tr key={v.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <td style={{ ...c.td, fontWeight: 600 }}>{v.name}</td>
              <td style={c.td}>{v.role}</td>
              <td style={{ ...c.td, fontSize: '0.75rem' }}>{v.email}</td>
              <td style={c.td}>{v.shift}</td>
              <td style={{ ...c.td, fontSize: '0.75rem' }}>{v.registered}</td>
              <td style={c.td}><Badge label={v.status} color={statusColor[v.status]} /></td>
              <td style={c.td}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {v.status === 'Pending' && <>
                    <button onClick={() => approve(v.id)} style={{ ...c.btn, padding: '4px 8px', fontSize: '0.7rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', borderRadius: 6 }}>✓</button>
                    <button onClick={() => reject(v.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 8px', fontSize: '0.7rem' }}>✕</button>
                  </>}
                  <button onClick={() => openEdit(v)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 8px', fontSize: '0.7rem' }}>✏️</button>
                  <button onClick={() => handleDelete(v.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 8px', fontSize: '0.7rem' }}>🗑️</button>
                </div>
              </td>
            </tr>
          )}
        />
      </SectionCard>

      {modal && (
        <Modal title={editing ? 'Edit Volunteer' : 'Add Volunteer'} onClose={() => { setModal(false); setEditing(null) }}>
          <FormField label="Full Name"><input style={c.input} value={form.name} onChange={set('name')} /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Role">
              <select style={{ ...c.select, width: '100%' }} value={form.role} onChange={set('role')}>
                {roles.map(r => <option key={r}>{r}</option>)}
              </select>
            </FormField>
            <FormField label="Shift">
              <select style={{ ...c.select, width: '100%' }} value={form.shift} onChange={set('shift')}>
                <option>Morning</option><option>Afternoon</option><option>Evening</option><option>Full Day</option>
              </select>
            </FormField>
          </div>
          <FormField label="Email"><input style={c.input} type="email" value={form.email} onChange={set('email')} /></FormField>
          <FormField label="Phone"><input style={c.input} value={form.phone} onChange={set('phone')} /></FormField>
          <FormField label="Status">
            <select style={{ ...c.select, width: '100%' }} value={form.status} onChange={set('status')}>
              <option>Pending</option><option>Approved</option><option>Rejected</option>
            </select>
          </FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => { setModal(false); setEditing(null) }} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={handleSave} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
