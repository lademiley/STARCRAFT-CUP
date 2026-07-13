import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const EDO_LGAS = ['Akoko-Edo','Egor','Esan Central','Esan North-East','Esan South-East','Esan West','Etsako Central','Etsako East','Etsako West','Igueben','Ikpoba-Okha','Orhionmwon','Oredo','Ovia North-East','Ovia South-West','Owan East','Owan West','Uhunmwonde']
const KIT_SIZES = ['XS','S','M','L','XL','XXL']
const FEET = ['Left', 'Right', 'Both']
const FOOT_SIZES = ['35','36','37','38','39','40','41','42','43','44','45','46','47','48']

function calcAge(dob) {
  if (!dob) return ''
  const birth = new Date(dob)
  if (Number.isNaN(birth.getTime())) return ''
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const monthDiff = now.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age--
  return age
}

export default function PlayerRegister() {
  const [form, setForm] = useState({
    name: '', lga: '', dob: '', height: '', jerseySize: '', preferredFoot: '', footSize: '',
    phone: '', email: '', password: '', confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const age = useMemo(() => calcAge(form.dob), [form.dob])
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Full name is required.'); return }
    if (!form.lga) { setError('Please select your Local Government Area.'); return }
    if (!form.dob) { setError('Date of birth is required.'); return }
    const heightNum = Number(form.height)
    if (!Number.isFinite(heightNum) || heightNum < 100 || heightNum > 230) { setError('Height must be between 100 and 230 cm.'); return }
    if (!form.jerseySize) { setError('Please select a jersey size.'); return }
    if (!form.preferredFoot) { setError('Please select your preferred foot.'); return }
    if (!form.footSize) { setError('Please select your foot size.'); return }
    if (!form.phone.trim()) { setError('Phone number is required.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/player/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed.'); setLoading(false); return }
      navigate('/player/dashboard')
    } catch {
      setError('Network error — please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-container" style={{ maxWidth: 480 }}>
        <div className="auth-card card">
          <div className="auth-logo">
            <span style={{ fontSize: '2rem' }}>🧑‍⚽️</span>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '3px', color: 'var(--gold)' }}>PLAYER REGISTRATION</div>
          </div>

          <h2 style={{ textAlign: 'center', marginBottom: 6 }}>Player Account</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
            Register to take part in StarCraft Cup 2026
          </p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#f87171', fontSize: '0.88rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" className="form-control" placeholder="Your full name" value={form.name} onChange={set('name')} autoComplete="name" />
            </div>
            <div className="form-group">
              <label>Local Government Area (LGA) *</label>
              <select className="form-control" value={form.lga} onChange={set('lga')}>
                <option value="">Select your LGA</option>
                {EDO_LGAS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="grid-2" style={{ gap: 16 }}>
              <div className="form-group">
                <label>Date of Birth *</label>
                <input type="date" className="form-control" value={form.dob} onChange={set('dob')} />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="text" className="form-control" value={age === '' ? '' : `${age} years`} disabled placeholder="Auto-calculated" />
              </div>
            </div>
            <div className="grid-2" style={{ gap: 16 }}>
              <div className="form-group">
                <label>Height (cm) *</label>
                <input type="number" className="form-control" placeholder="e.g. 175" value={form.height} onChange={set('height')} />
              </div>
              <div className="form-group">
                <label>Jersey Size *</label>
                <select className="form-control" value={form.jerseySize} onChange={set('jerseySize')}>
                  <option value="">Select size</option>
                  {KIT_SIZES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid-2" style={{ gap: 16 }}>
              <div className="form-group">
                <label>Preferred Foot *</label>
                <select className="form-control" value={form.preferredFoot} onChange={set('preferredFoot')}>
                  <option value="">Select preferred foot</option>
                  {FEET.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Foot Size (EU) *</label>
                <select className="form-control" value={form.footSize} onChange={set('footSize')}>
                  <option value="">Select size</option>
                  {FOOT_SIZES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input type="tel" className="form-control" placeholder="+234 800 000 0000" value={form.phone} onChange={set('phone')} autoComplete="tel" />
            </div>
            <div className="form-group">
              <label>Email Address (optional)</label>
              <input type="email" className="form-control" placeholder="your@email.com" value={form.email} onChange={set('email')} autoComplete="email" />
            </div>
            <div className="grid-2" style={{ gap: 16 }}>
              <div className="form-group">
                <label>Password * (min 8 chars)</label>
                <input type="password" className="form-control" placeholder="Min 8 characters" value={form.password} onChange={set('password')} autoComplete="new-password" />
              </div>
              <div className="form-group">
                <label>Confirm Password *</label>
                <input type="password" className="form-control" placeholder="Repeat password" value={form.confirmPassword} onChange={set('confirmPassword')} autoComplete="new-password" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8, marginBottom: 16 }} disabled={loading}>
              {loading ? 'Creating account…' : 'Register as Player →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
            Already registered? <Link to="/player/login" style={{ color: 'var(--gold)', fontWeight: 700 }}>Sign In →</Link>
          </p>
          <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.85rem' }}>
            <Link to="/register" style={{ color: 'rgba(255,255,255,0.5)' }}>← Back to registration options</Link>
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
