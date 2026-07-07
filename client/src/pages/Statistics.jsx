import React, { useState } from 'react'
import { players, teams } from '../data/mockData'

export default function Statistics() {
  const [activeTab, setActiveTab] = useState('scorers')

  const scorers = [...players].sort((a,b) => b.goals - a.goals)
  const assisters = [...players].sort((a,b) => b.assists - a.assists)
  const keepers = [...players].filter(p=>p.position==='Goalkeeper').sort((a,b)=>b.cleanSheets-a.cleanSheets)
  const ratings = [...players].sort((a,b) => b.rating - a.rating)

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Home <span>›</span> Statistics</div>
          <h1>Tournament <span className="text-gold">Statistics</span></h1>
          <p>In-depth stats, rankings, and performance metrics</p>
        </div>
      </section>

      {/* Overview Cards */}
      <section className="section section-dark">
        <div className="container">
          <div className="grid-4">
            {[
              { label:'Total Goals', value:89, icon:'⚽', sub:'Across 18 matches' },
              { label:'Avg Goals/Match', value:'4.9', icon:'📊', sub:'Highest in tournament history' },
              { label:'Clean Sheets', value:11, icon:'🧤', sub:'By all goalkeepers' },
              { label:'Yellow Cards', value:34, icon:'🟨', sub:'Tournament total' },
              { label:'Red Cards', value:3, icon:'🟥', sub:'Tournament total' },
              { label:'Corners', value:156, icon:'🚩', sub:'Both teams combined' },
              { label:'Penalties', value:8, icon:'🎯', sub:'6 scored, 2 missed' },
              { label:'MVP Votes Cast', value:'12,400', icon:'⭐', sub:'Fan votes received' },
            ].map(s => (
              <div key={s.label} className="card" style={{padding:24,textAlign:'center'}}>
                <div style={{fontSize:'1.8rem',marginBottom:8}}>{s.icon}</div>
                <div style={{fontFamily:'var(--font-heading)',fontSize:'2rem',fontWeight:900,color:'var(--gold)'}}>{s.value}</div>
                <div style={{fontFamily:'var(--font-secondary)',fontSize:'0.75rem',fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',color:'var(--white)',marginTop:6}}>{s.label}</div>
                <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.4)',marginTop:4}}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Tab Nav */}
          <div style={{display:'flex',gap:8,marginBottom:32,flexWrap:'wrap'}}>
            {[['scorers','⚽ Top Scorers'],['assists','🎯 Top Assists'],['keepers','🧤 Clean Sheets'],['ratings','⭐ Player Ratings'],['teams','👕 Team Rankings']].map(([k,l]) => (
              <button key={k} className={`tab-btn ${activeTab===k?'active':''}`} onClick={()=>setActiveTab(k)}>{l}</button>
            ))}
          </div>

          {activeTab === 'scorers' && (
            <div>
              <h2 style={{marginBottom:24}}>Golden Boot Race</h2>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {scorers.map((p,i) => (
                  <div key={p.id} className="card stat-row">
                    <div className="sr-rank">{i===0?'🥇':i===1?'🥈':i===2?'🥉':<span style={{fontFamily:'var(--font-heading)',fontWeight:700,color:'rgba(255,255,255,0.3)'}}>{i+1}</span>}</div>
                    <div className="sr-avatar">{p.nationality}</div>
                    <div className="sr-info">
                      <div style={{fontWeight:700}}>{p.name}</div>
                      <div style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.4)'}}>{p.team} • {p.position}</div>
                    </div>
                    <div className="sr-bar-wrap">
                      <div className="progress-bar" style={{width:'100%',height:8}}>
                        <div className="progress-fill" style={{width:`${(p.goals/scorers[0].goals)*100}%`}} />
                      </div>
                    </div>
                    <div className="sr-value">
                      <span style={{fontFamily:'var(--font-heading)',fontSize:'1.6rem',fontWeight:900,color:'var(--gold)'}}>{p.goals}</span>
                      <span style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.4)',fontFamily:'var(--font-secondary)',fontWeight:600}}>GOALS</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assists' && (
            <div>
              <h2 style={{marginBottom:24}}>Top Assist Providers</h2>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {assisters.map((p,i) => (
                  <div key={p.id} className="card stat-row">
                    <div className="sr-rank">{i===0?'🥇':i===1?'🥈':i===2?'🥉':<span style={{fontFamily:'var(--font-heading)',fontWeight:700,color:'rgba(255,255,255,0.3)'}}>{i+1}</span>}</div>
                    <div className="sr-avatar">{p.nationality}</div>
                    <div className="sr-info">
                      <div style={{fontWeight:700}}>{p.name}</div>
                      <div style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.4)'}}>{p.team} • {p.position}</div>
                    </div>
                    <div className="sr-bar-wrap">
                      <div className="progress-bar"><div className="progress-fill" style={{width:`${(p.assists/assisters[0].assists)*100}%`}} /></div>
                    </div>
                    <div className="sr-value">
                      <span style={{fontFamily:'var(--font-heading)',fontSize:'1.6rem',fontWeight:900,color:'#3b82f6'}}>{p.assists}</span>
                      <span style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.4)',fontFamily:'var(--font-secondary)',fontWeight:600}}>ASSISTS</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'keepers' && (
            <div>
              <h2 style={{marginBottom:24}}>Golden Glove Race</h2>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {keepers.map((p,i) => (
                  <div key={p.id} className="card stat-row">
                    <div className="sr-rank">{i===0?'🥇':i===1?'🥈':i===2?'🥉':<span>{i+1}</span>}</div>
                    <div className="sr-avatar">{p.nationality}</div>
                    <div className="sr-info">
                      <div style={{fontWeight:700}}>{p.name}</div>
                      <div style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.4)'}}>{p.team}</div>
                    </div>
                    <div className="sr-bar-wrap">
                      <div className="progress-bar"><div className="progress-fill" style={{width:`${(p.cleanSheets/(keepers[0]?.cleanSheets||1))*100}%`}} /></div>
                    </div>
                    <div className="sr-value">
                      <span style={{fontFamily:'var(--font-heading)',fontSize:'1.6rem',fontWeight:900,color:'#10b981'}}>{p.cleanSheets}</span>
                      <span style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.4)',fontFamily:'var(--font-secondary)',fontWeight:600}}>CLEAN SHEETS</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ratings' && (
            <div>
              <h2 style={{marginBottom:24}}>Player Ratings</h2>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {ratings.map((p,i) => (
                  <div key={p.id} className="card stat-row">
                    <div className="sr-rank">{i+1}</div>
                    <div className="sr-avatar">{p.nationality}</div>
                    <div className="sr-info">
                      <div style={{fontWeight:700}}>{p.name}</div>
                      <div style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.4)'}}>{p.team} • {p.position}</div>
                    </div>
                    <div className="sr-bar-wrap">
                      <div className="progress-bar"><div className="progress-fill" style={{width:`${((p.rating-6)/4)*100}%`}} /></div>
                    </div>
                    <div className="sr-value">
                      <span style={{fontFamily:'var(--font-heading)',fontSize:'1.6rem',fontWeight:900,color:'var(--gold)'}}>{p.rating}</span>
                      <span style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.4)',fontFamily:'var(--font-secondary)',fontWeight:600}}>RATING</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'teams' && (
            <div>
              <h2 style={{marginBottom:24}}>Team Rankings</h2>
              <div className="grid-2" style={{gap:32}}>
                <div>
                  <h3 style={{color:'var(--gold)',marginBottom:16}}>Most Goals Scored</h3>
                  {[...teams].sort((a,b)=>b.gf-a.gf).slice(0,6).map((t,i) => (
                    <div key={t.id} className="card stat-row" style={{marginBottom:10}}>
                      <div className="sr-rank">{i+1}</div>
                      <div style={{fontSize:'1.6rem'}}>{t.logo}</div>
                      <div style={{flex:1,fontWeight:600,fontSize:'0.9rem'}}>{t.name}</div>
                      <div style={{fontFamily:'var(--font-heading)',fontSize:'1.4rem',fontWeight:700,color:'var(--gold)'}}>{t.gf}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <h3 style={{color:'var(--gold)',marginBottom:16}}>Best Defensive Record</h3>
                  {[...teams].sort((a,b)=>a.ga-b.ga).slice(0,6).map((t,i) => (
                    <div key={t.id} className="card stat-row" style={{marginBottom:10}}>
                      <div className="sr-rank">{i+1}</div>
                      <div style={{fontSize:'1.6rem'}}>{t.logo}</div>
                      <div style={{flex:1,fontWeight:600,fontSize:'0.9rem'}}>{t.name}</div>
                      <div style={{fontFamily:'var(--font-heading)',fontSize:'1.4rem',fontWeight:700,color:'#10b981'}}>{t.ga} GA</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .tab-btn { padding: 10px 20px; border-radius: 30px; border: 2px solid rgba(212,175,55,0.25); background: transparent; color: rgba(255,255,255,0.6); font-family: var(--font-secondary); font-size: 0.8rem; font-weight: 700; cursor: pointer; transition: all 300ms; white-space: nowrap; }
        .tab-btn.active, .tab-btn:hover { border-color: var(--gold); background: rgba(212,175,55,0.1); color: var(--gold); }
        .stat-row { display: flex; align-items: center; gap: 16px; padding: 14px 20px; }
        .sr-rank { width: 32px; text-align: center; font-size: 1.1rem; flex-shrink: 0; }
        .sr-avatar { font-size: 1.5rem; flex-shrink: 0; }
        .sr-info { min-width: 160px; }
        .sr-bar-wrap { flex: 1; }
        .sr-value { display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 70px; text-align: center; }
      `}</style>
    </div>
  )
}
