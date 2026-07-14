import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { fixtures, placementPrizes, specialAwards, matchBonus, teams, editions } from '../data/mockData'

// Day-by-day schedule Dec 1–20, 2026
const schedule = [
  { date: '2026-12-01', day: 'Dec 1',  event: '🎉 Opening Ceremony',                               venue: 'Ugbowo Campus Main Bowl',  special: 'LGA Chairman XI vs Ex-Bendel Insurance XI (Exhibition)', type: 'ceremony' },
  { date: '2026-12-02', day: 'Dec 2',  event: 'Group Stage — Matchday 1 (4 matches)',              venue: 'Ugbowo Campus Main Bowl',  type: 'group' },
  { date: '2026-12-03', day: 'Dec 3',  event: 'Group Stage — Matchday 1 cont. (4 matches)',        venue: 'Ugbowo Campus Main Bowl',  type: 'group' },
  { date: '2026-12-04', day: 'Dec 4',  event: 'Group Stage — Matchday 2 (4 matches)',              venue: 'Ugbowo Campus Main Bowl',  type: 'group' },
  { date: '2026-12-05', day: 'Dec 5',  event: 'Group Stage — Matchday 2 cont. (4 matches)',        venue: 'Ugbowo Campus Main Bowl',  type: 'group' },
  { date: '2026-12-06', day: 'Dec 6',  event: 'Group Stage — Matchday 3 (4 matches)',              venue: 'Ugbowo Campus Main Bowl',  type: 'group' },
  { date: '2026-12-07', day: 'Dec 7',  event: 'Group Stage — Matchday 3 cont. (4 matches)',        venue: 'Ugbowo Campus Main Bowl',  type: 'group' },
  { date: '2026-12-08', day: 'Dec 8',  event: 'Group Stage — Matchday 4 (4 matches)',              venue: 'Ugbowo Campus Main Bowl',  type: 'group' },
  { date: '2026-12-09', day: 'Dec 9',  event: 'Group Stage — Matchday 4 cont. (4 matches)',        venue: 'Ugbowo Campus Main Bowl',  type: 'group' },
  { date: '2026-12-10', day: 'Dec 10', event: 'Group Stage — Final Matchday (4 matches)',          venue: 'Ugbowo Campus Main Bowl',  type: 'group' },
  { date: '2026-12-11', day: 'Dec 11', event: 'Group Stage — Final Matchday cont. (4 matches)',    venue: 'Ugbowo Campus Main Bowl',  type: 'group' },
  { date: '2026-12-12', day: 'Dec 12', event: 'Group Stage — Closing Matchday (4 matches)',        venue: 'Ugbowo Campus Main Bowl',  type: 'group' },
  { date: '2026-12-13', day: 'Dec 13', event: '🛌 Rest Day',                                       venue: '—',                        type: 'rest' },
  { date: '2026-12-14', day: 'Dec 14', event: '⚔️ Quarter-Finals (4 matches)',                     venue: 'Ugbowo Campus Main Bowl',  type: 'knockout' },
  { date: '2026-12-15', day: 'Dec 15', event: '🛌 Rest Day',                                       venue: '—',                        type: 'rest' },
  { date: '2026-12-16', day: 'Dec 16', event: '🥊 Semi-Finals (2 matches)',                         venue: 'Ugbowo Campus Main Bowl',  type: 'knockout' },
  { date: '2026-12-17', day: 'Dec 17', event: '🛌 Rest Day',                                       venue: '—',                        type: 'rest' },
  { date: '2026-12-18', day: 'Dec 18', event: '🏆 Grand Final + 3rd Place Play-Off',               venue: 'Ogbemudia Main Bowl',      type: 'final' },
  { date: '2026-12-19', day: 'Dec 19', event: '🎬 Media Tour + StarCraft Elite XI Training',        venue: 'Ugbowo Campus Main Bowl',  type: 'media' },
  { date: '2026-12-20', day: 'Dec 20', event: '🎊 Closing Ceremony — Bendel Insurance vs StarCraft Elite XI', venue: 'Ogbemudia Main Bowl', type: 'ceremony' },
]

