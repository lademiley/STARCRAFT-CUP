import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initFixtures = []

const blank = { home: '', away: '', date: '', time: '10:00', venue: 'Ugbowo Campus Main Bowl', round: 'Group Stage', status: 'upcoming', homeScore: null, awayScore: null }
const roundColors = { 'Group Stage': '#3B82F6', 'Quarter-Final': '#F59E0B', 'Semi-Final': '#EC4899', 'Final': '#D4AF37', 'Opening Exhibition': '#22C55E' }
const statusColors = { completed: '#22C55E', upcoming: '#3B82F6', live: '#EF4444', postponed: '#F59E0B' }

export default function FixtureGenerator() {
  const [fixtures, setFixtures] = useState(initFixtures)
  const [search, setSearch] = useState('')
  const [roundFilter, setRoundFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modal, setModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank)

  const filtered = fixtures.filter(f =>
    (roundFilter === 'All' || f.round === roundFilter) &&
    (statusFilter === 'All' || f.status === statusFilter) &&
    (f.home.toLowerCase().includes(search.toLowerCase()) || f.away.toLowerCase().includes(search.toLowerCase()))
  )

  const openAdd  = () => { setForm(blank); setModal('add') }
  const openEdit = f => { setEditing(f.id); setForm({ ...f }); setModal('edit') }
  const save     = () => {
    if (modal === 'add') setFixtures(p => [...p, { ...form, id: Date.now() }])
    else setFixtures(p => p.map(f => f.id === editing ? { ...form, id: editing } : f))
    setModal(null)
  }
  const del = id => { if (confirm('Delete this fixture?')) setFixtures(p => p.filter(f => f.id !== id)) }
  const ff  = k  => e => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div>
      <ModuleHeader title="Fixture Generator" subtitle="Schedule management — StarCraft Cup 2026" action="Add Fixture" onAction={openAdd} count={fixtures.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Fixtures"  value={fixtures.length}                            icon="📅" color="#D4AF37" />
        <StatCard label="Completed"       value={fixtures.filter(f => f.status==='completed').length} icon="✅" color="#22C55E" />
        <StatCard label="Upcoming"        value={fixtures.filter(f => f.status==='upcoming').length}  icon="⏳" color="#3B82F6" />
        <StatCard label="Venues"          value={2}                                          icon="🏟️" color="#F59E0B" />
      </div>

      <SectionCard title="📋 All Fixtures" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search teams..." />
          <select value={roundFilter} onChange={e => setRoundFilter(e.target.value)} style={c.select}>
            <option value="All">All Rounds</option>
            {['Group Stage','Quarter-Final','Semi-Final','Final'].map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={c.select}>
            <option value="All">All Status</option>
            {['upcoming','completed','live','postponed'].map(s => <option key={s}>{s}</option>)}
          </select>
        </ActionRow>
        <Table
          cols={['Date & Time','Home Team','Away Team','Score','Round','Venue','Status','Actions']}
          rows={filtered}
          renderRow={(f, i) => (
            <tr key={f.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <td style={{ ...c.td, fontSize: '0.75rem' }}>{f.date} {f.time}</td>
              <td style={{ ...c.td, fontWeight: 600 }}>{f.home}</td>
              <td style={{ ...c.td, fontWeight: 600 }}>{f.away}</td>
              <td style={{ ...c.td, fontWeight: 800, color: '#D4AF37' }}>
                {f.homeScore !== null ? `${f.homeScore} – ${f.awayScore}` : '—'}
              </td>
              <td style={c.td}><Badge label={f.round} color={roundColors[f.round] || '#D4AF37'} /></td>
              <td style={{ ...c.td, fontSize: '0.72rem' }}>{f.venue}</td>
              <td style={c.td}><Badge label={f.status} color={statusColors[f.status] || '#D4AF37'} /></td>
              <td style={c.td}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(f)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.7rem' }}>✏️</button>
                  <button onClick={() => del(f.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.7rem' }}>🗑️</button>
                </div>
              </td>
            </tr>
          )}
        />
      </SectionCard>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Fixture' : 'Edit Fixture'} onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Home Team"><input style={c.input} value={form.home} onChange={ff('home')} placeholder="Home team" /></FormField>
            <FormField label="Away Team"><input style={c.input} value={form.away} onChange={ff('away')} placeholder="Away team" /></FormField>
            <FormField label="Date"><input style={c.input} type="date" value={form.date} onChange={ff('date')} /></FormField>
            <FormField label="Kick-off Time"><input style={c.input} type="time" value={form.time} onChange={ff('time')} /></FormField>
            <FormField label="Round">
              <select style={{ ...c.select, width: '100%' }} value={form.round} onChange={ff('round')}>
                {['Group Stage','Quarter-Final','Semi-Final','Final','Opening Exhibition'].map(r => <option key={r}>{r}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select style={{ ...c.select, width: '100%' }} value={form.status} onChange={ff('status')}>
                {['upcoming','live','completed','postponed'].map(s => <option key={s}>{s}</option>)}
              </select>
            </FormField>
            <FormField label="Home Score"><input style={c.input} type="number" value={form.homeScore ?? ''} onChange={ff('homeScore')} placeholder="—" /></FormField>
            <FormField label="Away Score"><input style={c.input} type="number" value={form.awayScore ?? ''} onChange={ff('awayScore')} placeholder="—" /></FormField>
          </div>
          <FormField label="Venue">
            <select style={{ ...c.select, width: '100%' }} value={form.venue} onChange={ff('venue')}>
              <option>Ugbowo Campus Main Bowl</option>
              <option>Ogbemudia Stadium</option>
            </select>
          </FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button onClick={() => setModal(null)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={save} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Fixture</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
