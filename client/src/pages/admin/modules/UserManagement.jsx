import React, { useState, useEffect } from 'react'
import { c, StatCard, SectionCard, Badge, Table, ModuleHeader, SearchBar, ActionRow } from './shared'

const roleColor = { fan: '#3B82F6', admin: '#EF4444' }

export default function UserManagement() {
  const [users, setUsers]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [roleFilter, setRoleFilter] = useState('All')

  const load = () => {
    setLoading(true)
    fetch('/api/users')
      .then(r => r.ok ? r.json() : { users: [] })
      .then(d => { setUsers(d.users || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = users.filter(u =>
    (roleFilter === 'All' || u.mode === roleFilter) &&
    (u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <ModuleHeader title="User Management" subtitle="All registered fan and admin accounts" count={users.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Accounts" value={users.length}                            icon="👥" color="#D4AF37" />
        <StatCard label="Fan Accounts"   value={users.filter(u => u.mode === 'fan').length} icon="🎫" color="#3B82F6" />
        <StatCard label="Admin Accounts" value={users.filter(u => u.mode === 'admin').length} icon="🔐" color="#EF4444" />
      </div>

      <SectionCard title="👥 User Accounts" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search name or email..." />
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={c.select}>
            <option value="All">All Roles</option>
            <option value="fan">Fan</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={load} style={{ ...c.btn, ...c.btnGhost, padding: '8px 14px', fontSize: '0.78rem' }}>🔄 Refresh</button>
        </ActionRow>

        {loading && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 40 }}>Loading accounts…</p>}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>👥</div>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>No accounts found.</p>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>Registered fans and admins appear here. Accounts are in-memory and reset on server restart.</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <Table
            cols={['Name', 'Email', 'Role', 'Joined', 'ID']}
            rows={filtered}
            renderRow={(u, i) => (
              <tr key={u.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                <td style={{ ...c.td, fontWeight: 600 }}>{u.name}</td>
                <td style={{ ...c.td, fontSize: '0.75rem' }}>{u.email}</td>
                <td style={c.td}><Badge label={u.mode} color={roleColor[u.mode] || '#D4AF37'} /></td>
                <td style={{ ...c.td, fontSize: '0.75rem' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-NG') : '—'}</td>
                <td style={{ ...c.td, fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{u.id}</td>
              </tr>
            )}
          />
        )}
      </SectionCard>
    </div>
  )
}
