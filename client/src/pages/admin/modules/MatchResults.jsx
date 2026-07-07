import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, ActionRow } from './shared'

const initResults = [
  { id: 1, home: 'Edo Warriors', away: 'Ughelli Rangers', hScore: 4, aScore: 0, date: '2027-03-01', round: 'Group Stage', scorers: 'Obi (12,34,56), Oriaifo (78)', motm: 'Chukwuemeka Obi' },
  { id: 2, home: 'Oredo United', away: 'Sapele City FC', hScore: 2, aScore: 1, date: '2027-03-01', round: 'Group Stage', scorers: 'Agbonlahor (15), Ehigie (67)', motm: 'Victor Ehigie' },
  { id: 3, home: 'Ugbowo Stars', away: 'Warri Wolves', hScore: 1, aScore: 1, date: '2027-03-03', round: 'Group Stage', scorers: 'Osagie (40), Uwaifo (71)', motm: 'Peter Osagie' },
  { id: 4, home: 'Benin Royals', away: 'Esan Warriors', hScore: 3, aScore: 0, date: '2027-03-03', round: 'Group Stage', scorers: 'Multiple scorers', motm: 'Emmanuel Okuosa' },
  { id: 5, home: 'Delta Eagles', away: 'Auchi City', hScore: 2, aScore: 0, date: '2027-03-05', round: 'Group Stage', scorers: 'Akhigbe (22,55)', motm: 'David Akhigbe' },
  { id: 6, home: 'Uromi FC', away: 'Ekpoma Lions', hScore: 1, aScore: 1, date: '2027-03-05', round: 'Group Stage', scorers: 'Ehigiamusoe (60), Idahosa (80)', motm: 'Chris Ehigiamusoe' },
]

const blank = { home: 'Edo Warriors', away: 'Benin Royals', hScore: 0, aScore: 0, date: '2027-03-20', round: 'Quarter-Final', scorers: '', motm: '' }

export default function MatchResults() {
  const [results, setResults] = useState(initResults)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const openEdit = (r) => { setForm({ ...r }); setEditing(r.id); setModal(true) }
  const handleSave = () => {
    const entry = { ...form, hScore: Number(form.hScore), aScore: Number(form.aScore) }
    if (editing) setResults(prev => prev.map(r => r.id === editing ? { ...entry, id: editing } : r))
    else setResults(prev => [...prev, { ...entry, id: Date.now() }])
    setModal(false); setEditing(null)
  }
  const handleDelete = id => { if (confirm('Delete result?')) setResults(prev => prev.filter(r => r.id !== id)) }

  const getResult = (h, a) => h > a ? '🟢 H Win' : a > h ? '🔴 A Win' : '🟡 Draw'
  const getColor = (h, a) => h > a ? '#22C55E' : a > h ? '#EF4444' : '#F59E0B'

  return (
    <div>
      <ModuleHeader title="Match Results" subtitle="Enter and manage completed match results" action="Add Result" onAction={() => { setForm(blank); setEditing(null); setModal(true) }} count={results.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Results Entered" value={results.length} icon="📊" color="#D4AF37" />
        <StatCard label="Home Wins" value={results.filter(r => r.hScore > r.aScore).length} icon="🏠" color="#22C55E" />
        <StatCard label="Away Wins" value={results.filter(r => r.aScore > r.hScore).length} icon="✈️" color="#EF4444" />
        <StatCard label="Draws" value={results.filter(r => r.hScore === r.aScore).length} icon="🤝" color="#F59E0B" />
      </div>

      <SectionCard title="⚽ Results Log" action="">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {results.map((r, i) => (
            <div key={r.id} style={{
              display: 'grid', gridTemplateColumns: '1fr auto 1fr auto',
              alignItems: 'center', gap: 16,
              padding: '16px 20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10,
            }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{r.home}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>{r.date} · {r.round}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#D4AF37', letterSpacing: 4 }}>
                  {r.hScore} – {r.aScore}
                </div>
                <Badge label={getResult(r.hScore, r.aScore)} color={getColor(r.hScore, r.aScore)} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>{r.away}</div>
                <div style={{ fontSize: '0.7rem', color: '#D4AF37' }}>MOTM: {r.motm}</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => openEdit(r)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.72rem' }}>✏️</button>
                <button onClick={() => handleDelete(r.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.72rem' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {modal && (
        <Modal title={editing ? 'Edit Result' : 'Enter Match Result'} onClose={() => { setModal(false); setEditing(null) }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'end' }}>
            <FormField label="Home Team"><input style={c.input} value={form.home} onChange={set('home')} /></FormField>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              <FormField label="H"><input style={{ ...c.input, textAlign: 'center', width: 60 }} type="number" min="0" value={form.hScore} onChange={set('hScore')} /></FormField>
              <FormField label="A"><input style={{ ...c.input, textAlign: 'center', width: 60 }} type="number" min="0" value={form.aScore} onChange={set('aScore')} /></FormField>
            </div>
            <FormField label="Away Team"><input style={c.input} value={form.away} onChange={set('away')} /></FormField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Date"><input style={c.input} type="date" value={form.date} onChange={set('date')} /></FormField>
            <FormField label="Round"><input style={c.input} value={form.round} onChange={set('round')} /></FormField>
          </div>
          <FormField label="Goal Scorers"><input style={c.input} value={form.scorers} onChange={set('scorers')} placeholder="Obi (12,34), Ehigie (67)" /></FormField>
          <FormField label="Man of the Match"><input style={c.input} value={form.motm} onChange={set('motm')} /></FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => { setModal(false); setEditing(null) }} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={handleSave} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Result</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
