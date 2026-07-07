import React, { useState, useEffect, useRef } from 'react'
import { c, StatCard, SectionCard, Badge, Modal, FormField } from './shared'

const upcomingMatches = [
  { id: 6,  home: 'Akoko-Edo Panthers', away: 'Etsako Central FC',   date: '2026-12-14', time: '09:00', venue: 'Ugbowo Campus Main Bowl', round: 'Quarter-Final' },
  { id: 7,  home: 'Ikpoba-Okha FC',      away: 'Esan West Rangers',   date: '2026-12-14', time: '12:00', venue: 'Ugbowo Campus Main Bowl', round: 'Quarter-Final' },
  { id: 8,  home: 'Owan East FC',         away: 'Egor United',          date: '2026-12-14', time: '15:00', venue: 'Ugbowo Campus Main Bowl', round: 'Quarter-Final' },
  { id: 9,  home: 'Oredo City FC',        away: 'Owan West United',    date: '2026-12-14', time: '18:00', venue: 'Ugbowo Campus Main Bowl', round: 'Quarter-Final' },
]

export default function LiveScoreControl() {
  const [liveMatch, setLiveMatch] = useState(null)
  const [hs, setHs]               = useState(0)
  const [as, setAs]               = useState(0)
  const [minute, setMinute]       = useState(0)
  const [running, setRunning]     = useState(false)
  const [feed, setFeed]           = useState([])
  const [eventModal, setEventModal] = useState(false)
  const [eventForm, setEventForm]   = useState({ type: 'Goal', player: '', team: 'home', desc: '' })
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setMinute(m => m < 90 ? m + 1 : m), 60000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  const startMatch = m => {
    setLiveMatch(m); setHs(0); setAs(0); setMinute(0); setRunning(false); setFeed([])
  }

  const addEvent = () => {
    const goal = eventForm.type === 'Goal'
    if (goal) {
      if (eventForm.team === 'home') setHs(s => s + 1)
      else setAs(s => s + 1)
    }
    const log = `${minute}' ${eventForm.type} — ${eventForm.player}${eventForm.desc ? ` (${eventForm.desc})` : ''}`
    setFeed(f => [{ text: log, type: eventForm.type }, ...f])
    setEventModal(false)
    setEventForm({ type: 'Goal', player: '', team: 'home', desc: '' })
  }

  const endMatch = () => {
    setRunning(false)
    setFeed(f => [{ text: `FT: ${liveMatch.home} ${hs}–${as} ${liveMatch.away}`, type: 'FT' }, ...f])
    setLiveMatch(null)
  }

  const eventColors = { Goal: '#22C55E', 'Yellow Card': '#F59E0B', 'Red Card': '#EF4444', Substitution: '#3B82F6', FT: '#D4AF37', 'Half Time': '#8B5CF6' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>Live Score Control</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>Manage live match feeds and scorelines in real time</p>
        </div>
        {liveMatch && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: running ? '#22C55E' : '#F59E0B', animation: running ? 'pulse 1.5s infinite' : 'none' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: running ? '#22C55E' : '#F59E0B' }}>{running ? 'LIVE' : 'PAUSED'} — {minute}'</span>
          </div>
        )}
      </div>

      {!liveMatch ? (
        <>
          <div style={{ ...c.card, marginBottom: 24, padding: 20, background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.15)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: 1, color: '#D4AF37', textTransform: 'uppercase', marginBottom: 14 }}>Select a match to go live</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcomingMatches.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{m.home} <span style={{ color: 'rgba(255,255,255,0.35)' }}>vs</span> {m.away}</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{m.date} {m.time} · {m.venue}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Badge label={m.round} color="#F59E0B" />
                    <button onClick={() => startMatch(m)} style={{ ...c.btn, ...c.btnPrimary, padding: '7px 16px', fontSize: '0.78rem' }}>🔴 Go Live</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {feed.length > 0 && (
            <SectionCard title="📋 Last Match Feed" action="">
              {feed.map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < feed.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: eventColors[e.type] || '#D4AF37', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)' }}>{e.text}</span>
                </div>
              ))}
            </SectionCard>
          )}
        </>
      ) : (
        <>
          {/* Scoreboard */}
          <div style={{ ...c.card, padding: 28, textAlign: 'center', marginBottom: 24, background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.2)' }}>
            <Badge label={liveMatch.round} color="#F59E0B" />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 20, marginBottom: 12 }}>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: '1.1rem', fontWeight: 700 }}>{liveMatch.home}</div>
              </div>
              <div style={{ fontFamily: "'Cinzel',serif", fontSize: '3rem', fontWeight: 900, color: '#D4AF37', minWidth: 120 }}>{hs} – {as}</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: '1.1rem', fontWeight: 700 }}>{liveMatch.away}</div>
              </div>
            </div>
            <div style={{ fontSize: '0.85rem', color: running ? '#22C55E' : '#F59E0B', fontWeight: 700 }}>{running ? `${minute}'` : minute === 0 ? 'Not started' : `${minute}' — Paused`}</div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
            <button onClick={() => setRunning(r => !r)} style={{ ...c.btn, ...c.btnPrimary, flex: 1 }}>
              {running ? '⏸ Pause Clock' : '▶️ Start Clock'}
            </button>
            <button onClick={() => setEventModal(true)} style={{ ...c.btn, ...c.btnGhost, flex: 1 }}>⚽ Add Event</button>
            <button onClick={() => setFeed(f => [{ text: `Half Time — ${liveMatch.home} ${hs}–${as} ${liveMatch.away}`, type: 'Half Time' }, ...f])} style={{ ...c.btn, ...c.btnGhost, flex: 1 }}>⏸ Half Time</button>
            <button onClick={endMatch} style={{ ...c.btn, ...c.btnDanger, flex: 1 }}>🏁 Full Time</button>
          </div>

          {/* Commentary feed */}
          <SectionCard title="📡 Live Commentary Feed" action="">
            {feed.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '20px 0' }}>Match events will appear here…</p>}
            {feed.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: i < feed.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: eventColors[e.type] || '#D4AF37', flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>{e.text}</span>
              </div>
            ))}
          </SectionCard>
        </>
      )}

      {eventModal && (
        <Modal title="Add Match Event" onClose={() => setEventModal(false)}>
          <FormField label="Event Type">
            <select style={{ ...c.select, width: '100%' }} value={eventForm.type} onChange={e => setEventForm(p => ({ ...p, type: e.target.value }))}>
              {['Goal','Yellow Card','Red Card','Substitution','Penalty Miss','Injury'].map(t => <option key={t}>{t}</option>)}
            </select>
          </FormField>
          {eventForm.type === 'Goal' && (
            <FormField label="Scoring Team">
              <select style={{ ...c.select, width: '100%' }} value={eventForm.team} onChange={e => setEventForm(p => ({ ...p, team: e.target.value }))}>
                <option value="home">{liveMatch.home}</option>
                <option value="away">{liveMatch.away}</option>
              </select>
            </FormField>
          )}
          <FormField label="Player Name"><input style={c.input} value={eventForm.player} onChange={e => setEventForm(p => ({ ...p, player: e.target.value }))} placeholder="Player name" /></FormField>
          <FormField label="Notes (optional)"><input style={c.input} value={eventForm.desc} onChange={e => setEventForm(p => ({ ...p, desc: e.target.value }))} placeholder="e.g. Header from corner" /></FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button onClick={() => setEventModal(false)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={addEvent} style={{ ...c.btn, ...c.btnPrimary }}>Add Event</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
