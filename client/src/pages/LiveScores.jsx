import React, { useState, useEffect } from 'react'
import { liveMatches, fixtures, teams } from '../data/mockData'

function StatBar({ label, home, away }) {
  const total = home + away || 1
  return (
    <div className="stat-bar-row">
      <span className="sb-val">{home}</span>
      <div className="sb-track-wrap">
        <span className="sb-label">{label}</span>
        <div className="sb-track">
          <div className="sb-home" style={{ width: `${(home / total) * 100}%` }} />
          <div className="sb-away" style={{ width: `${(away / total) * 100}%` }} />
        </div>
      </div>
      <span className="sb-val">{away}</span>
    </div>
  )
}

const commentary = [
  { min: 67, team: 'Edo Warriors', text: 'GOAL! Chukwuemeka Obi fires home a stunning volley from the edge of the box! 2-1!' },
  { min: 54, team: 'Benin Royals', text: 'Yellow card for Monday Ogunbor after a late challenge on Akhigbe.' },
  { min: 49, team: 'Benin Royals', text: 'GOAL! Ekene Offor heads home from a corner. Benin Royals level the scores! 1-1.' },
  { min: 38, team: 'Edo Warriors', text: 'GOAL! Victor Akhigbe slots home coolly after a brilliant through ball. 1-0 to Edo Warriors.' },
  { min: 22, team: 'Edo Warriors', text: 'Corner kick for Edo Warriors. The crowd is on their feet!' },
  { min: 8, team: 'Benin Royals', text: 'Dangerous free kick for Benin Royals. Okuosa steps up...' },
  { min: 1, team: '', text: '⚽ KICK OFF! The quarter-final is underway at Samuel Ogbemudia Stadium!' },
]

