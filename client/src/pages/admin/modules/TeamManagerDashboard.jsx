import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, ModuleHeader } from './shared'

const teams = [
  { id: 1, name: 'Edo Warriors', manager: 'Emmanuel Okoro', group: 'A', points: 9, played: 3, won: 3, gf: 9, ga: 2 },
  { id: 2, name: 'Oredo United', manager: 'Victor Ihejirika', group: 'A', points: 7, played: 3, won: 2, gf: 7, ga: 3 },
  { id: 7, name: 'Benin Royals', manager: 'Austin Oghuvwu', group: 'B', points: 7, played: 3, won: 2, gf: 8, ga: 2 },
  { id: 8, name: 'Delta Eagles', manager: 'John Ochuko', group: 'B', points: 6, played: 3, won: 2, gf: 6, ga: 4 },
]

const teamSquads = {
  1: [
    { jersey: 23, name: 'Bright Omokhagbo', position: 'GK', goals: 0, assists: 0, status: 'Fit' },
    { jersey: 4, name: 'Samuel Oriaifo', position: 'CB', goals: 1, assists: 2, status: 'Fit' },
    { jersey: 9, name: 'Chukwuemeka Obi', position: 'ST', goals: 7, assists: 3, status: 'Fit' },
    { jersey: 7, name: 'Osas Enobun', position: 'LW', goals: 2, assists: 4, status: 'Fit' },
    { jersey: 11, name: 'Kingsley Asoro', position: 'RW', goals: 1, assists: 2, status: 'Suspended' },
  ],
  2: [
    { jersey: 1, name: 'Peter Egbunu', position: 'GK', goals: 0, assists: 0, status: 'Fit' },
    { jersey: 8, name: 'Victor Ehigie', position: 'CM', goals: 4, assists: 6, status: 'Fit' },
    { jersey: 10, name: 'Felix Agbonlahor', position: 'ST', goals: 4, assists: 3, status: 'Fit' },
  ],
}

const teamMessages = {
  1: [
    { from: 'Emmanuel Okoro', time: '2hr ago', text: 'Requesting two extra training sessions before the QF. Can stadium be booked?' },
    { from: 'Emmanuel Okoro', time: '1 day ago', text: 'Confirmed 22-man squad submitted. All players cleared by medical.' },
  ],
  2: [
    { from: 'Victor Ihejirika', time: '4hr ago', text: 'Player Ehigie has a minor muscle strain. Should be fit for Thursday.' },
  ],
}

const posColor = { GK: '#F59E0B', CB: '#22C55E', CM: '#3B82F6', ST: '#EF4444', LW: '#EC4899', RW: '#8B5CF6', DM: '#14B8A6' }

export default function TeamManagerDashboard() {
  const [selectedTeam, setSelectedTeam] = useState(1)
  const squad = teamSquads[selectedTeam] || []
  const messages = teamMessages[selectedTeam] || []
  const team = teams.find(t => t.id === selectedTeam)

  return (
    <div>
      <ModuleHeader title="Team Manager Dashboard" subtitle="Overview for all team managers and their squads" />

      {/* Team Selector */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {teams.map(t => (
          <button key={t.id} onClick={() => setSelectedTeam(t.id)} style={{
            ...c.btn,
            ...(selectedTeam === t.id ? c.btnPrimary : c.btnGhost),
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px 16px', minWidth: 160,
          }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{t.name}</span>
            <span style={{ fontSize: '0.68rem', opacity: 0.7, marginTop: 2 }}>Group {t.group} · {t.points} pts</span>
          </button>
        ))}
      </div>

      {team && (
        <>
          {/* Team Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
            <StatCard label="Points" value={team.points} icon="📊" color="#D4AF37" />
            <StatCard label="Matches Played" value={team.played} icon="⚽" color="#3B82F6" />
            <StatCard label="Goals Scored" value={team.gf} icon="🥅" color="#22C55E" />
            <StatCard label="Goals Conceded" value={team.ga} icon="🔴" color="#EF4444" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
            {/* Squad */}
            <SectionCard title={`👤 ${team.name} — Squad`} action="">
              <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
                <Badge label={`Manager: ${team.manager}`} color="#D4AF37" />
                <Badge label={`Group ${team.group}`} color="#3B82F6" />
                <Badge label={`${squad.filter(p => p.status === 'Fit').length}/${squad.length} fit`} color="#22C55E" />
              </div>
              <Table
                cols={['#', 'Name', 'Pos', 'Goals', 'Assists', 'Status']}
                rows={squad}
                renderRow={(p, i) => (
                  <tr key={p.jersey} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                    <td style={{ ...c.td, color: '#D4AF37', fontWeight: 700 }}>{p.jersey}</td>
                    <td style={{ ...c.td, fontWeight: 600 }}>{p.name}</td>
                    <td style={c.td}><Badge label={p.position} color={posColor[p.position] || '#D4AF37'} /></td>
                    <td style={{ ...c.td, color: '#22C55E', fontWeight: 700 }}>{p.goals}</td>
                    <td style={{ ...c.td, color: '#3B82F6', fontWeight: 700 }}>{p.assists}</td>
                    <td style={c.td}><Badge label={p.status} color={p.status === 'Fit' ? '#22C55E' : '#EF4444'} /></td>
                  </tr>
                )}
              />
            </SectionCard>

            {/* Messages & Requests */}
            <SectionCard title="💬 Manager Messages" action="">
              {messages.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {messages.map((m, i) => (
                    <div key={i} style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#D4AF37' }}>{m.from}</span>
                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>{m.time}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)' }}>{m.text}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
                  No messages from this team manager
                </div>
              )}
              <div style={{ marginTop: 16 }}>
                <textarea placeholder="Reply to manager..." style={{ ...c.input, minHeight: 72, resize: 'vertical', width: '100%', marginBottom: 10 }} />
                <button style={{ ...c.btn, ...c.btnPrimary, width: '100%' }}>📤 Send Reply</button>
              </div>
            </SectionCard>
          </div>
        </>
      )}
    </div>
  )
}