const rules = [
  { rule: 'Players must be aged U17 to U20 (born between 2006 and 2009).' },
  { rule: 'Each team must register a squad of 18 players with valid NIN or student ID.' },
  { rule: 'Players must have verifiable ties to the LGA they represent.' },
  { rule: 'Matches are 90 minutes (two halves of 45 minutes).' },
  { rule: 'Knockout matches level at full time proceed to extra time (30 mins), then penalty shootout.' },
  { rule: 'A player receiving 2 yellow cards in the tournament is suspended for one match.' },
  { rule: 'A player receiving a red card is suspended for a minimum of one match.' },
  { rule: 'Teams must arrive at the venue at least 60 minutes before kickoff.' },
  { rule: 'All disputes are resolved by the Tournament Technical Committee.' },
  { rule: 'Anti-doping regulations as per NADAC guidelines apply to all players.' },
  { rule: 'The host LGA and defending champion are guaranteed automatic entry each edition.' },
]

const venues = [
  {
    name: 'Ugbowo Campus Main Bowl',
    capacity: '10,000',
    surface: 'Hybrid Grass',
    facilities: 'Changing rooms, Medical bay, VIP lounge, Floodlights',
    role: 'Group Stage, Quarter-Finals & Semi-Finals',
    matches: 'Dec 2–12 (Group Stage) • Dec 14 (QF) • Dec 16 (SF)',
    image: '/venue-ugbowo.jpg'
  },
  {
    name: 'Ogbemudia Main Bowl',
    capacity: '20,000',
    surface: 'Natural Grass',
    facilities: 'Full broadcast suite, Press box, VIP suites, LED screens',
    role: 'Grand Final & Closing Ceremony',
    matches: 'Dec 18 (Final + 3rd Place) • Dec 20 (Closing)',
    image: '/venue-ogbemudia.jpg'
  },
]

const typeStyle = {
  ceremony: { bg: 'rgba(212,175,55,0.15)', border: 'rgba(212,175,55,0.4)', color: 'var(--gold)', badge: 'CEREMONY' },
  group:    { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)', color: '#60A5FA',     badge: 'GROUP STAGE' },
  rest:     { bg: 'rgba(255,255,255,0.03)',border: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)', badge: 'REST' },
  knockout: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', color: '#F87171',     badge: 'KNOCKOUT' },
  final:    { bg: 'rgba(212,175,55,0.2)', border: 'rgba(212,175,55,0.6)', color: 'var(--gold)', badge: '🏆 FINAL' },
  media:    { bg: 'rgba(139,92,246,0.08)',border: 'rgba(139,92,246,0.2)', color: '#A78BFA',     badge: 'MEDIA' },
}

