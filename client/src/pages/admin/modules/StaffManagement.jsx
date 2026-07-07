import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initStaff = [
  { id: 1, name: 'Dr. Chukwudi Eze', role: 'Tournament Director', dept: 'Management', email: 'c.eze@sc2027.ng', phone: '08011111111', status: 'Active', joined: '2026-09-01' },
  { id: 2, name: 'Mrs. Amaka Okonkwo', role: 'Operations Manager', dept: 'Operations', email: 'a.okonkwo@sc2027.ng', phone: '08022222222', status: 'Active', joined: '2026-09-15' },
  { id: 3, name: 'Mr. Festus Idehen', role: 'Head of Security', dept: 'Security', email: 'f.idehen@sc2027.ng', phone: '08033333333', status: 'Active', joined: '2026-10-01' },
  { id: 4, name: 'Miss Blessing Osagie', role: 'Media Coordinator', dept: 'Media', email: 'b.osagie@sc2027.ng', phone: '08044444444', status: 'Active', joined: '2026-10-15' },
  { id: 5, name: 'Mr. Emeka Agbamu', role: 'Finance Officer', dept: 'Finance', email: 'e.agbamu@sc2027.ng', phone: '08055555555', status: 'Active', joined: '2026-09-01' },
  { id: 6, name: 'Dr. Grace Uwaifo', role: 'Team Doctor', dept: 'Medical', email: 'g.uwaifo@sc2027.ng', phone: '08066666666', status: 'Active', joined: '2026-11-01' },
  { id: 7, name: 'Mr. Sunday Obi', role: 'Ground Staff Manager', dept: 'Operations', email: 's.obi@sc2027.ng', phone: '08077777777', status: 'On Leave', joined: '2026-09-01' },
]

const deptColors = { Management: '#D4AF37', Operations: '#3B82F6', Security: '#EF4444', Media: '#EC4899', Finance: '#22C55E', Medical: '#14B8A6' }
const blank = { name: '', role: '', dept: 'Operations', email: '', phone: '', status: 'Active', joined: '' }

export default function StaffManagement() {
  const [staff, setStaff] = useState(initStaff)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')

  const depts = ['All', ...new Set(staff.map(s => s.dept))]
  const filtered = staff.filter(s =>
    (deptFilter === 'All' || s.dept === deptFilter) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()))
  )
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const openEdit = s => { setForm({ ...s }); setEditing(s.id); setModal(true) }
  const handleSave = () => {
    if (editing) setStaff(prev => prev.map(s => s.id === editing ? { ...form, id: editing } : s))
    else setStaff(prev => [...prev, { ...form, id: Date.now() }])
    setModal(false); setEditing(null)
  }
  const handleDelete = id => { if (confirm('Remove staff member?')) setStaff(prev => prev.filter(s => s.id !== id)) }

  return (
    <div>
      <ModuleHeader title="Staff Management" subtitle="Tournament staff and personnel" action="Add Staff" onAction={() => { setForm(blank); setEditing(null); setModal(true) }} count={staff.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Staff" value={staff.length} icon="👔" color="#D4AF37" />
        <StatCard label="Active" value={staff.filter(s => s.status === 'Active').length} icon="✅" color="#22C55E" />
        <StatCard label="On Leave" value={staff.filter(s => s.status === 'On Leave').length} icon="🏖️" color="#F59E0B" />
        <StatCard label="Departments" value={new Set(staff.map(s => s.dept)).size} icon="🏢" color="#3B82F6" />
      </div>

      <SectionCard title="👔 Staff Directory" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search staff..." />
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={c.select}>
            {depts.map(d => <option key={d}>{d}</option>)}
          </select>
        </ActionRow>
        <Table
          cols={['Name', 'Role', 'Department', 'Email', 'Phone', 'Status', 'Actions']}
          rows={filtered}
          renderRow={(s, i) => (
            <tr key={s.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <td style={{ ...c.td, fontWeight: 600 }}>{s.name}</td>
              <td style={{ ...c.td, color: 'rgba(255,255,255,0.65)' }}>{s.role}</td>
              <td style={c.td}><Badge label={s.dept} color={deptColors[s.dept] || '#D4AF37'} /></td>
              <td style={{ ...c.td, fontSize: '0.75rem' }}>{s.email}</td>
              <td style={c.td}>{s.phone}</td>
              <td style={c.td}><Badge label={s.status} color={s.status === 'Active' ? '#22C55E' : '#F59E0B'} /></td>
              <td style={c.td}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(s)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.72rem' }}>✏️</button>
                  <button onClick={() => handleDelete(s.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.72rem' }}>🗑️</button>
                </div>
              </td>
            </tr>
          )}
        />
      </SectionCard>

      {modal && (
        <Modal title={editing ? 'Edit Staff' : 'Add Staff Member'} onClose={() => { setModal(false); setEditing(null) }}>
          <FormField label="Full Name"><input style={c.input} value={form.name} onChange={set('name')} placeholder="Dr. Chukwudi Eze" /></FormField>
          <FormField label="Role / Title"><input style={c.input} value={form.role} onChange={set('role')} placeholder="Tournament Director" /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Department">
              <select style={{ ...c.select, width: '100%' }} value={form.dept} onChange={set('dept')}>
                {Object.keys(deptColors).map(d => <option key={d}>{d}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select style={{ ...c.select, width: '100%' }} value={form.status} onChange={set('status')}>
                <option>Active</option><option>On Leave</option><option>Inactive</option>
              </select>
            </FormField>
          </div>
          <FormField label="Email"><input style={c.input} type="email" value={form.email} onChange={set('email')} /></FormField>
          <FormField label="Phone"><input style={c.input} value={form.phone} onChange={set('phone')} /></FormField>
          <FormField label="Date Joined"><input style={c.input} type="date" value={form.joined} onChange={set('joined')} /></FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => { setModal(false); setEditing(null) }} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={handleSave} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Staff</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
