import React, { useState } from 'react'
import { players, teams } from '../data/mockData'

const positions = ['All', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper']

export default function Players() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [sort, setSort] = useState('goals')

  const filtered = players
    .filter(p => filter === 'All' || p.position === filter)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.team.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b[sort] - a[sort])

  const player = selected ? players.find(p => p.id === selected) : null

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Home <span>›</span> Players</div>
          <h1>Player <span className="text-gold">Profiles</span></h1>
          <p>Discover the stars of StarCraft Cup 2027</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {!selected ? (
            <>
              {/* Filters */}
              <div className="players-filters">
                <input
                  type="text" placeholder="🔍 Search players or teams..."
                  className="form-control" value={search} onChange={e => setSearch(e.target.value)}
                  style={{maxWidth:320}}
                />
                <div className="filter-chips">
                  {positions.map(p => (
                    <button key={p} className={`tag ${filter===p?'active':''}`} onClick={()=>setFilter(p)}>{p}</button>
                  ))}
                </div>
                <select className="form-control" value={sort} onChange={e=>setSort(e.target.value)} style={{maxWidth:180}}>
                  <option value="goals">Sort: Goals</option>
                  <option value="assists">Sort: Assists</option>
                  <option value="rating">Sort: Rating</option>
                  <option value="mvpVotes">Sort: MVP Votes</option>
                </select>
              </div>

              {/* Top 3 */}
              <div className="top-scorers">
                {filtered.slice(0,3).map((p,i) => (
                  <div key={p.id} className={`top-scorer-card card ${i===0?'gold':i===1?'silver':'bronze'}`} onClick={()=>setSelected(p.id)}>
                    <div className="top-scorer-rank">#{i+1}</div>
                    <div className="top-scorer-avatar">{p.nationality}</div>
                    <h4 style={{color:'var(--white)',textAlign:'center',marginBottom:4}}>{p.name}</h4>
                    <span className="badge badge-gold" style={{marginBottom:12}}>{p.position}</span>
                    <div style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.5)',marginBottom:16}}>{p.team}</div>
                    <div className="top-scorer-stats">
                      <div className="tss"><span style={{fontFamily:'var(--font-heading)',fontSize:'1.4rem',fontWeight:700,color:'var(--gold)'}}>{p[sort]}</span><span style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.4)',textTransform:'uppercase',fontFamily:'var(--font-secondary)',fontWeight:700}}>{sort}</span></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div className="grid-4" style={{marginTop:32}}>
                {filtered.map(p => (
                  <div key={p.id} className="card player-card-2" onClick={()=>setSelected(p.id)}>
                    <div className="player-card-2-top">
                      <div className="pc2-avatar">{p.nationality}</div>
                      <div className="pc2-jersey">#{p.jersey}</div>
                      <div className="pc2-rating">{p.rating}</div>
                    </div>
                    <div style={{padding:16}}>
                      <span className="badge badge-gold" style={{marginBottom:8,fontSize:'0.6rem'}}>{p.position}</span>
                      <h4 style={{fontSize:'0.95rem',color:'var(--white)',marginBottom:2,lineHeight:1.3}}>{p.name}</h4>
                      <p style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.4)',marginBottom:12}}>{p.team}</p>
                      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,paddingTop:12,borderTop:'1px solid rgba(255,255,255,0.08)'}}>
                        {[['⚽',p.goals,'Goals'],['🎯',p.assists,'Assists'],['🟨',p.yellowCards,'YC']].map(([icon,val,label]) => (
                          <div key={label} style={{textAlign:'center'}}>
                            <div style={{fontSize:'0.7rem',marginBottom:2}}>{icon}</div>
                            <div style={{fontFamily:'var(--font-heading)',fontSize:'1rem',fontWeight:700,color:'var(--gold)'}}>{val}</div>
                            <div style={{fontFamily:'var(--font-secondary)',fontSize:'0.55rem',fontWeight:700,letterSpacing:'0.5px',color:'rgba(255,255,255,0.4)',textTransform:'uppercase'}}>{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="player-profile">
              <button className="btn btn-secondary btn-sm" style={{marginBottom:28}} onClick={()=>setSelected(null)}>← Back to Players</button>
              <div className="pp-header card">
                <div className="pp-avatar-wrap">
                  <div className="pp-avatar">{player.nationality}</div>
                  <div className="pp-jersey">#{player.jersey}</div>
                </div>
                <div className="pp-info">
                  <span className="badge badge-gold" style={{marginBottom:12,display:'inline-block'}}>{player.position}</span>
                  <h1 style={{fontSize:'clamp(1.5rem,3vw,2.5rem)',marginBottom:8}}>{player.name}</h1>
                  <p style={{color:'rgba(255,255,255,0.6)',marginBottom:20}}>{player.team} • Age {player.age} • {player.nationality}</p>
                  <div className="pp-stats-grid">
                    {[['Goals',player.goals,'⚽'],['Assists',player.assists,'🎯'],['Clean Sheets',player.cleanSheets,'🧤'],['Yellow Cards',player.yellowCards,'🟨'],['Red Cards',player.redCards,'🟥'],['MVP Votes',player.mvpVotes,'⭐'],['Rating',player.rating,'📊'],['Market Value',player.marketValue,'💰']].map(([l,v,icon]) => (
                      <div key={l} className="pp-stat">
                        <span style={{fontSize:'1.2rem'}}>{icon}</span>
                        <span style={{fontFamily:'var(--font-heading)',fontSize:'1.4rem',fontWeight:700,color:'var(--gold)'}}>{v}</span>
                        <span style={{fontFamily:'var(--font-secondary)',fontSize:'0.65rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.5px',color:'rgba(255,255,255,0.4)'}}>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid-2" style={{marginTop:24}}>
                <div className="card" style={{padding:28}}>
                  <h3 style={{color:'var(--gold)',marginBottom:16}}>📖 Biography</h3>
                  <p style={{color:'rgba(255,255,255,0.8)',lineHeight:1.8}}>{player.bio}</p>
                  <div style={{marginTop:20,padding:16,background:'rgba(212,175,55,0.06)',borderRadius:12,border:'1px solid rgba(212,175,55,0.15)'}}>
                    <div style={{fontFamily:'var(--font-secondary)',fontWeight:700,fontSize:'0.8rem',color:'var(--gold)',marginBottom:12,letterSpacing:'1px',textTransform:'uppercase'}}>🔍 Scout Notes</div>
                    <p style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.7)',fontStyle:'italic'}}>"{player.name} is a player of exceptional quality. Their technical ability, positioning, and work rate make them one of the tournament's standout performers. Recommended for state-level trials."</p>
                  </div>
                </div>
                <div className="card" style={{padding:28}}>
                  <h3 style={{color:'var(--gold)',marginBottom:16}}>📊 Performance Breakdown</h3>
                  {[['Shooting',0],['Passing',0],['Dribbling',0],['Defending',0],['Physical',0],['Pace',0]].map(([attr,val]) => (
                    <div key={attr} style={{marginBottom:14}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                        <span style={{fontSize:'0.85rem',fontFamily:'var(--font-secondary)',fontWeight:600}}>{attr}</span>
                        <span style={{fontSize:'0.85rem',color:'var(--gold)',fontWeight:700}}>{val}</span>
                      </div>
                      <div className="progress-bar"><div className="progress-fill" style={{width:`${val}%`}} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .players-filters { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; margin-bottom: 32px; }
        .filter-chips { display: flex; gap: 8px; flex-wrap: wrap; }
        .top-scorers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 16px; }
        .top-scorer-card { padding: 28px; text-align: center; display: flex; flex-direction: column; align-items: center; cursor: pointer; position: relative; }
        .top-scorer-card.gold { border-color: rgba(212,175,55,0.6); background: linear-gradient(145deg, rgba(74,9,11,0.9), rgba(100,75,0,0.15)); }
        .top-scorer-card.silver { border-color: rgba(192,192,192,0.4); }
        .top-scorer-card.bronze { border-color: rgba(158,91,40,0.5); }
        .top-scorer-rank { position: absolute; top: 16px; left: 16px; font-family: var(--font-heading); font-size: 1.5rem; font-weight: 900; color: rgba(255,255,255,0.15); }
        .top-scorer-avatar { font-size: 3rem; margin-bottom: 12px; }
        .top-scorer-stats { display: flex; gap: 16px; justify-content: center; }
        .tss { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .player-card-2 { cursor: pointer; }
        .player-card-2-top { height: 90px; background: linear-gradient(135deg, var(--burgundy), var(--red-primary)); display: flex; align-items: center; justify-content: center; position: relative; }
        .pc2-avatar { font-size: 2.2rem; }
        .pc2-jersey { position: absolute; top: 8px; left: 10px; font-family: var(--font-heading); font-size: 1rem; font-weight: 700; color: rgba(255,255,255,0.2); }
        .pc2-rating { position: absolute; top: 8px; right: 10px; font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--gold); background: rgba(212,175,55,0.15); padding: 2px 8px; border-radius: 20px; }
        .pp-header { padding: 40px; display: flex; gap: 40px; align-items: flex-start; }
        .pp-avatar-wrap { position: relative; flex-shrink: 0; }
        .pp-avatar { width: 140px; height: 140px; border-radius: 50%; border: 3px solid var(--gold); background: linear-gradient(135deg, var(--burgundy), var(--red-primary)); display: flex; align-items: center; justify-content: center; font-size: 4rem; }
        .pp-jersey { position: absolute; bottom: 0; right: 0; background: var(--gold); color: var(--black); font-family: var(--font-heading); font-weight: 700; font-size: 0.85rem; padding: 4px 10px; border-radius: 20px; }
        .pp-info { flex: 1; }
        .pp-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .pp-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; background: rgba(255,255,255,0.04); border-radius: 12px; padding: 14px 8px; border: 1px solid rgba(255,255,255,0.06); }
        @media (max-width: 768px) { .top-scorers { grid-template-columns: 1fr; } .pp-header { flex-direction: column; } .pp-stats-grid { grid-template-columns: repeat(2,1fr); } }
      `}</style>
    </div>
  )
}