export default function LiveScores() {
  const [minute, setMinute] = useState(67)
  const [activeMatch, setActiveMatch] = useState(liveMatches[0])

  useEffect(() => {
    const t = setInterval(() => setMinute(m => m < 90 ? m + 1 : m), 60000)
    return () => clearInterval(t)
  }, [])

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Home <span>›</span> Live Scores</div>
          <h1><span className="live-dot" style={{width:14,height:14,display:'inline-block',marginRight:12}} />Live <span className="text-gold">Score Center</span></h1>
          <p>Real-time match updates, live commentary, and match statistics</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Live Match Banner */}
          {liveMatches.map(m => {
            const hTeam = teams.find(t => t.name === m.homeTeam)
            const aTeam = teams.find(t => t.name === m.awayTeam)
            return (
              <div key={m.id} className="live-match-card card">
                <div className="lm-badge-row">
                  <span className="badge badge-live">🔴 LIVE</span>
                  <span style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, color: '#ef4444' }}>{minute}′</span>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Quarter-Final</span>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>🏟️ {m.venue}</span>
                </div>

                <div className="lm-scoreboard">
                  <div className="lm-team">
                    <div style={{ fontSize: '4rem' }}>{hTeam?.logo}</div>
                    <h3>{m.homeTeam}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>HOME</span>
                  </div>
                  <div className="lm-score">
                    <div className="live-score-num">{m.homeScore}</div>
                    <div style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>–</div>
                    <div className="live-score-num">{m.awayScore}</div>
                  </div>
                  <div className="lm-team">
                    <div style={{ fontSize: '4rem' }}>{aTeam?.logo}</div>
                    <h3>{m.awayTeam}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>AWAY</span>
                  </div>
                </div>

                {/* Match Stats */}
                <div className="lm-stats">
                  <StatBar label="Possession %" home={m.possession[0]} away={m.possession[1]} />
                  <StatBar label="Shots" home={m.shots[0]} away={m.shots[1]} />
                  <StatBar label="Corners" home={m.corners[0]} away={m.corners[1]} />
                  <StatBar label="Fouls" home={m.fouls[0]} away={m.fouls[1]} />
                </div>

                {/* Timeline */}
                <div className="lm-timeline">
                  <div className="timeline-track">
                    <div className="timeline-progress" style={{ width: `${(minute / 90) * 100}%` }} />
                    <div className="timeline-events">
                      {[38, 49, 67].map(min => (
                        <div key={min} className="timeline-event" style={{ left: `${(min / 90) * 100}%` }} title={`Goal at ${min}′`}>⚽</div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>
                    <span>0′</span><span>45′ HT</span><span>90′</span>
                  </div>
                </div>
              </div>
            )
          })}

          {liveMatches.length === 0 && (
            <div className="card" style={{ padding: 60, textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚽</div>
              <h3 style={{ color: 'var(--gold)', marginBottom: 8 }}>No Live Matches Right Now</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>Check back on match days for real-time scores and commentary.</p>
            </div>
          )}

          {/* Live Commentary */}
          <div style={{ marginTop: 40 }}>
            <h2 style={{ marginBottom: 24 }}>📡 Live Commentary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {commentary.map((c, i) => (
                <div key={i} className={`commentary-item card ${i === 0 ? 'latest' : ''}`}>
                  <div className="commentary-min">{c.min}′</div>
                  <div className="commentary-text">
                    {c.team && <span className="commentary-team">{c.team}</span>}
                    <span style={{ color: i === 0 ? 'var(--white)' : 'rgba(255,255,255,0.7)' }}>{c.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Today */}
          <div style={{ marginTop: 40 }}>
            <h2 style={{ marginBottom: 24 }}>📅 Upcoming Matches</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {fixtures.filter(f => f.status === 'upcoming').slice(0, 4).map(f => {
                const hTeam = teams.find(t => t.name === f.homeTeam)
                const aTeam = teams.find(t => t.name === f.awayTeam)
                return (
                  <div key={f.id} className="card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
                      <span style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700 }}>{f.homeTeam}</span>
                      <span style={{ fontSize: '1.6rem' }}>{hTeam?.logo || '⚽'}</span>
                    </div>
                    <div style={{ textAlign: 'center', minWidth: 80 }}>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 700 }}>{f.time}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-secondary)' }}>{f.date}</div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: '1.6rem' }}>{aTeam?.logo || '⚽'}</span>
                      <span style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700 }}>{f.awayTeam}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .live-match-card { padding: 0; overflow: hidden; border-color: rgba(239,68,68,0.3); }
        .lm-badge-row { display: flex; align-items: center; gap: 16px; padding: 16px 28px; border-bottom: 1px solid rgba(255,255,255,0.06); flex-wrap: wrap; }
        .lm-scoreboard { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 32px; padding: 40px 28px; }
        .lm-team { display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; }
        .lm-score { display: flex; align-items: center; gap: 8px; justify-content: center; }
        .live-score-num { font-family: var(--font-heading); font-size: 5rem; font-weight: 900; color: var(--gold); line-height: 1; text-shadow: 0 0 30px rgba(212,175,55,0.4); }
        .lm-stats { padding: 24px 28px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; gap: 12px; }
        .stat-bar-row { display: flex; align-items: center; gap: 16px; }
        .sb-val { font-family: var(--font-heading); font-size: 1rem; font-weight: 700; color: var(--gold); width: 30px; text-align: center; }
        .sb-track-wrap { flex: 1; display: flex; flex-direction: column; gap: 4px; }
        .sb-label { font-family: var(--font-secondary); font-size: 0.7rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.4); text-align: center; }
        .sb-track { display: flex; height: 6px; border-radius: 3px; overflow: hidden; background: rgba(255,255,255,0.08); }
        .sb-home { background: linear-gradient(90deg, var(--gold-dark), var(--gold)); border-radius: 3px 0 0 3px; }
        .sb-away { background: linear-gradient(90deg, var(--red-primary), var(--red-bright)); border-radius: 0 3px 3px 0; }
        .lm-timeline { padding: 20px 28px; border-top: 1px solid rgba(255,255,255,0.06); }
        .timeline-track { position: relative; height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: visible; }
        .timeline-progress { height: 100%; background: linear-gradient(90deg, var(--gold-dark), var(--gold)); border-radius: 4px; transition: width 1s; }
        .timeline-events { position: absolute; inset: 0; }
        .timeline-event { position: absolute; transform: translate(-50%, -100%); font-size: 0.8rem; top: 0; }
        .commentary-item { display: flex; gap: 16px; padding: 14px 20px; align-items: flex-start; }
        .commentary-item.latest { border-color: rgba(212,175,55,0.4); background: linear-gradient(145deg, rgba(74,9,11,0.9), rgba(100,75,0,0.1)); }
        .commentary-min { font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--gold); min-width: 32px; flex-shrink: 0; }
        .commentary-team { font-family: var(--font-secondary); font-size: 0.75rem; font-weight: 700; color: var(--gold); margin-right: 8px; }
        .commentary-text { display: flex; flex-direction: column; gap: 4px; font-size: 0.9rem; }
        @media (max-width: 600px) { .lm-scoreboard { grid-template-columns: 1fr; gap: 16px; } .live-score-num { font-size: 3.5rem; } .lm-score { order: -1; } }
      `}</style>
    </div>
  )
}
