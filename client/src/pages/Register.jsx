import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const EDO_LGAS = ['Akoko-Edo','Egor','Esan Central','Esan North-East','Esan South-East','Esan West','Etsako Central','Etsako East','Etsako West','Igueben','Ikpoba-Okha','Orhionmwon','Oredo','Ovia North-East','Ovia South-West','Owan East','Owan West','Uhunmwonde']
const KIT_SIZES = ['XS','S','M','L','XL','XXL']

export default function Register() {
  const [mode, setMode] = useState('choose')
  const [form, setForm] = useState({
    email: '', password: '', confirmPassword: '', name: '', phone: '',
    lga: '', age: '', kitSize: '', height: '', footSize: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  // ── Fan / ticket account registration ──────────────────────────
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
      <div className="auth-container" style={{ maxWidth: mode === 'choose' ? 780 : 480 }}>
        <div className="auth-card card">

          {/* Logo */}
          <div className="auth-logo">
            <span style={{ fontSize: '2rem' }}>⚽</span>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '3px', color: 'var(--gold)' }}>STARCRAFT CUP 2026</div>
          </div>

          <h2 style={{ textAlign: 'center', marginBottom: 6 }}>Create Account</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
            Join StarCraft Cup 2026 — Edo State
          </p>

          {/* ══════════════ CHOOSER ══════════════ */}
          {mode === 'choose' && (
            <div>
              <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                <Link to="/register/chairman" className="card" style={choiceCardStyle}>
                  <div style={{ fontSize: '2.4rem', marginBottom: 10 }}>🏛️</div>
                  <div style={choiceTitleStyle}>LGA Chairman</div>
                  <p style={choiceDescStyle}>Register your Local Government Area and manage players from your dashboard.</p>
                </Link>
                <Link to="/register/player" className="card" style={choiceCardStyle}>
                  <div style={{ fontSize: '2.4rem', marginBottom: 10 }}>🧑‍⚽️</div>
                  <div style={choiceTitleStyle}>Player</div>
                  <p style={choiceDescStyle}>Register as an individual player to take part in the tournament.</p>
                </Link>
                <button type="button" onClick={() => setMode('fan')} className="card" style={{ ...choiceCardStyle, cursor: 'pointer', border: 'none', textAlign: 'left', font: 'inherit' }}>
                  <div style={{ fontSize: '2.4rem', marginBottom: 10 }}>🎟️</div>
                  <div style={choiceTitleStyle}>Fan / Ticket Account</div>
                  <p style={choiceDescStyle}>Create a supporter account to purchase match tickets.</p>
                </button>
              </div>
            </div>
          )}

          {/* Error banner */}
          {mode === 'fan' && error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#f87171', fontSize: '0.88rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {/* ══════════════ FAN / TICKET ACCOUNT ══════════════ */}
          {mode === 'fan' && (
            <form onSubmit={handleFanSubmit} noValidate>
              <button type="button" onClick={() => { setMode('choose'); setError('') }} style={backLinkStyle}>← Back to options</button>
              <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.5)', marginBottom: 16, marginTop: 8 }}>
                Create a fan account to buy tickets and follow the tournament.
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
                    {EDO_LGAS.map(t => <option key={t}>{t}</option>)}
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
                    {KIT_SIZES.map(s => <option key={s}>{s}</option>)}
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
                {loading ? 'Submitting…' : 'Create Fan Account 🎉'}
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

const choiceCardStyle = {
  display: 'block', padding: 24, textAlign: 'center',
  border: '1px solid rgba(212,175,55,0.2)', borderRadius: 14,
  textDecoration: 'none', color: '#fff', transition: 'transform 200ms, border-color 200ms',
  cursor: 'pointer',
}
const choiceTitleStyle = { fontFamily: 'var(--font-secondary)', fontWeight: 800, fontSize: '1rem', color: 'var(--gold)', marginBottom: 8 }
const choiceDescStyle = { fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, margin: 0 }
const backLinkStyle = { background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, padding: 0 }
