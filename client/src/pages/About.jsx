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
          <p>The story, vision, and mission behind Edo State's greatest football tournament</p>
        </div>
      </section>

      {/* About + History */}
      <section className="section">
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:64,alignItems:'center'}}>
            <div>
              <span className="eyebrow">Our Story</span>
              <h2>About StarCraft Cup</h2>
              <p style={{marginBottom:16}}>The StarCraft Cup is a premier grassroots football tournament organized by the Oredo Local Government Area Football Board in partnership with the Edo State Sports Commission and the Edo State Government.</p>
              <p style={{marginBottom:16}}>Founded with the mission of unearthing raw talent from communities across Edo State, the tournament has grown from a modest local competition into a world-class sporting event that attracts scouts, media, and thousands of spectators.</p>
              <p>The 2027 edition marks a significant milestone — featuring 12 clubs, world-class venues, and a prize pool of ₦10 million, making it the richest grassroots football tournament in the South-South region.</p>
            </div>
            <div className="card glass-panel" style={{padding:32}}>
              <h3 style={{color:'var(--gold)',marginBottom:24}}>🏆 Tournament Motto</h3>
              <blockquote style={{fontFamily:'var(--font-heading)',fontSize:'1.4rem',lineHeight:1.5,color:'var(--white)',borderLeft:'3px solid var(--gold)',paddingLeft:20,marginBottom:20}}>
                "Building Champions, Uniting Communities"
              </blockquote>
              <p style={{color:'rgba(255,255,255,0.7)'}}>Every match is a step toward excellence. Every player is a potential legend. Every fan is a part of the legacy.</p>
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
              <p>To become the most prestigious community football tournament in Nigeria, producing world-class players, fostering community development, and elevating the profile of Edo State as a centre of sporting excellence.</p>
            </div>
            <div className="card" style={{padding:32}}>
              <div style={{fontSize:'3rem',marginBottom:16}}>🎯</div>
              <h3 style={{color:'var(--gold)',marginBottom:12}}>Mission</h3>
              <p>To discover, develop, and promote football talent in Edo State through a structured, transparent, and world-class tournament that provides opportunities for young players, creates employment, and builds community pride.</p>
            </div>
            <div className="card" style={{padding:32}}>
              <div style={{fontSize:'3rem',marginBottom:16}}>💎</div>
              <h3 style={{color:'var(--gold)',marginBottom:12}}>Core Values</h3>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:10}}>
                {['Excellence — in every aspect of organization','Integrity — fair play and transparency','Inclusion — every community represented','Innovation — world-class production standards','Community — football for the people'].map(v => (
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
              { icon:'🌍', title:'Talent Discovery', desc:'Identify and develop the next generation of Nigerian football stars from Edo State communities.' },
              { icon:'💰', title:'Economic Impact', desc:'Generate significant economic activity through tourism, local business patronage, and job creation.' },
              { icon:'🤝', title:'Community Unity', desc:'Bring together communities across Oredo LGA and wider Edo State through the universal language of football.' },
              { icon:'🏟️', title:'Infrastructure Development', desc:'Improve and sustain sports facilities in Edo State for long-term community benefit.' },
              { icon:'📺', title:'Media Visibility', desc:'Showcase Edo State talent to national and international audiences through broadcast and social media coverage.' },
              { icon:'🌱', title:'Youth Development', desc:'Provide structured pathways for young players to grow, compete, and progress to professional football.' },
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

      {/* Why Edo / Oredo */}
      <section className="section section-dark">
        <div className="container">
          <div className="grid-2">
            <div>
              <span className="eyebrow">Location</span>
              <h2>Why Edo State?</h2>
              <p style={{marginBottom:16}}>Edo State has a rich football heritage, having produced numerous Super Eagles players including John Obi Mikel, Victor Moses, and Osaze Odemwingie.</p>
              <p style={{marginBottom:16}}>With the Edo State Government's strong commitment to sports development and excellent existing infrastructure including the Samuel Ogbemudia Stadium, Edo State is the natural home for a premier tournament.</p>
              <p>The state's central location in the South-South region also makes it accessible to talent from across the Niger Delta.</p>
            </div>
            <div>
              <span className="eyebrow">The Venue</span>
              <h2>Why Oredo LGA?</h2>
              <p style={{marginBottom:16}}>Oredo Local Government Area sits at the heart of Benin City — a densely populated, football-passionate community with a proud sporting tradition.</p>
              <p style={{marginBottom:16}}>The presence of the University of Benin provides a world-class secondary venue with its Ugbowo Bowl, while the Samuel Ogbemudia Stadium — Nigeria's second oldest purpose-built stadium — provides a grand Final venue.</p>
              <p>Oredo LGA's football heritage and enthusiastic community made it the ideal host for StarCraft Cup.</p>
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

      {/* Long-term Vision */}
      <section className="section section-dark">
        <div className="container">
          <div style={{maxWidth:800,margin:'0 auto',textAlign:'center'}}>
            <span className="eyebrow">The Future</span>
            <h2>Long-term Vision & Sustainability</h2>
            <div className="divider" />
            <p style={{margin:'24px 0',fontSize:'1.1rem',color:'rgba(255,255,255,0.8)'}}>The StarCraft Cup is not a one-off event. Our long-term vision is to establish an annual fixture on Nigeria's football calendar, with each edition growing in scale, prize money, and international recognition.</p>
            <div className="grid-3" style={{marginTop:40,textAlign:'left'}}>
              {[
                { year:'2027', title:'Foundation Year', desc:'Establish the template: 12 teams, world-class production, ₦10M prize.' },
                { year:'2028', title:'Expansion', desc:'Expand to 16 teams, introduce youth categories, and attract more national sponsors.' },
                { year:'2030+', title:'International Recognition', desc:'Attract CHAN-eligible players, international media coverage, and CAF recognition.' },
              ].map(v => (
                <div key={v.year} className="card" style={{padding:24}}>
                  <div style={{fontFamily:'var(--font-heading)',fontSize:'1.5rem',fontWeight:900,color:'var(--gold)',marginBottom:8}}>{v.year}</div>
                  <h4 style={{color:'var(--white)',marginBottom:8}}>{v.title}</h4>
                  <p style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.6)'}}>{v.desc}</p>
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
