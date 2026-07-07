import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Modal, FormField, ModuleHeader, ActionRow, SearchBar } from './shared'

const initResults = [
  { id: 1,  home: 'Akoko-Edo Panthers', away: 'Esan South FC',          hs: 3, as: 0, date: '2026-12-02', round: 'Group Stage',   scorers: 'Chukwuemeka Obi ×2, Felix A.',      motm: 'Chukwuemeka Obi' },
  { id: 2,  home: 'Egor United',         away: 'Esan North Stars',       hs: 2, as: 1, date: '2026-12-02', round: 'Group Stage',   scorers: 'Victor Ehigie, Osagie',             motm: 'Victor Ehigie' },
  { id: 3,  home: 'Esan West Rangers',   away: 'Igueben FC',              hs: 2, as: 0, date: '2026-12-02', round: 'Group Stage',   scorers: 'John Uwaifo ×2',                    motm: 'John Uwaifo' },
  { id: 4,  home: 'Ikpoba-Okha FC',      away: 'Ovia South United',      hs: 4, as: 0, date: '2026-12-03', round: 'Group Stage',   scorers: 'Kingsley Idehen ×2, Okuosa, OG',    motm: 'Kingsley Idehen' },
  { id: 5,  home: 'Owan East FC',        away: 'Bendel Insurance Youth', hs: 3, as: 0, date: '2026-12-03', round: 'Group Stage',   scorers: 'Peter Osagie ×2, Ehigiamusoe',      motm: 'Peter Osagie' },
  { id: 6,  home: 'Oredo City FC',       away: 'Orhionmwon FC',          hs: 2, as: 1, date: '2026-12-04', round: 'Group Stage',   scorers: 'David Akhigbe ×2',                  motm: 'David Akhigbe' },
  { id: 7,  home: 'Owan West United',    away: 'Oredo Host XI',          hs: 2, as: 1, date: '2026-12-03', round: 'Group Stage',   scorers: 'Samuel Oriaifo, Ehigiamusoe',       motm: 'Samuel Oriaifo' },
  { id: 8,  home: 'Etsako Central FC',   away: 'Etsako West FC',         hs: 1, as: 1, date: '2026-12-02', round: 'Group Stage',   scorers: 'Monday Ogunbor — Penalty',          motm: 'Monday Ogunbor' },
]

const blank = { home: '', away: '', hs: 0, as: 0, date: '', round: 'Group Stage', scorers: '', motm: '' }

export default function MatchResults() {
  const [results, setResults] = useState(initResults)
  const [search, setSearch]   = useState('')
  const [modal, setModal]     = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(blank)

  const filtered = results.filter(r =>
    r.home.toLowerCase().includes(search.toLowerCase()) ||
    r.away.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd  = () => { setForm(blank); setModal('add') }
  const openEdit = r => { setEditing(r.id); setForm({ ...r }); setModal('edit') }
  const save     = () => {
    if (modal === 'add') setResults(p => [...p, { ...form, id: Date.now(), hs: Number(form.hs), as: Number(form.as) }])
    else setResults(p => p.map(r => r.id === editing ? { ...form, id: editing } : r))
    setModal(null)
  }
  const del = id => { if (confirm('Delete result?')) setResults(p => p.filter(r => r.id !== id)) }
  const f   = k  => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const totalGoals = results.reduce((s, r) => s + Number(r.hs) + Number(r.as), 0)

  return (
    <div>
      <ModuleHeader title="Match Results" subtitle="Record and manage match outcomes" action="Add Result" onAction={openAdd} count={results.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Results Logged" value={results.length}  icon="📊" color="#D4AF37" />
        <StatCard label="Total Goals"    value={totalGoals}       icon="⚽" color="#22C55E" change={`${(totalGoals / results.length).toFixed(1)} per match`} />
        <StatCard label="Home Wins"      value={results.filter(r => r.hs > r.as).length}  icon="🏠" color="#3B82F6" />
        <StatCard label="Away Wins"      value={results.filter(r => r.as > r.hs).length}  icon="✈️" color="#F59E0B" />
      </div>

      <SectionCard title="📋 Completed Matches" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search teams..." />
        </ActionRow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(r => (
            <div key={r.id} style={{ ...c.card, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.home}</span>
                  <span style={{ fontFamily: "'Cinzel',serif", fontSize: '1.3rem', fontWeight: 900, color: '#D4AF37', minWidth: 60, textAlign: 'center' }}>{r.hs} – {r.as}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.away}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                  ⚽ {r.scorers || '—'} · 🌟 MOTM: {r.motm || '—'}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{ textAlign: 'right', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>
                  <div>{r.date}</div>
                  <Badge label={r.round} color="#3B82F6" />
                </div>
                <button onClick={() => openEdit(r)} style={{ ...c.btn, ...c.btnGhost, padding: '5px 10px', fontSize: '0.72rem' }}>✏️</button>
                <button onClick={() => del(r.id)} style={{ ...c.btn, ...c.btnDanger, padding: '5px 10px', fontSize: '0.72rem' }}>🗑️</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: 24 }}>No results found.</p>}
        </div>
      </SectionCard>

      {modal && (
        <Modal title={modal === 'add' ? 'Add Match Result' : 'Edit Result'} onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Home Team"><input style={c.input} value={form.home} onChange={f('home')} /></FormField>
            <FormField label="Away Team"><input style={c.input} value={form.away} onChange={f('away')} /></FormField>
            <FormField label="Home Score"><input style={c.input} type="number" min="0" value={form.hs} onChange={f('hs')} /></FormField>
            <FormField label="Away Score"><input style={c.input} type="number" min="0" value={form.as} onChange={f('as')} /></FormField>
            <FormField label="Date"><input style={c.input} type="date" value={form.date} onChange={f('date')} /></FormField>
            <FormField label="Round">
              <select style={{ ...c.select, width: '100%' }} value={form.round} onChange={f('round')}>
                {['Group Stage','Quarter-Final','Semi-Final','Final'].map(r => <option key={r}>{r}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Goal Scorers"><input style={c.input} value={form.scorers} onChange={f('scorers')} placeholder="Player ×2, Player..." /></FormField>
          <FormField label="Man of the Match"><input style={c.input} value={form.motm} onChange={f('motm')} placeholder="Player name" /></FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button onClick={() => setModal(null)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={save} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Result</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
