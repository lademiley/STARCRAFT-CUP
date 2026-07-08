import React, { useState } from 'react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Home <span>›</span> Contact</div>
          <h1>Get in <span className="text-gold">Touch</span></h1>
          <p>We'd love to hear from you. Reach out for any enquiries.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:64,alignItems:'start'}}>
            {/* Info */}
            <div>
              <h2 style={{marginBottom:24}}>Contact Information</h2>
              <div style={{display:'flex',flexDirection:'column',gap:16,marginBottom:36}}>
                {[
                  { icon:'📍', label:'Office Address', value:'Oredo LGA Secretariat, Ring Road, Benin City, Edo State, Nigeria' },
                  { icon:'📞', label:'Phone Numbers', value:'+2348155576539\n+2348056042784\n+2347056445844' },
                  { icon:'✉️', label:'Email', value:'info@starcraftcup.ng\npress@starcraftcup.ng' },
                  { icon:'💬', label:'WhatsApp', value:'+2349077575347' },
                ].map(c => (
                  <div key={c.label} className="card" style={{padding:'20px 24px',display:'flex',gap:16}}>
                    <div style={{fontSize:'1.8rem',flexShrink:0}}>{c.icon}</div>
                    <div>
                      <div style={{fontFamily:'var(--font-secondary)',fontWeight:700,fontSize:'0.75rem',letterSpacing:'1px',textTransform:'uppercase',color:'var(--gold)',marginBottom:6}}>{c.label}</div>
                      <div style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.8)',whiteSpace:'pre-line'}}>{c.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <h3 style={{color:'var(--gold)',marginBottom:16}}>Follow Us</h3>
              <div className="social-links" style={{flexWrap:'wrap'}}>
                {[['𝕏','Twitter'],['f','Facebook'],['📸','Instagram'],['▶','YouTube'],['in','LinkedIn']].map(([icon,name]) => (
                  <a key={name} href="#" className="social-link" title={name}>{icon}</a>
                ))}
              </div>

              {/* Map Placeholder */}
              <div style={{marginTop:32,borderRadius:16,overflow:'hidden',border:'1px solid rgba(212,175,55,0.2)'}}>
                <div style={{height:220,background:'linear-gradient(135deg,var(--burgundy),#1a0507)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8}}>
                  <span style={{fontSize:'3rem'}}>🗺️</span>
                  <span style={{fontFamily:'var(--font-secondary)',fontSize:'0.85rem',color:'rgba(255,255,255,0.5)'}}>Oredo LGA, Benin City, Edo State</span>
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">Open in Google Maps</a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 style={{marginBottom:24}}>Send a Message</h2>
              {submitted ? (
                <div className="card" style={{padding:60,textAlign:'center'}}>
                  <div style={{fontSize:'4rem',marginBottom:16}}>✅</div>
                  <h3 style={{color:'var(--gold)',marginBottom:8}}>Message Sent!</h3>
                  <p style={{color:'rgba(255,255,255,0.7)'}}>Thank you for getting in touch. Our team will respond within 24 hours.</p>
                  <button className="btn btn-secondary" style={{marginTop:24}} onClick={()=>setSubmitted(false)}>Send Another Message</button>
                </div>
              ) : (
                <div className="card glass-panel" style={{padding:36}}>
                  <div className="grid-2" style={{gap:16}}>
                    <div className="form-group"><label>First Name</label><input type="text" className="form-control" placeholder="First name" /></div>
                    <div className="form-group"><label>Last Name</label><input type="text" className="form-control" placeholder="Last name" /></div>
                  </div>
                  <div className="form-group"><label>Email Address</label><input type="email" className="form-control" placeholder="your@email.com" /></div>
                  <div className="form-group"><label>Phone Number</label><input type="tel" className="form-control" placeholder="+234..." /></div>
                  <div className="form-group">
                    <label>Subject</label>
                    <select className="form-control">
                      <option>General Enquiry</option>
                      <option>Team Registration</option>
                      <option>Sponsorship</option>
                      <option>Media Accreditation</option>
                      <option>Volunteer Application</option>
                      <option>Ticketing</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group"><label>Message</label><textarea className="form-control" placeholder="How can we help you?" /></div>
                  <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}} onClick={()=>setSubmitted(true)}>
                    Send Message 📨
                  </button>
                </div>
              )}

              {/* FAQ */}
              <div style={{marginTop:40}}>
                <h3 style={{color:'var(--gold)',marginBottom:20}}>Frequently Asked Questions</h3>
                <div style={{display:'flex',flexDirection:'column',gap:10}}>
                  {[
                    { q:'How do I register my team?', a:'Click "Register Team" on the home page or visit our team registration page. Registration costs ₦25,000 per team and is open until February 15, 2027.' },
                    { q:'How can I buy tickets?', a:'Tickets are available online on our website and at designated outlets across Benin City. Group/season tickets are also available.' },
                    { q:'When does the tournament start?', a:'The StarCraft Cup 2027 Group Stage begins on March 1, 2027, with the Grand Final on April 20, 2027.' },
                    { q:'Who is eligible to play?', a:'Players must be Nigerian citizens aged 18 or above with valid ID, and must be registered members of a participating club.' },
                  ].map((f,i) => (
                    <details key={i} className="faq-item">
                      <summary>{f.q}</summary>
                      <div className="faq-answer">{f.a}</div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .faq-item { background: rgba(255,255,255,0.04); border: 1px solid rgba(212,175,55,0.15); border-radius: 12px; padding: 16px 20px; cursor: pointer; transition: border-color 200ms; }
        .faq-item[open] { border-color: rgba(212,175,55,0.4); }
        .faq-item summary { font-family: var(--font-secondary); font-weight: 700; font-size: 0.9rem; color: var(--white); list-style: none; display: flex; justify-content: space-between; align-items: center; }
        .faq-item summary::after { content: '+'; color: var(--gold); font-size: 1.2rem; flex-shrink: 0; }
        .faq-item[open] summary::after { content: '−'; }
        .faq-answer { margin-top: 12px; font-size: 0.9rem; color: rgba(255,255,255,0.7); line-height: 1.7; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.06); }
        @media(max-width:768px){div[style*='gridTemplateColumns:1fr 1.4fr']{display:flex!important;flex-direction:column}}
      `}</style>
    </div>
  )
}
