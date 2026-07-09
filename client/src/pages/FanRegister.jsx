import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const EDO_LGAS = ['Akoko-Edo','Egor','Esan Central','Esan North-East','Esan South-East','Esan West','Etsako Central','Etsako East','Etsako West','Igueben','Ikpoba-Okha','Orhionmwon','Oredo','Ovia North-East','Ovia South-West','Owan East','Owan West','Uhunmwonde']

export default function FanRegister() {
  const [form, setForm] = useState({ name: '', lga: '', email: '', phone: '', preferredTeam: '', ticketCategory: '', password: '', confirmPassword: '' })
  const [teams, setTeams] = useState([])
  const [categories, setCategories] = useState([])
  const [prices, setPrices] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/fan/teams').then(r => r.json()).then(d => {
      setTeams(d.teams || [])
      setCategories(d.categories || [])
      setPrices(d.prices || {})
    }).catch(() => {})
  }, [])

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const price = useMemo(() => {
    if (!form.preferredTeam || !form.ticketCategory) return null
    return prices[form.preferredTeam]?.[form.ticketCategory] ?? null
  }, [form.preferredTeam, form.ticketCategory, prices])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!form.name.trim()) { setError('Full name is required.'); return }
    if (!form.lga) { setError('Please select your Local Government Area.'); return }
    if (!form.email.trim()) { setError('Email address is required.'); return }
    if (!form.phone.trim()) { setError('Phone number is required.'); return }
    if (!form.preferredTeam) { setError('Please select your preferred team.'); return }
    if (!form.ticketCategory) { setError('Please select a ticket category.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/fan/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed.'); setLoading(false); return }
      navigate('/fan/checkout')
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
            <span style={{ fontSize: '2rem' }}>🎟️</span>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '3px', color: 'var(--gold)' }}>FAN / TICKET REGISTRATION</div>
          </div>

          <h2 style={{ textAlign: 'center', marginBottom: 6 }}>Fan Account</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
            Support your team at StarCraft Cup 2026
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
            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" className="form-control" placeholder="you@email.com" value={form.email} onChange={set('email')} autoComplete="email" />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input type="tel" className="form-control" placeholder="+234 800 000 0000" value={form.phone} onChange={set('phone')} autoComplete="tel" />
            </div>
            <div className="form-group">
              <label>Preferred Team *</label>
              <select className="form-control" value={form.preferredTeam} onChange={set('preferredTeam')}>
                <option value="">Select a team to support</option>
                {teams.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Ticket Category *</label>
              <select className="form-control" value={form.ticketCategory} onChange={set('ticketCategory')} disabled={!form.preferredTeam}>
                <option value="">{form.preferredTeam ? 'Select a category' : 'Select a team first'}</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}{form.preferredTeam && prices[form.preferredTeam] ? ` — ₦${prices[form.preferredTeam][cat].toLocaleString()}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {price !== null && (
              <div style={s.priceBox}>
                <span>Ticket Price</span>
                <strong style={{ color: '#D4AF37', fontSize: '1.1rem' }}>₦{price.toLocaleString()}</strong>
              </div>
            )}

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
              {loading ? 'Creating account…' : 'Continue to Secure Checkout →'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
            Already registered? <Link to="/fan/login" style={{ color: 'var(--gold)', fontWeight: 700 }}>Sign In →</Link>
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

const s = {
  priceBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 10, padding: '12px 16px', marginBottom: 16, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' },
}