export default function Tournament() {
  const [activeTab, setActiveTab] = useState('format')
  const [activeEdition, setActiveEdition] = useState(2026)

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Home <span>›</span> Tournament</div>
          <h1>The <span className="text-gold">Tournament</span></h1>
          <p>Competition format, schedule, rules, venues, and prize structure</p>
        </div>
      </section>

      {/* Edition Selector */}
      <div style={{background:'rgba(10,1,2,0.9)',borderBottom:'1px solid rgba(212,175,55,0.12)',padding:'16px 0'}}>
        <div className="container">
          <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
            <span style={{fontFamily:'var(--font-secondary)',fontSize:'0.7rem',fontWeight:700,letterSpacing:'3px',color:'rgba(255,255,255,0.4)',textTransform:'uppercase',flexShrink:0}}>Edition</span>
            {editions.map(ed => (
              <button
                key={ed.year}
                onClick={() => setActiveEdition(ed.year)}
                style={{
                  padding:'6px 18px', borderRadius:20,
                  border: `1px solid ${activeEdition===ed.year ? 'rgba(212,175,55,0.6)' : 'rgba(255,255,255,0.1)'}`,
                  background: activeEdition===ed.year ? 'rgba(212,175,55,0.15)' : 'transparent',
                  color: activeEdition===ed.year ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
                  fontFamily:'var(--font-secondary)', fontSize:'0.78rem', fontWeight:700,
                  cursor: ed.status==='current'||ed.status==='upcoming' ? 'pointer' : 'default',
                  transition:'all 200ms',
                  display:'flex',alignItems:'center',gap:6,
                }}
              >
                {ed.year}
                {ed.status==='current' && <span style={{fontSize:'0.55rem',background:'var(--gold)',color:'#000',borderRadius:4,padding:'1px 4px',fontWeight:900}}>LIVE</span>}
                {ed.status==='future' && <span style={{fontSize:'0.55rem',color:'rgba(255,255,255,0.3)'}}>TBD</span>}
              </button>
            ))}
          </div>
          {/* Edition info banner */}
          {(() => {
            const ed = editions.find(e => e.year === activeEdition)
            if (!ed) return null
            return (
              <div style={{marginTop:12,padding:'10px 16px',background:'rgba(212,175,55,0.06)',border:'1px solid rgba(212,175,55,0.12)',borderRadius:10,display:'flex',gap:32,flexWrap:'wrap'}}>
                {[['📅 Dates', ed.dates],['👕 Teams', `${ed.teams} teams`],['📊 Groups', ed.groups],['🧒 Age Group', ed.ageGroup],['🏷️ Status', ed.label]].map(([k,v]) => (
                  <div key={k} style={{display:'flex',flexDirection:'column',gap:2}}>
                    <span style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.35)',fontFamily:'var(--font-secondary)',fontWeight:600,letterSpacing:'1px'}}>{k}</span>
                    <span style={{fontSize:'0.82rem',fontWeight:700,color:k.includes('Status')&&activeEdition===2026?'var(--gold)':'var(--white)'}}>{v}</span>
                  </div>
                ))}
              </div>
            )
          })()}
        </div>
      </div>

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
              <h2>Competition Format — Premier Edition</h2>
              <p>20 teams from Edo State's 18 LGAs battle through 4 groups to the Grand Final</p>
              <div className="divider" />
            </div>

            {/* Age-group banner */}
            <div style={{background:'linear-gradient(135deg,rgba(212,175,55,0.1),rgba(139,11,18,0.2))',border:'1px solid rgba(212,175,55,0.25)',borderRadius:16,padding:'20px 28px',marginBottom:40,display:'flex',gap:32,flexWrap:'wrap',alignItems:'center'}}>
              {[['🧒 Age Group','U17 – U20'],['👕 Teams','20 (18 LGAs + Host + Defending Champion)'],['📊 Format','4 Groups × 5 teams'],['📅 Duration','Dec 1 – 20, 2026'],['📍 Location','Edo State, Nigeria']].map(([l,v]) => (
                <div key={l}>
                  <div style={{fontSize:'0.65rem',color:'rgba(255,255,255,0.4)',fontFamily:'var(--font-secondary)',fontWeight:700,letterSpacing:'1px',marginBottom:4}}>{l}</div>
                  <div style={{fontWeight:700,color:'var(--gold)',fontSize:'0.9rem'}}>{v}</div>
                </div>
              ))}
            </div>

            <div className="grid-3" style={{marginBottom:48}}>
              {[
                { phase:'Group Stage',        icon:'📊', desc:'20 teams split into 4 groups of 5. Round-robin format — each team plays 4 matches. Top 2 from each group advance to the quarter-finals (8 teams total). Dec 2–12.' },
                { phase:'Quarter-Finals',     icon:'⚔️', desc:'4 quarter-finals on Dec 14 at Ugbowo Campus Main Bowl. Single-leg knockout. Group A winner vs Group B runner-up, and vice versa; same for Groups C & D.' },
                { phase:'Semi-Finals',        icon:'🥊', desc:'2 semi-finals on Dec 16 at Ugbowo Campus Main Bowl determine the finalists and third-place play-off teams. Single-leg, extra time + penalties if level.' },
                { phase:'3rd Place Play-Off', icon:'🥉', desc:'Semi-final losers meet on Dec 18 at Ogbemudia Main Bowl for the bronze medal and ₦1,000,000.' },
                { phase:'Grand Final',        icon:'🏆', desc:'The ultimate match on Dec 18 at Ogbemudia Main Bowl in front of 20,000 fans. The winner lifts the StarCraft Cup Premier Edition trophy.' },
                { phase:'Closing Exhibition', icon:'🎊', desc:'Dec 20 — Bendel Insurance face StarCraft Elite XI in a special closing match to cap the Premier Edition celebrations at Ogbemudia Main Bowl.' },
              ].map(p => (
                <div key={p.phase} className="card" style={{padding:28}}>
                  <div style={{fontSize:'2.5rem',marginBottom:14}}>{p.icon}</div>
                  <h4 style={{color:'var(--gold)',marginBottom:8}}>{p.phase}</h4>
                  <p style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.7)'}}>{p.desc}</p>
                </div>
              ))}
            </div>

            {/* Group Tables */}
            <h3 style={{color:'var(--gold)',marginBottom:24,textAlign:'center'}}>Group Stage Standings</h3>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:24,marginBottom:48}}>
              {['A','B','C','D'].map(grp => (
                <div key={grp}>
                  <h4 style={{color:'var(--gold)',marginBottom:12,fontFamily:'var(--font-heading)',letterSpacing:'1px'}}>Group {grp}</h4>
                  <div className="table-wrapper card" style={{padding:0}}>
                    <table>
                      <thead><tr><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th></tr></thead>
                      <tbody>
                        {teams.filter(t=>t.group===grp).sort((a,b)=>b.points-a.points).map((t,i) => (
                          <tr key={t.id} style={{background:i<2?'rgba(212,175,55,0.04)':''}}>
                            <td>
                              <div style={{display:'flex',alignItems:'center',gap:6}}>
                                {i<2&&<span title="Qualifies" style={{color:'var(--gold)',fontSize:'0.65rem',fontWeight:900}}>Q</span>}
                                <span>{t.logo}</span>
                                <span style={{fontWeight:600,fontSize:'0.8rem'}}>{t.name}</span>
                              </div>
                            </td>
                            <td style={{fontSize:'0.8rem'}}>{t.played}</td>
                            <td style={{fontSize:'0.8rem'}}>{t.won}</td>
                            <td style={{fontSize:'0.8rem'}}>{t.draw}</td>
                            <td style={{fontSize:'0.8rem'}}>{t.lost}</td>
                            <td style={{fontSize:'0.8rem',color:t.gd>0?'#2ecc71':t.gd<0?'#ef4444':'inherit'}}>{t.gd>0?'+':''}{t.gd}</td>
                            <td><strong style={{color:'var(--gold)',fontSize:'0.85rem'}}>{t.points}</strong></td>
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
                  <div className="bracket-label">Quarter-Finals · Dec 14</div>
                  {fixtures.filter(f=>f.round==='Quarter-Final').map(f => (
                    <div key={f.id} className="bracket-match card">
                      <div className="bracket-team">{teams.find(t=>t.name===f.homeTeam)?.logo||'⚽'} {f.homeTeam}</div>
                      <div className="bracket-vs">vs</div>
                      <div className="bracket-team">{teams.find(t=>t.name===f.awayTeam)?.logo||'⚽'} {f.awayTeam}</div>
                      <div style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.35)',marginTop:6}}>🏟️ Ugbowo Campus Main Bowl</div>
                    </div>
                  ))}
                </div>
                <div className="bracket-arrow">→</div>
                <div className="bracket-round">
                  <div className="bracket-label">Semi-Finals · Dec 16</div>
                  {[1,2].map(n => (
                    <div key={n} className="bracket-match card" style={{opacity:0.6}}>
                      <div className="bracket-team">TBD</div>
                      <div className="bracket-vs">vs</div>
                      <div className="bracket-team">TBD</div>
                      <div style={{fontSize:'0.7rem',color:'rgba(255,255,255,0.35)',marginTop:6}}>🏟️ Ugbowo Campus Main Bowl</div>
                    </div>
                  ))}
                </div>
                <div className="bracket-arrow">→</div>
                <div className="bracket-round">
                  <div className="bracket-label">Grand Final · Dec 18</div>
                  <div className="bracket-match card final-match" style={{opacity:0.7}}>
                    <div className="bracket-team">🏆 TBD</div>
                    <div className="bracket-vs" style={{color:'var(--gold)'}}>FINAL</div>
                    <div className="bracket-team">🏆 TBD</div>
                    <div style={{fontSize:'0.7rem',color:'var(--gold)',marginTop:6}}>🏟️ Ogbemudia Main Bowl</div>
                  </div>
                  <div className="bracket-match card" style={{opacity:0.5,marginTop:12}}>
                    <div className="bracket-team">🥉 TBD</div>
                    <div className="bracket-vs" style={{fontSize:'0.65rem'}}>3RD PLACE</div>
                    <div className="bracket-team">🥉 TBD</div>
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
              <span className="eyebrow">Dec 1 – 20, 2026</span>
              <h2>Full Tournament Schedule</h2>
              <p>20 days of football, ceremony, and celebration</p>
              <div className="divider" />
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {schedule.map((s,i) => {
                const ts = typeStyle[s.type] || typeStyle.group
                return (
                  <div key={i} className="card" style={{padding:'16px 24px',display:'flex',alignItems:'flex-start',gap:20,borderColor:ts.border,background:ts.bg}}>
                    <div style={{flexShrink:0,textAlign:'center',background:'rgba(0,0,0,0.3)',border:`1px solid ${ts.border}`,borderRadius:10,padding:'10px 14px',minWidth:70}}>
                      <div style={{fontFamily:'var(--font-heading)',fontSize:'1.3rem',fontWeight:900,color:ts.color}}>{s.day.split(' ')[1]}</div>
                      <div style={{fontFamily:'var(--font-secondary)',fontSize:'0.6rem',fontWeight:700,letterSpacing:'1px',color:'rgba(255,255,255,0.4)'}}>DEC</div>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
                        <span style={{fontFamily:'var(--font-secondary)',fontWeight:700,fontSize:'0.92rem',color:s.type==='rest'?'rgba(255,255,255,0.4)':ts.color}}>{s.event}</span>
                        <span style={{fontSize:'0.6rem',fontFamily:'var(--font-secondary)',fontWeight:800,letterSpacing:'1px',padding:'2px 8px',borderRadius:4,background:ts.border,color:s.type==='rest'?'rgba(255,255,255,0.3)':'rgba(0,0,0,0.7)'}}>{ts.badge}</span>
                      </div>
                      {s.special && <div style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.6)',marginBottom:4}}>⚽ {s.special}</div>}
                      {s.venue !== '—' && <div style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.35)'}}>🏟️ {s.venue}</div>}
                    </div>
                  </div>
                )
              })}
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

            {/* Age eligibility highlight */}
            <div style={{background:'rgba(212,175,55,0.08)',border:'1px solid rgba(212,175,55,0.3)',borderRadius:14,padding:'20px 28px',marginBottom:32,display:'flex',gap:16,alignItems:'center'}}>
              <span style={{fontSize:'2.5rem'}}>🧒</span>
              <div>
                <div style={{fontWeight:700,color:'var(--gold)',marginBottom:4}}>Age Eligibility: U17 – U20</div>
                <div style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.7)'}}>All participating players must be born between 2006 and 2009 (inclusive). Valid NIN or student ID required. This is a youth-development competition open exclusively to Nigeria's next generation of football talent.</div>
              </div>
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
              <span className="eyebrow">Stadiums — Edo State, Nigeria</span>
              <h2>Match Venues</h2>
              <p>Two world-class Edo State venues hosting the Premier Edition</p>
              <div className="divider" />
            </div>
            <div className="grid-2">
              {venues.map(v => (
                <div key={v.name} className="card" style={{padding:0,overflow:'hidden'}}>
                  <div style={{height:200,overflow:'hidden',position:'relative'}}>
                    <img src={v.image} alt={v.name} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',display:'block'}} />
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(to bottom, transparent 40%, rgba(10,2,2,0.75) 100%)'}} />
                  </div>
                  <div style={{padding:28}}>
                    <span className="badge badge-gold" style={{marginBottom:12,display:'inline-block'}}>{v.role}</span>
                    <h3 style={{color:'var(--white)',marginBottom:8}}>{v.name}</h3>
                    <div style={{fontSize:'0.82rem',color:'rgba(255,255,255,0.5)',marginBottom:16}}>📅 {v.matches}</div>
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
            <div style={{marginTop:32,padding:'20px 28px',background:'rgba(212,175,55,0.06)',border:'1px solid rgba(212,175,55,0.15)',borderRadius:14}}>
              <p style={{color:'rgba(255,255,255,0.7)',fontSize:'0.9rem',margin:0}}>
                📍 <strong style={{color:'var(--gold)'}}>All venues are in Edo State, Nigeria.</strong> Ugbowo Campus Main Bowl hosts all group stage, quarter-final, and semi-final matches. The Ogbemudia Main Bowl steps up for the Grand Final, Third Place Play-Off, and Closing Ceremony — providing a 20,000-capacity stage fit for champions.
              </p>
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
              <p>Team placement prizes, individual honours, and match-day bonuses</p>
              <div className="divider" />
            </div>

            {/* Team Placement Prizes */}
            <h3 style={{color:'var(--gold)',marginBottom:20,textAlign:'center'}}>🏆 Team Placement Prizes</h3>
            <div style={{maxWidth:700,margin:'0 auto',display:'flex',flexDirection:'column',gap:12,marginBottom:56}}>
              {placementPrizes.map((p,i) => (
                <div key={i} className={`card prize-row ${i<3?'top-prize':''}`} style={{padding:'20px 28px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,borderColor:i===0?'rgba(212,175,55,0.6)':i===1?'rgba(192,192,192,0.3)':i===2?'rgba(158,91,40,0.4)':'rgba(212,175,55,0.15)'}}>
                  <div>
                    <div style={{fontFamily:'var(--font-secondary)',fontWeight:700,fontSize:'0.95rem',marginBottom:4}}>{p.position}</div>
                    <div style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.5)'}}>{p.additional}</div>
                  </div>
                  <div style={{fontFamily:'var(--font-heading)',fontSize:'1.5rem',fontWeight:900,color:i===0?'var(--gold)':i===1?'#c0c0c0':i===2?'var(--bronze)':'var(--white)',flexShrink:0}}>{p.prize}</div>
                </div>
              ))}
            </div>

            {/* Individual & Special Awards */}
            <h3 style={{color:'var(--gold)',marginBottom:20,textAlign:'center'}}>🎖️ Individual & Special Awards</h3>
            <div className="grid-3" style={{marginBottom:56}}>
              {specialAwards.map((a,i) => (
                <div key={i} className="card" style={{padding:'22px 24px',display:'flex',gap:14,alignItems:'flex-start'}}>
                  <span style={{fontSize:'1.6rem',flexShrink:0}}>{a.icon}</span>
                  <div>
                    <div style={{fontFamily:'var(--font-secondary)',fontWeight:700,fontSize:'0.9rem',marginBottom:4,color:'var(--white)'}}>{a.title}</div>
                    <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.55)',marginBottom:a.prize?6:0}}>{a.description}</div>
                    {a.prize && <div style={{fontFamily:'var(--font-heading)',fontWeight:900,color:'var(--gold)',fontSize:'1rem'}}>{a.prize}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Match Bonuses & Discipline */}
            <h3 style={{color:'var(--gold)',marginBottom:20,textAlign:'center'}}>💵 Match Bonuses & Discipline</h3>
            <div style={{maxWidth:700,margin:'0 auto'}}>
              <div className="card" style={{padding:'24px 28px',marginBottom:16,display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,borderColor:'rgba(212,175,55,0.3)'}}>
                <div>
                  <div style={{fontFamily:'var(--font-secondary)',fontWeight:700,fontSize:'0.95rem',marginBottom:4}}>Match Bonus</div>
                  <div style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.5)'}}>{matchBonus.perLabel}</div>
                </div>
                <div style={{fontFamily:'var(--font-heading)',fontSize:'1.5rem',fontWeight:900,color:'var(--gold)',flexShrink:0}}>{matchBonus.amount}</div>
              </div>
              {matchBonus.deductions.map((d,i) => (
                <div key={i} className="card" style={{padding:'16px 28px',marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,borderColor:'rgba(239,68,68,0.2)'}}>
                  <div>
                    <div style={{fontFamily:'var(--font-secondary)',fontWeight:700,fontSize:'0.88rem',marginBottom:4}}>{d.card}</div>
                    <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.5)'}}>{d.note}</div>
                  </div>
                  <div style={{fontFamily:'var(--font-heading)',fontSize:'1.2rem',fontWeight:900,color:'#F87171',flexShrink:0}}>-{d.amount}</div>
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
        .bracket { display: flex; gap: 24px; align-items: flex-start; overflow-x: auto; padding: 16px 0; }
        .bracket-round { display: flex; flex-direction: column; gap: 16px; min-width: 210px; }
        .bracket-label { color: rgba(255,255,255,0.5); font-family: var(--font-secondary); font-size: 0.65rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; text-align: center; }
        .bracket-match { padding: 14px; text-align: center; }
        .bracket-team { font-family: var(--font-secondary); font-size: 0.82rem; font-weight: 700; padding: 5px 0; }
        .bracket-vs { font-family: var(--font-heading); font-size: 0.7rem; color: rgba(255,255,255,0.3); padding: 3px 0; }
        .bracket-arrow { font-size: 1.5rem; color: rgba(212,175,55,0.4); flex-shrink: 0; margin-top: 80px; }
        .final-match { border-color: rgba(212,175,55,0.5); }
      `}</style>
    </div>
  )
}
