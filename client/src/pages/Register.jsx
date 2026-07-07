import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const steps = ['Account', 'Team Info', 'Players', 'Review']

const emptyPlayer = () => ({ name: '', age: '', position: '', jersey: '' })

export default function Register() {
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState('team')
  const [form, setForm] = useState({
    // shared / fan
    email: '', password: '', confirmPassword: '', name: '', phone: '', favouriteTeam: '',
    // team rep account
    repName: '', repEmail: '', repPassword: '', repConfirmPassword: '', repPhone: '',
    // team info
    teamName: '', city: '', yearFounded: '', coach: '', homeColors: '', competitionHistory: '',
    // players
    players: [emptyPlayer(), emptyPlayer(), emptyPlayer()],
  })
  const [submitted, setSubmitted] = useState(false)
  const [submittedRef, setSubmittedRef] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const updatePlayer = (idx, field, val) => setForm(p => {
    const players = [...p.players]
    players[idx] = { ...players[idx], [field]: val }
    return { ...p, players }
  })

  const addPlayer = () => setForm(p => ({ ...p, players: [...p.players, emptyPlayer()] }))
  const removePlayer = idx => setForm(p => ({ ...p, players: p.players.filter((_, i) => i !== idx) }))

  // ── Team registration submit ──────────────────────────────────
  const handleTeamSubmit = async () => {
    setError('')
    if (!form.repName || !form.repEmail || !form.repPassword) {
      setError('All account fields are required')
      return
    }
    if (form.repPassword !== form.repConfirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.repPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (!form.teamName) {
      setError('Team name is required')
      return
    }
    const filledPlayers = form.players.filter(p => p.name.trim())
    if (filledPlayers.length < 3) {
      setError('Please add at least 3 players')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/teams/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          repName: form.repName,
          repEmail: form.repEmail,
          repPhone: form.repPhone,
          teamName: form.teamName,
          city: form.city,
          yearFounded: form.yearFounded,
          coach: form.coach,
          homeColors: form.homeColors,
          competitionHistory: form.competitionHistory,
          players: filledPlayers,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return }
      navigate(`/team-dashboard?ref=${data.reference}&token=${data.dashboardToken}`)
    } catch {
      setError('Network error — please try again')
    }
    setLoading(false)
  }

  // ── Validate each step before advancing ──────────────────────
  const canAdvance = () => {
    if (step === 0) return form.repName && form.repEmail && form.repPassword && form.repConfirmPassword && form.repPassword === form.repConfirmPassword && form.repPassword.length >= 8
    if (step === 1) return form.teamName && form.city && form.coach
    return true
  }

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-container" style={{ maxWidth: 560 }}>
          <div className="auth-card card" style={{ padding: 56, textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', marginBottom: 16 }}>🎉</div>
            <h2 style={{ color: 'var(--gold)', marginBottom: 8 }}>
              {mode === 'team' ? 'Registration Submitted!' : 'Account Created!'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 28 }}>
              {mode === 'team'
                ? `"${form.teamName}" has been submitted for StarCraft Cup 2026. Our team will review your application and contact you within 48 hours.`
                : 'Your fan account has been created. Welcome to the StarCraft Cup family!'}
            </p>
            {mode === 'team' && (
              <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 12, padding: 20, marginBottom: 28 }}>
                <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Registration Reference</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>{submittedRef}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>Keep this reference for your records</div>
              </div>
            )}
            <Link to="/" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Back to Home</Link>
          </div>
        </div>
        <style>{`.auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:100px 24px 40px;background:linear-gradient(160deg,#0d0102 0%,#3a0608 50%,#0d0102 100%)}.auth-container{width:100%;max-width:480px}`}</style>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-container" style={{ maxWidth: mode === 'team' ? 680 : 480 }}>
        <div className="auth-card card">
          <div className="auth-logo">
            <span style={{ fontSize: '2rem' }}>⚽</span>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '3px', color: 'var(--gold)' }}>STARCRAFT CUP 2026</div>
          </div>

          <h2 style={{ textAlign: 'center', marginBottom: 6 }}>Create Account</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>Join StarCraft Cup 2026 — Oredo LGA, Edo State</p>

          {/* Mode Toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 28, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4 }}>
            {[['team', '🏟️ Register Team'], ['fan', '👤 Fan Account']].map(([m, l]) => (
              <button key={m} onClick={() => { setMode(m); setStep(0); setError('') }} style={{ padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.82rem', transition: 'all 200ms', background: mode === m ? 'var(--gold)' : 'transparent', color: mode === m ? 'var(--black)' : 'rgba(255,255,255,0.5)' }}>
                {l}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#f87171', fontSize: '0.88rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {/* ── TEAM REGISTRATION ─────────────────────── */}
          {mode === 'team' && (
            <>
              {/* Progress steps */}
              <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
                {steps.map((s, i) => (
                  <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: '100%', height: 3, background: i <= step ? 'var(--gold)' : 'rgba(255,255,255,0.1)', transition: 'background 300ms' }} />
                    <span style={{ fontFamily: 'var(--font-secondary)', fontSize: '0.65rem', fontWeight: 700, color: i <= step ? 'var(--gold)' : 'rgba(255,255,255,0.3)', letterSpacing: '0.5px' }}>{s}</span>
                  </div>
                ))}
              </div>

              {/* Step 0 — Account details */}
              {step === 0 && (
                <div>
                  <h4 style={{ color: 'var(--gold)', marginBottom: 16 }}>Team Representative Account</h4>
                  <div className="form-group"><label>Full Name (Representative)</label><input type="text" className="form-control" placeholder="Your full name" value={form.repName} onChange={set('repName')} /></div>
                  <div className="form-group"><label>Email Address</label><input type="email" className="form-control" placeholder="team@email.com" value={form.repEmail} onChange={set('repEmail')} /></div>
                  <div className="form-group"><label>Phone Number</label><input type="tel" className="form-control" placeholder="+234 800 000 0000" value={form.repPhone} onChange={set('repPhone')} /></div>
                  <div className="grid-2" style={{ gap: 16 }}>
                    <div className="form-group"><label>Password</label><input type="password" className="form-control" placeholder="Min 8 characters" value={form.repPassword} onChange={set('repPassword')} /></div>
                    <div className="form-group"><label>Confirm Password</label><input type="password" className="form-control" placeholder="Repeat password" value={form.repConfirmPassword} onChange={set('repConfirmPassword')} /></div>
                  </div>
                </div>
              )}

              {/* Step 1 — Team info */}
              {step === 1 && (
                <div>
                  <h4 style={{ color: 'var(--gold)', marginBottom: 16 }}>Team Information</h4>
                  <div className="form-group"><label>Team Name *</label><input type="text" className="form-control" placeholder="Official club name" value={form.teamName} onChange={set('teamName')} /></div>
                  <div className="grid-2" style={{ gap: 16 }}>
                    <div className="form-group"><label>City / LGA *</label><input type="text" className="form-control" placeholder="e.g. Oredo, Benin City" value={form.city} onChange={set('city')} /></div>
                    <div className="form-group"><label>Year Founded</label><input type="number" className="form-control" placeholder="e.g. 2015" value={form.yearFounded} onChange={set('yearFounded')} /></div>
                  </div>
                  <div className="form-group"><label>Head Coach *</label><input type="text" className="form-control" placeholder="Coach full name" value={form.coach} onChange={set('coach')} /></div>
                  <div className="form-group"><label>Home Kit Colors</label><input type="text" className="form-control" placeholder="e.g. Red and White stripes" value={form.homeColors} onChange={set('homeColors')} /></div>
                  <div className="form-group"><label>Competition History</label><textarea className="form-control" placeholder="Previous tournaments, achievements, league participation..." style={{ minHeight: 80 }} value={form.competitionHistory} onChange={set('competitionHistory')} /></div>
                </div>
              )}

              {/* Step 2 — Players */}
              {step === 2 && (
                <div>
                  <h4 style={{ color: 'var(--gold)', marginBottom: 6 }}>Player Registration</h4>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>Register your squad (min 11, max 18 players).</p>
                  {form.players.map((p, n) => (
                    <div key={n} className="card" style={{ padding: 16, marginBottom: 12, position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--gold)' }}>Player {n + 1}</span>
                        {form.players.length > 3 && (
                          <button onClick={() => removePlayer(n)} style={{ background: 'none', border: 'none', color: 'rgba(239,68,68,0.7)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                        )}
                      </div>
                      <div className="grid-2" style={{ gap: 12 }}>
                        <input type="text" className="form-control" placeholder="Full name" style={{ fontSize: '0.85rem' }} value={p.name} onChange={e => updatePlayer(n, 'name', e.target.value)} />
                        <input type="number" className="form-control" placeholder="Age" style={{ fontSize: '0.85rem' }} value={p.age} onChange={e => updatePlayer(n, 'age', e.target.value)} />
                        <input type="text" className="form-control" placeholder="Position (e.g. Forward)" style={{ fontSize: '0.85rem' }} value={p.position} onChange={e => updatePlayer(n, 'position', e.target.value)} />
                        <input type="number" className="form-control" placeholder="Jersey #" style={{ fontSize: '0.85rem' }} value={p.jersey} onChange={e => updatePlayer(n, 'jersey', e.target.value)} />
                      </div>
                    </div>
                  ))}
                  {form.players.length < 18 && (
                    <button onClick={addPlayer} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>+ Add Player</button>
                  )}
                </div>
              )}

              {/* Step 3 — Review & submit */}
              {step === 3 && (
                <div>
                  <h4 style={{ color: 'var(--gold)', marginBottom: 16 }}>Review & Submit</h4>
                  <div className="card" style={{ padding: 24, marginBottom: 20 }}>
                    <div style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--gold)', marginBottom: 16, letterSpacing: '1px', textTransform: 'uppercase' }}>Registration Summary</div>
                    {[
                      ['Representative', form.repName || '—'],
                      ['Email', form.repEmail || '—'],
                      ['Team Name', form.teamName || '—'],
                      ['City / LGA', form.city || '—'],
                      ['Head Coach', form.coach || '—'],
                      ['Kit Colors', form.homeColors || '—'],
                      ['Players Listed', `${form.players.filter(p => p.name.trim()).length} players`],
                      ['Registration Fee', '₦25,000'],
                      ['Payment Method', 'Bank Transfer (details after approval)'],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{k}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: 16, background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12, marginBottom: 20, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                    By submitting, you confirm all information is accurate and your team agrees to abide by StarCraft Cup 2026 Rules & Regulations.
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                {step > 0 && <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { setStep(s => s - 1); setError('') }}>← Back</button>}
                {step < 3
                  ? <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={() => { if (canAdvance()) { setStep(s => s + 1); setError('') } else setError('Please fill in all required fields correctly') }}>Continue →</button>
                  : <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleTeamSubmit} disabled={loading}>{loading ? 'Submitting…' : 'Submit Registration 🚀'}</button>
                }
              </div>
            </>
          )}

          {/* ── FAN REGISTRATION ──────────────────────── */}
          {mode === 'fan' && (
            <form onSubmit={async e => {
              e.preventDefault()
              setError('')
              if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
              if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
              setLoading(true)
              try {
                const res = await fetch('/api/auth/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  credentials: 'include',
                  body: JSON.stringify({ email: form.email, password: form.password, name: form.name, mode: 'fan' }),
                })
                const data = await res.json()
                if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return }
                setUser(data.user)
                navigate('/tickets')
              } catch {
                setError('Network error — please try again')
                setLoading(false)
              }
            }}>
              <div className="form-group"><label>Full Name</label><input type="text" className="form-control" placeholder="Your name" required value={form.name} onChange={set('name')} /></div>
              <div className="form-group"><label>Email Address</label><input type="email" className="form-control" placeholder="your@email.com" required value={form.email} onChange={set('email')} /></div>
              <div className="form-group"><label>Phone Number</label><input type="tel" className="form-control" placeholder="+234..." value={form.phone} onChange={set('phone')} /></div>
              <div className="form-group"><label>Favourite Team</label>
                <select className="form-control" value={form.favouriteTeam} onChange={set('favouriteTeam')}>
                  <option value="">Select a team</option>
                  {['Akoko-Edo Panthers','Egor United','Esan Central FC','Esan West Rangers','Etsako Central FC','Ikpoba-Okha FC','Oredo City FC','Owan East FC','Owan West United','Bendel Insurance Youth'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Password</label><input type="password" className="form-control" placeholder="Min 8 characters" required value={form.password} onChange={set('password')} /></div>
              <div className="form-group"><label>Confirm Password</label><input type="password" className="form-control" placeholder="Confirm password" required value={form.confirmPassword} onChange={set('confirmPassword')} /></div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }} disabled={loading}>
                {loading ? 'Creating account…' : 'Create Fan Account 🎉'}
              </button>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 700 }}>Sign In →</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:100px 24px 40px;background:linear-gradient(160deg,#0d0102 0%,#3a0608 50%,#0d0102 100%)}
        .auth-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(212,175,55,.06) 0%,transparent 70%);pointer-events:none}
        .auth-container{width:100%;position:relative;z-index:1}
        .auth-card{padding:40px}
        .auth-logo{display:flex;align-items:center;gap:14px;justify-content:center;margin-bottom:24px}
        @media(max-width:480px){.auth-card{padding:28px 20px}}
      `}</style>
    </div>
  )
}
