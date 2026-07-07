import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, ActionRow } from './shared'

const teams = ['Edo Warriors','Oredo United','Ugbowo Stars','Sapele City FC','Warri Wolves','Ughelli Rangers','Benin Royals','Delta Eagles','Uromi FC','Ekpoma Lions','Auchi City','Esan Warriors']
const venues = ['Samuel Ogbemudia Stadium','University of Benin Bowl','Ogbe Stadium','Oba Ovonramwen Square']
const rounds = ['Group Stage','Round of 16','Quarter-Final','Semi-Final','Grand Final']

const initFixtures = [
  { id: 1, home: 'Edo Warriors', away: 'Ughelli Rangers', date: '2027-03-01', time: '15:00', venue: 'University of Benin Bowl', round: 'Group Stage', status: 'Completed' },
  { id: 2, home: 'Oredo United', away: 'Sapele City FC', date: '2027-03-01', time: '17:30', venue: 'University of Benin Bowl', round: 'Group Stage', status: 'Completed' },
  { id: 3, home: 'Benin Royals', away: 'Esan Warriors', date: '2027-03-03', time: '17:30', venue: 'Samuel Ogbemudia Stadium', round: 'Group Stage', status: 'Completed' },
  { id: 7, home: 'Edo Warriors', away: 'Benin Royals', date: '2027-03-20', time: '15:00', venue: 'Samuel Ogbemudia Stadium', round: 'Quarter-Final', status: 'Upcoming' },
  { id: 8, home: 'Oredo United', away: 'Delta Eagles', date: '2027-03-20', time: '18:00', venue: 'Samuel Ogbemudia Stadium', round: 'Quarter-Final', status: 'Upcoming' },
  { id: 11, home: 'TBD', away: 'TBD', date: '2027-04-05', time: '15:00', venue: 'Samuel Ogbemudia Stadium', round: 'Semi-Final', status: 'Upcoming' },
  { id: 13, home: 'TBD', away: 'TBD', date: '2027-04-20', time: '16:00', venue: 'Samuel Ogbemudia Stadium', round: 'Grand Final', status: 'Upcoming' },
]

const blank = { home: teams[0], away: teams[1], date: '2027-03-25', time: '15:00', venue: venues[0], round: 'Quarter-Final', status: 'Upcoming' }
const statusColor = { Completed: '#22C55E', Upcoming: '#3B82F6', Live: '#EF4444', Postponed: '#F59E0B' }

export default function FixtureGenerator() {
  const [fixtures, setFixtures] = useState(initFixtures)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(blank)
  const [roundFilter, setRoundFilter] = useState('All')
  const [editing, setEditing] = useState(null)

  const filtered = fixtures.filter(f => roundFilter === 'All' || f.round === roundFilter)
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSave = () => {
    if (editing) setFixtures(prev => prev.map(f => f.id === editing ? { ...form, id: editing } : f))
    else setFixtures(prev => [...prev, { ...form, id: Date.now() }])
    setModal(false); setEditing(null)
  }
  const openEdit = (f) => { setForm({ ...f }); setEditing(f.id); setModal(true) }
  const handleDelete = (id) => { if (confirm('Delete fixture?')) setFixtures(prev => prev.filter(f => f.id !== id)) }

  return (
    <div>
      <ModuleHeader title="Fixture Generator" subtitle="Schedule & manage all matches" action="Add Fixture" onAction={() => { setForm(blank); setEditing(null); setModal(true) }} count={fixtures.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Fixtures" value={fixtures.length} icon="📅" color="#D4AF37" />
        <StatCard label="Completed" value={fixtures.filter(f => f.status === 'Completed').length} icon="✅" color="#22C55E" />
        <StatCard label="Upcoming" value={fixtures.filter(f => f.status === 'Upcoming').length} icon="🔜" color="#3B82F6" />
        <StatCard label="Grand Final" value="Apr 20" icon="🏆" color="#F59E0B" sub="2027" />
      </div>

      <SectionCard title="📅 All Fixtures" action="">
        <ActionRow>
          <select value={roundFilter} onChange={e => setRoundFilter(e.target.value)} style={c.select}>
            <option value="All">All Rounds</option>
            {rounds.map(r => <option key={r}>{r}</option>)}
          </select>
        </ActionRow>
        <Table
          cols={['Home', 'Away', 'Date', 'Time', 'Venue', 'Round', 'Status', 'Actions']}
          rows={filtered}
          renderRow={(f, i) => (
            <tr key={f.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <td style={{ ...c.td, fontWeight: 700, color: '#fff' }}>{f.home}</td>
              <td style={{ ...c.td, color: 'rgba(255,255,255,0.6)' }}>{f.away}</td>
              <td style={c.td}>{f.date}</td>
              <td style={c.td}>{f.time}</td>
              <td style={{ ...c.td, fontSize: '0.75rem' }}>{f.venue}</td>
              <td style={c.td}><Badge label={f.round} color="#D4AF37" /></td>
              <td style={c.td}><Badge label={f.status} color={statusColor[f.status] || '#D4AF37'} /></td>
              <td style={c.td}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => openEdit(f)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.72rem' }}>✏️</button>
                  <button onClick={() => handleDelete(f.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.72rem' }}>🗑️</button>
                </div>
              </td>
            </tr>
          )}
        />
      </SectionCard>

      {modal && (
        <Modal title={editing ? 'Edit Fixture' : 'Create Fixture'} onClose={() => { setModal(false); setEditing(null) }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Home Team">
              <select style={{ ...c.select, width: '100%' }} value={form.home} onChange={set('home')}>
                {['TBD', ...teams].map(t => <option key={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Away Team">
              <select style={{ ...c.select, width: '100%' }} value={form.away} onChange={set('away')}>
                {['TBD', ...teams].map(t => <option key={t}>{t}</option>)}
              </select>
            </FormField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Date"><input style={c.input} type="date" value={form.date} onChange={set('date')} /></FormField>
            <FormField label="Time"><input style={c.input} type="time" value={form.time} onChange={set('time')} /></FormField>
          </div>
          <FormField label="Venue">
            <select style={{ ...c.select, width: '100%' }} value={form.venue} onChange={set('venue')}>
              {venues.map(v => <option key={v}>{v}</option>)}
            </select>
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Round">
              <select style={{ ...c.select, width: '100%' }} value={form.round} onChange={set('round')}>
                {rounds.map(r => <option key={r}>{r}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select style={{ ...c.select, width: '100%' }} value={form.status} onChange={set('status')}>
                <option>Upcoming</option><option>Live</option><option>Completed</option><option>Postponed</option>
              </select>
            </FormField>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => { setModal(false); setEditing(null) }} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={handleSave} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Fixture</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
