import React, { useState } from 'react'
import { sponsors } from '../data/mockData'

export default function Sponsors() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Home <span>›</span> Sponsors</div>
          <h1>Our <span className="text-gold">Sponsors</span></h1>
          <p>The partners who make StarCraft Cup 2027 possible</p>
        </div>
      </section>

      {/* Platinum */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Highest Tier</span>
            <h2>Platinum Sponsors</h2>
            <div className="divider" />
          </div>
          <div className="grid-2">
            {sponsors.platinum.map(s => (
              <div key={s.name} className="card sponsor-card-lg">
                <div className="sponsor-logo-area platinum-bg">
                  <span style={{fontSize:'4rem'}}>{s.logo}</span>
                </div>
                <div style={{padding:28}}>
                  <span className="badge" style={{background:'rgba(212,175,55,0.2)',color:'var(--gold)',border:'1px solid rgba(212,175,55,0.4)',marginBottom:12,display:'inline-block',fontSize:'0.65rem',fontWeight:700,padding:'4px 14px',borderRadius:30}}>PLATINUM SPONSOR</span>
                  <h3 style={{color:'var(--gold)',marginBottom:8}}>{s.name}</h3>
                  <p style={{color:'rgba(255,255,255,0.7)',marginBottom:16}}>{s.description}</p>
                  <a href={s.website} className="btn btn-secondary btn-sm">Visit Website →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gold */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Premium Tier</span>
            <h2>Gold Sponsors</h2>
            <div className="divider" />
          </div>
          <div className="grid-3">
            {sponsors.gold.map(s => (
              <div key={s.name} className="card" style={{padding:0,overflow:'hidden'}}>
                <div style={{height:120,background:'linear-gradient(135deg,rgba(140,106,18,0.3),rgba(212,175,55,0.1))',display:'flex',alignItems:'center',justifyContent:'center',borderBottom:'1px solid rgba(212,175,55,0.15)'}}>
                  <span style={{fontSize:'3rem'}}>{s.logo}</span>
                </div>
                <div style={{padding:20}}>
                  <span className="badge badge-gold" style={{marginBottom:10,display:'inline-block',fontSize:'0.6rem'}}>GOLD SPONSOR</span>
                  <h4 style={{color:'var(--white)',marginBottom:6}}>{s.name}</h4>
                  <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.6)'}}>{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Silver */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Supporting Tier</span>
            <h2>Silver Sponsors</h2>
            <div className="divider" />
          </div>
          <div className="grid-4">
            {sponsors.silver.map(s => (
              <div key={s.name} className="card" style={{padding:24,textAlign:'center'}}>
                <div style={{fontSize:'2.5rem',marginBottom:10}}>{s.logo}</div>
                <span className="badge" style={{background:'rgba(192,192,192,0.1)',color:'#c0c0c0',border:'1px solid rgba(192,192,192,0.25)',marginBottom:10,display:'inline-block',fontSize:'0.6rem',fontWeight:700,padding:'3px 12px',borderRadius:30}}>SILVER</span>
                <h4 style={{color:'var(--white)',marginBottom:4,fontSize:'0.9rem'}}>{s.name}</h4>
                <p style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.5)'}}>{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Partners */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Official Partners</span>
            <h2>Tournament Partners</h2>
            <div className="divider" />
          </div>
          <div style={{display:'flex',justifyContent:'center',flexWrap:'wrap',gap:20}}>
            {sponsors.official.map(s => (
              <div key={s.name} className="card" style={{padding:'20px 28px',display:'flex',alignItems:'center',gap:14,minWidth:200}}>
                <span style={{fontSize:'2rem'}}>{s.logo}</span>
                <div>
                  <div style={{fontWeight:700,fontSize:'0.9rem'}}>{s.name}</div>
                  <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.5)'}}>{s.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsor Benefits */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Partnership</span>
            <h2>Sponsorship Benefits</h2>
            <p>Why sponsoring StarCraft Cup is the right investment</p>
            <div className="divider" />
          </div>
          <div className="grid-3">
            {[
              { icon:'👥', title:'Massive Reach', desc:'Direct access to 47,500+ match attendees and 200,000+ social media followers across Nigeria.' },
              { icon:'📺', title:'Broadcast Coverage', desc:'Brand visibility on Supersport, Channels TV, and Silverbird Television throughout the tournament.' },
              { icon:'🏆', title:'Brand Association', desc:"Associate your brand with excellence, youth development, and Nigeria's brightest football talent." },
              { icon:'🤝', title:'Community Goodwill', desc:'Build deep community goodwill by investing in the development of sport in Edo State.' },
              { icon:'📱', title:'Digital Exposure', desc:'Prominent placement on website, social media, email campaigns, and official tournament app.' },
              { icon:'🎖️', title:'Exclusive Access', desc:'VIP match tickets, access to players and coaches, and exclusive sponsor events.' },
            ].map(b => (
              <div key={b.title} className="card" style={{padding:28}}>
                <div style={{fontSize:'2.5rem',marginBottom:14}}>{b.icon}</div>
                <h4 style={{color:'var(--gold)',marginBottom:8}}>{b.title}</h4>
                <p style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.7)'}}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Sponsor */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Join Us</span>
            <h2>Become a Sponsor</h2>
            <p>Partner with StarCraft Cup 2027 and be part of football history</p>
            <div className="divider" />
          </div>

          {/* Packages */}
          <div className="grid-3" style={{marginBottom:48}}>
            {[
              { tier:'Platinum', price:'₦5,000,000', color:'var(--gold)', perks:['Main shirt logo','TV broadcast mentions','10 VIP tickets per match','Full digital package','Exclusive sponsor event'] },
              { tier:'Gold', price:'₦2,000,000', color:'#FFD700', perks:['Shirt sleeve logo','Match programme full page','6 VIP tickets per match','Social media features','Sponsor networking'] },
              { tier:'Silver', price:'₦750,000', color:'#c0c0c0', perks:['Perimeter board advertising','Match programme half page','4 tickets per match','Website logo placement','Newsletter mention'] },
            ].map((p,i) => (
              <div key={p.tier} className="card" style={{padding:32,textAlign:'center',borderColor:i===0?'rgba(212,175,55,0.6)':'',position:'relative'}}>
                {i===0 && <div className="ribbon">MOST POPULAR</div>}
                <div style={{fontSize:'2.5rem',marginBottom:8}}>{i===0?'🥇':i===1?'🥈':'🥉'}</div>
                <h3 style={{color:p.color,marginBottom:4}}>{p.tier}</h3>
                <div style={{fontFamily:'var(--font-heading)',fontSize:'2rem',fontWeight:900,color:'var(--white)',margin:'16px 0 24px'}}>{p.price}</div>
                <ul style={{list:'none',display:'flex',flexDirection:'column',gap:10,marginBottom:28,textAlign:'left'}}>
                  {p.perks.map(perk => (
                    <li key={perk} style={{display:'flex',gap:10,alignItems:'center',fontSize:'0.85rem',color:'rgba(255,255,255,0.75)'}}>
                      <span style={{color:p.color}}>✦</span>{perk}
                    </li>
                  ))}
                </ul>
                <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={()=>setShowForm(true)}>Choose {p.tier}</button>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          {showForm && (
            <div className="card glass-panel" style={{maxWidth:600,margin:'0 auto',padding:40}}>
              <h3 style={{color:'var(--gold)',marginBottom:24,textAlign:'center'}}>Sponsorship Enquiry</h3>
              <div className="grid-2">
                <div className="form-group"><label>Company Name</label><input type="text" className="form-control" placeholder="Your company" /></div>
                <div className="form-group"><label>Contact Person</label><input type="text" className="form-control" placeholder="Full name" /></div>
                <div className="form-group"><label>Email Address</label><input type="email" className="form-control" placeholder="email@company.com" /></div>
                <div className="form-group"><label>Phone Number</label><input type="tel" className="form-control" placeholder="+234..." /></div>
              </div>
              <div className="form-group">
                <label>Sponsorship Package</label>
                <select className="form-control">
                  <option>Platinum – ₦5,000,000</option>
                  <option>Gold – ₦2,000,000</option>
                  <option>Silver – ₦750,000</option>
                  <option>Custom Package</option>
                </select>
              </div>
              <div className="form-group"><label>Message</label><textarea className="form-control" placeholder="Tell us about your brand and sponsorship goals..." /></div>
              <div style={{display:'flex',gap:12}}>
                <button className="btn btn-primary" style={{flex:1,justifyContent:'center'}}>Submit Enquiry</button>
                <button className="btn btn-secondary btn-sm" onClick={()=>setShowForm(false)}>Cancel</button>
              </div>
            </div>
          )}
          {!showForm && (
            <div style={{textAlign:'center'}}>
              <button className="btn btn-primary btn-lg" onClick={()=>setShowForm(true)}>Send Sponsorship Enquiry</button>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .eyebrow { font-family: var(--font-secondary); font-size: 0.75rem; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: var(--gold); display: block; margin-bottom: 12px; }
        .sponsor-card-lg { display: flex; overflow: hidden; }
        .sponsor-logo-area { width: 200px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .platinum-bg { background: linear-gradient(135deg,rgba(140,106,18,0.3),rgba(212,175,55,0.08)); }
        @media (max-width:768px) { .sponsor-card-lg { flex-direction: column; } .sponsor-logo-area { width: 100%; height: 120px; } }
      `}</style>
    </div>
  )
}
