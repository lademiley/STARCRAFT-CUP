import React from 'react'
import { Link } from 'react-router-dom'
import { committeeMembers } from '../data/mockData'

export default function About() {
  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Home <span>›</span> About</div>
          <h1>About <span className="text-gold">StarCraft Cup</span></h1>
          <p>The story, vision, and mission behind Edo State's premier youth football tournament</p>
        </div>
      </section>

      {/* About + History */}
      <section className="section">
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,alignItems:'center'}}>
            <div>
              <span className="eyebrow">Our Story</span>
              <h2>About StarCraft Cup</h2>
              <p style={{marginBottom:16}}>The StarCraft Cup is a premier youth football tournament organized by the Oredo Local Government Area Football Board in partnership with the Edo State Sports Commission and the Edo State Government.</p>
              <p style={{marginBottom:16}}>Founded to unearth and develop raw U17–U20 talent from every community across Edo State, the tournament brings together one team from each of the state's 18 Local Government Areas, the tournament host, and the defending champion — 20 teams competing for glory on a world-class stage.</p>
              <p>The 2026 Premier Edition marks the founding of a competition designed to grow annually, creating a direct pathway for Edo's finest young players to reach professional football.</p>
            </div>
            <div className="card glass-panel" style={{padding:32}}>
              <h3 style={{color:'var(--gold)',marginBottom:24}}>🏆 Tournament Motto</h3>
              <blockquote style={{fontFamily:'var(--font-heading)',fontSize:'1.4rem',lineHeight:1.5,color:'var(--white)',borderLeft:'3px solid var(--gold)',paddingLeft:20,marginBottom:20}}>
                "Building Champions, Uniting Communities"
              </blockquote>
              <p style={{color:'rgba(255,255,255,0.7)'}}>Every match is a step toward excellence. Every player is a potential legend. Every community in Edo State is part of the legacy.</p>
              <div style={{marginTop:20,display:'flex',flexDirection:'column',gap:10}}>
                {[['📅','Dec 1 – 20, 2026'],['📍','Edo State, Nigeria'],['🧒','U17 – U20 age group'],['👕','20 teams · 4 groups of 5'],['🏟️','Ugbowo Campus Main Bowl + Ogbemudia Main Bowl']].map(([icon,v])=>(
                  <div key={v} style={{display:'flex',gap:10,alignItems:'center',fontSize:'0.85rem',color:'rgba(255,255,255,0.7)'}}>
                    <span>{icon}</span><span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Our Foundation</span>
            <h2>Vision, Mission & Values</h2>
            <div className="divider" />
          </div>
          <div className="grid-3">
            <div className="card" style={{padding:32}}>
              <div style={{fontSize:'3rem',marginBottom:16}}>🌟</div>
              <h3 style={{color:'var(--gold)',marginBottom:12}}>Vision</h3>
              <p>To become the most prestigious youth football tournament in Nigeria, producing world-class U17–U20 players, fostering community development, and elevating Edo State as a centre of sporting excellence across all five annual editions from 2026 to 2030.</p>
            </div>
            <div className="card" style={{padding:32}}>
              <div style={{fontSize:'3rem',marginBottom:16}}>🎯</div>
              <h3 style={{color:'var(--gold)',marginBottom:12}}>Mission</h3>
              <p>To discover, develop, and promote youth football talent (ages U17–U20) from all 18 LGAs in Edo State through a structured, transparent, and world-class tournament that creates opportunities, employment, and community pride.</p>
            </div>
            <div className="card" style={{padding:32}}>
              <div style={{fontSize:'3rem',marginBottom:16}}>💎</div>
              <h3 style={{color:'var(--gold)',marginBottom:12}}>Core Values</h3>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:10}}>
                {['Excellence — in every aspect of organization','Integrity — fair play and transparency','Inclusion — all 18 LGAs represented','Innovation — world-class production standards','Community — football for the people of Edo'].map(v => (
                  <li key={v} style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.7)',paddingLeft:12,borderLeft:'2px solid var(--gold)'}}>✦ {v}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Goals</span>
            <h2>Tournament Objectives</h2>
            <div className="divider" />
          </div>
          <div className="grid-2">
            {[
              { icon:'🌍', title:'Talent Discovery',           desc:'Identify and develop the next generation of Nigerian football stars from all 18 LGAs in Edo State, providing a structured U17–U20 competitive platform.' },
              { icon:'💰', title:'Economic Impact',            desc:'Generate significant economic activity in Edo State through tourism, local business patronage, and job creation across all 20 match days.' },
              { icon:'🤝', title:'LGA Unity',                  desc:'Bring all 18 Local Government Areas together under one flag — representing every Edo community through the universal language of football.' },
              { icon:'🏟️', title:'Infrastructure Development', desc:'Maximize and sustain both the Ugbowo Campus Main Bowl and Ogbemudia Main Bowl for long-term community benefit and future editions.' },
              { icon:'📺', title:'Media Visibility',           desc:'Showcase Edo State youth talent to national and international audiences through broadcast, social media coverage, and the Dec 19 media tour.' },
              { icon:'🌱', title:'Youth Development',          desc:'Provide structured pathways for U17–U20 players to grow, compete, and progress — with scouting opportunities and the StarCraft Elite XI training program.' },
            ].map(o => (
              <div key={o.title} className="card" style={{padding:28,display:'flex',gap:20,alignItems:'flex-start'}}>
                <div style={{fontSize:'2.5rem',flexShrink:0}}>{o.icon}</div>
                <div>
                  <h4 style={{color:'var(--gold)',marginBottom:8}}>{o.title}</h4>
                  <p style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.7)'}}>{o.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Edo */}
      <section className="section section-dark">
        <div className="container">
          <div className="grid-2">
            <div>
              <span className="eyebrow">Location</span>
              <h2>Why Edo State?</h2>
              <p style={{marginBottom:16}}>Edo State has a rich football heritage, having produced numerous Super Eagles legends including John Obi Mikel, Victor Moses, and Osaze Odemwingie.</p>
              <p style={{marginBottom:16}}>With the Edo State Government's strong commitment to sports development, excellent existing infrastructure, and the passion of all 18 LGAs for football, Edo State is the natural home for this annual youth competition.</p>
              <p>The state's 18 diverse LGAs — from Akoko-Edo in the north to Ovia South-West in the south — make it uniquely positioned to host a tournament that truly represents every Edo community.</p>
            </div>
            <div>
              <span className="eyebrow">The Venues</span>
              <h2>Two World-Class Arenas</h2>
              <p style={{marginBottom:16}}>The <strong style={{color:'var(--gold)'}}>Ugbowo Campus Main Bowl</strong> (University of Benin) hosts all group stage, quarter-final, and semi-final action — a dynamic, accessible venue in the heart of Benin City.</p>
              <p style={{marginBottom:16}}>For the Grand Final and Closing Ceremony, the <strong style={{color:'var(--gold)'}}>Ogbemudia Main Bowl</strong> — Nigeria's iconic purpose-built stadium — provides a 20,000-capacity grand stage fit for champions.</p>
              <p>Together, they create the perfect two-venue setup: the Ugbowo Bowl for the journey, the Ogbemudia for the destination.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Organizing Committee */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Leadership</span>
            <h2>Organizing Committee</h2>
            <p>The dedicated team making StarCraft Cup possible</p>
            <div className="divider" />
          </div>
          <div className="grid-3">
            {committeeMembers.map(m => (
              <div key={m.name} className="card" style={{padding:28,textAlign:'center'}}>
                <div style={{width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,var(--burgundy),var(--red-primary))',border:'2px solid var(--gold)',margin:'0 auto 16px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2rem'}}>👤</div>
                <h4 style={{color:'var(--white)',marginBottom:4}}>{m.name}</h4>
                <span className="badge badge-gold" style={{marginBottom:12,fontSize:'0.65rem'}}>{m.role}</span>
                <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.6)'}}>{m.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2026–2030 Roadmap */}
      <section className="section section-dark">
        <div className="container">
          <div style={{maxWidth:900,margin:'0 auto',textAlign:'center'}}>
            <span className="eyebrow">The Future</span>
            <h2>Five-Year Vision: 2026 – 2030</h2>
            <div className="divider" />
            <p style={{margin:'24px 0',fontSize:'1.1rem',color:'rgba(255,255,255,0.8)'}}>The StarCraft Cup is built to last. From a 20-team Premier Edition in 2026, the roadmap scales up to a 32-team continental-calibre event by 2030 — each edition building on the last.</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:16,marginTop:40,textAlign:'left'}}>
              {[
                { year:'2026', title:'Premier Edition',       desc:'20 teams, 4 groups, U17–U20. Establish the template at Ugbowo & Ogbemudia.' },
                { year:'2027', title:'2nd Edition',           desc:'Expand media coverage, introduce scouting combine, grow attendance.' },
                { year:'2028', title:'3rd Edition',           desc:'24 teams (4 × 6), introduce youth U15 sideshow & more national sponsors.' },
                { year:'2029', title:'4th Edition',           desc:'National broadcast deal, player development tracker, community academies.' },
                { year:'2030', title:'5th Edition & Beyond',  desc:'32 teams, CAF recognition, international media coverage, elite youth pathway.' },
              ].map(v => (
                <div key={v.year} className="card" style={{padding:20,borderColor:v.year==='2026'?'rgba(212,175,55,0.5)':'rgba(212,175,55,0.15)',background:v.year==='2026'?'rgba(212,175,55,0.06)':''}}>
                  <div style={{fontFamily:'var(--font-heading)',fontSize:'1.4rem',fontWeight:900,color:'var(--gold)',marginBottom:6}}>{v.year}</div>
                  <h4 style={{color:'var(--white)',marginBottom:8,fontSize:'0.9rem'}}>{v.title}</h4>
                  <p style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.55)'}}>{v.desc}</p>
                  {v.year==='2026'&&<span style={{fontSize:'0.6rem',background:'var(--gold)',color:'#000',padding:'2px 6px',borderRadius:4,fontWeight:900,display:'inline-block',marginTop:4}}>CURRENT</span>}
                </div>
              ))}
            </div>
            <div style={{marginTop:40}}>
              <Link to="/contact" className="btn btn-primary btn-lg" style={{marginRight:16}}>Contact Us</Link>
              <Link to="/sponsors" className="btn btn-secondary btn-lg">Become a Sponsor</Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .eyebrow { font-family: var(--font-secondary); font-size: 0.75rem; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: var(--gold); display: block; margin-bottom: 12px; }
        @media(max-width:768px){ .grid-2{grid-template-columns:1fr} }
      `}</style>
    </div>
  )
}
