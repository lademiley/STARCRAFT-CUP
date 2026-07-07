import React, { useState } from 'react'
import { teams } from '../data/mockData'

export default function LeagueTable() {
  const [group, setGroup] = useState('A')

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Home <span>›</span> League Table</div>
          <h1>League <span className="text-gold">Standings</span></h1>
          <p>Current group stage standings and qualification positions</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{display:'flex',gap:12,marginBottom:32}}>
            {['A','B'].map(g => (
              <button key={g} className={`tab-btn ${group===g?'active':''}`} onClick={()=>setGroup(g)}>Group {g}</button>
            ))}
          </div>

          {/* Legend */}
          <div style={{display:'flex',gap:20,marginBottom:20,flexWrap:'wrap'}}>
            {[['Q','Qualifies to Quarter-Finals','rgba(212,175,55,0.15)'],['E','Eliminated','rgba(239,68,68,0.1)']].map(([badge,label,bg]) => (
              <div key={badge} style={{display:'flex',alignItems:'center',gap:8,fontSize:'0.8rem',color:'rgba(255,255,255,0.6)'}}>
                <span style={{width:22,height:22,borderRadius:4,background:bg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontWeight:700,color:'var(--gold)'}}>{badge}</span>
                {label}
              </div>
            ))}
          </div>

          <div className="table-wrapper card">
            <table>
              <thead>
                <tr>
                  <th style={{width:40}}>Pos</th>
                  <th>Club</th>
                  <th title="Played">P</th>
                  <th title="Won">W</th>
                  <th title="Drawn">D</th>
                  <th title="Lost">L</th>
                  <th title="Goals For">GF</th>
                  <th title="Goals Against">GA</th>
                  <th title="Goal Difference">GD</th>
                  <th title="Points">Pts</th>
                  <th>Form</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {teams.filter(t => t.group === group).sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf).map((t, i) => (
                  <tr key={t.id} style={{background:i<2?'rgba(212,175,55,0.04)':i>=4?'rgba(239,68,68,0.02)':''}}>
                    <td>
                      <div style={{width:28,height:28,borderRadius:6,background:i<2?'rgba(212,175,55,0.15)':i>=4?'rgba(239,68,68,0.1)':'rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-heading)',fontWeight:700,fontSize:'0.85rem',color:i<2?'var(--gold)':i>=4?'rgba(239,68,68,0.7)':'rgba(255,255,255,0.5)'}}>
                        {i+1}
                      </div>
                    </td>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:12}}>
                        <span style={{fontSize:'1.4rem'}}>{t.logo}</span>
                        <div>
                          <div style={{fontWeight:700,fontSize:'0.95rem'}}>{t.name}</div>
                          <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.4)'}}>📍 {t.city}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{textAlign:'center'}}>{t.played}</td>
                    <td style={{textAlign:'center',color:'#2ecc71',fontWeight:600}}>{t.won}</td>
                    <td style={{textAlign:'center',color:'#f59e0b',fontWeight:600}}>{t.draw}</td>
                    <td style={{textAlign:'center',color:'#ef4444',fontWeight:600}}>{t.lost}</td>
                    <td style={{textAlign:'center'}}>{t.gf}</td>
                    <td style={{textAlign:'center'}}>{t.ga}</td>
                    <td style={{textAlign:'center',fontWeight:700,color:t.gd>0?'#2ecc71':t.gd<0?'#ef4444':'rgba(255,255,255,0.5)'}}>
                      {t.gd>0?'+':''}{t.gd}
                    </td>
                    <td style={{textAlign:'center'}}>
                      <strong style={{fontFamily:'var(--font-heading)',fontSize:'1.1rem',color:'var(--gold)'}}>{t.points}</strong>
                    </td>
                    <td>
                      <div style={{display:'flex',gap:3}}>
                        {t.form.map((r,j) => (
                          <span key={j} style={{width:22,height:22,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.6rem',fontWeight:700,background:r==='W'?'#2ecc71':r==='D'?'#f59e0b':'#ef4444',color:'#fff'}}>{r}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      {i<2 ? <span className="badge badge-green" style={{fontSize:'0.65rem'}}>Qualifies ✓</span>
                           : i>=4 ? <span className="badge badge-red" style={{fontSize:'0.65rem'}}>Eliminated</span>
                           : <span className="badge" style={{fontSize:'0.65rem',background:'rgba(245,158,11,0.15)',color:'#f59e0b',border:'1px solid rgba(245,158,11,0.3)'}}>In Play</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Head to Head Summary */}
          <div style={{marginTop:48}}>
            <h2 style={{marginBottom:24}}>Group {group} — Quick Summary</h2>
            <div className="grid-3">
              {[
                { label:'Matches Played', value: teams.filter(t=>t.group===group).reduce((s,t)=>s+t.played,0)/2, icon:'⚽' },
                { label:'Total Goals', value: teams.filter(t=>t.group===group).reduce((s,t)=>s+t.gf,0)/2, icon:'🥅' },
                { label:'Avg Goals/Match', value: (teams.filter(t=>t.group===group).reduce((s,t)=>s+t.gf,0)/2 / (teams.filter(t=>t.group===group).reduce((s,t)=>s+t.played,0)/2)).toFixed(1), icon:'📊' },
              ].map(s => (
                <div key={s.label} className="card" style={{padding:28,textAlign:'center'}}>
                  <div style={{fontSize:'2rem',marginBottom:8}}>{s.icon}</div>
                  <div style={{fontFamily:'var(--font-heading)',fontSize:'2.5rem',fontWeight:900,color:'var(--gold)'}}>{s.value}</div>
                  <div style={{fontFamily:'var(--font-secondary)',fontSize:'0.8rem',fontWeight:600,letterSpacing:'1px',textTransform:'uppercase',color:'rgba(255,255,255,0.5)',marginTop:6}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{marginTop:32,padding:20,background:'rgba(212,175,55,0.06)',border:'1px solid rgba(212,175,55,0.15)',borderRadius:12}}>
            <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.6)'}}>
              <strong style={{color:'var(--gold)'}}>Qualification rules:</strong> Top 2 teams from each group advance to the Quarter-Finals. In the event of equal points, Goal Difference (GD), then Goals For (GF), then Head-to-Head results apply.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .tab-btn { padding: 10px 24px; border-radius: 30px; border: 2px solid rgba(212,175,55,0.25); background: transparent; color: rgba(255,255,255,0.6); font-family: var(--font-secondary); font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 300ms; }
        .tab-btn.active, .tab-btn:hover { border-color: var(--gold); background: rgba(212,175,55,0.1); color: var(--gold); }
      `}</style>
    </div>
  )
}
