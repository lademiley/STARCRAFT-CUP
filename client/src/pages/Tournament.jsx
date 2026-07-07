import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { fixtures, prizeStructure, teams } from '../data/mockData'

const schedule = [
  { date: '2027-03-01', event: 'Group Stage Matchday 1', venue: 'University of Benin Bowl' },
  { date: '2027-03-03', event: 'Group Stage Matchday 1', venue: 'Samuel Ogbemudia Stadium' },
  { date: '2027-03-05', event: 'Group Stage Matchday 1', venue: 'University of Benin Bowl' },
  { date: '2027-03-08', event: 'Group Stage Matchday 2', venue: 'University of Benin Bowl' },
  { date: '2027-03-10', event: 'Group Stage Matchday 2', venue: 'Samuel Ogbemudia Stadium' },
  { date: '2027-03-15', event: 'Group Stage Matchday 3', venue: 'University of Benin Bowl' },
  { date: '2027-03-17', event: 'Group Stage Matchday 3', venue: 'Samuel Ogbemudia Stadium' },
  { date: '2027-03-20', event: 'Quarter-Finals', venue: 'Samuel Ogbemudia Stadium' },
  { date: '2027-03-22', event: 'Quarter-Finals', venue: 'University of Benin Bowl' },
  { date: '2027-04-05', event: 'Semi-Finals', venue: 'Samuel Ogbemudia Stadium' },
  { date: '2027-04-10', event: '3rd Place Play-Off', venue: 'Samuel Ogbemudia Stadium' },
  { date: '2027-04-20', event: '🏆 Grand Final', venue: 'Samuel Ogbemudia Stadium' },
]

const rules = [
  { rule: 'Each team must register a squad of 18 players.' },
  { rule: 'Players must be 18 years or older and Nigerian citizens.' },
  { rule: 'Players must have valid ID and proof of LGA residency or club affiliation.' },
  { rule: 'Matches are 90 minutes (two halves of 45 minutes).' },
  { rule: 'Knockout matches level at full time proceed to extra time (30 mins), then penalty shootout.' },
  { rule: 'A player receiving 2 yellow cards in the tournament is suspended for one match.' },
  { rule: 'A player receiving a red card is suspended for a minimum of one match.' },
  { rule: 'Teams must arrive at the venue at least 60 minutes before kickoff.' },
  { rule: 'All disputes are resolved by the Tournament Technical Committee.' },
  { rule: 'Anti-doping regulations as per NADAC guidelines apply to all players.' },
]

const venues = [
  { name: 'University of Benin Bowl, Ugbowo', capacity: '8,000', surface: 'Hybrid Grass', facilities: 'Changing rooms, Medical bay, VIP lounge', role: 'Group Stage Primary Venue' },
  { name: 'Samuel Ogbemudia Stadium', capacity: '20,000', surface: 'Natural Grass', facilities: 'Full broadcast suite, Press box, VIP suites, LED screens', role: 'Finals Venue' },
]

