import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initStaff = []

const deptColors = { Administration: '#D4AF37', Operations: '#3B82F6', Football: '#22C55E', Medical: '#EC4899', Security: '#EF4444', Media: '#8B5CF6', Finance: '#F59E0B' }
const blank = { name: '', role: '', dept: 'Administration', status: 'Active', phone: '', email: '' }

export default function StaffManagement() {
  const [staff, setStaff]   = useState(initStaff)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  const [modal, setModal]   = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm]     = useState(blank)

  const depts    = [...new Set(staff.map(s => s.dept))]
  const filtered = staff.filter(s =>
    (deptFilter === 'All' || s.dept === deptFilter) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase()))
  )

  const openAdd  = () => { setForm(blank); setModal('add') }
  const openEdit = s => { setEditing(s.id); setForm({ ...s }); setModal('edit') }
  const save     = () => {
    if (modal === 'add') setStaff(p => [...p, { ...form, id: Date.now() }])
    else setStaff(p => p.map(s => s.id === editing ? { ...form, id: editing } : s))
    setModal(null)
  }
  const del = id => { if (confirm('Remove staff member?')) setStaff(p => p.filter(s => s.id !== id)) }
  const f   = k  => e => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div>
      <ModuleHeader title="Staff Management" subtitle="Tournament personnel directory" action="Add Staff" onAction={openAdd} count={staff.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Staff"  value={staff.length}                                icon="👔" color="#D4AF37" />
        <StatCard label="Active"       value={staff.filter(s => s.status === 'Active').length} icon="✅" color="#22C55E" />
        <StatCard label="On Leave"     value={staff.filter(s => s.status === 'On Leave').length} icon="🏖️" color="#F59E0B" />
        <StatCard label="Departments"  value={depts.length}                                icon="🏢" color="#3B82F6" />
      </div>

      <SectionCard title="👥 Staff Directory" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search name or role..." />
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} style={c.select}>
            <option value="All">All Departments</option>
            {depts.map(d => <option key={d}>{d}</option>)}
          </select>
        </ActionRow>
        <Table
          cols={['Name', 'Role', 'Department', 'Phone', 'Email', 'Status', 'Actions']}
          rows={filtered}
          renderRow={(s, i) => (
            <tr key={s.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <td style={{ ...c.td, fontWeight: 600 }}>{s.name}</td>
              <td style={{ ...c.td, fontSize: '0.8rem' }}>{s.role}</td>
              <td style={c.td}><Badge label={s.dept} color={deptColors[s.dept] || '#D4AF37'} /></td>
              <td style={{ ...c.td, fontSize: '0.75rem' }}>{s.phone}</td>
              <td style={{ ...c.td, fontSize: '0.72rem' }}>{s.email}</td>
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
        <Modal title={modal === 'add' ? 'Add Staff Member' : 'Edit Staff'} onClose={() => setModal(null)}>
          <FormField label="Full Name"><input style={c.input} value={form.name} onChange={f('name')} /></FormField>
          <FormField label="Role / Title"><input style={c.input} value={form.role} onChange={f('role')} placeholder="e.g. Operations Manager" /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Department">
              <select style={{ ...c.select, width: '100%' }} value={form.dept} onChange={f('dept')}>
                {['Administration','Operations','Football','Medical','Security','Media','Finance'].map(d => <option key={d}>{d}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select style={{ ...c.select, width: '100%' }} value={form.status} onChange={f('status')}>
                <option>Active</option><option>On Leave</option><option>Inactive</option>
              </select>
            </FormField>
            <FormField label="Phone"><input style={c.input} value={form.phone} onChange={f('phone')} placeholder="+234..." /></FormField>
            <FormField label="Email"><input style={c.input} value={form.email} onChange={f('email')} placeholder="staff@email.com" /></FormField>
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
