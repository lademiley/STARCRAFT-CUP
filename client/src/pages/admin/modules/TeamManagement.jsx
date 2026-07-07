import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initTeams = [
  { id: 1, name: 'Edo Warriors', short: 'EDO', logo: '🦁', city: 'Benin City', coach: 'Emmanuel Okoro', group: 'A', status: 'Active', players: 22 },
  { id: 2, name: 'Oredo United', short: 'ORU', logo: '⚡', city: 'Oredo', coach: 'Victor Ihejirika', group: 'A', status: 'Active', players: 20 },
  { id: 3, name: 'Ugbowo Stars', short: 'UGS', logo: '⭐', city: 'Ugbowo', coach: 'Chidi Nwosu', group: 'A', status: 'Active', players: 19 },
  { id: 4, name: 'Sapele City FC', short: 'SAP', logo: '🌊', city: 'Sapele', coach: 'Emeka Eze', group: 'A', status: 'Active', players: 21 },
  { id: 5, name: 'Warri Wolves', short: 'WAR', logo: '🐺', city: 'Warri', coach: 'Festus Agbamu', group: 'A', status: 'Active', players: 18 },
  { id: 6, name: 'Ughelli Rangers', short: 'UGR', logo: '🦅', city: 'Ughelli', coach: 'Dickson Owie', group: 'A', status: 'Active', players: 20 },
  { id: 7, name: 'Benin Royals', short: 'BNR', logo: '👑', city: 'Benin City', coach: 'Austin Oghuvwu', group: 'B', status: 'Active', players: 23 },
  { id: 8, name: 'Delta Eagles', short: 'DEL', logo: '🦆', city: 'Asaba', coach: 'John Ochuko', group: 'B', status: 'Active', players: 21 },
  { id: 9, name: 'Uromi FC', short: 'URO', logo: '🛡️', city: 'Uromi', coach: 'Peter Aigbe', group: 'B', status: 'Active', players: 19 },
  { id: 10, name: 'Ekpoma Lions', short: 'EKP', logo: '🦁', city: 'Ekpoma', coach: 'Felix Idahosa', group: 'B', status: 'Active', players: 20 },
  { id: 11, name: 'Auchi City', short: 'AUC', logo: '🏰', city: 'Auchi', coach: 'Sunday Omotosho', group: 'B', status: 'Active', players: 18 },
  { id: 12, name: 'Esan Warriors', short: 'ESA', logo: '⚔️', city: 'Irrua', coach: 'Mike Odalume', group: 'B', status: 'Active', players: 17 },
]

const blank = { name: '', short: '', logo: '⚽', city: '', coach: '', group: 'A', status: 'Active', players: 0 }

export default function TeamManagement() {
  const [teams, setTeams] = useState(initTeams)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [modal, setModal] = useState(null) // null | 'add' | 'edit'
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank)

  const filtered = teams.filter(t =>
    (filter === 'All' || t.group === filter) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.city.toLowerCase().includes(search.toLowerCase()))
  )

  const openAdd = () => { setForm(blank); setModal('add') }
  const openEdit = (t) => { setEditing(t.id); setForm({ ...t }); setModal('edit') }
  const handleSave = () => {
    if (modal === 'add') {
      setTeams(prev => [...prev, { ...form, id: Date.now(), players: Number(form.players) }])
    } else {
      setTeams(prev => prev.map(t => t.id === editing ? { ...form, id: editing, players: Number(form.players) } : t))
    }
    setModal(null)
  }
  const handleDelete = (id) => { if (confirm('Delete this team?')) setTeams(prev => prev.filter(t => t.id !== id)) }
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div>
      <ModuleHeader title="Team Management" subtitle="Manage all tournament teams" action="Add Team" onAction={openAdd} count={teams.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Teams" value={teams.length} icon="🏆" color="#D4AF37" />
        <StatCard label="Group A" value={teams.filter(t => t.group === 'A').length} icon="🅰️" color="#3B82F6" />
        <StatCard label="Group B" value={teams.filter(t => t.group === 'B').length} icon="🅱️" color="#22C55E" />
        <StatCard label="Total Players" value={teams.reduce((s, t) => s + Number(t.players), 0)} icon="👤" color="#F59E0B" />
      </div>

      <SectionCard title="📋 All Teams" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search teams..." />
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ ...c.select }}>
            <option value="All">All Groups</option>
            <option value="A">Group A</option>
            <option value="B">Group B</option>
          </select>
        </ActionRow>
        <Table
          cols={['Team', 'Code', 'City', 'Coach', 'Group', 'Players', 'Status', 'Actions']}
          rows={filtered}
          renderRow={(t, i) => (
            <tr key={t.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <td style={c.td}><span style={{ marginRight: 8 }}>{t.logo}</span>{t.name}</td>
              <td style={c.td}><Badge label={t.short} color="#D4AF37" /></td>
              <td style={c.td}>{t.city}</td>
              <td style={c.td}>{t.coach}</td>
              <td style={c.td}><Badge label={`Group ${t.group}`} color={t.group === 'A' ? '#3B82F6' : '#22C55E'} /></td>
              <td style={c.td}>{t.players}</td>
              <td style={c.td}><Badge label={t.status} color="#22C55E" /></td>
              <td style={c.td}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(t)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.72rem' }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(t.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.72rem' }}>🗑️</button>
                </div>
              </td>
            </tr>
          )}
        />
      </SectionCard>

      {modal && (
        <Modal title={modal === 'add' ? 'Add New Team' : 'Edit Team'} onClose={() => setModal(null)}>
          <FormField label="Team Name"><input style={c.input} value={form.name} onChange={set('name')} placeholder="Edo Warriors" /></FormField>
          <FormField label="Short Code"><input style={c.input} value={form.short} onChange={set('short')} placeholder="EDO" maxLength={4} /></FormField>
          <FormField label="Logo Emoji"><input style={c.input} value={form.logo} onChange={set('logo')} placeholder="⚽" /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="City"><input style={c.input} value={form.city} onChange={set('city')} placeholder="Benin City" /></FormField>
            <FormField label="Group">
              <select style={{ ...c.select, width: '100%' }} value={form.group} onChange={set('group')}>
                <option value="A">Group A</option>
                <option value="B">Group B</option>
              </select>
            </FormField>
          </div>
          <FormField label="Head Coach"><input style={c.input} value={form.coach} onChange={set('coach')} placeholder="Coach Name" /></FormField>
          <FormField label="Squad Size"><input style={{ ...c.input }} type="number" value={form.players} onChange={set('players')} placeholder="22" /></FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => setModal(null)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={handleSave} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Team</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
