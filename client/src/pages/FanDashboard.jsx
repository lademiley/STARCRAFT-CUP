import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const fmt = iso => iso
  ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '—'

function qrUrl(data, size = 220) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&bgcolor=1a0103&color=D4AF37&margin=10`
}

const STATUS_CFG = {
  pending_payment: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'Payment Required', icon: '💳', msg: 'Complete secure checkout to submit your ticket for approval.' },
  pending_approval: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'Pending Approval', icon: '⏳', msg: 'Your payment has been received and is awaiting verification by the tournament committee.' },
  approved: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)', label: 'Approved', icon: '✅', msg: 'Your ticket has been approved. See it below.' },
  rejected: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', label: 'Not Approved', icon: '❌', msg: 'Your payment could not be verified. Please contact the tournament committee.' },
}

export default function FanDashboard() {
  const navigate = useNavigate()
  const [fan, setFan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('status')
  const [editForm, setEditForm] = useState({ name: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [photoError, setPhotoError] = useState('')
  const fileRef = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/fan/me', { credentials: 'include' })
      if (!res.ok) { navigate('/fan/login'); return }
      const data = await res.json()
      if (data.fan.status === 'pending_payment') { navigate('/fan/checkout'); return }
      setFan(data.fan)
      setEditForm({ name: data.fan.name, phone: data.fan.phone })
    } catch {
      setError('Failed to load dashboard. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => { load() }, [load])

  const saveProfile = async e => {
    e.preventDefault()
    setSaving(true)
    setSaveMsg('')
    try {
      const res = await fetch('/api/fan/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editForm),
      })
      const data = await res.json()
      if (!res.ok) { setSaveMsg(data.error || 'Failed to update profile.'); setSaving(false); return }
      setFan(data.fan)
      setSaveMsg('Profile updated successfully.')
    } catch {
      setSaveMsg('Network error — please try again.')
    } finally {
      setSaving(false)
    }
  }

  const uploadPhoto = async file => {
    if (!file) return
    setPhotoError('')
    try {
      const fd = new FormData()
      fd.append('photo', file)
      const res = await fetch('/api/fan/photo', { method: 'POST', credentials: 'include', body: fd })
      const data = await res.json()
      if (!res.ok) { setPhotoError(data.error || 'Failed to upload photo.'); return }
      setFan(data.fan)
    } catch {
      setPhotoError('Network error — please try again.')
    }
  }

  const markRead = async id => {
    await fetch(`/api/fan/notifications/${id}/read`, { method: 'PATCH', credentials: 'include' }).catch(() => {})
    setFan(p => ({ ...p, notifications: p.notifications.map(n => n.id === id ? { ...n, read: true } : n) }))
  }

  const handleLogout = async () => {
    await fetch('/api/fan/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
    navigate('/fan/login')
  }

  const downloadTicket = () => {
    const t = fan.ticket
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`
      <html><head><title>Ticket ${t.id}</title>
      <style>body{font-family:sans-serif;padding:40px;color:#111;text-align:center} h1{color:#8B0E12} table{width:100%;border-collapse:collapse;margin-top:20px;text-align:left} td{padding:8px;border-bottom:1px solid #ddd} img{margin-top:20px}</style>
      </head><body>
      <h1>StarCraft Cup 2026 — Digital Ticket</h1>
      <img src="${qrUrl(t.qrData, 240)}" alt="QR Code" />
      <table>
        <tr><td><strong>Ticket ID</strong></td><td>${t.id}</td></tr>
        <tr><td><strong>Fan Name</strong></td><td>${fan.name}</td></tr>
        <tr><td><strong>Team</strong></td><td>${fan.preferredTeam}</td></tr>
        <tr><td><strong>Category</strong></td><td>${fan.ticketCategory}</td></tr>
        <tr><td><strong>Match Details</strong></td><td>${t.matchDetails}</td></tr>
        <tr><td><strong>Seat Number</strong></td><td>${t.seatNumber || 'General Admission'}</td></tr>
        <tr><td><strong>Payment Status</strong></td><td>${fan.payment.status.toUpperCase()}</td></tr>
      </table>
      </body></html>
    `)
    w.document.close()
    w.print()
  }

  if (loading) {
    return (
      <div style={s.page}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', paddingTop: 80 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🎟️</div>
          <div>Loading your dashboard…</div>
        </div>
      </div>
    )
  }

  if (error || !fan) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚠️</div>
            <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 24 }}>{error || 'Could not load fan account.'}</p>
            <Link to="/fan/login" style={s.btnPrimary}>Sign In</Link>
          </div>
        </div>
      </div>
    )
  }

  const cfg = STATUS_CFG[fan.status] || STATUS_CFG.pending_approval
  const unreadCount = fan.notifications.filter(n => !n.read).length

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <div style={s.topbarLeft}>
          <span style={{ fontSize: '1.4rem' }}>🎟️</span>
          <div>
            <div style={s.brand}>STARCRAFT CUP 2026</div>
            <div style={s.brandSub}>Fan Dashboard</div>
          </div>
        </div>
        <div style={s.topbarRight}>
          <Link to="/" style={s.btnGhost}>← Home</Link>
          <button onClick={handleLogout} style={s.btnLogout}>Logout</button>
        </div>
      </div>

      <div style={s.body}>
        <div style={s.header}>
          <div style={s.avatarWrap}>
            {fan.photoUrl
              ? <img src={fan.photoUrl} alt={fan.name} style={s.avatarImg} />
              : <div style={s.avatarFallback}>{fan.name.charAt(0)}</div>}
          </div>
          <div>
            <h1 style={s.name}>{fan.name}</h1>
            <div style={s.meta}>
              <span>📍 {fan.lga} LGA</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>🎽 {fan.preferredTeam}</span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <div style={{ ...s.statusPillBig, background: cfg.bg, color: cfg.color }}>{cfg.icon} {cfg.label}</div>
          </div>
        </div>

        <div style={s.tabs}>
          {[['status', '📋 Status'], ['ticket', '🎫 My Ticket'], ['profile', '✏️ Edit Profile'], ['payments', '💳 Payment History'], ['notifications', `🔔 Notifications${unreadCount ? ` (${unreadCount})` : ''}`]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ ...s.tab, ...(tab === k ? s.tabActive : {}) }}>{l}</button>
          ))}
        </div>

        {tab === 'status' && (
          <div style={s.card}>
            <div style={{ ...s.statusBanner, background: cfg.bg, borderColor: cfg.color }}>
              <div style={{ fontSize: '2rem' }}>{cfg.icon}</div>
              <div>
                <div style={{ fontWeight: 800, color: cfg.color }}>{cfg.label}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{cfg.msg}</div>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              {[
                ['Full Name', fan.name],
                ['LGA', fan.lga],
                ['Email', fan.email],
                ['Phone', fan.phone],
                ['Preferred Team', fan.preferredTeam],
                ['Ticket Category', fan.ticketCategory],
                ['Ticket Price', `₦${fan.ticketPrice.toLocaleString()}`],
                ['Registered On', fmt(fan.createdAt)],
              ].map(([k, v]) => (
                <div key={k} style={s.infoRow}><span style={s.infoKey}>{k}</span><span style={s.infoVal}>{v}</span></div>
              ))}
            </div>
          </div>
        )}

        {tab === 'ticket' && (
          <div style={s.card}>
            {fan.status !== 'approved' || !fan.ticket ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🎫</div>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Your ticket isn't ready yet</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Your digital ticket, QR code and seat details will appear here once your payment is approved.</div>
              </div>
            ) : (
              <div>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <img src={qrUrl(fan.ticket.qrData)} alt="Ticket QR Code" style={{ borderRadius: 12, border: '1px solid rgba(212,175,55,0.3)' }} />
                </div>
                {[
                  ['Ticket ID', fan.ticket.id],
                  ['Fan Name', fan.name],
                  ['Selected Team', fan.preferredTeam],
                  ['Ticket Category', fan.ticketCategory],
                  ['Match Details', fan.ticket.matchDetails],
                  ['Seat Number', fan.ticket.seatNumber || 'General Admission'],
                  ['Payment Status', fan.payment?.status?.toUpperCase()],
                ].map(([k, v]) => (
                  <div key={k} style={s.infoRow}><span style={s.infoKey}>{k}</span><span style={s.infoVal}>{v}</span></div>
                ))}
                <button onClick={downloadTicket} style={{ ...s.btnSecondary, width: '100%', justifyContent: 'center', marginTop: 20 }}>
                  📄 Download Ticket
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'profile' && (
          <div style={s.card}>
            <div style={s.cardTitle}>Edit Personal Information</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={s.avatarWrapSm}>
                {fan.photoUrl
                  ? <img src={fan.photoUrl} alt={fan.name} style={s.avatarImg} />
                  : <div style={s.avatarFallback}>{fan.name.charAt(0)}</div>}
              </div>
              <div>
                <button type="button" onClick={() => fileRef.current?.click()} style={s.btnSecondary}>Upload / Change Photo</button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => uploadPhoto(e.target.files[0])} />
              </div>
            </div>
            {photoError && <div style={s.errorBanner}>{photoError}</div>}
            {saveMsg && <div style={{ ...s.errorBanner, color: saveMsg.includes('success') ? '#22C55E' : '#f87171', background: saveMsg.includes('success') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>{saveMsg}</div>}
            <form onSubmit={saveProfile}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="form-control" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" className="form-control" value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Email Address (cannot be changed)</label>
                <input type="email" className="form-control" value={fan.email} disabled />
              </div>
              <div className="grid-2" style={{ gap: 16 }}>
                <div className="form-group">
                  <label>LGA (cannot be changed)</label>
                  <input type="text" className="form-control" value={fan.lga} disabled />
                </div>
                <div className="form-group">
                  <label>Preferred Team (cannot be changed)</label>
                  <input type="text" className="form-control" value={fan.preferredTeam} disabled />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
            </form>
          </div>
        )}

        {tab === 'payments' && (
          <div style={s.card}>
            <div style={s.cardTitle}>Payment History</div>
            {!fan.payment ? (
              <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '24px 0' }}>No payments recorded yet.</p>
            ) : (
              <div>
                {[
                  ['Reference', fan.payment.reference],
                  ['Amount', `₦${fan.payment.amount.toLocaleString()}`],
                  ['Method', `Card ending in ${fan.payment.last4}`],
                  ['Status', fan.payment.status.toUpperCase()],
                  ['Paid On', fmt(fan.payment.paidAt)],
                ].map(([k, v]) => (
                  <div key={k} style={s.infoRow}><span style={s.infoKey}>{k}</span><span style={s.infoVal}>{v}</span></div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'notifications' && (
          <div style={s.card}>
            <div style={s.cardTitle}>Notifications</div>
            {fan.notifications.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '24px 0' }}>No notifications yet.</p>
            ) : (
              fan.notifications.map((n, i) => (
                <div key={n.id} onClick={() => !n.read && markRead(n.id)} style={{ padding: '14px 0', borderBottom: i < fan.notifications.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', cursor: n.read ? 'default' : 'pointer', opacity: n.read ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontWeight: 700, color: '#D4AF37' }}>{n.title}</div>
                    {!n.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#D4AF37' }} />}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: '4px 0' }}>{fmt(n.createdAt)}</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>{n.message}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: 'linear-gradient(160deg,#0d0102 0%,#1a0d16 100%)', color: '#fff' },
  topbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  topbarLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  topbarRight: { display: 'flex', alignItems: 'center', gap: 12 },
  brand: { fontFamily: "'Cinzel', serif", fontWeight: 900, fontSize: '0.9rem', color: '#D4AF37', letterSpacing: 1 },
  brandSub: { fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' },
  btnGhost: { padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none', fontSize: '0.82rem' },
  btnLogout: { padding: '8px 16px', borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.15)', color: '#f87171', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700 },
  body: { maxWidth: 720, margin: '0 auto', padding: '32px 24px 60px' },
  header: { display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28, flexWrap: 'wrap' },
  avatarWrap: { width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: '2px solid #D4AF37', flexShrink: 0 },
  avatarWrapSm: { width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '2px solid #D4AF37', flexShrink: 0 },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarFallback: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 900, color: '#D4AF37', background: 'rgba(212,175,55,0.15)' },
  name: { fontFamily: "'Cinzel', serif", fontSize: '1.5rem', margin: 0 },
  meta: { color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', display: 'flex', gap: 8, marginTop: 4 },
  statusPillBig: { padding: '8px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 },
  tabs: { display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
  tab: { padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 },
  tabActive: { background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 24 },
  cardTitle: { fontFamily: "'Cinzel', serif", fontSize: '1rem', color: '#D4AF37', marginBottom: 16 },
  statusBanner: { display: 'flex', gap: 16, alignItems: 'flex-start', padding: 18, borderRadius: 12, border: '1px solid' },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  infoKey: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' },
  infoVal: { fontSize: '0.85rem', fontWeight: 700 },
  btnPrimary: { padding: '10px 20px', borderRadius: 8, background: '#D4AF37', color: '#000', textDecoration: 'none', fontWeight: 700 },
  btnSecondary: { padding: '10px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: 8 },
  errorBanner: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: '0.85rem', marginBottom: 16 },
}
