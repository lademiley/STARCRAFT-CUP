import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Modal, FormField, ModuleHeader } from './shared'

const PERMISSIONS = [
  { key: 'view_dashboard', label: 'View Dashboard' },
  { key: 'manage_teams', label: 'Manage Teams' },
  { key: 'manage_players', label: 'Manage Players' },
  { key: 'manage_fixtures', label: 'Manage Fixtures' },
  { key: 'enter_results', label: 'Enter Results' },
  { key: 'live_score', label: 'Live Score Control' },
  { key: 'assign_referees', label: 'Assign Referees' },
  { key: 'manage_users', label: 'Manage Users' },
  { key: 'manage_content', label: 'Manage Content (News/Gallery)' },
  { key: 'manage_finance', label: 'View Financial Reports' },
  { key: 'manage_sponsors', label: 'Manage Sponsors' },
  { key: 'manage_tickets', label: 'Manage Ticket Sales' },
  { key: 'send_notifications', label: 'Send Notifications' },
  { key: 'view_audit', label: 'View Audit Logs' },
  { key: 'manage_settings', label: 'Website Settings' },
  { key: 'manage_roles', label: 'Role & Permission Management' },
]

const initRoles = [
  { id: 1, name: 'Super Admin', desc: 'Full system access', color: '#D4AF37', perms: PERMISSIONS.map(p => p.key), users: 1 },
  { id: 2, name: 'Tournament Manager', desc: 'Manage all tournament operations', color: '#3B82F6', perms: ['view_dashboard','manage_teams','manage_players','manage_fixtures','enter_results','live_score','assign_referees','manage_content'], users: 2 },
  { id: 3, name: 'Media Officer', desc: 'Content and communications', color: '#EC4899', perms: ['view_dashboard','manage_content','send_notifications'], users: 3 },
  { id: 4, name: 'Finance Officer', desc: 'Financial access only', color: '#22C55E', perms: ['view_dashboard','manage_finance','manage_sponsors','manage_tickets'], users: 1 },
  { id: 5, name: 'Team Manager', desc: 'Limited team-specific access', color: '#F59E0B', perms: ['view_dashboard','manage_players'], users: 12 },
  { id: 6, name: 'Referee', desc: 'Match and fixture access', color: '#8B5CF6', perms: ['view_dashboard','manage_fixtures','enter_results'], users: 6 },
]

const blank = { name: '', desc: '', color: '#3B82F6', perms: [], users: 0 }

