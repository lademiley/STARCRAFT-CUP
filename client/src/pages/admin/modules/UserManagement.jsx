import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initUsers = [
  { id: 1, name: 'Chukwuemeka Adeleke', email: 'c.adeleke@gmail.com', role: 'Fan', joined: '2027-01-05', status: 'Active', lastLogin: '2027-03-19' },
  { id: 2, name: 'Ngozi Okonkwo', email: 'ngozi.ok@yahoo.com', role: 'Team Manager', joined: '2026-12-10', status: 'Active', lastLogin: '2027-03-18' },
  { id: 3, name: 'Emmanuel Eze', email: 'e.eze@gmail.com', role: 'Fan', joined: '2027-02-14', status: 'Active', lastLogin: '2027-03-17' },
  { id: 4, name: 'Blessing Idahosa', email: 'blessing.id@hotmail.com', role: 'Media', joined: '2027-01-22', status: 'Active', lastLogin: '2027-03-20' },
  { id: 5, name: 'Festus Agbamu', email: 'festus.ag@gmail.com', role: 'Team Manager', joined: '2026-11-30', status: 'Active', lastLogin: '2027-03-19' },
  { id: 6, name: 'Amaka Uwaifo', email: 'amaka.u@gmail.com', role: 'Fan', joined: '2027-03-01', status: 'Active', lastLogin: '2027-03-15' },
  { id: 7, name: 'John Akhigbe', email: 'j.akhigbe@outlook.com', role: 'Fan', joined: '2027-02-28', status: 'Suspended', lastLogin: '2027-03-10' },
  { id: 8, name: 'Grace Osagie', email: 'grace.os@gmail.com', role: 'Sponsor', joined: '2026-10-15', status: 'Active', lastLogin: '2027-03-18' },
  { id: 9, name: 'Peter Nweke', email: 'peter.nw@gmail.com', role: 'Fan', joined: '2027-03-05', status: 'Active', lastLogin: '2027-03-12' },
  { id: 10, name: 'Sandra Obi', email: 's.obi@gmail.com', role: 'Media', joined: '2027-01-18', status: 'Active', lastLogin: '2027-03-20' },
]

const roleColor = { Fan: '#3B82F6', 'Team Manager': '#D4AF37', Media: '#EC4899', Sponsor: '#22C55E', Admin: '#EF4444' }

export default function UserManagement() {
  const [users, setUsers] = useState(initUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = users.filter(u =>
    (roleFilter === 'All' || u.role === roleFilter) &&
    (statusFilter === 'All' || u.status === statusFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  )

  const suspend = id => setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u))
  const deleteUser = id => { if (confirm('Delete user account?')) setUsers(prev => prev.filter(u => u.id !== id)) }

  return (
    <div>
      <ModuleHeader title="User Management" subtitle="All registered website users" count={users.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Users" value={users.length} icon="👥" color="#D4AF37" />
        <StatCard label="Active" value={users.filter(u => u.status === 'Active').length} icon="✅" color="#22C55E" />
        <StatCard label="Suspended" value={users.filter(u => u.status === 'Suspended').length} icon="🚫" color="#EF4444" />
        <StatCard label="Team Managers" value={users.filter(u => u.role === 'Team Manager').length} icon="⚽" color="#F59E0B" />
      </div>

      <SectionCard title="👥 User Registry" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search users..." />
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={c.select}>
            <option value="All">All Roles</option>
            {['Fan','Team Manager','Media','Sponsor'].map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={c.select}>
            <option value="All">All Status</option>
            <option>Active</option><option>Suspended</option>
          </select>
        </ActionRow>
        <Table
          cols={['Name', 'Email', 'Role', 'Joined', 'Last Login', 'Status', 'Actions']}
          rows={filtered}
          renderRow={(u, i) => (
            <tr key={u.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <td style={{ ...c.td, fontWeight: 600 }}>{u.name}</td>
              <td style={{ ...c.td, fontSize: '0.75rem' }}>{u.email}</td>
              <td style={c.td}><Badge label={u.role} color={roleColor[u.role] || '#D4AF37'} /></td>
              <td style={{ ...c.td, fontSize: '0.75rem' }}>{u.joined}</td>
              <td style={{ ...c.td, fontSize: '0.75rem' }}>{u.lastLogin}</td>
              <td style={c.td}><Badge label={u.status} color={u.status === 'Active' ? '#22C55E' : '#EF4444'} /></td>
              <td style={c.td}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => suspend(u.id)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.7rem' }}>
                    {u.status === 'Active' ? '🚫 Suspend' : '✅ Restore'}
                  </button>
                  <button onClick={() => deleteUser(u.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 8px', fontSize: '0.7rem' }}>🗑️</button>
                </div>
              </td>
            </tr>
          )}
        />
      </SectionCard>
    </div>
  )
}
