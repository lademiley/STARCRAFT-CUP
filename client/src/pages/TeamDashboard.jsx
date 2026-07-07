import React, { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

function usePaymentSettings() {
  const [settings, setSettings] = useState(null)
  useEffect(() => {
    fetch('/api/settings/payment')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.settings) setSettings(d.settings) })
      .catch(() => {})
  }, [])
  return settings
}

const POSITIONS = ['Goalkeeper','Defender','Midfielder','Forward','Winger','Striker','Sweeper','Libero']

const emptyPlayer = () => ({ name: '', age: '', position: '', jersey: '' })

const fmt = iso => iso
  ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '—'

const STATUS_CFG = {
  pending: {
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    icon: '⏳',
    title: 'Application Under Review',
    message: 'Your team registration is being reviewed by the StarCraft Cup 2026 committee. You will be contacted at your registered email within 48 hours.',
    pulse: true,
  },
  approved: {
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.3)',
    icon: '🏆',
    title: 'Congratulations — Team Approved!',
    message: 'Your team has been officially accepted into StarCraft Cup 2026. Payment details and further instructions will be sent to your registered email.',
    pulse: false,
  },
  rejected: {
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.3)',
    icon: '❌',
    title: 'Application Not Approved',
    message: 'Unfortunately your team application was not approved at this time. Please see the reason below and contact the committee if you have questions.',
    pulse: false,
  },
}

