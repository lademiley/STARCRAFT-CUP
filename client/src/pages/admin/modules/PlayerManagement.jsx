import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initPlayers = [
  { id: 1, name: 'Chukwuemeka Obi', position: 'Forward', team: 'Edo Warriors', jersey: 9, age: 24, goals: 7, assists: 3, rating: 9.1, status: 'Active' },
  { id: 2, name: 'Victor Ehigie', position: 'Midfielder', team: 'Oredo United', jersey: 8, age: 26, goals: 4, assists: 6, rating: 8.7, status: 'Active' },
  { id: 3, name: 'Emmanuel Okuosa', position: 'Goalkeeper', team: 'Benin Royals', jersey: 1, age: 28, goals: 0, assists: 0, rating: 8.5, status: 'Active' },
  { id: 4, name: 'Samuel Oriaifo', position: 'Defender', team: 'Edo Warriors', jersey: 4, age: 25, goals: 1, assists: 2, rating: 8.2, status: 'Active' },
  { id: 5, name: 'David Akhigbe', position: 'Forward', team: 'Delta Eagles', jersey: 11, age: 22, goals: 5, assists: 4, rating: 8.0, status: 'Active' },
  { id: 6, name: 'Peter Osagie', position: 'Midfielder', team: 'Ugbowo Stars', jersey: 6, age: 27, goals: 3, assists: 5, rating: 7.8, status: 'Active' },
  { id: 7, name: 'Felix Agbonlahor', position: 'Forward', team: 'Oredo United', jersey: 10, age: 23, goals: 4, assists: 3, rating: 7.9, status: 'Active' },
  { id: 8, name: 'Monday Ogunbor', position: 'Defender', team: 'Benin Royals', jersey: 5, age: 30, goals: 0, assists: 1, rating: 7.5, status: 'Suspended' },
  { id: 9, name: 'John Uwaifo', position: 'Forward', team: 'Warri Wolves', jersey: 7, age: 21, goals: 2, assists: 1, rating: 7.2, status: 'Active' },
  { id: 10, name: 'Chris Ehigiamusoe', position: 'Midfielder', team: 'Uromi FC', jersey: 14, age: 24, goals: 2, assists: 7, rating: 7.7, status: 'Active' },
  { id: 11, name: 'Bright Omokhagbo', position: 'Goalkeeper', team: 'Edo Warriors', jersey: 23, age: 26, goals: 0, assists: 0, rating: 8.3, status: 'Active' },
  { id: 12, name: 'Kingsley Idehen', position: 'Forward', team: 'Sapele City FC', jersey: 9, age: 25, goals: 3, assists: 2, rating: 6.9, status: 'Suspended' },
]

const blank = { name: '', position: 'Forward', team: '', jersey: '', age: '', goals: 0, assists: 0, rating: 7.0, status: 'Active' }
const posColor = { Forward: '#EF4444', Midfielder: '#3B82F6', Defender: '#22C55E', Goalkeeper: '#F59E0B' }

