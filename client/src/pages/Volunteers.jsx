import React, { useState } from 'react'

export default function Volunteers() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Home <span>›</span> Volunteers</div>
          <h1>Be a <span className="text-gold">Volunteer</span></h1>
          <p>Join our team of passionate volunteers and be part of football history</p>
        </div>
      </section>

      {/* Why Volunteer */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Make a Difference</span>
            <h2>Why Volunteer with StarCraft Cup?</h2>
            <div className="divider" />
          </div>
          <div className="grid-4">
            {[
              { icon:'🏆', title:'Be Part of History', desc:'Help organize Edo State\'s greatest football tournament.' },
              { icon:'🎓', title:'Learn & Grow', desc:'Gain event management skills and sports industry experience.' },
              { icon:'🤝', title:'Network', desc:'Connect with football professionals, media, and corporate sponsors.' },
              { icon:'🎁', title:'Exclusive Benefits', desc:'Free tournament merchandise, meals, and access to all matches.' },
              { icon:'📜', title:'Certificate', desc:'Receive an official volunteer certificate and reference letter.' },
              { icon:'⚽', title:'Football Access', desc:'Behind-the-scenes access including training sessions and player areas.' },
              { icon:'👥', title:'Community', desc:'Join a family of passionate football lovers from across Edo State.' },
              { icon:'💼', title:'Career Boost', desc:'Build your CV with a prestigious sports event management credential.' },
            ].map(b => (
              <div key={b.title} className="card" style={{padding:24,textAlign:'center'}}>
                <div style={{fontSize:'2rem',marginBottom:10}}>{b.icon}</div>
                <h4 style={{color:'var(--gold)',marginBottom:6,fontSize:'0.95rem'}}>{b.title}</h4>
                <p style={{fontSize:'0.82rem',color:'rgba(255,255,255,0.6)'}}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Opportunities</span>
            <h2>Volunteer Roles</h2>
            <div className="divider" />
          </div>
          <div className="grid-3">
            {[
              { role:'Match Day Steward', slots:40, desc:'Manage crowd flow, assist fans with seating, and ensure a safe match environment.', requirements:'18+, physically fit, team player' },
              { role:'Media & Photography', slots:12, desc:'Assist the media team with photography, video, and social media content creation.', requirements:'Photography experience preferred' },
              { role:'Registration Desk', slots:20, desc:'Manage team and fan registration, handle ticketing, and provide information.', requirements:'Customer service skills, organized' },
              { role:'Medical Support', slots:8, desc:'Assist medical personnel with first aid, logistics, and player welfare.', requirements:'First aid certification preferred' },
              { role:'Transportation Coordinator', slots:15, desc:'Coordinate team transport, logistics, and driver management across venues.', requirements:'Valid driver\'s license, local knowledge' },
              { role:'Hospitality & VIP Host', slots:10, desc:'Manage VIP areas, sponsor hospitality, and ensure top-tier guest experience.', requirements:'Presentable, fluent in English' },
              { role:'Technical & IT Support', slots:6, desc:'Support live streaming, scoring systems, and technical equipment setup.', requirements:'IT skills required' },
              { role:'Community Ambassador', slots:25, desc:'Represent the tournament in communities, promote matches, and engage fans.', requirements:'Outgoing personality, social media savvy' },
            ].map(r => (
              <div key={r.role} className="card" style={{padding:24}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                  <h4 style={{color:'var(--gold)'}}>{r.role}</h4>
                  <span className="badge badge-green">{r.slots} slots</span>
                </div>
                <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.7)',marginBottom:12}}>{r.desc}</p>
                <div style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.45)',padding:'8px 12px',background:'rgba(212,175,55,0.05)',borderRadius:8,border:'1px solid rgba(212,175,55,0.1)'}}>
                  📋 Requirements: {r.requirements}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training */}
      <section className="section">
        <div className="container">
          <div className="grid-2">
            <div>
              <span className="eyebrow">Preparation</span>
              <h2>Training Schedule</h2>
              <p style={{marginBottom:24}}>All accepted volunteers will undergo a structured training programme to prepare them for their roles.</p>
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {[
                  { date:'March 10, 2027', session:'Orientation & Welcome Day', location:'Oredo LGA Civic Centre' },
                  { date:'March 12, 2027', session:'Role-Specific Training', location:'University of Benin' },
                  { date:'March 14, 2027', session:'Venue Walkthrough & Simulation', location:'Samuel Ogbemudia Stadium' },
                  { date:'March 16, 2027', session:'First Aid & Emergency Procedures', location:'Oredo LGA Health Centre' },
                  { date:'March 18, 2027', session:'Final Briefing & Kit Distribution', location:'University of Benin Bowl' },
                ].map(t => (
                  <div key={t.date} className="card" style={{padding:'14px 20px',display:'flex',gap:16,alignItems:'flex-start'}}>
                    <div style={{fontFamily:'var(--font-heading)',fontSize:'0.85rem',fontWeight:700,color:'var(--gold)',minWidth:100}}>{t.date}</div>
                    <div>
                      <div style={{fontWeight:600,fontSize:'0.9rem'}}>{t.session}</div>
                      <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.4)',marginTop:2}}>📍 {t.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration Form */}
            <div>
              <span className="eyebrow">Apply Now</span>
              <h2>Volunteer Registration</h2>
              {submitted ? (
                <div className="card" style={{padding:40,textAlign:'center'}}>
                  <div style={{fontSize:'4rem',marginBottom:16}}>🎉</div>
                  <h3 style={{color:'var(--gold)',marginBottom:8}}>Application Submitted!</h3>
                  <p style={{color:'rgba(255,255,255,0.7)'}}>Thank you for applying to volunteer at StarCraft Cup 2027. We'll contact you within 5 business days with a decision.</p>
                </div>
              ) : (
                <div className="card glass-panel" style={{padding:28}}>
                  <div className="form-group"><label>Full Name</label><input type="text" className="form-control" placeholder="Your full name" /></div>
                  <div className="grid-2" style={{gap:16}}>
                    <div className="form-group"><label>Age</label><input type="number" className="form-control" placeholder="Your age" min={18} /></div>
                    <div className="form-group"><label>Gender</label><select className="form-control"><option>Male</option><option>Female</option><option>Prefer not to say</option></select></div>
                  </div>
                  <div className="form-group"><label>Email Address</label><input type="email" className="form-control" placeholder="your@email.com" /></div>
                  <div className="form-group"><label>Phone Number</label><input type="tel" className="form-control" placeholder="+234..." /></div>
                  <div className="form-group"><label>LGA of Residence</label><input type="text" className="form-control" placeholder="Your LGA" /></div>
                  <div className="form-group">
                    <label>Preferred Role</label>
                    <select className="form-control">
                      <option>Match Day Steward</option>
                      <option>Media & Photography</option>
                      <option>Registration Desk</option>
                      <option>Medical Support</option>
                      <option>Transportation Coordinator</option>
                      <option>Hospitality & VIP Host</option>
                      <option>Technical & IT Support</option>
                      <option>Community Ambassador</option>
                    </select>
                  </div>
                  <div className="form-group"><label>Relevant Skills / Experience</label><textarea className="form-control" placeholder="Tell us about your relevant experience..." style={{minHeight:100}} /></div>
                  <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={()=>setSubmitted(true)}>Submit Application</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`.eyebrow{font-family:var(--font-secondary);font-size:.75rem;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:12px} @media(max-width:768px){.grid-2{grid-template-columns:1fr}}`}</style>
    </div>
  )
}
