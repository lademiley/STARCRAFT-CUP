import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Modal, FormField, ModuleHeader } from './shared'

const PERMISSIONS = [
  'View Dashboard', 'Manage Teams', 'Manage Players', 'Manage Fixtures',
  'Enter Results', 'Manage Live Scores', 'Assign Referees', 'Manage Stadiums',
  'Manage Staff', 'Manage Volunteers', 'Manage Sponsors', 'Manage News',
  'Manage Gallery', 'View Users', 'Manage Users', 'View Finance',
  'Manage Finance', 'View Payments', 'Confirm Payments', 'Manage Merchandise',
  'Send Notifications', 'View Audit Logs', 'Manage Settings', 'Manage Roles',
  'Review Team Registrations', 'Approve Team Registrations',
]

const initRoles = [
  { id: 1, name: 'Super Admin',    color: '#EF4444', permissions: PERMISSIONS },
  { id: 2, name: 'Tournament Manager', color: '#D4AF37', permissions: ['View Dashboard','Manage Teams','Manage Players','Manage Fixtures','Enter Results','Manage Live Scores','Assign Referees','Manage Stadiums','View Finance','View Payments','Confirm Payments','Review Team Registrations','Approve Team Registrations'] },
  { id: 3, name: 'Finance Officer', color: '#22C55E', permissions: ['View Dashboard','View Finance','Manage Finance','View Payments','Confirm Payments'] },
  { id: 4, name: 'Media Manager',  color: '#8B5CF6', permissions: ['View Dashboard','Manage News','Manage Gallery','Send Notifications'] },
  { id: 5, name: 'Volunteer Coordinator', color: '#14B8A6', permissions: ['View Dashboard','Manage Volunteers','Manage Staff'] },
]

const blank = { name: '', color: '#3B82F6', permissions: [] }

export default function RolePermissions() {
  const [roles, setRoles]   = useState(initRoles)
  const [modal, setModal]   = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm]     = useState(blank)
  const [saved, setSaved]   = useState(false)

  const openAdd  = () => { setForm(blank); setModal('add') }
  const openEdit = r => { setEditing(r.id); setForm({ ...r, permissions: [...r.permissions] }); setModal('edit') }
  const togglePerm = perm => setForm(p => ({
    ...p,
    permissions: p.permissions.includes(perm) ? p.permissions.filter(x => x !== perm) : [...p.permissions, perm]
  }))
  const save = () => {
    if (modal === 'add') setRoles(p => [...p, { ...form, id: Date.now() }])
    else setRoles(p => p.map(r => r.id === editing ? { ...form, id: editing } : r))
    setSaved(true); setTimeout(() => setSaved(false), 3000)
    setModal(null)
  }
  const del = id => { if (confirm('Delete role?')) setRoles(p => p.filter(r => r.id !== id)) }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>Role & Permissions</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>Manage staff roles and access control</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {saved && <span style={{ color: '#22C55E', fontSize: '0.82rem', fontWeight: 700 }}>✅ Saved</span>}
          <button onClick={openAdd} style={{ ...c.btn, ...c.btnPrimary }}>+ Add Role</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Roles"  value={roles.length}                               icon="🔐" color="#D4AF37" />
        <StatCard label="Permissions"  value={PERMISSIONS.length}                          icon="🔑" color="#3B82F6" />
        <StatCard label="Super Admins" value={roles.filter(r => r.name === 'Super Admin').length} icon="👑" color="#EF4444" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {roles.map(role => (
          <div key={role.id} style={{ ...c.sectionCard, marginBottom: 0, borderLeft: `4px solid ${role.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: "'Cinzel',serif", fontSize: '1rem', fontWeight: 700 }}>{role.name}</span>
                <Badge label={`${role.permissions.length} permissions`} color={role.color} />
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => openEdit(role)} style={{ ...c.btn, ...c.btnGhost, padding: '5px 12px', fontSize: '0.75rem' }}>✏️ Edit</button>
                {role.name !== 'Super Admin' && (
                  <button onClick={() => del(role.id)} style={{ ...c.btn, ...c.btnDanger, padding: '5px 12px', fontSize: '0.75rem' }}>🗑️</button>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {role.permissions.map(perm => (
                <span key={perm} style={{ ...c.badge, background: `${role.color}15`, color: role.color, border: `1px solid ${role.color}30`, fontSize: '0.65rem', padding: '3px 8px' }}>
                  {perm}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Create Role' : `Edit Role — ${form.name}`} onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <FormField label="Role Name"><input style={c.input} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Content Editor" /></FormField>
            <FormField label="Color"><input type="color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} style={{ ...c.input, padding: 4, height: 42, cursor: 'pointer' }} /></FormField>
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: 1, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 12 }}>
            Permissions ({form.permissions.length} selected)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxHeight: 280, overflowY: 'auto', marginBottom: 20 }}>
            {PERMISSIONS.map(perm => {
              const active = form.permissions.includes(perm)
              return (
                <button key={perm} onClick={() => togglePerm(perm)} style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${active ? form.color : 'rgba(255,255,255,0.12)'}`, background: active ? `${form.color}20` : 'transparent', color: active ? form.color : 'rgba(255,255,255,0.5)', fontSize: '0.72rem', fontWeight: active ? 700 : 400, cursor: 'pointer', transition: 'all 200ms' }}>
                  {active ? '✓ ' : ''}{perm}
                </button>
              )
            })}
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button onClick={() => setForm(p => ({ ...p, permissions: [...PERMISSIONS] }))} style={{ ...c.btn, ...c.btnGhost, fontSize: '0.75rem', flex: 1 }}>Select All</button>
            <button onClick={() => setForm(p => ({ ...p, permissions: [] }))} style={{ ...c.btn, ...c.btnGhost, fontSize: '0.75rem', flex: 1 }}>Clear All</button>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setModal(null)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={save} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Role</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