export default function PlayerManagement() {
  const [players, setPlayers] = useState(initPlayers)
  const [search, setSearch] = useState('')
  const [posFilter, setPosFilter] = useState('All')
  const [modal, setModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank)

  const filtered = players.filter(p =>
    (posFilter === 'All' || p.position === posFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.team.toLowerCase().includes(search.toLowerCase()))
  )

  const openEdit = (p) => { setEditing(p.id); setForm({ ...p }); setModal('edit') }
  const openAdd = () => { setForm(blank); setModal('add') }
  const handleSave = () => {
    if (modal === 'add') setPlayers(prev => [...prev, { ...form, id: Date.now(), goals: Number(form.goals), assists: Number(form.assists), jersey: Number(form.jersey), age: Number(form.age), rating: Number(form.rating) }])
    else setPlayers(prev => prev.map(p => p.id === editing ? { ...form, id: editing, goals: Number(form.goals), assists: Number(form.assists), jersey: Number(form.jersey), age: Number(form.age), rating: Number(form.rating) } : p))
    setModal(null)
  }
  const handleDelete = (id) => { if (confirm('Remove this player?')) setPlayers(prev => prev.filter(p => p.id !== id)) }
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div>
      <ModuleHeader title="Player Management" subtitle="All registered players" action="Add Player" onAction={openAdd} count={players.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Players" value={players.length} icon="👤" color="#D4AF37" />
        <StatCard label="Forwards" value={players.filter(p => p.position === 'Forward').length} icon="⚽" color="#EF4444" />
        <StatCard label="Midfielders" value={players.filter(p => p.position === 'Midfielder').length} icon="🔄" color="#3B82F6" />
        <StatCard label="Suspended" value={players.filter(p => p.status === 'Suspended').length} icon="🟡" color="#F59E0B" />
      </div>

      <SectionCard title="👤 Player Registry" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search players..." />
          <select value={posFilter} onChange={e => setPosFilter(e.target.value)} style={c.select}>
            <option value="All">All Positions</option>
            <option>Forward</option><option>Midfielder</option><option>Defender</option><option>Goalkeeper</option>
          </select>
        </ActionRow>
        <Table
          cols={['Player', 'Position', 'Team', '#', 'Age', 'Goals', 'Assists', 'Rating', 'Status', 'Actions']}
          rows={filtered}
          renderRow={(p, i) => (
            <tr key={p.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <td style={{ ...c.td, fontWeight: 600 }}>{p.name}</td>
              <td style={c.td}><Badge label={p.position} color={posColor[p.position] || '#D4AF37'} /></td>
              <td style={c.td}>{p.team}</td>
              <td style={c.td}>{p.jersey}</td>
              <td style={c.td}>{p.age}</td>
              <td style={{ ...c.td, color: '#22C55E', fontWeight: 700 }}>{p.goals}</td>
              <td style={{ ...c.td, color: '#3B82F6', fontWeight: 700 }}>{p.assists}</td>
              <td style={{ ...c.td, color: '#D4AF37', fontWeight: 700 }}>{p.rating}★</td>
              <td style={c.td}><Badge label={p.status} color={p.status === 'Active' ? '#22C55E' : '#EF4444'} /></td>
              <td style={c.td}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(p)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.72rem' }}>✏️</button>
                  <button onClick={() => handleDelete(p.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.72rem' }}>🗑️</button>
                </div>
              </td>
            </tr>
          )}
        />
      </SectionCard>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Player' : 'Edit Player'} onClose={() => setModal(null)}>
          <FormField label="Full Name"><input style={c.input} value={form.name} onChange={set('name')} placeholder="Player Name" /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Position">
              <select style={{ ...c.select, width: '100%' }} value={form.position} onChange={set('position')}>
                <option>Forward</option><option>Midfielder</option><option>Defender</option><option>Goalkeeper</option>
              </select>
            </FormField>
            <FormField label="Jersey #"><input style={c.input} type="number" value={form.jersey} onChange={set('jersey')} /></FormField>
          </div>
          <FormField label="Team"><input style={c.input} value={form.team} onChange={set('team')} placeholder="Team name" /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <FormField label="Age"><input style={c.input} type="number" value={form.age} onChange={set('age')} /></FormField>
            <FormField label="Goals"><input style={c.input} type="number" value={form.goals} onChange={set('goals')} /></FormField>
            <FormField label="Assists"><input style={c.input} type="number" value={form.assists} onChange={set('assists')} /></FormField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Rating (0-10)"><input style={c.input} type="number" step="0.1" min="0" max="10" value={form.rating} onChange={set('rating')} /></FormField>
            <FormField label="Status">
              <select style={{ ...c.select, width: '100%' }} value={form.status} onChange={set('status')}>
                <option>Active</option><option>Suspended</option><option>Injured</option>
              </select>
            </FormField>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => setModal(null)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={handleSave} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Player</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
