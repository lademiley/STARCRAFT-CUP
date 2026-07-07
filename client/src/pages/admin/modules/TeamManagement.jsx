import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initTeams = []

const blank = { name: '', short: '', logo: '⚽', lga: '', coach: '', group: 'A', players: 18, points: 0, status: 'Active' }

export default function TeamManagement() {
  const [teams, setTeams] = useState(initTeams)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [modal, setModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank)

  const filtered = teams.filter(t =>
    (filter === 'All' || t.group === filter) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.lga.toLowerCase().includes(search.toLowerCase()))
  )

  const openAdd  = () => { setForm(blank); setModal('add') }
  const openEdit = t => { setEditing(t.id); setForm({ ...t }); setModal('edit') }
  const save     = () => {
    if (modal === 'add') setTeams(p => [...p, { ...form, id: Date.now(), players: Number(form.players), points: Number(form.points) }])
    else setTeams(p => p.map(t => t.id === editing ? { ...form, id: editing } : t))
    setModal(null)
  }
  const del = id => { if (confirm('Delete this team?')) setTeams(p => p.filter(t => t.id !== id)) }
  const f   = k  => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const groupColors = { A: '#D4AF37', B: '#3B82F6', C: '#22C55E', D: '#EC4899' }

  return (
    <div>
      <ModuleHeader title="Team Management" subtitle="All 20 teams — StarCraft Cup 2026, Oredo LGA" action="Add Team" onAction={openAdd} count={teams.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Teams" value={teams.length} icon="🏆" color="#D4AF37" />
        {['A','B','C','D'].map((g, i) => (
          <StatCard key={g} label={`Group ${g}`} value={teams.filter(t => t.group === g).length} icon={['🅰️','🅱️','🇨','🇩'][i]} color={groupColors[g]} />
        ))}
      </div>

      <SectionCard title="📋 All Teams" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search teams or LGA..." />
          <select value={filter} onChange={e => setFilter(e.target.value)} style={c.select}>
            <option value="All">All Groups</option>
            {['A','B','C','D'].map(g => <option key={g} value={g}>Group {g}</option>)}
          </select>
        </ActionRow>
        <Table
          cols={['Team', 'Code', 'LGA', 'Coach', 'Group', 'Squad', 'Pts', 'Status', 'Actions']}
          rows={filtered}
          renderRow={(t, i) => (
            <tr key={t.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <td style={c.td}><span style={{ marginRight: 8 }}>{t.logo}</span>{t.name}</td>
              <td style={c.td}><Badge label={t.short} color="#D4AF37" /></td>
              <td style={{ ...c.td, fontSize: '0.75rem' }}>{t.lga}</td>
              <td style={{ ...c.td, fontSize: '0.75rem' }}>{t.coach}</td>
              <td style={c.td}><Badge label={`Group ${t.group}`} color={groupColors[t.group]} /></td>
              <td style={c.td}>{t.players}</td>
              <td style={{ ...c.td, fontWeight: 700, color: '#D4AF37' }}>{t.points}</td>
              <td style={c.td}><Badge label={t.status} color="#22C55E" /></td>
              <td style={c.td}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(t)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.72rem' }}>✏️</button>
                  <button onClick={() => del(t.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.72rem' }}>🗑️</button>
                </div>
              </td>
            </tr>
          )}
        />
      </SectionCard>

      {modal && (
        <Modal title={modal === 'add' ? 'Add New Team' : 'Edit Team'} onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Team Name"><input style={c.input} value={form.name} onChange={f('name')} placeholder="Oredo City FC" /></FormField>
            <FormField label="Short Code"><input style={c.input} value={form.short} onChange={f('short')} placeholder="ORC" maxLength={4} /></FormField>
            <FormField label="Logo Emoji"><input style={c.input} value={form.logo} onChange={f('logo')} placeholder="⚽" /></FormField>
            <FormField label="Group">
              <select style={{ ...c.select, width: '100%' }} value={form.group} onChange={f('group')}>
                {['A','B','C','D'].map(g => <option key={g} value={g}>Group {g}</option>)}
              </select>
            </FormField>
            <FormField label="LGA / City"><input style={c.input} value={form.lga} onChange={f('lga')} placeholder="Oredo" /></FormField>
            <FormField label="Head Coach"><input style={c.input} value={form.coach} onChange={f('coach')} placeholder="Coach Name" /></FormField>
            <FormField label="Squad Size"><input style={c.input} type="number" value={form.players} onChange={f('players')} /></FormField>
            <FormField label="Points"><input style={c.input} type="number" value={form.points} onChange={f('points')} /></FormField>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => setModal(null)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={save} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Team</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
