import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initPlayers = []

const posColor = { Forward: '#EF4444', Midfielder: '#3B82F6', Defender: '#22C55E', Goalkeeper: '#F59E0B' }
const blank = { name: '', team: '', position: 'Forward', jersey: '', age: '', goals: 0, assists: 0, yellowCards: 0, redCards: 0, rating: 7.0, status: 'Active' }

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

  const openAdd  = () => { setForm(blank); setModal('add') }
  const openEdit = p => { setEditing(p.id); setForm({ ...p }); setModal('edit') }
  const save     = () => {
    if (modal === 'add') setPlayers(prev => [...prev, { ...form, id: Date.now() }])
    else setPlayers(prev => prev.map(p => p.id === editing ? { ...form, id: editing } : p))
    setModal(null)
  }
  const del = id => { if (confirm('Remove this player?')) setPlayers(prev => prev.filter(p => p.id !== id)) }
  const f   = k  => e => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div>
      <ModuleHeader title="Player Management" subtitle="Registered players — StarCraft Cup 2026" action="Add Player" onAction={openAdd} count={players.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Players" value={players.length} icon="👤" color="#D4AF37" />
        <StatCard label="Top Scorer"    value={players.length ? `${Math.max(...players.map(p => p.goals))} goals` : '—'} icon="⚽" color="#22C55E" />
        <StatCard label="Suspended"     value={players.filter(p => p.status === 'Suspended').length} icon="🟥" color="#EF4444" />
        <StatCard label="Avg Rating"    value={players.length ? (players.reduce((s, p) => s + p.rating, 0) / players.length).toFixed(1) : '—'} icon="⭐" color="#F59E0B" />
      </div>

      <SectionCard title="👥 Player Registry" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search player or team..." />
          <select value={posFilter} onChange={e => setPosFilter(e.target.value)} style={c.select}>
            <option value="All">All Positions</option>
            {['Forward','Midfielder','Defender','Goalkeeper'].map(p => <option key={p}>{p}</option>)}
          </select>
        </ActionRow>
        <Table
          cols={['Name','Team','Pos','#','Age','G','A','YC','RC','Rating','Status','Actions']}
          rows={filtered}
          renderRow={(p, i) => (
            <tr key={p.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <td style={{ ...c.td, fontWeight: 600 }}>{p.name}</td>
              <td style={{ ...c.td, fontSize: '0.72rem' }}>{p.team}</td>
              <td style={c.td}><Badge label={p.position} color={posColor[p.position]} /></td>
              <td style={c.td}>{p.jersey}</td>
              <td style={c.td}>{p.age}</td>
              <td style={{ ...c.td, color: '#22C55E', fontWeight: 700 }}>{p.goals}</td>
              <td style={{ ...c.td, color: '#3B82F6', fontWeight: 700 }}>{p.assists}</td>
              <td style={{ ...c.td, color: '#F59E0B' }}>{p.yellowCards}</td>
              <td style={{ ...c.td, color: '#EF4444' }}>{p.redCards}</td>
              <td style={{ ...c.td, color: '#D4AF37', fontWeight: 700 }}>{p.rating}</td>
              <td style={c.td}><Badge label={p.status} color={p.status === 'Active' ? '#22C55E' : '#EF4444'} /></td>
              <td style={c.td}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(p)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.7rem' }}>✏️</button>
                  <button onClick={() => del(p.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.7rem' }}>🗑️</button>
                </div>
              </td>
            </tr>
          )}
        />
      </SectionCard>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Player' : 'Edit Player'} onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Full Name"><input style={c.input} value={form.name} onChange={f('name')} placeholder="Player name" /></FormField>
            <FormField label="Team"><input style={c.input} value={form.team} onChange={f('team')} placeholder="Team name" /></FormField>
            <FormField label="Position">
              <select style={{ ...c.select, width: '100%' }} value={form.position} onChange={f('position')}>
                {['Forward','Midfielder','Defender','Goalkeeper'].map(p => <option key={p}>{p}</option>)}
              </select>
            </FormField>
            <FormField label="Jersey #"><input style={c.input} type="number" value={form.jersey} onChange={f('jersey')} /></FormField>
            <FormField label="Age"><input style={c.input} type="number" value={form.age} onChange={f('age')} /></FormField>
            <FormField label="Rating (0–10)"><input style={c.input} type="number" step="0.1" min="0" max="10" value={form.rating} onChange={f('rating')} /></FormField>
            <FormField label="Goals"><input style={c.input} type="number" value={form.goals} onChange={f('goals')} /></FormField>
            <FormField label="Assists"><input style={c.input} type="number" value={form.assists} onChange={f('assists')} /></FormField>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button onClick={() => setModal(null)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={save} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Player</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