export default function RolePermissions() {
  const [roles, setRoles] = useState(initRoles)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)

  const openEdit = r => { setForm({ ...r, perms: [...r.perms] }); setEditing(r.id); setModal('role') }
  const handleSave = () => {
    if (editing) setRoles(prev => prev.map(r => r.id === editing ? { ...form, id: editing } : r))
    else setRoles(prev => [...prev, { ...form, id: Date.now(), users: 0 }])
    setModal(null); setEditing(null)
  }
  const togglePerm = key => setForm(p => ({ ...p, perms: p.perms.includes(key) ? p.perms.filter(k => k !== key) : [...p.perms, key] }))
  const handleDelete = id => { if (confirm('Delete this role?')) setRoles(prev => prev.filter(r => r.id !== id)) }

  return (
    <div>
      <ModuleHeader title="Role & Permissions" subtitle="Define roles and access control" action="Create Role" onAction={() => { setForm(blank); setEditing(null); setModal('role') }} count={roles.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Roles" value={roles.length} icon="🔐" color="#D4AF37" />
        <StatCard label="Total Admins" value={roles.reduce((s, r) => s + r.users, 0)} icon="👤" color="#3B82F6" />
        <StatCard label="Super Admins" value={roles.find(r => r.name === 'Super Admin')?.users || 0} icon="⭐" color="#F59E0B" />
        <StatCard label="Permissions" value={PERMISSIONS.length} icon="🔑" color="#22C55E" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 24 }}>
        {roles.map(r => (
          <div key={r.id} style={{ ...c.card, borderLeft: `4px solid ${r.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{r.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{r.desc}</div>
              </div>
              <Badge label={`${r.users} user${r.users !== 1 ? 's' : ''}`} color={r.color} />
            </div>
            {/* Permission list */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
              {r.perms.length === PERMISSIONS.length ? (
                <Badge label="All Permissions" color="#D4AF37" />
              ) : (
                r.perms.slice(0, 5).map(pk => {
                  const perm = PERMISSIONS.find(p => p.key === pk)
                  return perm ? <Badge key={pk} label={perm.label} color={r.color} /> : null
                })
              )}
              {r.perms.length > 5 && r.perms.length < PERMISSIONS.length && (
                <Badge label={`+${r.perms.length - 5} more`} color="rgba(255,255,255,0.3)" />
              )}
            </div>
            {/* Permission count bar */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>
                <span>{r.perms.length} of {PERMISSIONS.length} permissions</span>
                <span>{Math.round(r.perms.length / PERMISSIONS.length * 100)}%</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${r.perms.length / PERMISSIONS.length * 100}%`, background: r.color, borderRadius: 2 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => openEdit(r)} style={{ ...c.btn, ...c.btnGhost, flex: 1, fontSize: '0.72rem' }}>✏️ Edit Role</button>
              {r.name !== 'Super Admin' && <button onClick={() => handleDelete(r.id)} style={{ ...c.btn, ...c.btnDanger, padding: '8px 12px', fontSize: '0.72rem' }}>🗑️</button>}
            </div>
          </div>
        ))}
      </div>

      {/* Permission Matrix */}
      <SectionCard title="🔑 Full Permission Matrix" action="">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
            <thead>
              <tr>
                <th style={{ ...c.th, minWidth: 180 }}>Permission</th>
                {roles.map(r => (
                  <th key={r.id} style={{ ...c.th, textAlign: 'center', minWidth: 100 }}>
                    <span style={{ color: r.color }}>{r.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((perm, i) => (
                <tr key={perm.key} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                  <td style={{ ...c.td, fontWeight: 500 }}>{perm.label}</td>
                  {roles.map(r => (
                    <td key={r.id} style={{ ...c.td, textAlign: 'center' }}>
                      {r.perms.includes(perm.key) ? (
                        <span style={{ color: '#22C55E', fontSize: '1rem' }}>✓</span>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.8rem' }}>—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {modal === 'role' && (
        <Modal title={editing ? 'Edit Role' : 'Create Role'} onClose={() => { setModal(null); setEditing(null) }}>
          <FormField label="Role Name"><input style={c.input} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></FormField>
          <FormField label="Description"><input style={c.input} value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} /></FormField>
          <FormField label="Color"><input type="color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} style={{ ...c.input, height: 40, padding: 4 }} /></FormField>
          <FormField label="Permissions">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 240, overflowY: 'auto', padding: '8px 0' }}>
              <button onClick={() => setForm(p => ({ ...p, perms: p.perms.length === PERMISSIONS.length ? [] : PERMISSIONS.map(pm => pm.key) }))} style={{ ...c.btn, ...c.btnGhost, textAlign: 'left', fontSize: '0.75rem', marginBottom: 4 }}>
                {form.perms.length === PERMISSIONS.length ? '☑ Deselect All' : '☐ Select All'}
              </button>
              {PERMISSIONS.map(perm => (
                <label key={perm.key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.perms.includes(perm.key)} onChange={() => togglePerm(perm.key)} style={{ accentColor: form.color, width: 14, height: 14 }} />
                  <span style={{ fontSize: '0.8rem', color: form.perms.includes(perm.key) ? '#fff' : 'rgba(255,255,255,0.5)' }}>{perm.label}</span>
                </label>
              ))}
            </div>
          </FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => { setModal(null); setEditing(null) }} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={handleSave} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Role</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
