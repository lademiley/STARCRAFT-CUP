import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField } from './shared'

const teams = [
  { id: 11, name: 'Ikpoba-Okha FC',    coach: 'Austin Oghuvwu',   group: 'C', played: 4, won: 4, draw: 0, lost: 0, gf: 12, ga: 2,  points: 12 },
  { id: 16, name: 'Owan East FC',      coach: 'Richard Ebore',     group: 'D', played: 4, won: 3, draw: 1, lost: 0, gf: 11, ga: 3,  points: 10 },
  { id: 1,  name: 'Akoko-Edo Panthers',coach: 'Gabriel Alagbe',    group: 'A', played: 4, won: 3, draw: 1, lost: 0, gf: 10, ga: 3,  points: 10 },
  { id: 7,  name: 'Etsako Central FC', coach: 'Sunday Omotosho',   group: 'B', played: 4, won: 2, draw: 2, lost: 0, gf: 8,  ga: 3,  points: 8  },
  { id: 17, name: 'Owan West United',  coach: 'Samuel Oriaifo',    group: 'D', played: 4, won: 2, draw: 2, lost: 0, gf: 7,  ga: 4,  points: 8  },
]

const messages = [
  { id: 1, from: 'Austin Oghuvwu',   team: 'Ikpoba-Okha FC',    subject: 'QF strip colour confirmation', date: '2026-12-13', read: false },
  { id: 2, from: 'Gabriel Alagbe',   team: 'Akoko-Edo Panthers',subject: 'Player injury update — Obi',   date: '2026-12-12', read: true  },
  { id: 3, from: 'Richard Ebore',    team: 'Owan East FC',       subject: 'Bus transport request for QF', date: '2026-12-12', read: false },
  { id: 4, from: 'Samuel Oriaifo',   team: 'Owan West United',   subject: 'Dressing room access query',   date: '2026-12-11', read: true  },
  { id: 5, from: 'Sunday Omotosho',  team: 'Etsako Central FC',  subject: 'Referee assignment question',  date: '2026-12-10', read: true  },
]

export default function TeamManagerDashboard() {
  const [msgs, setMsgs]   = useState(messages)
  const [modal, setModal] = useState(null)
  const [compose, setCompose] = useState({ to: '', subject: '', body: '' })
  const [toast, setToast] = useState('')

  const markRead = id => setMsgs(p => p.map(m => m.id === id ? { ...m, read: true } : m))
  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 2500) }
  const sendMsg = () => {
    showToast('✅ Message sent to team manager')
    setModal(null)
    setCompose({ to: '', subject: '', body: '' })
  }

  return (
    <div style={{ position: 'relative' }}>
      {toast && (
        <div style={{ position: 'fixed', top: 24, right: 24, background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 10, padding: '12px 20px', zIndex: 9999, fontSize: '0.85rem', color: '#fff' }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>Team Manager Hub</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>Communicate with team coaches and track QF standings</p>
        </div>
        <button onClick={() => setModal('compose')} style={{ ...c.btn, ...c.btnPrimary }}>✉️ Compose Message</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Teams in QF" value={teams.length}                           icon="🏆" color="#D4AF37" />
        <StatCard label="Unread Messages" value={msgs.filter(m => !m.read).length}   icon="📬" color="#F59E0B" change={msgs.filter(m => !m.read).length > 0 ? 'Needs attention' : 'All read'} />
        <StatCard label="Total Messages" value={msgs.length}                          icon="✉️" color="#3B82F6" />
        <StatCard label="Top Scorer Team" value="Ikpoba-Okha FC"                     icon="⚽" color="#22C55E" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* QF Leaderboard */}
        <SectionCard title="🏆 QF-Bound Standings" action="">
          <Table
            cols={['Team', 'Group', 'P', 'W', 'D', 'L', 'GF', 'GA', 'Pts']}
            rows={teams}
            renderRow={(t, i) => (
              <tr key={t.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                <td style={{ ...c.td, fontWeight: 600, fontSize: '0.82rem' }}>{i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : i === 2 ? '🥉 ' : ''}{t.name}</td>
                <td style={c.td}><Badge label={`Grp ${t.group}`} color="#D4AF37" /></td>
                <td style={c.td}>{t.played}</td>
                <td style={{ ...c.td, color: '#22C55E' }}>{t.won}</td>
                <td style={c.td}>{t.draw}</td>
                <td style={{ ...c.td, color: '#EF4444' }}>{t.lost}</td>
                <td style={c.td}>{t.gf}</td>
                <td style={c.td}>{t.ga}</td>
                <td style={{ ...c.td, fontWeight: 900, color: '#D4AF37' }}>{t.points}</td>
              </tr>
            )}
          />
        </SectionCard>

        {/* Messages */}
        <SectionCard title="📬 Manager Messages" action="">
          {msgs.length === 0 && <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: 20 }}>No messages.</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {msgs.map(m => (
              <div key={m.id} onClick={() => markRead(m.id)} style={{ padding: '12px 16px', background: m.read ? 'rgba(255,255,255,0.02)' : 'rgba(212,175,55,0.06)', border: `1px solid ${m.read ? 'rgba(255,255,255,0.06)' : 'rgba(212,175,55,0.25)'}`, borderRadius: 10, cursor: 'pointer', transition: 'all 200ms' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: m.read ? 500 : 700, fontSize: '0.85rem' }}>{m.subject}</span>
                  {!m.read && <Badge label="New" color="#D4AF37" />}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>
                  {m.from} · {m.team} · {m.date}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {modal === 'compose' && (
        <Modal title="✉️ Message a Team Manager" onClose={() => setModal(null)}>
          <FormField label="To (Team / Manager)">
            <select style={{ ...c.select, width: '100%' }} value={compose.to} onChange={e => setCompose(p => ({ ...p, to: e.target.value }))}>
              <option value="">Select team...</option>
              {teams.map(t => <option key={t.id} value={t.name}>{t.name} — {t.coach}</option>)}
            </select>
          </FormField>
          <FormField label="Subject"><input style={c.input} value={compose.subject} onChange={e => setCompose(p => ({ ...p, subject: e.target.value }))} placeholder="Message subject" /></FormField>
          <FormField label="Message">
            <textarea style={{ ...c.input, minHeight: 100, resize: 'vertical' }} value={compose.body} onChange={e => setCompose(p => ({ ...p, body: e.target.value }))} placeholder="Your message..." />
          </FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button onClick={() => setModal(null)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={sendMsg} style={{ ...c.btn, ...c.btnPrimary }}>📤 Send Message</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
