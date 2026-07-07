import React, { useState } from 'react'
import { teams, fixtures, players } from '../data/mockData'

export default function Teams() {
  const [selected, setSelected] = useState(null)
  const team = selected ? teams.find(t => t.id === selected) : null

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Home <span>›</span> Teams</div>
          <h1>Participating <span className="text-gold">Teams</span></h1>
          <p>Meet the 12 elite clubs competing for StarCraft Cup glory</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {!selected ? (
            <>
              {['A','B'].map(grp => (
                <div key={grp} style={{marginBottom:56}}>
                  <h2 style={{marginBottom:24}}>Group {grp}</h2>
                  <div className="grid-3">
                    {teams.filter(t=>t.group===grp).map(t => (
                      <div key={t.id} className="card team-card" onClick={()=>setSelected(t.id)}>
                        <div className="team-card-header">
                          <div className="team-logo">{t.logo}</div>
                          <div className="team-badge-group">
                            <span className="badge badge-gold">Group {t.group}</span>
                          </div>
                        </div>
                        <div className="team-card-body">
                          <h3 style={{color:'var(--white)',marginBottom:4}}>{t.name}</h3>
                          <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.5)',marginBottom:16}}>📍 {t.city} • 👨‍💼 {t.coach}</p>
                          <div className="team-mini-stats">
                            <div className="team-mini-stat"><span className="stat-val">{t.points}</span><span className="stat-lbl">PTS</span></div>
                            <div className="team-mini-stat"><span className="stat-val">{t.won}</span><span className="stat-lbl">W</span></div>
                            <div className="team-mini-stat"><span className="stat-val">{t.gf}</span><span className="stat-lbl">GF</span></div>
                            <div className="team-mini-stat"><span className="stat-val">{t.ga}</span><span className="stat-lbl">GA</span></div>
                          </div>
                          <div style={{display:'flex',gap:4,marginTop:12}}>
                            {t.form.map((r,i) => (
                              <span key={i} style={{width:24,height:24,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem',fontWeight:700,background:r==='W'?'#2ecc71':r==='D'?'#f59e0b':'#ef4444',color:'#fff'}}>{r}</span>
                            ))}
                          </div>
                        </div>
                        <div className="team-card-footer">
                          <span className="btn btn-secondary btn-sm">View Profile →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div>
              <button className="btn btn-secondary btn-sm" style={{marginBottom:28}} onClick={()=>setSelected(null)}>← Back to Teams</button>
              <div className="team-profile">
                <div className="team-profile-header card">
                  <div className="tp-logo">{team.logo}</div>
                  <div className="tp-info">
                    <span className="badge badge-gold" style={{marginBottom:8,display:'inline-block'}}>Group {team.group}</span>
                    <h1 style={{fontSize:'clamp(1.8rem,4vw,3rem)',marginBottom:8}}>{team.name}</h1>
                    <p style={{color:'rgba(255,255,255,0.6)'}}>📍 {team.city} &nbsp;•&nbsp; 👨‍💼 Head Coach: <strong style={{color:'var(--white)'}}>{team.coach}</strong></p>
                    <div className="tp-stats">
                      {[['Played',team.played],['Won',team.won],['Drawn',team.draw],['Lost',team.lost],['Goals For',team.gf],['Goals Against',team.ga],['GD',`${team.gd>0?'+':''}${team.gd}`],['Points',team.points]].map(([l,v]) => (
                        <div key={l} className="tp-stat">
                          <span className="tp-stat-val" style={{color:l==='Points'?'var(--gold)':'var(--white)'}}>{v}</span>
                          <span className="tp-stat-lbl">{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid-2" style={{marginTop:28}}>
                  {/* Squad */}
                  <div>
                    <h3 style={{color:'var(--gold)',marginBottom:16}}>Squad List</h3>
                    <div className="card" style={{overflow:'hidden'}}>
                      <table style={{width:'100%'}}>
                        <thead><tr><th>#</th><th>Player</th><th>Position</th><th>Goals</th><th>Rating</th></tr></thead>
                        <tbody>
                          {players.filter(p=>p.teamId===team.id).map(p => (
                            <tr key={p.id}>
                              <td style={{color:'var(--gold)',fontWeight:700}}>{p.jersey}</td>
                              <td style={{fontWeight:600}}>{p.name}</td>
                              <td><span className="badge badge-gold" style={{fontSize:'0.6rem'}}>{p.position}</span></td>
                              <td>{p.goals}</td>
                              <td><span style={{color:'var(--gold)',fontWeight:700}}>{p.rating}</span></td>
                            </tr>
                          ))}
                          {players.filter(p=>p.teamId===team.id).length === 0 && (
                            <tr><td colSpan={5} style={{textAlign:'center',padding:24,color:'rgba(255,255,255,0.4)'}}>Squad details coming soon</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent Results */}
                  <div>
                    <h3 style={{color:'var(--gold)',marginBottom:16}}>Recent Results</h3>
                    <div style={{display:'flex',flexDirection:'column',gap:10}}>
                      {fixtures.filter(f=>f.status==='completed'&&(f.homeTeam===team.name||f.awayTeam===team.name)).slice(0,4).map(f => {
                        const isHome = f.homeTeam === team.name
                        const teamScore = isHome ? f.homeScore : f.awayScore
                        const oppScore = isHome ? f.awayScore : f.homeScore
                        const opponent = isHome ? f.awayTeam : f.homeTeam
                        const result = teamScore > oppScore ? 'W' : teamScore < oppScore ? 'L' : 'D'
                        return (
                          <div key={f.id} className="card" style={{padding:'14px 20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                            <div>
                              <div style={{fontSize:'0.9rem',fontWeight:600}}>{team.name} vs {opponent}</div>
                              <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.4)'}}>{f.date} • {isHome?'Home':'Away'}</div>
                            </div>
                            <div style={{display:'flex',alignItems:'center',gap:10}}>
                              <span style={{fontFamily:'var(--font-heading)',fontSize:'1.1rem',fontWeight:700}}>{teamScore} – {oppScore}</span>
                              <span style={{width:26,height:26,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontWeight:700,background:result==='W'?'#2ecc71':result==='D'?'#f59e0b':'#ef4444',color:'#fff'}}>{result}</span>
                            </div>
                          </div>
                        )
                      })}
                      {fixtures.filter(f=>f.status==='completed'&&(f.homeTeam===team.name||f.awayTeam===team.name)).length===0 && (
                        <div className="card" style={{padding:28,textAlign:'center',color:'rgba(255,255,255,0.4)'}}>No completed matches yet</div>
                      )}
                    </div>

                    <h3 style={{color:'var(--gold)',marginBottom:16,marginTop:28}}>Upcoming Matches</h3>
                    <div style={{display:'flex',flexDirection:'column',gap:10}}>
                      {fixtures.filter(f=>f.status==='upcoming'&&(f.homeTeam===team.name||f.awayTeam===team.name)).slice(0,2).map(f => (
                        <div key={f.id} className="card" style={{padding:'14px 20px'}}>
                          <div style={{fontSize:'0.9rem',fontWeight:600}}>{f.homeTeam} vs {f.awayTeam}</div>
                          <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.4)',marginTop:4}}>📅 {f.date} {f.time} • 🏟️ {f.venue}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .eyebrow { font-family: var(--font-secondary); font-size: 0.75rem; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: var(--gold); display: block; margin-bottom: 12px; }
        .team-card { cursor: pointer; }
        .team-card-header { height: 120px; background: linear-gradient(135deg, var(--burgundy), var(--red-primary)); display: flex; align-items: center; justify-content: center; position: relative; }
        .team-logo { font-size: 3.5rem; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5)); }
        .team-badge-group { position: absolute; top: 12px; right: 12px; }
        .team-card-body { padding: 20px; }
        .team-mini-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 12px; }
        .team-mini-stat { display: flex; flex-direction: column; align-items: center; gap: 2px; background: rgba(255,255,255,0.04); border-radius: 8px; padding: 8px 4px; }
        .stat-val { font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; color: var(--gold); }
        .stat-lbl { font-family: var(--font-secondary); font-size: 0.6rem; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: rgba(255,255,255,0.4); }
        .team-card-footer { padding: 0 20px 20px; }
        .team-profile-header { padding: 40px; display: flex; gap: 40px; align-items: center; margin-bottom: 28px; }
        .tp-logo { font-size: 5rem; filter: drop-shadow(0 8px 20px rgba(0,0,0,0.5)); flex-shrink: 0; }
        .tp-info { flex: 1; }
        .tp-stats { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 20px; }
        .tp-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; background: rgba(255,255,255,0.05); border-radius: 10px; padding: 12px 16px; min-width: 70px; }
        .tp-stat-val { font-family: var(--font-heading); font-size: 1.3rem; font-weight: 700; }
        .tp-stat-lbl { font-family: var(--font-secondary); font-size: 0.65rem; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: rgba(255,255,255,0.4); }
        @media (max-width: 768px) { .team-profile-header { flex-direction: column; text-align: center; } }
      `}</style>
    </div>
  )
}
