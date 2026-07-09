import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const steps = ['Account', 'Team Info', 'Players', 'Review']

const emptyPlayer = () => ({ name: '', age: '', position: '', jersey: '' })

export default function Register() {
  const [step, setStep]   = useState(0)
  const [mode, setMode]   = useState('team')
  const [form, setForm]   = useState({
    // individual
    email: '', password: '', confirmPassword: '', name: '', phone: '', favouriteTeam: '',
    lga: '', age: '', kitSize: '', height: '', footSize: '',
    // team rep
    repName: '', repEmail: '', repPassword: '', repConfirmPassword: '', repPhone: '',
    // team info
    teamName: '', city: '', yearFounded: '', coach: '', homeColors: '', competitionHistory: '',
    // players
    players: [emptyPlayer(), emptyPlayer(), emptyPlayer()],
  })
  const [error,      setError]      = useState('')
  const [loading,    setLoading]    = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [payMethod,   setPayMethod]   = useState('bank')
  const [paymentSettings, setPaymentSettings] = useState(null)
  const { setUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/settings/payment')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.settings) setPaymentSettings(d.settings) })
      .catch(() => {})
  }, [])

  const activeMethods = paymentSettings?.methods?.filter(m => m.enabled) || []

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const updatePlayer = (idx, field, val) => setForm(p => {
    const players = [...p.players]
    players[idx] = { ...players[idx], [field]: val }
    return { ...p, players }
  })

  const addPlayer    = () => setForm(p => ({ ...p, players: [...p.players, emptyPlayer()] }))
  const removePlayer = idx => setForm(p => ({ ...p, players: p.players.filter((_, i) => i !== idx) }))

  // ── Step validation ──────────────────────────────────────────
  const canAdvance = () => {
    if (step === 0) return (
      form.repName.trim() &&
      form.repEmail.trim() &&
      form.repPassword.length >= 8 &&
      form.repPassword === form.repConfirmPassword
    )
    if (step === 1) return form.teamName.trim() && form.city.trim() && form.coach.trim()
    return true
  }

  const advance = () => {
    if (canAdvance()) { setStep(s => s + 1); setError('') }
    else setError(
      step === 0 ? 'Please fill in all account fields and make sure passwords match (min 8 characters).'
                 : 'Please fill in all required fields marked with *.'
    )
  }

  const back = () => { setStep(s => s - 1); setError('') }

  // ── Step 3: intercept submit → show payment modal ────────────
  const handleFormSubmit = e => {
    e.preventDefault()
    if (step < 3) return
    setError('')
    setShowPayment(true)
  }

  // ── Actual API call — triggered from payment modal ────────────
  const handleTeamSubmit = async () => {
    setError('')
    const filledPlayers = form.players.filter(p => p.name.trim())
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
      if (!res.ok) {
        setError(data.error || 'Registration failed — please try again.')
        setLoading(false)
        return
      }
      navigate(`/team-dashboard?ref=${data.reference}&token=${data.dashboardToken}`)
    } catch {
      setError('Network error — please check your connection and try again.')
      setLoading(false)
    }
  }

  // ── Fan registration submit ──────────────────────────────────
  const handleFanSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (!form.name.trim() || !form.email.trim()) { setError('Full name and email are required.'); return }
    if (!form.lga.trim() || !form.kitSize.trim()) { setError('Please select your LGA and kit size.'); return }
    const ageNum = Number(form.age), heightNum = Number(form.height), footNum = Number(form.footSize)
    if (!Number.isFinite(ageNum) || ageNum < 5 || ageNum > 60) { setError('Age must be between 5 and 60.'); return }
    if (!Number.isFinite(heightNum) || heightNum < 100 || heightNum > 230) { setError('Height must be between 100 and 230 cm.'); return }
    if (!Number.isFinite(footNum) || footNum < 20 || footNum > 55) { setError('Foot size must be between 20 and 55.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: form.email, password: form.password, name: form.name, phone: form.phone,
          mode: 'individual', lga: form.lga, age: form.age, kitSize: form.kitSize,
          height: form.height, footSize: form.footSize,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed.'); setLoading(false); return }
      setUser(data.user)
      navigate('/tickets')
    } catch {
      setError('Network error — please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-container" style={{ maxWidth: mode === 'team' ? 680 : 480 }}>
        <div className="auth-card card">

          {/* Logo */}
          <div className="auth-logo">
            <span style={{ fontSize: '2rem' }}>⚽</span>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '3px', color: 'var(--gold)' }}>STARCRAFT CUP 2026</div>
          </div>

          <h2 style={{ textAlign: 'center', marginBottom: 6 }}>Create Account</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
            Join StarCraft Cup 2026 — Oredo LGA, Edo State
          </p>

          {/* Mode toggle */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 28, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4 }}>
            {[['team', '🏛️ LGA Chairman'], ['fan', '👤 Individual Registration']].map(([m, l]) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setStep(0); setError('') }}
                style={{ padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.82rem', transition: 'all 200ms', background: mode === m ? 'var(--gold)' : 'transparent', color: mode === m ? 'var(--black)' : 'rgba(255,255,255,0.5)' }}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Error banner */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#f87171', fontSize: '0.88rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {/* ══════════════ TEAM REGISTRATION ══════════════ */}
          {mode === 'team' && (
            <form onSubmit={handleFormSubmit} noValidate>

              {/* Progress bar */}
              <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
                {steps.map((s, i) => (
                  <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: '100%', height: 3, background: i <= step ? 'var(--gold)' : 'rgba(255,255,255,0.1)', transition: 'background 300ms' }} />
                    <span style={{ fontFamily: 'var(--font-secondary)', fontSize: '0.65rem', fontWeight: 700, color: i <= step ? 'var(--gold)' : 'rgba(255,255,255,0.3)', letterSpacing: '0.5px' }}>{s}</span>
                  </div>
                ))}
              </div>

              {/* ── Step 0 — Account ── */}
              {step === 0 && (
                <div>
                  <h4 style={{ color: 'var(--gold)', marginBottom: 6 }}>LGA Chairman Account</h4>
                  <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>
                    Only the Local Government Chairman (or an authorised representative) may register their LGA as a team.
                  </p>
                  <div className="form-group">
                    <label>Full Name (Chairman / Representative) *</label>
                    <input type="text" className="form-control" placeholder="Your full name" value={form.repName} onChange={set('repName')} autoComplete="name" />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input type="email" className="form-control" placeholder="team@email.com" value={form.repEmail} onChange={set('repEmail')} autoComplete="email" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" className="form-control" placeholder="+234 800 000 0000" value={form.repPhone} onChange={set('repPhone')} autoComplete="tel" />
                  </div>
                  <div className="grid-2" style={{ gap: 16 }}>
                    <div className="form-group">
                      <label>Password * (min 8 chars)</label>
                      <input type="password" className="form-control" placeholder="Min 8 characters" value={form.repPassword} onChange={set('repPassword')} autoComplete="new-password" />
                    </div>
                    <div className="form-group">
                      <label>Confirm Password *</label>
                      <input type="password" className="form-control" placeholder="Repeat password" value={form.repConfirmPassword} onChange={set('repConfirmPassword')} autoComplete="new-password" />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 1 — Team Info ── */}
              {step === 1 && (
                <div>
                  <h4 style={{ color: 'var(--gold)', marginBottom: 16 }}>LGA / Team Information</h4>
                  <div className="form-group">
                    <label>LGA / Team Name *</label>
                    <input type="text" className="form-control" placeholder="Name of the Local Government Area team" value={form.teamName} onChange={set('teamName')} />
                  </div>
                  <div className="grid-2" style={{ gap: 16 }}>
                    <div className="form-group">
                      <label>City / LGA *</label>
                      <input type="text" className="form-control" placeholder="e.g. Oredo, Benin City" value={form.city} onChange={set('city')} />
                    </div>
                    <div className="form-group">
                      <label>Year Founded</label>
                      <input type="number" className="form-control" placeholder="e.g. 2015" value={form.yearFounded} onChange={set('yearFounded')} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Head Coach *</label>
                    <input type="text" className="form-control" placeholder="Coach full name" value={form.coach} onChange={set('coach')} />
                  </div>
                  <div className="form-group">
                    <label>Home Kit Colors</label>
                    <input type="text" className="form-control" placeholder="e.g. Red and White stripes" value={form.homeColors} onChange={set('homeColors')} />
                  </div>
                  <div className="form-group">
                    <label>Competition History</label>
                    <textarea className="form-control" placeholder="Previous tournaments, achievements, league participation..." style={{ minHeight: 80 }} value={form.competitionHistory} onChange={set('competitionHistory')} />
                  </div>
                </div>
              )}

              {/* ── Step 2 — Players ── */}
              {step === 2 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <h4 style={{ color: 'var(--gold)', margin: 0 }}>Player Registration</h4>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: form.players.filter(p => p.name.trim()).length >= 11 ? '#22C55E' : '#F59E0B' }}>
                      {form.players.filter(p => p.name.trim()).length} / 18 added
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>
                    Register your squad — minimum 11, maximum 18 players.
                  </p>
                  {form.players.map((p, n) => (
                    <div key={n} className="card" style={{ padding: 16, marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--gold)' }}>Player {n + 1}</span>
                        {form.players.length > 3 && (
                          <button type="button" onClick={() => removePlayer(n)} style={{ background: 'none', border: 'none', color: 'rgba(239,68,68,0.7)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>✕</button>
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
                    <button type="button" onClick={addPlayer} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>
                      + Add Player
                    </button>
                  )}
                </div>
              )}

              {/* ── Step 3 — Review ── */}
              {step === 3 && (
                <div>
                  <h4 style={{ color: 'var(--gold)', marginBottom: 16 }}>Review & Submit</h4>
                  <div className="card" style={{ padding: 24, marginBottom: 20 }}>
                    <div style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.8rem', color: 'var(--gold)', marginBottom: 16, letterSpacing: '1px', textTransform: 'uppercase' }}>Registration Summary</div>
                    {[
                      ['Representative',  form.repName    || '—'],
                      ['Email',           form.repEmail   || '—'],
                      ['Team Name',       form.teamName   || '—'],
                      ['City / LGA',      form.city       || '—'],
                      ['Head Coach',      form.coach      || '—'],
                      ['Kit Colors',      form.homeColors || '—'],
                      ['Players Listed',  `${form.players.filter(p => p.name.trim()).length} players`],
                      ['Registration Fee','₦25,000'],
                      ['Payment Method',  'Bank Transfer (details after approval)'],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{k}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  {form.players.filter(p => p.name.trim()).length < 11 && (
                    <div style={{ padding: '12px 16px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 10, marginBottom: 14, fontSize: '0.83rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚠️</span>
                      You have {form.players.filter(p => p.name.trim()).length} of 11 required players. You can add more players from your team dashboard after registration.
                    </div>
                  )}
                  <div style={{ padding: 16, background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12, marginBottom: 20, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                    By submitting, you confirm all information is accurate and your team agrees to abide by StarCraft Cup 2026 Rules & Regulations.
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                {step > 0 && (
                  <button type="button" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={back}>
                    ← Back
                  </button>
                )}
                {step < 3 ? (
                  <button type="button" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={advance}>
                    Continue →
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
                    Proceed to Payment 💳
                  </button>
                )}
              </div>
            </form>
          )}

          {/* ══════════════ PAYMENT MODAL ══════════════ */}
          {showPayment && (
            <div style={ps.overlay} onClick={() => !loading && setShowPayment(false)}>
              <div style={ps.modal} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={ps.header}>
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>💳</div>
                  <h3 style={ps.title}>Complete Payment</h3>
                  <p style={ps.sub}>Choose your preferred payment method to finalise registration</p>
                </div>

                {/* Amount */}
                <div style={ps.amountBox}>
                  <div style={ps.amountLabel}>Registration Fee</div>
                  <div style={ps.amount}>₦25,000</div>
                  <div style={ps.amountTeam}>{form.teamName}</div>
                </div>

                {/* Method tabs */}
                <div style={ps.methodTabs}>
                  {[['bank','🏦 Bank Transfer'],['ussd','📱 USSD'],['online','💻 Online Payment']].map(([m, l]) => (
                    <button key={m} type="button" onClick={() => setPayMethod(m)}
                      style={{ ...ps.methodTab, ...(payMethod === m ? ps.methodTabActive : {}) }}>
                      {l}
                    </button>
                  ))}
                </div>

                {/* Payment method details — driven by admin-configured settings */}
                {activeMethods.length === 0 ? (
                  <div style={{ ...ps.detailsBox, textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>⚙️</div>
                    <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                      Payment details are being configured. Please contact the tournament office directly to complete your payment.
                    </div>
                  </div>
                ) : (
                  activeMethods.map((method, idx) => (
                    <div key={method.id || idx} style={ps.detailsBox}>
                      <div style={ps.detailsTitle}>🏦 {method.label || 'Bank Transfer Details'}</div>
                      {[
                        method.bankName      && ['Bank Name',       method.bankName],
                        method.accountName   && ['Account Name',    method.accountName],
                        method.accountNumber && ['Account Number',  method.accountNumber],
                        method.sortCode      && ['Sort Code',       method.sortCode],
                        ['Amount',    '₦25,000'],
                        ['Payment Ref', `REG-${form.teamName.replace(/\s+/g,'').toUpperCase().slice(0,6) || 'TEAM'}`],
                      ].filter(Boolean).map(([k, v]) => (
                        <div key={k} style={ps.detailRow}>
                          <span style={ps.detailKey}>{k}</span>
                          <span style={{ ...ps.detailVal, color: k === 'Payment Ref' ? '#D4AF37' : '#fff' }}>{v}</span>
                        </div>
                      ))}
                      {method.instructions ? (
                        <div style={ps.note}>⚠️ {method.instructions}</div>
                      ) : (
                        <div style={ps.note}>⚠️ Use your team name or the Payment Ref as your transfer narration so we can identify your payment.</div>
                      )}
                    </div>
                  ))
                )}

                {/* Error */}
                {error && (
                  <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: '0.83rem', marginBottom: 12 }}>
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button type="button" onClick={() => setShowPayment(false)} disabled={loading}
                    style={ps.cancelBtn}>
                    ← Back
                  </button>
                  <button type="button" onClick={handleTeamSubmit} disabled={loading}
                    style={{ ...ps.confirmBtn, opacity: loading ? 0.65 : 1 }}>
                    {loading ? 'Submitting…' : '✅ I Have Paid — Submit Registration'}
                  </button>
                </div>

                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 14 }}>
                  Your registration will be reviewed within 48 hours of payment confirmation.
                </p>
              </div>
            </div>
          )}

          {/* ══════════════ INDIVIDUAL / PLAYER REGISTRATION ══════════════ */}
          {mode === 'fan' && (
            <form onSubmit={handleFanSubmit} noValidate>
              <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)', marginBottom: 16, marginTop: -8 }}>
                Register as an individual player — provide your details below.
              </p>
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" className="form-control" placeholder="Your name" required value={form.name} onChange={set('name')} autoComplete="name" />
              </div>
              <div className="grid-2" style={{ gap: 16 }}>
                <div className="form-group">
                  <label>LGA *</label>
                  <select className="form-control" required value={form.lga} onChange={set('lga')}>
                    <option value="">Select your LGA</option>
                    {['Akoko-Edo','Egor','Esan Central','Esan North-East','Esan South-East','Esan West','Etsako Central','Etsako East','Etsako West','Igueben','Ikpoba-Okha','Orhionmwon','Oredo','Ovia North-East','Ovia South-West','Owan East','Owan West','Uhunmwonde'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Age *</label>
                  <input type="number" className="form-control" placeholder="e.g. 22" required value={form.age} onChange={set('age')} />
                </div>
              </div>
              <div className="grid-2" style={{ gap: 16 }}>
                <div className="form-group">
                  <label>Jersey / Kit Size *</label>
                  <select className="form-control" required value={form.kitSize} onChange={set('kitSize')}>
                    <option value="">Select size</option>
                    {['XS','S','M','L','XL','XXL'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Height (cm) *</label>
                  <input type="number" className="form-control" placeholder="e.g. 175" required value={form.height} onChange={set('height')} />
                </div>
              </div>
              <div className="form-group">
                <label>Foot Size *</label>
                <input type="number" className="form-control" placeholder="e.g. 42" required value={form.footSize} onChange={set('footSize')} />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" className="form-control" placeholder="your@email.com" required value={form.email} onChange={set('email')} autoComplete="email" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" className="form-control" placeholder="+234..." value={form.phone} onChange={set('phone')} autoComplete="tel" />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input type="password" className="form-control" placeholder="Min 8 characters" required value={form.password} onChange={set('password')} autoComplete="new-password" />
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input type="password" className="form-control" placeholder="Confirm password" required value={form.confirmPassword} onChange={set('confirmPassword')} autoComplete="new-password" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }} disabled={loading}>
                {loading ? 'Submitting…' : 'Register as Player 🎉'}
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

// ─── Payment modal styles ────────────────────────────────────────
const ps = {
  overlay: {
    position: 'fixed', inset: 0, zIndex: 1000,
    background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px 16px',
  },
  modal: {
    background: 'linear-gradient(160deg,#15050a 0%,#1a0d16 100%)',
    border: '1px solid rgba(212,175,55,0.25)',
    borderRadius: 20, padding: '32px 28px',
    width: '100%', maxWidth: 520,
    maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
  },
  header: { textAlign: 'center', marginBottom: 20 },
  title: {
    fontFamily: "'Cinzel', serif", fontSize: '1.3rem',
    fontWeight: 900, color: '#D4AF37', marginBottom: 6,
  },
  sub: { fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', margin: 0 },
  amountBox: {
    background: 'rgba(212,175,55,0.07)',
    border: '1px solid rgba(212,175,55,0.2)',
    borderRadius: 12, padding: '16px 20px',
    textAlign: 'center', marginBottom: 20,
  },
  amountLabel: {
    fontSize: '0.68rem', fontWeight: 700, letterSpacing: 1.5,
    color: 'rgba(212,175,55,0.6)', textTransform: 'uppercase', marginBottom: 6,
  },
  amount: {
    fontFamily: "'Cinzel', serif", fontSize: '2rem',
    fontWeight: 900, color: '#D4AF37', lineHeight: 1,
  },
  amountTeam: {
    fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)',
    marginTop: 6, fontStyle: 'italic',
  },
  methodTabs: {
    display: 'flex', gap: 6, marginBottom: 16,
    background: 'rgba(255,255,255,0.04)',
    borderRadius: 10, padding: 4,
  },
  methodTab: {
    flex: 1, padding: '8px 4px',
    background: 'transparent', border: 'none',
    borderRadius: 8, cursor: 'pointer',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.72rem', fontWeight: 700,
    color: 'rgba(255,255,255,0.4)',
    transition: 'all 200ms',
  },
  methodTabActive: {
    background: 'rgba(212,175,55,0.15)',
    color: '#D4AF37',
    border: '1px solid rgba(212,175,55,0.25)',
  },
  detailsBox: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12, padding: '16px 18px',
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: '0.68rem', fontWeight: 800, letterSpacing: 1.2,
    color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
    marginBottom: 12,
  },
  detailRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  detailKey: { fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' },
  detailVal: { fontSize: '0.82rem', fontWeight: 700, color: '#fff' },
  note: {
    marginTop: 12,
    padding: '10px 12px',
    background: 'rgba(245,158,11,0.07)',
    border: '1px solid rgba(245,158,11,0.2)',
    borderRadius: 8,
    fontSize: '0.78rem',
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 1.6,
  },
  cancelBtn: {
    flex: '0 0 auto', padding: '11px 20px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: 'rgba(255,255,255,0.7)',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.8rem', fontWeight: 700,
    cursor: 'pointer',
  },
  confirmBtn: {
    flex: 1, padding: '12px 16px',
    background: 'linear-gradient(135deg,#22C55E,#15803D)',
    border: 'none', borderRadius: 10,
    color: '#fff',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.82rem', fontWeight: 800,
    cursor: 'pointer', transition: 'opacity 200ms',
  },
}