export default function TeamDashboard() {
  const [params]                        = useSearchParams()
  const ref                             = params.get('ref')   || ''
  const token                           = params.get('token') || ''

  const [reg, setReg]                   = useState(null)
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [tab, setTab]                   = useState('status')         // 'status' | 'squad'
  const paymentSettings                 = usePaymentSettings()

  // Add-player form
  const [showForm, setShowForm]         = useState(false)
  const [playerForm, setPlayerForm]     = useState(emptyPlayer())
  const [formError, setFormError]       = useState('')
  const [saving, setSaving]             = useState(false)

  const load = useCallback(async () => {
    if (!ref) { setError('No registration reference provided.'); setLoading(false); return }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/teams/registrations/by-ref/${encodeURIComponent(ref)}?token=${encodeURIComponent(token)}`)
      if (res.status === 404) throw new Error('Registration not found. Please check your reference code.')
      if (res.status === 403) throw new Error('Invalid access token. Please use the original link from your registration email.')
      if (!res.ok) throw new Error('Failed to load registration.')
      const data = await res.json()
      setReg(data.registration)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [ref, token])

  useEffect(() => { load() }, [load])

  // Auto-refresh every 30 s to pick up admin approval changes
  useEffect(() => {
    const t = setInterval(load, 30_000)
    return () => clearInterval(t)
  }, [load])

  const pf = k => e => setPlayerForm(p => ({ ...p, [k]: e.target.value }))

  const addPlayer = async () => {
    setFormError('')
    if (!playerForm.name.trim()) { setFormError('Player name is required.'); return }
    if (!playerForm.position)    { setFormError('Position is required.'); return }
    if (!playerForm.age || Number(playerForm.age) < 15 || Number(playerForm.age) > 45) {
      setFormError('Please enter a valid age (15–45).')
      return
    }
    if (reg.players.length >= 18) { setFormError('Maximum squad size is 18 players.'); return }
    setSaving(true)
    try {
      const res = await fetch(`/api/teams/registrations/by-ref/${encodeURIComponent(ref)}/players`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, player: playerForm }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to add player.') }
      await load()
      setPlayerForm(emptyPlayer())
      setShowForm(false)
    } catch (e) {
      setFormError(e.message)
    } finally {
      setSaving(false)
    }
  }

  /* ─── Loading / error screens ─── */
  if (loading) {
    return (
      <div style={s.page}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', paddingTop: 80 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16, animation: 'spin 1s linear infinite' }}>⚽</div>
          <div>Loading your dashboard…</div>
        </div>
        <style>{globalCss}</style>
      </div>
    )
  }

  if (error || !reg) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚠️</div>
            <h3 style={{ color: '#f87171', marginBottom: 8 }}>Registration Not Found</h3>
            <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 24, fontSize: '0.9rem' }}>
              {error || 'We could not find a registration matching this reference.'}
            </p>
            <Link to="/register" style={s.btnPrimary}>Register a Team</Link>
            <span style={{ display: 'inline-block', width: 12 }} />
            <Link to="/" style={s.btnGhost}>Back to Home</Link>
          </div>
        </div>
        <style>{globalCss}</style>
      </div>
    )
  }

  const cfg    = STATUS_CFG[reg.status] || STATUS_CFG.pending
  const canAdd = reg.status !== 'rejected' && reg.players.length < 18
  const activeMethods = paymentSettings?.methods?.filter(m => m.enabled) || []
  const payRef = `REG-${reg.teamName.replace(/\s+/g,'').toUpperCase().slice(0,6)}`

  /* ─── Topbar (shared) ─── */
  const topbar = (
    <div style={s.topbar}>
      <div style={s.topbarLeft}>
        <span style={{ fontSize: '1.4rem' }}>⚽</span>
        <div>
          <div style={s.brand}>STARCRAFT CUP 2026</div>
          <div style={s.brandSub}>Team Representative Dashboard</div>
        </div>
      </div>
      <div style={s.topbarRight}>
        <div style={{ ...s.refBadge, color: '#D4AF37' }}>{reg.ref}</div>
        <Link to="/" style={s.btnGhost}>← Home</Link>
      </div>
    </div>
  )

  /* ═══════════════════════════════════════════════════════
     PENDING — Payment confirmation gate
  ═══════════════════════════════════════════════════════ */
  if (reg.status === 'pending') {
    return (
      <div style={s.page}>
        {topbar}
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 60px' }}>

          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 12 }}>🏦</div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '1.5rem', color: '#D4AF37', marginBottom: 8 }}>
              Complete Your Payment
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem', lineHeight: 1.7 }}>
              Your team <strong style={{ color: '#fff' }}>{reg.teamName}</strong> has been registered.<br />
              Transfer the registration fee to the account below to confirm your place in the tournament.
            </p>
          </div>

          {/* Amount box */}
          <div style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 14, padding: '20px 24px', textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: 2, color: 'rgba(212,175,55,0.6)', textTransform: 'uppercase', marginBottom: 6 }}>Registration Fee</div>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: '2.4rem', fontWeight: 900, color: '#D4AF37', lineHeight: 1 }}>₦25,000</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: 8, fontStyle: 'italic' }}>{reg.teamName}</div>
          </div>

          {/* Bank details */}
          {activeMethods.length === 0 ? (
            <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '20px 24px', marginBottom: 20, textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem' }}>
              ⚙️ Payment details are being configured. Please contact the committee directly.
            </div>
          ) : activeMethods.map((method, idx) => (
            <div key={method.id || idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 14, padding: '20px 24px', marginBottom: 16 }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: 2, color: 'rgba(212,175,55,0.6)', textTransform: 'uppercase', marginBottom: 14 }}>
                🏦 {method.label || 'Official Account'}
              </div>
              {[
                method.bankName      && ['Bank',           method.bankName],
                method.accountName   && ['Account Name',   method.accountName],
                method.accountNumber && ['Account Number', method.accountNumber],
                method.sortCode      && ['Sort Code',      method.sortCode],
              ].filter(Boolean).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: 16 }}>
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>{k}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, textAlign: 'right', wordBreak: 'break-word' }}>{v}</span>
                </div>
              ))}
              {/* Payment reference row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', gap: 16 }}>
                <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>Payment Reference</span>
                <span style={{ fontFamily: "'Cinzel', serif", fontSize: '1rem', color: '#D4AF37', fontWeight: 900, letterSpacing: 2 }}>{payRef}</span>
              </div>
              {method.instructions && (
                <p style={{ margin: '12px 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{method.instructions}</p>
              )}
            </div>
          ))}

          {/* Warning note */}
          <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '14px 18px', marginBottom: 24, fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
            ⚠️ Use <strong style={{ color: '#F59E0B' }}>{payRef}</strong> as your transfer narration so we can match your payment.
            Once our committee confirms your transfer, this page will unlock your full team dashboard automatically.
          </div>

          {/* Auto-refresh notice */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
            <span style={{ ...s.pulse, background: '#F59E0B', flexShrink: 0, width: 8, height: 8, borderRadius: '50%', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
            This page checks for payment confirmation automatically every 30 seconds.
            You can bookmark this URL and return at any time.
          </div>
        </div>
        <style>{globalCss}</style>
      </div>
    )
  }

  /* ═══════════════════════════════════════════════════════
     REJECTED — simple message
  ═══════════════════════════════════════════════════════ */
  if (reg.status === 'rejected') {
    return (
      <div style={s.page}>
        {topbar}
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '60px 24px' }}>
          <div style={{ ...s.card, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', textAlign: 'center', padding: '48px 32px' }}>
            <div style={{ fontSize: '3rem', marginBottom: 14 }}>❌</div>
            <h3 style={{ fontFamily: "'Cinzel', serif", color: '#f87171', marginBottom: 12 }}>Application Not Approved</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 0 }}>
              Unfortunately your team application was not approved at this time.
            </p>
            {reg.reviewNote && (
              <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: '0.85rem', color: '#f87171', fontStyle: 'italic', textAlign: 'left' }}>
                <strong>Reason:</strong> {reg.reviewNote}
              </div>
            )}
            <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={s.btnPrimary}>Register a New Team</Link>
              <Link to="/contact" style={s.btnGhost}>Contact Committee</Link>
            </div>
          </div>
        </div>
        <style>{globalCss}</style>
      </div>
    )
  }

  /* ═══════════════════════════════════════════════════════
     APPROVED — full dashboard (payment confirmed ✅)
  ═══════════════════════════════════════════════════════ */
  return (
    <div style={s.page}>
      {/* ── Top bar ── */}
      {topbar}

      <div style={s.body}>
        {/* ── Team header ── */}
        <div style={s.teamHeader}>
          <div style={{ fontSize: '3rem' }}>🏟️</div>
          <div>
            <h1 style={s.teamName}>{reg.teamName}</h1>
            <div style={s.teamMeta}>
              <span>{reg.city || '—'}</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>Coach: {reg.coach || '—'}</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>Rep: {reg.repName}</span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <div style={{ ...s.statusPill, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
              {cfg.icon} Approved
            </div>
          </div>
        </div>

        {/* Payment confirmed banner */}
        <div style={{ background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 12, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.88rem', color: '#4ade80' }}>
          <span style={{ fontSize: '1.3rem' }}>✅</span>
          <div>
            <strong>Payment Confirmed — Dashboard Unlocked</strong>
            <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: 8, fontSize: '0.8rem' }}>
              {reg.reviewNote ? `Committee note: ${reg.reviewNote}` : 'Your team is officially registered for StarCraft Cup 2026.'}
            </span>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={s.tabs}>
          {[['status','📋 Registration Details'],['squad','👥 Squad Management']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{ ...s.tab, ...(tab === key ? s.tabActive : {}) }}>
              {label}
            </button>
          ))}
        </div>

        {/* ════════ STATUS TAB ════════ */}
        {tab === 'status' && (
          <div>
            {/* Registration details grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div style={s.card}>
                <div style={s.cardTitle}>📄 Registration Details</div>
                <table style={{ width: '100%' }}>
                  <tbody>
                    {[
                      ['Reference',    <span style={{ fontFamily: 'monospace', color: '#D4AF37', fontWeight: 700 }}>{reg.ref}</span>],
                      ['Submitted',    fmt(reg.submittedAt)],
                      ['Confirmed',    reg.reviewedAt ? fmt(reg.reviewedAt) : '—'],
                      ['Status',       <span style={{ color: cfg.color, fontWeight: 700 }}>Approved ✅</span>],
                    ].map(([k, v]) => (
                      <tr key={k}>
                        <td style={s.dtKey}>{k}</td>
                        <td style={s.dtVal}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={s.card}>
                <div style={s.cardTitle}>🏟️ Team Info</div>
                <table style={{ width: '100%' }}>
                  <tbody>
                    {[
                      ['Team Name',  reg.teamName],
                      ['City / LGA', reg.city || '—'],
                      ['Coach',      reg.coach || '—'],
                      ['Kit Colors', reg.homeColors || '—'],
                      ['Founded',    reg.yearFounded || '—'],
                    ].map(([k, v]) => (
                      <tr key={k}>
                        <td style={s.dtKey}>{k}</td>
                        <td style={s.dtVal}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Contact card */}
            <div style={s.card}>
              <div style={s.cardTitle}>👤 Representative Contact</div>
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                {[['Name', reg.repName], ['Email', reg.repEmail], ['Phone', reg.repPhone || '—']].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════ SQUAD TAB ════════ */}
        {tab === 'squad' && (
          <div>
            <div style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div style={s.cardTitle}>👥 Squad — {reg.players.length} / 18 Players</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Min 11 required for tournament participation</div>
                </div>
                {canAdd && !showForm && (
                  <button onClick={() => setShowForm(true)} style={s.btnPrimary}>
                    + Add Player
                  </button>
                )}
                {!canAdd && reg.status !== 'rejected' && (
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>Squad full (18/18)</span>
                )}
              </div>

              {/* Add player form */}
              {showForm && (
                <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                  <div style={{ fontFamily: "'Cinzel', serif", fontSize: '0.85rem', color: '#D4AF37', marginBottom: 16, fontWeight: 700 }}>New Player Details</div>
                  {formError && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: '0.82rem', marginBottom: 12 }}>{formError}</div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div>
                      <label style={s.label}>Full Name *</label>
                      <input style={s.input} placeholder="e.g. Chukwuemeka Obi" value={playerForm.name} onChange={pf('name')} />
                    </div>
                    <div>
                      <label style={s.label}>Age *</label>
                      <input style={s.input} type="number" placeholder="e.g. 22" min={15} max={45} value={playerForm.age} onChange={pf('age')} />
                    </div>
                    <div>
                      <label style={s.label}>Position *</label>
                      <select style={s.select} value={playerForm.position} onChange={pf('position')}>
                        <option value="">Select position</option>
                        {POSITIONS.map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={s.label}>Jersey Number</label>
                      <input style={s.input} type="number" placeholder="e.g. 10" min={1} max={99} value={playerForm.jersey} onChange={pf('jersey')} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button onClick={() => { setShowForm(false); setFormError(''); setPlayerForm(emptyPlayer()) }} style={s.btnGhost} disabled={saving}>Cancel</button>
                    <button onClick={addPlayer} style={s.btnPrimary} disabled={saving}>{saving ? 'Adding…' : '✅ Add to Squad'}</button>
                  </div>
                </div>
              )}

              {/* Squad table */}
              {reg.players.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.3)' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 10 }}>👟</div>
                  <div style={{ fontSize: '0.9rem' }}>No players added yet</div>
                  <div style={{ fontSize: '0.75rem', marginTop: 4 }}>Add at least 11 players to complete your squad</div>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['#', 'Name', 'Position', 'Age', 'Jersey'].map(h => (
                          <th key={h} style={s.th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {reg.players.map((p, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                          <td style={{ ...s.td, color: 'rgba(255,255,255,0.3)', width: 32 }}>{i + 1}</td>
                          <td style={{ ...s.td, fontWeight: 600 }}>{p.name}</td>
                          <td style={s.td}>
                            <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 20, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', color: '#60a5fa', fontSize: '0.72rem', fontWeight: 700 }}>{p.position || '—'}</span>
                          </td>
                          <td style={s.td}>{p.age || '—'}</td>
                          <td style={{ ...s.td, color: '#D4AF37', fontWeight: 700 }}>{p.jersey ? `#${p.jersey}` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Squad strength indicator */}
              {reg.players.length > 0 && (
                <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Squad strength</span>
                      <span style={{ fontSize: '0.72rem', color: reg.players.length >= 11 ? '#22C55E' : '#F59E0B' }}>{reg.players.length}/18 players</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(reg.players.length / 18) * 100}%`, background: reg.players.length >= 11 ? 'linear-gradient(90deg,#22C55E,#16a34a)' : 'linear-gradient(90deg,#F59E0B,#d97706)', borderRadius: 99, transition: 'width 500ms ease' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: reg.players.length >= 11 ? '#4ade80' : '#fbbf24', fontWeight: 700 }}>
                    {reg.players.length >= 11 ? '✓ Eligible' : `${11 - reg.players.length} more needed`}
                  </span>
                </div>
              )}

              {reg.status === 'rejected' && (
                <div style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
                  Squad editing is disabled for rejected applications. Please re-register to submit a new team.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{globalCss}</style>
    </div>
  )
}

/* ─── Styles ─── */
const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg,#0d0102 0%,#1a0510 40%,#0d0d16 100%)',
    color: '#fff',
    fontFamily: "'Poppins', sans-serif",
  },
  topbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 32px',
    background: 'rgba(17,17,32,0.8)',
    borderBottom: '1px solid rgba(212,175,55,0.12)',
    backdropFilter: 'blur(10px)',
    position: 'sticky', top: 0, zIndex: 100,
    gap: 16,
  },
  topbarLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  topbarRight: { display: 'flex', alignItems: 'center', gap: 14 },
  brand: { fontFamily: "'Cinzel', serif", fontSize: '0.85rem', fontWeight: 900, color: '#D4AF37', letterSpacing: 2 },
  brandSub: { fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', fontFamily: "'Montserrat', sans-serif", letterSpacing: 1 },
  refBadge: { fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 700, background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 8, padding: '4px 12px' },
  body: { maxWidth: 960, margin: '0 auto', padding: '28px 24px 60px' },
  teamHeader: {
    display: 'flex', alignItems: 'center', gap: 20,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, padding: '24px 28px',
    marginBottom: 24, flexWrap: 'wrap',
  },
  teamName: { fontFamily: "'Cinzel', serif", fontSize: '1.5rem', fontWeight: 900, color: '#fff', margin: 0, marginBottom: 6 },
  teamMeta: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', display: 'flex', gap: 10, flexWrap: 'wrap' },
  statusPill: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 16px', borderRadius: 20,
    fontFamily: "'Montserrat', sans-serif", fontSize: '0.78rem', fontWeight: 800, letterSpacing: 0.5,
  },
  pulse: { display: 'inline-block', width: 7, height: 7, borderRadius: '50%', animation: 'pulse 1.5s infinite' },
  tabs: {
    display: 'flex', gap: 4,
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    marginBottom: 20,
  },
  tab: {
    background: 'none', border: 'none', borderBottom: '2px solid transparent',
    color: 'rgba(255,255,255,0.45)', cursor: 'pointer', padding: '10px 20px',
    fontFamily: "'Montserrat', sans-serif", fontSize: '0.82rem', fontWeight: 700,
    transition: 'all 200ms', marginBottom: -1,
  },
  tabActive: { color: '#D4AF37', borderBottomColor: '#D4AF37' },
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14, padding: '20px 24px',
  },
  cardTitle: {
    fontFamily: "'Montserrat', sans-serif", fontSize: '0.72rem',
    fontWeight: 800, letterSpacing: 1, color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase', marginBottom: 14,
  },
  dtKey: { fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', padding: '6px 0', paddingRight: 24, whiteSpace: 'nowrap', verticalAlign: 'top' },
  dtVal: { fontSize: '0.83rem', color: 'rgba(255,255,255,0.85)', padding: '6px 0', fontWeight: 500 },
  th: { padding: '10px 14px', textAlign: 'left', fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: 0.8, textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.07)' },
  td: { padding: '11px 14px', fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  label: { display: 'block', fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  input: { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontFamily: "'Poppins', sans-serif", fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontFamily: "'Poppins', sans-serif", fontSize: '0.85rem', outline: 'none', cursor: 'pointer' },
  btnPrimary: { display: 'inline-block', padding: '9px 20px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#D4AF37,#8C6A12)', color: '#000', fontFamily: "'Montserrat', sans-serif", fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'none', transition: 'opacity 200ms' },
  btnGhost: { display: 'inline-block', padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', fontFamily: "'Montserrat', sans-serif", fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'none', transition: 'opacity 200ms' },
}

const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Montserrat:wght@600;700;800&family=Poppins:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.85)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @media(max-width:640px){
    .team-grid{grid-template-columns:1fr!important}
  }
`
