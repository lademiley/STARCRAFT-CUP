import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function formatCardNumber(v) {
  return v.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(v) {
  const d = v.replace(/\D/g, '').slice(0, 4)
  if (d.length <= 2) return d
  return `${d.slice(0, 2)}/${d.slice(2)}`
}

export default function FanCheckout() {
  const navigate = useNavigate()
  const [fan, setFan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ cardName: '', cardNumber: '', expiry: '', cvv: '' })
  const [paying, setPaying] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/fan/me', { credentials: 'include' })
      if (!res.ok) { navigate('/fan/login'); return }
      const data = await res.json()
      if (data.fan.status !== 'pending_payment') { navigate('/fan/dashboard'); return }
      setFan(data.fan)
    } catch {
      setError('Failed to load checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => { load() }, [load])

  const handlePay = async e => {
    e.preventDefault()
    setError('')
    setPaying(true)
    try {
      const res = await fetch('/api/fan/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Payment failed.'); setPaying(false); return }
      navigate('/fan/dashboard')
    } catch {
      setError('Network error — please try again.')
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="auth-page">
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔒</div>
          <div>Loading secure checkout…</div>
        </div>
        <style>{pageStyle}</style>
      </div>
    )
  }

  if (!fan) return null

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-container" style={{ maxWidth: 460 }}>
        <div className="auth-card card">
          <div className="auth-logo">
            <span style={{ fontSize: '2rem' }}>🔒</span>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '3px', color: 'var(--gold)' }}>SECURE CHECKOUT</div>
          </div>

          <div style={s.summary}>
            <div style={s.summaryRow}><span>Fan</span><strong>{fan.name}</strong></div>
            <div style={s.summaryRow}><span>Team</span><strong>{fan.preferredTeam}</strong></div>
            <div style={s.summaryRow}><span>Category</span><strong>{fan.ticketCategory}</strong></div>
            <div style={{ ...s.summaryRow, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 10, marginTop: 6 }}>
              <span>Total Due</span><strong style={{ color: '#D4AF37', fontSize: '1.2rem' }}>₦{fan.ticketPrice.toLocaleString()}</strong>
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#f87171', fontSize: '0.88rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handlePay} noValidate>
            <div className="form-group">
              <label>Cardholder Name *</label>
              <input type="text" className="form-control" placeholder="Name on card" value={form.cardName} onChange={e => setForm(p => ({ ...p, cardName: e.target.value }))} autoComplete="cc-name" />
            </div>
            <div className="form-group">
              <label>Card Number *</label>
              <input type="text" inputMode="numeric" className="form-control" placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={e => setForm(p => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))} autoComplete="cc-number" maxLength={23} />
            </div>
            <div className="grid-2" style={{ gap: 16 }}>
              <div className="form-group">
                <label>Expiry (MM/YY) *</label>
                <input type="text" inputMode="numeric" className="form-control" placeholder="MM/YY" value={form.expiry} onChange={e => setForm(p => ({ ...p, expiry: formatExpiry(e.target.value) }))} autoComplete="cc-exp" maxLength={5} />
              </div>
              <div className="form-group">
                <label>CVV *</label>
                <input type="password" inputMode="numeric" className="form-control" placeholder="123" value={form.cvv} onChange={e => setForm(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} autoComplete="cc-csc" maxLength={4} />
              </div>
            </div>
            <div style={s.secureNote}>🔒 Your card details are validated and encrypted in transit — only the last 4 digits are ever stored.</div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8, marginBottom: 16 }} disabled={paying}>
              {paying ? 'Processing payment…' : `Pay ₦${fan.ticketPrice.toLocaleString()} Securely →`}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
            After payment your ticket enters <strong>Pending Approval</strong> until verified by the tournament committee.
          </p>
        </div>
      </div>
      <style>{pageStyle}</style>
    </div>
  )
}

const pageStyle = `
  .auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:100px 24px 40px;background:linear-gradient(160deg,#0d0102 0%,#3a0608 50%,#0d0102 100%)}
  .auth-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(212,175,55,.06) 0%,transparent 70%);pointer-events:none}
  .auth-container{width:100%;position:relative;z-index:1}
  .auth-card{padding:40px}
  .auth-logo{display:flex;align-items:center;gap:14px;justify-content:center;margin-bottom:20px}
  @media(max-width:480px){.auth-card{padding:28px 20px}}
`

const s = {
  summary: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 18px', marginBottom: 20 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', padding: '4px 0' },
  secureNote: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 16, lineHeight: 1.5 },
}