export default function Tournament() {
  const [activeTab, setActiveTab] = useState('format')
  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Home <span>›</span> Tournament</div>
          <h1>The <span className="text-gold">Tournament</span></h1>
          <p>Competition format, schedule, rules, venues, and prize structure</p>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="tab-nav">
        <div className="container">
          <div className="tab-nav-inner">
            {[['format','🏆 Format'],['schedule','📅 Schedule'],['rules','📋 Rules'],['venues','🏟️ Venues'],['prizes','💰 Prizes']].map(([k,l]) => (
              <button key={k} className={`tab-nav-btn ${activeTab===k?'active':''}`} onClick={()=>setActiveTab(k)}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'format' && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">How It Works</span>
              <h2>Competition Format</h2>
              <p>12 teams battle through group stage and knockout rounds for the StarCraft Cup title</p>
              <div className="divider" />
            </div>

            <div className="grid-3" style={{marginBottom:48}}>
              {[
                { phase:'Group Stage', icon:'📊', desc:'12 teams split into 2 groups of 6. Round-robin format — each team plays 5 matches. Top 2 from each group advance.' },
                { phase:'Quarter-Finals', icon:'⚔️', desc:'4 quarter-finals. Group A winner vs Group B runner-up and vice versa. Single-leg knockout matches.' },
                { phase:'Semi-Finals', icon:'🥊', desc:'2 semi-finals determine the finalists. Single-leg knockout, with extra time and penalties if needed.' },
                { phase:'3rd Place Play-Off', icon:'🥉', desc:'The two semi-final losers compete for third place and the bronze medal at Samuel Ogbemudia Stadium.' },
                { phase:'Grand Final', icon:'🏆', desc:'The ultimate match. Played at Samuel Ogbemudia Stadium before 20,000 fans. The winner lifts the StarCraft Cup.' },
              ].map(p => (
                <div key={p.phase} className="card" style={{padding:28}}>
                  <div style={{fontSize:'2.5rem',marginBottom:14}}>{p.icon}</div>
                  <h4 style={{color:'var(--gold)',marginBottom:8}}>{p.phase}</h4>
                  <p style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.7)'}}>{p.desc}</p>
                </div>
              ))}
            </div>

            {/* Group Tables */}
            <div className="grid-2">
              {['A','B'].map(grp => (
                <div key={grp}>
                  <h3 style={{color:'var(--gold)',marginBottom:16}}>Group {grp}</h3>
                  <div className="table-wrapper card">
                    <table>
                      <thead><tr><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead>
                      <tbody>
                        {teams.filter(t=>t.group===grp).sort((a,b)=>b.points-a.points).map((t,i) => (
                          <tr key={t.id} style={{background:i<2?'rgba(212,175,55,0.04)':''}}>
                            <td>
                              <div style={{display:'flex',alignItems:'center',gap:8}}>
                                {i<2&&<span title="Qualifies" style={{color:'var(--gold)',fontSize:'0.7rem'}}>Q</span>}
                                <span style={{fontSize:'1rem'}}>{t.logo}</span>
                                <span style={{fontWeight:600,fontSize:'0.85rem'}}>{t.name}</span>
                              </div>
                            </td>
                            <td>{t.played}</td><td>{t.won}</td><td>{t.draw}</td><td>{t.lost}</td>
                            <td style={{color:t.gd>0?'#2ecc71':t.gd<0?'#ef4444':'inherit'}}>{t.gd>0?'+':''}{t.gd}</td>
                            <td><strong style={{color:'var(--gold)'}}>{t.points}</strong></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>

            {/* Knockout Bracket */}
            <div style={{marginTop:48}}>
              <h3 style={{color:'var(--gold)',marginBottom:24,textAlign:'center'}}>Knockout Bracket</h3>
              <div className="bracket">
                <div className="bracket-round">
                  <div style={{color:'rgba(255,255,255,0.5)',fontFamily:'var(--font-secondary)',fontSize:'0.7rem',letterSpacing:'2px',textTransform:'uppercase',marginBottom:12,textAlign:'center'}}>Quarter-Finals</div>
                  {fixtures.filter(f=>f.round==='Quarter-Final').map(f => (
                    <div key={f.id} className="bracket-match card">
                      <div className="bracket-team">{teams.find(t=>t.name===f.homeTeam)?.logo||'⚽'} {f.homeTeam}</div>
                      <div className="bracket-vs">vs</div>
                      <div className="bracket-team">{teams.find(t=>t.name===f.awayTeam)?.logo||'⚽'} {f.awayTeam}</div>
                      <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.4)',marginTop:8}}>📅 {f.date}</div>
                    </div>
                  ))}
                </div>
                <div className="bracket-arrow">→</div>
                <div className="bracket-round">
                  <div style={{color:'rgba(255,255,255,0.5)',fontFamily:'var(--font-secondary)',fontSize:'0.7rem',letterSpacing:'2px',textTransform:'uppercase',marginBottom:12,textAlign:'center'}}>Semi-Finals</div>
                  {[1,2].map(n => (
                    <div key={n} className="bracket-match card" style={{opacity:0.6}}>
                      <div className="bracket-team">TBD</div>
                      <div className="bracket-vs">vs</div>
                      <div className="bracket-team">TBD</div>
                    </div>
                  ))}
                </div>
                <div className="bracket-arrow">→</div>
                <div className="bracket-round">
                  <div style={{color:'rgba(255,255,255,0.5)',fontFamily:'var(--font-secondary)',fontSize:'0.7rem',letterSpacing:'2px',textTransform:'uppercase',marginBottom:12,textAlign:'center'}}>Grand Final</div>
                  <div className="bracket-match card final-match" style={{opacity:0.6}}>
                    <div className="bracket-team">🏆 TBD</div>
                    <div className="bracket-vs" style={{color:'var(--gold)'}}>FINAL</div>
                    <div className="bracket-team">🏆 TBD</div>
                    <div style={{fontSize:'0.75rem',color:'var(--gold)',marginTop:8}}>📅 Apr 20, 2027</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'schedule' && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Calendar</span>
              <h2>Tournament Schedule</h2>
              <div className="divider" />
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:16}}>
              {schedule.map((s,i) => (
                <div key={i} className="card" style={{padding:'20px 28px',display:'flex',alignItems:'center',gap:24}}>
                  <div style={{flexShrink:0,textAlign:'center',background:'rgba(212,175,55,0.1)',border:'1px solid rgba(212,175,55,0.25)',borderRadius:12,padding:'12px 20px',minWidth:90}}>
                    <div style={{fontFamily:'var(--font-heading)',fontSize:'1.4rem',fontWeight:900,color:'var(--gold)'}}>{new Date(s.date).getDate()}</div>
                    <div style={{fontFamily:'var(--font-secondary)',fontSize:'0.7rem',fontWeight:700,letterSpacing:'1px',color:'rgba(255,255,255,0.5)'}}>{new Date(s.date).toLocaleString('default',{month:'short'}).toUpperCase()} {new Date(s.date).getFullYear()}</div>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:'var(--font-secondary)',fontWeight:700,fontSize:'0.95rem',color:s.event.includes('Final')?'var(--gold)':'var(--white)',marginBottom:4}}>{s.event}</div>
                    <div style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.5)'}}>🏟️ {s.venue}</div>
                  </div>
                  {s.event.includes('Final') && <span className="badge badge-gold">GRAND FINALE</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'rules' && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Regulations</span>
              <h2>Rules & Regulations</h2>
              <div className="divider" />
            </div>
            <div style={{maxWidth:800,margin:'0 auto',display:'flex',flexDirection:'column',gap:12}}>
              {rules.map((r,i) => (
                <div key={i} className="card" style={{padding:'20px 24px',display:'flex',gap:16,alignItems:'center'}}>
                  <span style={{fontFamily:'var(--font-heading)',fontSize:'1.1rem',fontWeight:900,color:'var(--gold)',flexShrink:0,width:36,textAlign:'center'}}>{String(i+1).padStart(2,'0')}</span>
                  <p style={{color:'rgba(255,255,255,0.85)',margin:0}}>{r.rule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'venues' && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Stadiums</span>
              <h2>Match Venues</h2>
              <div className="divider" />
            </div>
            <div className="grid-2">
              {venues.map(v => (
                <div key={v.name} className="card" style={{padding:0,overflow:'hidden'}}>
                  <div style={{height:160,background:'linear-gradient(135deg,var(--burgundy),var(--red-primary))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'4rem'}}>🏟️</div>
                  <div style={{padding:28}}>
                    <span className="badge badge-gold" style={{marginBottom:12,display:'inline-block'}}>{v.role}</span>
                    <h3 style={{color:'var(--white)',marginBottom:16}}>{v.name}</h3>
                    {[['Capacity',v.capacity],['Surface',v.surface],['Facilities',v.facilities]].map(([k,val]) => (
                      <div key={k} style={{display:'flex',gap:12,marginBottom:10}}>
                        <span style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.4)',minWidth:80,fontFamily:'var(--font-secondary)',fontWeight:600}}>{k}</span>
                        <span style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.85)'}}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'prizes' && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Rewards</span>
              <h2>Prize Structure</h2>
              <p>Total prize pool of ₦10,000,000+</p>
              <div className="divider" />
            </div>
            <div style={{maxWidth:700,margin:'0 auto',display:'flex',flexDirection:'column',gap:12}}>
              {prizeStructure.map((p,i) => (
                <div key={i} className={`card prize-row ${i<3?'top-prize':''}`} style={{padding:'20px 28px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,borderColor:i===0?'rgba(212,175,55,0.6)':i===1?'rgba(192,192,192,0.3)':i===2?'rgba(158,91,40,0.4)':'rgba(212,175,55,0.15)'}}>
                  <div>
                    <div style={{fontFamily:'var(--font-secondary)',fontWeight:700,fontSize:'0.95rem',marginBottom:4}}>{p.position}</div>
                    <div style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.5)'}}>{p.additional}</div>
                  </div>
                  <div style={{fontFamily:'var(--font-heading)',fontSize:'1.5rem',fontWeight:900,color:i===0?'var(--gold)':i===1?'#c0c0c0':i===2?'var(--bronze)':'var(--white)',flexShrink:0}}>{p.prize}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .eyebrow { font-family: var(--font-secondary); font-size: 0.75rem; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: var(--gold); display: block; margin-bottom: 12px; }
        .tab-nav { background: rgba(10,1,2,0.95); border-bottom: 1px solid rgba(212,175,55,0.15); position: sticky; top: 60px; z-index: 50; backdrop-filter: blur(20px); }
        .tab-nav-inner { display: flex; gap: 4px; overflow-x: auto; padding: 12px 0; scrollbar-width: none; }
        .tab-nav-inner::-webkit-scrollbar { display: none; }
        .tab-nav-btn { padding: 10px 22px; border-radius: 8px; border: none; background: transparent; color: rgba(255,255,255,0.5); font-family: var(--font-secondary); font-size: 0.8rem; font-weight: 700; letter-spacing: 0.5px; cursor: pointer; transition: all 200ms; white-space: nowrap; }
        .tab-nav-btn.active, .tab-nav-btn:hover { background: rgba(212,175,55,0.1); color: var(--gold); }
        .bracket { display: flex; gap: 24px; align-items: center; overflow-x: auto; padding: 16px 0; }
        .bracket-round { display: flex; flex-direction: column; gap: 20px; min-width: 200px; }
        .bracket-match { padding: 16px; text-align: center; }
        .bracket-team { font-family: var(--font-secondary); font-size: 0.85rem; font-weight: 700; padding: 6px 0; }
        .bracket-vs { font-family: var(--font-heading); font-size: 0.75rem; color: rgba(255,255,255,0.3); padding: 4px 0; }
        .bracket-arrow { font-size: 1.5rem; color: rgba(212,175,55,0.4); flex-shrink: 0; }
        .final-match { border-color: rgba(212,175,55,0.5); }
      `}</style>
    </div>
  )
}
