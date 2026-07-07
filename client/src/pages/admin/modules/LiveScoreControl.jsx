import React, { useState, useEffect } from 'react'
import { c, StatCard, SectionCard, Badge, Modal, FormField, ModuleHeader } from './shared'

const initMatches = [
  { id: 'L1', home: 'Edo Warriors', away: 'Benin Royals', hScore: 2, aScore: 1, minute: 67, venue: 'Samuel Ogbemudia Stadium', status: 'live', possession: [58,42], shots: [12,8], commentary: ['⚽ GOAL! Obi fires into the bottom corner — Warriors extend their lead! (67\')', '🟡 Yellow card for Ogunbor (Benin Royals) for a reckless challenge. (62\')', '⚽ GOAL! Benin Royals pull one back through a clinical header. (51\')', '⚽ GOAL! Chukwuemeka Obi opens the scoring with a tap-in. (23\')', '🔔 Match kicked off at Samuel Ogbemudia Stadium!'] },
]

const initUpcoming = [
  { id: 'U1', home: 'Oredo United', away: 'Delta Eagles', date: '2027-03-22', time: '18:00', venue: 'University of Benin Bowl' },
]

export default function LiveScoreControl() {
  const [matches, setMatches] = useState(initMatches)
  const [selected, setSelected] = useState('L1')
  const [minute, setMinute] = useState(67)
  const [commentInput, setCommentInput] = useState('')
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ type: '🔔', text: '' })

  const match = matches.find(m => m.id === selected)

  const updateScore = (side, delta) => {
    setMatches(prev => prev.map(m => {
      if (m.id !== selected) return m
      const key = side === 'home' ? 'hScore' : 'aScore'
      return { ...m, [key]: Math.max(0, m[key] + delta) }
    }))
  }

  const addCommentary = () => {
    if (!form.text) return
    const line = `${form.type} ${form.text} (${minute}')`
    setMatches(prev => prev.map(m => m.id === selected ? { ...m, commentary: [line, ...m.commentary] } : m))
    setForm({ type: '🔔', text: '' })
    setAdding(false)
  }

  const advanceMinute = () => setMinute(prev => Math.min(prev + 1, 120))

  const endMatch = () => {
    if (confirm('End this match?')) {
      setMatches(prev => prev.map(m => m.id === selected ? { ...m, status: 'ended' } : m))
    }
  }

  return (
    <div>
      <ModuleHeader title="Live Score Control" subtitle="Real-time match management" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Live Matches" value={matches.filter(m => m.status === 'live').length} icon="🔴" color="#EF4444" change="Right now" />
        <StatCard label="Current Minute" value={`${minute}'`} icon="⏱️" color="#F59E0B" />
        <StatCard label="Home Score" value={match?.hScore ?? 0} icon="🏠" color="#22C55E" />
        <StatCard label="Away Score" value={match?.aScore ?? 0} icon="✈️" color="#3B82F6" />
      </div>

      {match && (
        <SectionCard title="🔴 Live Match Control" action="">
          {/* Scoreboard */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139,14,18,0.3), rgba(74,9,11,0.4))',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: 14, padding: '28px 32px', marginBottom: 24, textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                LIVE — {match.venue} — {minute}'
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 24, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 12 }}>{match.home}</div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                  <button onClick={() => updateScore('home', -1)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 12px', fontSize: '1rem' }}>−</button>
                  <span style={{ fontSize: '3rem', fontWeight: 900, color: '#D4AF37', width: 60, textAlign: 'center' }}>{match.hScore}</span>
                  <button onClick={() => updateScore('home', 1)} style={{ ...c.btn, ...c.btnPrimary, padding: '4px 12px', fontSize: '1rem' }}>+</button>
                </div>
              </div>
              <div style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.3)', fontWeight: 900 }}>VS</div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: 12 }}>{match.away}</div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                  <button onClick={() => updateScore('away', -1)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 12px', fontSize: '1rem' }}>−</button>
                  <span style={{ fontSize: '3rem', fontWeight: 900, color: '#D4AF37', width: 60, textAlign: 'center' }}>{match.aScore}</span>
                  <button onClick={() => updateScore('away', 1)} style={{ ...c.btn, ...c.btnPrimary, padding: '4px 12px', fontSize: '1rem' }}>+</button>
                </div>
              </div>
            </div>
            {/* Possession bar */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>Possession</div>
              <div style={{ display: 'flex', borderRadius: 20, overflow: 'hidden', height: 8 }}>
                <div style={{ width: `${match.possession[0]}%`, background: '#D4AF37', transition: 'width 300ms' }} />
                <div style={{ flex: 1, background: '#3B82F6' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
                <span>{match.possession[0]}%</span><span>{match.possession[1]}%</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            <button onClick={advanceMinute} style={{ ...c.btn, ...c.btnGhost }}>⏱️ Advance Minute ({minute}')</button>
            <button onClick={() => setAdding(true)} style={{ ...c.btn, ...c.btnPrimary }}>💬 Add Commentary</button>
            <button onClick={endMatch} style={{ ...c.btn, ...c.btnDanger }}>🏁 End Match</button>
          </div>

          {adding && (
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                <FormField label="Type">
                  <select style={{ ...c.select, minWidth: 80 }} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                    <option value="⚽">⚽ Goal</option>
                    <option value="🟡">🟡 Yellow Card</option>
                    <option value="🔴">🔴 Red Card</option>
                    <option value="🔄">🔄 Substitution</option>
                    <option value="🔔">🔔 Update</option>
                    <option value="🩹">🩹 Injury</option>
                    <option value="⚠️">⚠️ Foul</option>
                  </select>
                </FormField>
                <div style={{ flex: 1 }}>
                  <FormField label="Commentary">
                    <input style={c.input} value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} placeholder="Describe what happened..." />
                  </FormField>
                </div>
                <button onClick={addCommentary} style={{ ...c.btn, ...c.btnPrimary, marginBottom: 1 }}>Add</button>
                <button onClick={() => setAdding(false)} style={{ ...c.btn, ...c.btnGhost, marginBottom: 1 }}>✕</button>
              </div>
            </div>
          )}

          {/* Commentary Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {match.commentary.map((line, i) => (
              <div key={i} style={{
                padding: '10px 14px',
                background: i === 0 ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${i === 0 ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 8, fontSize: '0.83rem', color: i === 0 ? '#fff' : 'rgba(255,255,255,0.65)',
              }}>
                {line}
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  )
}
