import React, { useState } from 'react'
import { fixtures, teams } from '../data/mockData'

export default function Fixtures() {
  const [filter, setFilter] = useState('all')
  const [round, setRound] = useState('all')

  const rounds = ['all', 'Group Stage', 'Quarter-Final', 'Semi-Final', 'Grand Final']
  const filtered = fixtures
    .filter(f => filter === 'all' || f.status === filter)
    .filter(f => round === 'all' || (f.round || 'Group Stage') === round)

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Home <span>›</span> Fixtures</div>
          <h1>Match <span className="text-gold">Fixtures</span></h1>
          <p>All match schedules, results, and previews</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:32,alignItems:'center'}}>
            <div style={{display:'flex',gap:8}}>
              {[['all','All'],['upcoming','Upcoming'],['completed','Completed'],['live','🔴 Live']].map(([v,l]) => (
                <button key={v} className={`tab-btn ${filter===v?'active':''}`} onClick={()=>setFilter(v)}>{l}</button>
              ))}
            </div>
            <select className="form-control" value={round} onChange={e=>setRound(e.target.value)} style={{maxWidth:180}}>
              {rounds.map(r => <option key={r} value={r}>{r === 'all' ? 'All Rounds' : r}</option>)}
            </select>
          </div>

          {/* Fixtures */}
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            {filtered.length === 0 && (
              <div className="card" style={{padding:40,textAlign:'center',color:'rgba(255,255,255,0.4)'}}>
                No fixtures found for selected filters.
              </div>
            )}
            {filtered.map(f => {
              const hTeam = teams.find(t => t.name === f.homeTeam)
              const aTeam = teams.find(t => t.name === f.awayTeam)
              return (
                <div key={f.id} className={`fixture-full card ${f.status}`}>
                  <div className="ff-header">
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <span className={`badge ${f.status === 'live' ? 'badge-live' : 'badge-gold'}`}>
                        {f.status === 'live' ? '🔴 LIVE' : f.round || 'Group Stage'}
                      </span>
                      {f.status === 'completed' && <span className="badge badge-green">FT</span>}
                    </div>
                    <div style={{display:'flex',gap:16,fontSize:'0.8rem',color:'rgba(255,255,255,0.5)'}}>
                      <span>📅 {f.date}</span>
                      <span>⏰ {f.time}</span>
                      <span>🏟️ {f.venue}</span>
                    </div>
                  </div>

                  <div className="ff-main">
                    <div className="ff-team">
                      <div className="ff-logo">{hTeam?.logo || '⚽'}</div>
                      <div className="ff-team-info">
                        <div className="ff-team-name">{f.homeTeam}</div>
                        <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.4)'}}>HOME</div>
                      </div>
                    </div>

                    <div className="ff-score-box">
                      {f.status === 'completed' ? (
                        <div className="ff-score">{f.homeScore} – {f.awayScore}</div>
                      ) : f.status === 'live' ? (
                        <div style={{textAlign:'center'}}>
                          <div className="ff-score" style={{color:'#ef4444'}}>{f.homeScore} – {f.awayScore}</div>
                          <div style={{fontFamily:'var(--font-secondary)',fontSize:'0.7rem',color:'#ef4444',fontWeight:700}}>LIVE</div>
                        </div>
                      ) : (
                        <div style={{textAlign:'center'}}>
                          <div style={{fontFamily:'var(--font-heading)',fontSize:'2rem',color:'rgba(255,255,255,0.2)',letterSpacing:'4px'}}>VS</div>
                          <div style={{fontFamily:'var(--font-secondary)',fontSize:'0.7rem',color:'var(--gold)',fontWeight:700,marginTop:4}}>{f.time}</div>
                        </div>
                      )}
                    </div>

                    <div className="ff-team" style={{flexDirection:'row-reverse',textAlign:'right'}}>
                      <div className="ff-logo">{aTeam?.logo || '⚽'}</div>
                      <div className="ff-team-info">
                        <div className="ff-team-name">{f.awayTeam}</div>
                        <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.4)'}}>AWAY</div>
                      </div>
                    </div>
                  </div>

                  <div className="ff-footer">
                    <div style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.4)'}}>
                      🏳️ Referee: {f.referee}
                    </div>
                    <div style={{display:'flex',gap:10}}>
                      {f.status === 'upcoming' && <button className="btn btn-secondary btn-sm">Match Preview</button>}
                      {f.status === 'completed' && <button className="btn btn-secondary btn-sm">Match Report</button>}
                      {f.status === 'live' && <button className="btn btn-red btn-sm">Watch Live</button>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <style>{`
        .tab-btn { padding: 10px 20px; border-radius: 30px; border: 2px solid rgba(212,175,55,0.25); background: transparent; color: rgba(255,255,255,0.6); font-family: var(--font-secondary); font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 300ms; white-space: nowrap; }
        .tab-btn.active, .tab-btn:hover { border-color: var(--gold); background: rgba(212,175,55,0.1); color: var(--gold); }
        .fixture-full { overflow: hidden; }
        .ff-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); flex-wrap: wrap; gap: 12px; }
        .ff-main { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 24px; padding: 24px; }
        .ff-team { display: flex; align-items: center; gap: 16px; }
        .ff-logo { font-size: 2.5rem; }
        .ff-team-name { font-family: var(--font-secondary); font-weight: 700; font-size: 1rem; }
        .ff-score-box { text-align: center; min-width: 120px; }
        .ff-score { font-family: var(--font-heading); font-size: 2.2rem; font-weight: 900; color: var(--gold); }
        .ff-footer { display: flex; justify-content: space-between; align-items: center; padding: 14px 24px; border-top: 1px solid rgba(255,255,255,0.06); flex-wrap: wrap; gap: 12px; }
        @media (max-width: 600px) { .ff-main { grid-template-columns: 1fr; gap: 16px; } .ff-score-box { order: -1; } }
      `}</style>
    </div>
  )
}
