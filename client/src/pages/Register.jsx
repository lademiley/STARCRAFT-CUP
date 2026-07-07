import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const steps = ['Account', 'Team Info', 'Players', 'Review']

export default function Register() {
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState('team') // 'team' | 'fan'
  const [form, setForm] = useState({ email:'', password:'', confirmPassword:'', teamName:'', city:'', coach:'', phone:'', group:'', kit:'', players:[] })
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-container" style={{maxWidth:560}}>
          <div className="auth-card card" style={{padding:56,textAlign:'center'}}>
            <div style={{fontSize:'5rem',marginBottom:16}}>🎉</div>
            <h2 style={{color:'var(--gold)',marginBottom:8}}>Registration Submitted!</h2>
            <p style={{color:'rgba(255,255,255,0.7)',marginBottom:28}}>
              {mode === 'team' ? `Your team "${form.teamName}" has been registered for StarCraft Cup 2027. We'll review your application and send confirmation within 48 hours.`
              : 'Your fan account has been created. Welcome to the StarCraft Cup family!'}
            </p>
            <div style={{background:'rgba(212,175,55,0.08)',border:'1px solid rgba(212,175,55,0.2)',borderRadius:12,padding:20,marginBottom:28}}>
              <div style={{fontFamily:'var(--font-secondary)',fontSize:'0.75rem',letterSpacing:'1px',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>Registration Reference</div>
              <div style={{fontFamily:'var(--font-heading)',fontSize:'1.5rem',fontWeight:700}}>SC2027-{Math.random().toString(36).substr(2,6).toUpperCase()}</div>
            </div>
            <Link to="/" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}}>Back to Home</Link>
          </div>
        </div>
        <style>{`.auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:100px 24px 40px;background:linear-gradient(160deg,#0d0102 0%,#3a0608 50%,#0d0102 100%)}.auth-container{width:100%;max-width:480px}`}</style>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-container" style={{maxWidth: mode === 'team' ? 680 : 480}}>
        <div className="auth-card card">
          {/* Logo */}
          <div className="auth-logo">
            <span style={{fontSize:'2rem'}}>⚽</span>
            <div style={{fontFamily:'var(--font-heading)',fontSize:'0.9rem',fontWeight:900,letterSpacing:'3px',color:'var(--gold)'}}>STARCRAFT CUP 2027</div>
          </div>

          <h2 style={{textAlign:'center',marginBottom:6}}>Create Account</h2>
          <p style={{textAlign:'center',color:'rgba(255,255,255,0.5)',marginBottom:24}}>Join StarCraft Cup 2027</p>

          {/* Mode Toggle */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:28,background:'rgba(255,255,255,0.05)',borderRadius:12,padding:4}}>
            {[['team','🏟️ Register Team'],['fan','👤 Fan Account']].map(([m,l]) => (
              <button key={m} onClick={()=>{setMode(m);setStep(0)}} style={{padding:'10px 16px',borderRadius:10,border:'none',cursor:'pointer',fontFamily:'var(--font-secondary)',fontWeight:700,fontSize:'0.82rem',transition:'all 200ms',background:mode===m?'var(--gold)':'transparent',color:mode===m?'var(--black)':'rgba(255,255,255,0.5)'}}>
                {l}
              </button>
            ))}
          </div>

          {/* Team Registration - Multi Step */}
          {mode === 'team' && (
            <>
              {/* Progress */}
              <div style={{display:'flex',gap:0,marginBottom:32}}>
                {steps.map((s,i) => (
                  <div key={s} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                    <div style={{width:'100%',height:3,background:i<=step?'var(--gold)':'rgba(255,255,255,0.1)',transition:'background 300ms'}} />
                    <span style={{fontFamily:'var(--font-secondary)',fontSize:'0.65rem',fontWeight:700,color:i<=step?'var(--gold)':'rgba(255,255,255,0.3)',letterSpacing:'0.5px'}}>{s}</span>
                  </div>
                ))}
              </div>

              {step === 0 && (
                <div>
                  <h4 style={{color:'var(--gold)',marginBottom:16}}>Account Details</h4>
                  <div className="form-group"><label>Full Name (Team Rep)</label><input type="text" className="form-control" placeholder="Your full name" /></div>
                  <div className="form-group"><label>Email Address</label><input type="email" className="form-control" placeholder="team@email.com" /></div>
                  <div className="grid-2" style={{gap:16}}>
                    <div className="form-group"><label>Password</label><input type="password" className="form-control" placeholder="Create password" /></div>
                    <div className="form-group"><label>Confirm Password</label><input type="password" className="form-control" placeholder="Confirm password" /></div>
                  </div>
                  <div className="form-group"><label>Phone Number</label><input type="tel" className="form-control" placeholder="+234..." /></div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h4 style={{color:'var(--gold)',marginBottom:16}}>Team Information</h4>
                  <div className="form-group"><label>Team Name</label><input type="text" className="form-control" placeholder="Official club name" value={form.teamName} onChange={e=>setForm({...form,teamName:e.target.value})} /></div>
                  <div className="grid-2" style={{gap:16}}>
                    <div className="form-group"><label>City / LGA</label><input type="text" className="form-control" placeholder="Club city" /></div>
                    <div className="form-group"><label>Year Founded</label><input type="number" className="form-control" placeholder="e.g. 2015" /></div>
                  </div>
                  <div className="form-group"><label>Head Coach</label><input type="text" className="form-control" placeholder="Coach full name" /></div>
                  <div className="form-group"><label>Home Colors (Kit)</label><input type="text" className="form-control" placeholder="e.g. Red and White" /></div>
                  <div className="form-group"><label>Competition History</label><textarea className="form-control" placeholder="Previous tournaments, achievements..." style={{minHeight:80}} /></div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h4 style={{color:'var(--gold)',marginBottom:6}}>Player Registration</h4>
                  <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.5)',marginBottom:16}}>Register at least 11 players (max 18). Each player must have a valid ID.</p>
                  {[1,2,3].map(n => (
                    <div key={n} className="card" style={{padding:16,marginBottom:12}}>
                      <div style={{fontFamily:'var(--font-secondary)',fontWeight:700,fontSize:'0.8rem',color:'var(--gold)',marginBottom:10}}>Player {n}</div>
                      <div className="grid-2" style={{gap:12}}>
                        <input type="text" className="form-control" placeholder="Full name" style={{fontSize:'0.85rem'}} />
                        <input type="number" className="form-control" placeholder="Age" style={{fontSize:'0.85rem'}} />
                        <input type="text" className="form-control" placeholder="Position" style={{fontSize:'0.85rem'}} />
                        <input type="number" className="form-control" placeholder="Jersey #" style={{fontSize:'0.85rem'}} />
                      </div>
                    </div>
                  ))}
                  <p style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.4)',textAlign:'center'}}>+ 15 more player slots available after submission</p>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h4 style={{color:'var(--gold)',marginBottom:16}}>Review & Submit</h4>
                  <div className="card" style={{padding:24,marginBottom:20}}>
                    <div style={{fontFamily:'var(--font-secondary)',fontWeight:700,fontSize:'0.8rem',color:'var(--gold)',marginBottom:16,letterSpacing:'1px',textTransform:'uppercase'}}>Registration Summary</div>
                    {[['Team Name',form.teamName||'Not set'],['Coach',form.coach||'Not set'],['Registration Fee','₦25,000'],['Payment Method','Bank Transfer / Online']].map(([k,v]) => (
                      <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                        <span style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.5)'}}>{k}</span>
                        <span style={{fontSize:'0.85rem',fontWeight:600}}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{padding:16,background:'rgba(212,175,55,0.06)',border:'1px solid rgba(212,175,55,0.15)',borderRadius:12,marginBottom:20,fontSize:'0.85rem',color:'rgba(255,255,255,0.7)'}}>
                    By submitting this registration, you confirm that all player information is accurate and that your team agrees to abide by the StarCraft Cup 2027 Rules & Regulations.
                  </div>
                  <label style={{display:'flex',alignItems:'flex-start',gap:10,cursor:'pointer',marginBottom:20}}>
                    <input type="checkbox" style={{marginTop:3}} />
                    <span style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.7)'}}>I agree to the Terms & Conditions and confirm all submitted information is accurate.</span>
                  </label>
                </div>
              )}

              {/* Navigation */}
              <div style={{display:'flex',gap:12,marginTop:20}}>
                {step > 0 && <button className="btn btn-secondary" style={{flex:1,justifyContent:'center'}} onClick={()=>setStep(s=>s-1)}>← Back</button>}
                {step < 3
                  ? <button className="btn btn-primary" style={{flex:2,justifyContent:'center'}} onClick={()=>setStep(s=>s+1)}>Continue →</button>
                  : <button className="btn btn-primary" style={{flex:2,justifyContent:'center'}} onClick={()=>setSubmitted(true)}>Submit Registration 🚀</button>
                }
              </div>
            </>
          )}

          {/* Fan Registration */}
          {mode === 'fan' && (
            <form onSubmit={e=>{e.preventDefault();setSubmitted(true)}}>
              <div className="form-group"><label>Full Name</label><input type="text" className="form-control" placeholder="Your name" required /></div>
              <div className="form-group"><label>Email Address</label><input type="email" className="form-control" placeholder="your@email.com" required /></div>
              <div className="form-group"><label>Phone Number</label><input type="tel" className="form-control" placeholder="+234..." /></div>
              <div className="form-group"><label>Favourite Team</label>
                <select className="form-control"><option value="">Select a team</option>{['Edo Warriors','Oredo United','Benin Royals','Delta Eagles','Ugbowo Stars','Uromi FC'].map(t=><option key={t}>{t}</option>)}</select>
              </div>
              <div className="form-group"><label>Password</label><input type="password" className="form-control" placeholder="Create password" required /></div>
              <div className="form-group"><label>Confirm Password</label><input type="password" className="form-control" placeholder="Confirm password" required /></div>
              <button type="submit" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginBottom:16}}>Create Fan Account 🎉</button>
              <div className="divider-text"><span>or sign up with</span></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:16}}>
                <button type="button" className="btn btn-secondary" style={{justifyContent:'center'}}>G Google</button>
                <button type="button" className="btn btn-secondary" style={{justifyContent:'center'}}>f Facebook</button>
              </div>
            </form>
          )}

          <p style={{textAlign:'center',marginTop:24,fontSize:'0.9rem',color:'rgba(255,255,255,0.5)'}}>
            Already have an account? <Link to="/login" style={{color:'var(--gold)',fontWeight:700}}>Sign In →</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:100px 24px 40px;background:linear-gradient(160deg,#0d0102 0%,#3a0608 50%,#0d0102 100%)}
        .auth-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(212,175,55,.06) 0%,transparent 70%);pointer-events:none}
        .auth-container{width:100%;position:relative;z-index:1}
        .auth-card{padding:40px}
        .auth-logo{display:flex;align-items:center;gap:14px;justify-content:center;margin-bottom:24px}
        .divider-text{display:flex;align-items:center;gap:12px;margin:8px 0}
        .divider-text::before,.divider-text::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.1)}
        .divider-text span{font-family:var(--font-secondary);font-size:.75rem;color:rgba(255,255,255,.4);white-space:nowrap}
        @media(max-width:480px){.auth-card{padding:28px 20px}}
      `}</style>
    </div>
  )
}
