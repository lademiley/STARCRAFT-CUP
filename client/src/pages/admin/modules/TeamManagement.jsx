import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initTeams = [
  { id: 1,  name: 'Akoko-Edo Panthers',  short: 'AKP', logo: '🐆', lga: 'Akoko-Edo',      coach: 'Gabriel Alagbe',     group: 'A', players: 22, points: 10, status: 'Active' },
  { id: 2,  name: 'Egor United',          short: 'EGU', logo: '🔥', lga: 'Egor',            coach: 'Emeka Olokor',       group: 'A', players: 20, points: 7,  status: 'Active' },
  { id: 3,  name: 'Esan Central FC',      short: 'ESC', logo: '⭐', lga: 'Esan Central',    coach: 'Chidi Nwosu',        group: 'A', players: 19, points: 5,  status: 'Active' },
  { id: 4,  name: 'Esan North Stars',     short: 'ENS', logo: '🌠', lga: 'Esan North-East', coach: 'Osaro Akhigbe',      group: 'A', players: 18, points: 4,  status: 'Active' },
  { id: 5,  name: 'Esan South FC',        short: 'ESS', logo: '🌊', lga: 'Esan South-East', coach: 'Festus Agbamu',      group: 'A', players: 17, points: 1,  status: 'Active' },
  { id: 6,  name: 'Esan West Rangers',    short: 'EWR', logo: '🦅', lga: 'Esan West',       coach: 'Dickson Owie',       group: 'B', players: 20, points: 9,  status: 'Active' },
  { id: 7,  name: 'Etsako Central FC',    short: 'ETC', logo: '🏰', lga: 'Etsako Central',  coach: 'Sunday Omotosho',    group: 'B', players: 21, points: 8,  status: 'Active' },
  { id: 8,  name: 'Etsako East United',   short: 'EEU', logo: '🦆', lga: 'Etsako East',     coach: 'John Ochuko',        group: 'B', players: 19, points: 6,  status: 'Active' },
  { id: 9,  name: 'Etsako West FC',       short: 'ETW', logo: '🛡️', lga: 'Etsako West',     coach: 'Peter Aigbe',        group: 'B', players: 18, points: 4,  status: 'Active' },
  { id: 10, name: 'Igueben FC',           short: 'IGU', logo: '⚔️', lga: 'Igueben',         coach: 'Felix Idahosa',      group: 'B', players: 17, points: 1,  status: 'Active' },
  { id: 11, name: 'Ikpoba-Okha FC',       short: 'IKO', logo: '🏆', lga: 'Ikpoba-Okha',     coach: 'Austin Oghuvwu',     group: 'C', players: 23, points: 12, status: 'Active' },
  { id: 12, name: 'Oredo City FC',        short: 'ORC', logo: '👑', lga: 'Oredo (Host)',    coach: 'Victor Ihejirika',   group: 'C', players: 22, points: 7,  status: 'Active' },
  { id: 13, name: 'Orhionmwon FC',        short: 'ORH', logo: '🌿', lga: 'Orhionmwon',      coach: 'Mike Odalume',       group: 'C', players: 18, points: 5,  status: 'Active' },
  { id: 14, name: 'Ovia North Rangers',   short: 'ONR', logo: '🦁', lga: 'Ovia North-East', coach: 'Emmanuel Okoro',     group: 'C', players: 19, points: 4,  status: 'Active' },
  { id: 15, name: 'Ovia South United',    short: 'OSU', logo: '🌍', lga: 'Ovia South-West', coach: 'Bright Osifo',       group: 'C', players: 16, points: 0,  status: 'Active' },
  { id: 16, name: 'Owan East FC',         short: 'OWE', logo: '🦊', lga: 'Owan East',       coach: 'Richard Ebore',      group: 'D', players: 21, points: 10, status: 'Active' },
  { id: 17, name: 'Owan West United',     short: 'OWW', logo: '🌙', lga: 'Owan West',       coach: 'Samuel Oriaifo',     group: 'D', players: 20, points: 8,  status: 'Active' },
  { id: 18, name: 'Uhunmwonde FC',        short: 'UHU', logo: '🏔️', lga: 'Uhunmwonde',      coach: 'Kingsley Egbase',    group: 'D', players: 18, points: 4,  status: 'Active' },
  { id: 19, name: 'Oredo Host XI',        short: 'HXI', logo: '🏠', lga: 'Host (Oredo)',    coach: 'Chief Osagie-Eweka', group: 'D', players: 17, points: 3,  status: 'Active' },
  { id: 20, name: 'Bendel Insurance Youth', short: 'BIY', logo: '🦁', lga: 'Defending 🏆',  coach: 'Godwin Enakhena',    group: 'D', players: 18, points: 0,  status: 'Active' },
]

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
