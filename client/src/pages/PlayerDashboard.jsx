import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const KIT_SIZES = ['XS','S','M','L','XL','XXL']
const FEET = ['Left', 'Right', 'Both']

const fmt = iso => iso
  ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '—'

const STATUS_CFG = {
  pending: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'Pending Review', icon: '⏳', msg: 'Your registration is being reviewed by the tournament committee.' },
  approved: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)', label: 'Approved', icon: '✅', msg: 'You have been approved to take part in StarCraft Cup 2026.' },
  rejected: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', label: 'Not Approved', icon: '❌', msg: 'Your registration was not approved. Contact the committee for details.' },
}

const ANNOUNCEMENTS = [
  { title: 'Player Accreditation Opens', date: '2026-08-01', text: 'Bring a valid ID and your registration slip to your LGA accreditation centre.' },
  { title: 'Fitness Assessment Schedule', date: '2026-09-10', text: 'All registered players will undergo a fitness assessment ahead of squad selection.' },
]

export default function PlayerDashboard() {
  const navigate = useNavigate()
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('status')
  const [editForm, setEditForm] = useState({ name: '', phone: '', height: '', jerseySize: '', preferredFoot: '' })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [photoError, setPhotoError] = useState('')
  const fileRef = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/player/me', { credentials: 'include' })
      if (!res.ok) { navigate('/player/login'); return }
      const data = await res.json()
      setPlayer(data.player)
      setEditForm({
        name: data.player.name, phone: data.player.phone,
        height: data.player.height, jerseySize: data.player.jerseySize, preferredFoot: data.player.preferredFoot,
      })
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
      const res = await fetch('/api/player/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editForm),
      })
      const data = await res.json()
      if (!res.ok) { setSaveMsg(data.error || 'Failed to update profile.'); setSaving(false); return }
      setPlayer(data.player)
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
      const res = await fetch('/api/player/photo', { method: 'POST', credentials: 'include', body: fd })
      const data = await res.json()
      if (!res.ok) { setPhotoError(data.error || 'Failed to upload photo.'); return }
      setPlayer(data.player)
    } catch {
      setPhotoError('Network error — please try again.')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/player/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
    navigate('/player/login')
  }

  const downloadSlip = () => {
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`
      <html><head><title>Registration Slip — ${player.name}</title>
      <style>body{font-family:sans-serif;padding:40px;color:#111} h1{color:#8B0E12} table{width:100%;border-collapse:collapse;margin-top:20px} td{padding:8px;border-bottom:1px solid #ddd}</style>
      </head><body>
      <h1>StarCraft Cup 2026 — Player Registration Slip</h1>
      <table>
        <tr><td><strong>Name</strong></td><td>${player.name}</td></tr>
        <tr><td><strong>LGA</strong></td><td>${player.lga}</td></tr>
        <tr><td><strong>Age</strong></td><td>${player.age}</td></tr>
        <tr><td><strong>Height</strong></td><td>${player.height} cm</td></tr>
        <tr><td><strong>Jersey Size</strong></td><td>${player.jerseySize}</td></tr>
        <tr><td><strong>Preferred Foot</strong></td><td>${player.preferredFoot}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${player.phone}</td></tr>
        <tr><td><strong>Status</strong></td><td>${player.status}</td></tr>
        <tr><td><strong>Registered</strong></td><td>${fmt(player.createdAt)}</td></tr>
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
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🧑‍⚽️</div>
          <div>Loading your dashboard…</div>
        </div>
      </div>
    )
  }

  if (error || !player) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚠️</div>
            <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 24 }}>{error || 'Could not load player account.'}</p>
            <Link to="/player/login" style={s.btnPrimary}>Sign In</Link>
          </div>
        </div>
      </div>
    )
  }

  const cfg = STATUS_CFG[player.status] || STATUS_CFG.pending

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <div style={s.topbarLeft}>
          <span style={{ fontSize: '1.4rem' }}>🧑‍⚽️</span>
          <div>
            <div style={s.brand}>STARCRAFT CUP 2026</div>
            <div style={s.brandSub}>Player Dashboard</div>
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
            {player.photoUrl
              ? <img src={player.photoUrl} alt={player.name} style={s.avatarImg} />
              : <div style={s.avatarFallback}>{player.name.charAt(0)}</div>}
          </div>
          <div>
            <h1 style={s.name}>{player.name}</h1>
            <div style={s.meta}>
              <span>📍 {player.lga} LGA</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>{player.age} yrs</span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <div style={{ ...s.statusPillBig, background: cfg.bg, color: cfg.color }}>{cfg.icon} {cfg.label}</div>
          </div>
        </div>

        <div style={s.tabs}>
          {[['status', '📋 Status'], ['profile', '✏️ Edit Profile'], ['announcements', '📢 Announcements']].map(([k, l]) => (
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
                ['Full Name', player.name],
                ['LGA', player.lga],
                ['Date of Birth', player.dob],
                ['Age', `${player.age} years`],
                ['Height', `${player.height} cm`],
                ['Jersey Size', player.jerseySize],
                ['Preferred Foot', player.preferredFoot],
                ['Phone', player.phone],
                ['Email', player.email || '—'],
                ['Registered On', fmt(player.createdAt)],
              ].map(([k, v]) => (
                <div key={k} style={s.infoRow}><span style={s.infoKey}>{k}</span><span style={s.infoVal}>{v}</span></div>
              ))}
            </div>
            <button onClick={downloadSlip} style={{ ...s.btnSecondary, width: '100%', justifyContent: 'center', marginTop: 20 }}>
              📄 Download Registration Slip
            </button>
          </div>
        )}

        {tab === 'profile' && (
          <div style={s.card}>
            <div style={s.cardTitle}>Edit Personal Information</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={s.avatarWrapSm}>
                {player.photoUrl
                  ? <img src={player.photoUrl} alt={player.name} style={s.avatarImg} />
                  : <div style={s.avatarFallback}>{player.name.charAt(0)}</div>}
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
              <div className="grid-2" style={{ gap: 16 }}>
                <div className="form-group">
                  <label>Height (cm)</label>
                  <input type="number" className="form-control" value={editForm.height} onChange={e => setEditForm(p => ({ ...p, height: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Jersey Size</label>
                  <select className="form-control" value={editForm.jerseySize} onChange={e => setEditForm(p => ({ ...p, jerseySize: e.target.value }))}>
                    {KIT_SIZES.map(s2 => <option key={s2}>{s2}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Preferred Foot</label>
                <select className="form-control" value={editForm.preferredFoot} onChange={e => setEditForm(p => ({ ...p, preferredFoot: e.target.value }))}>
                  {FEET.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
            </form>
          </div>
        )}

        {tab === 'announcements' && (
          <div style={s.card}>
            <div style={s.cardTitle}>Tournament Announcements</div>
            {ANNOUNCEMENTS.map((a, i) => (
              <div key={i} style={{ padding: '14px 0', borderBottom: i < ANNOUNCEMENTS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ fontWeight: 700, color: '#D4AF37' }}>{a.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', margin: '4px 0' }}>{new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>{a.text}</div>
              </div>
            ))}
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
