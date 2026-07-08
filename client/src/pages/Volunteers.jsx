import React, { useState } from 'react'
import { useContent } from '../context/ContentContext'

export default function Volunteers() {
  const pageContent = useContent('volunteers')
  const hero = pageContent?.hero || { title: 'Be a Volunteer', subtitle: 'Join our team of passionate volunteers and be part of football history' }
  const benefits = pageContent?.benefits || []
  const roles = pageContent?.roles || []
  const training = pageContent?.training || []
  const [submitted, setSubmitted] = useState(false)

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Home <span>›</span> Volunteers</div>
          <h1>
            {hero.title.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-gold">{hero.title.split(' ').slice(-1)[0]}</span>
          </h1>
          <p>{hero.subtitle}</p>
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
            {benefits.map(b => (
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
            {roles.map(r => (
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
                {training.map(t => (
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
