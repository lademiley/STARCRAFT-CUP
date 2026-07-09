import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const fmt = iso => iso
  ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '—'

const STATUS_COLORS = {
  pending: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  approved: { color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
  rejected: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
}

export default function ChairmanDashboard() {
  const navigate = useNavigate()
  const [chairman, setChairman] = useState(null)
  const [players, setPlayers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('overview') // overview | players | edit
  const [editForm, setEditForm] = useState({ name: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [photoError, setPhotoError] = useState('')
  const fileRef = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const meRes = await fetch('/api/chairman/me', { credentials: 'include' })
      if (!meRes.ok) { navigate('/chairman/login'); return }
      const meData = await meRes.json()
      setChairman(meData.chairman)
      setEditForm({ name: meData.chairman.name, phone: meData.chairman.phone })

      const [playersRes, statsRes] = await Promise.all([
        fetch('/api/chairman/players', { credentials: 'include' }),
        fetch('/api/chairman/stats', { credentials: 'include' }),
      ])
      if (playersRes.ok) setPlayers((await playersRes.json()).players)
      if (statsRes.ok) setStats((await statsRes.json()).stats)
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
      const res = await fetch('/api/chairman/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editForm),
      })
      const data = await res.json()
      if (!res.ok) { setSaveMsg(data.error || 'Failed to update profile.'); setSaving(false); return }
      setChairman(data.chairman)
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
      const res = await fetch('/api/chairman/photo', { method: 'POST', credentials: 'include', body: fd })
      const data = await res.json()
      if (!res.ok) { setPhotoError(data.error || 'Failed to upload photo.'); return }
      setChairman(data.chairman)
    } catch {
      setPhotoError('Network error — please try again.')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/chairman/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
    navigate('/chairman/login')
  }

  if (loading) {
    return (
      <div style={s.page}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', paddingTop: 80 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏛️</div>
          <div>Loading your dashboard…</div>
        </div>
      </div>
    )
  }

  if (error || !chairman) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>⚠️</div>
            <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 24 }}>{error || 'Could not load chairman account.'}</p>
            <Link to="/chairman/login" style={s.btnPrimary}>Sign In</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.topbar}>
        <div style={s.topbarLeft}>
          <span style={{ fontSize: '1.4rem' }}>🏛️</span>
          <div>
            <div style={s.brand}>STARCRAFT CUP 2026</div>
            <div style={s.brandSub}>Chairman Dashboard</div>
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
            {chairman.photoUrl
              ? <img src={chairman.photoUrl} alt={chairman.name} style={s.avatarImg} />
              : <div style={s.avatarFallback}>{chairman.name.charAt(0)}</div>}
          </div>
          <div>
            <h1 style={s.name}>{chairman.name}</h1>
            <div style={s.meta}>
              <span>📍 {chairman.lga} LGA</span>
              <span style={{ opacity: 0.4 }}>·</span>
              <span>{chairman.email}</span>
            </div>
          </div>
        </div>

        <div style={s.tabs}>
          {[['overview', '📊 Overview'], ['players', '👥 Players'], ['edit', '✏️ Edit Profile']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ ...s.tab, ...(tab === k ? s.tabActive : {}) }}>{l}</button>
          ))}
        </div>

        {tab === 'overview' && stats && (
          <div>
            <div style={s.statsGrid}>
              <div style={s.statCard}><div style={s.statValue}>{stats.totalPlayers}</div><div style={s.statLabel}>Total Players</div></div>
              <div style={{ ...s.statCard, color: '#F59E0B' }}><div style={{ ...s.statValue, color: '#F59E0B' }}>{stats.pending}</div><div style={s.statLabel}>Pending</div></div>
              <div style={{ ...s.statCard, color: '#22C55E' }}><div style={{ ...s.statValue, color: '#22C55E' }}>{stats.approved}</div><div style={s.statLabel}>Approved</div></div>
              <div style={{ ...s.statCard, color: '#EF4444' }}><div style={{ ...s.statValue, color: '#EF4444' }}>{stats.rejected}</div><div style={s.statLabel}>Rejected</div></div>
            </div>
            <div style={s.card}>
              <div style={s.cardTitle}>LGA Information</div>
              {[['Local Government Area', chairman.lga], ['Chairman', chairman.name], ['Email', chairman.email], ['Phone', chairman.phone || '—']].map(([k, v]) => (
                <div key={k} style={s.infoRow}><span style={s.infoKey}>{k}</span><span style={s.infoVal}>{v}</span></div>
              ))}
            </div>
          </div>
        )}

        {tab === 'players' && (
          <div style={s.card}>
            <div style={s.cardTitle}>Players Registered Under {chairman.lga}</div>
            {photoError && <div style={s.errorBanner}>{photoError}</div>}
            {players.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '24px 0' }}>No players have registered under your LGA yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Name</th>
                      <th style={s.th}>Age</th>
                      <th style={s.th}>Height</th>
                      <th style={s.th}>Jersey</th>
                      <th style={s.th}>Foot</th>
                      <th style={s.th}>Status</th>
                      <th style={s.th}>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map(p => {
                      const cfg = STATUS_COLORS[p.status] || STATUS_COLORS.pending
                      return (
                        <tr key={p.id}>
                          <td style={s.td}>{p.name}</td>
                          <td style={s.td}>{p.age}</td>
                          <td style={s.td}>{p.height} cm</td>
                          <td style={s.td}>{p.jerseySize}</td>
                          <td style={s.td}>{p.preferredFoot}</td>
                          <td style={s.td}><span style={{ ...s.statusPill, background: cfg.bg, color: cfg.color }}>{p.status}</span></td>
                          <td style={s.td}>{fmt(p.createdAt)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'edit' && (
          <div style={s.card}>
            <div style={s.cardTitle}>Edit Personal Information</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={s.avatarWrapSm}>
                {chairman.photoUrl
                  ? <img src={chairman.photoUrl} alt={chairman.name} style={s.avatarImg} />
                  : <div style={s.avatarFallback}>{chairman.name.charAt(0)}</div>}
              </div>
              <div>
                <button type="button" onClick={() => fileRef.current?.click()} style={s.btnSecondary}>Change Profile Picture</button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => uploadPhoto(e.target.files[0])} />
              </div>
            </div>
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
                <input type="email" className="form-control" value={chairman.email} disabled />
              </div>
              <div className="form-group">
                <label>Local Government Area (cannot be changed)</label>
                <input type="text" className="form-control" value={chairman.lga} disabled />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
            </form>
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
  body: { maxWidth: 960, margin: '0 auto', padding: '32px 24px 60px' },
  header: { display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 },
  avatarWrap: { width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: '2px solid #D4AF37', flexShrink: 0 },
  avatarWrapSm: { width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', border: '2px solid #D4AF37', flexShrink: 0 },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarFallback: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 900, color: '#D4AF37', background: 'rgba(212,175,55,0.15)' },
  name: { fontFamily: "'Cinzel', serif", fontSize: '1.5rem', margin: 0 },
  meta: { color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', display: 'flex', gap: 8, marginTop: 4 },
  tabs: { display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' },
  tab: { padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 },
  tabActive: { background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: 24 },
  statCard: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '20px', textAlign: 'center' },
  statValue: { fontFamily: "'Cinzel', serif", fontSize: '2rem', fontWeight: 900, color: '#D4AF37' },
  statLabel: { fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 24, maxWidth: 500, margin: '0 auto' },
  cardTitle: { fontFamily: "'Cinzel', serif", fontSize: '1rem', color: '#D4AF37', marginBottom: 16 },
  infoRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  infoKey: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' },
  infoVal: { fontSize: '0.85rem', fontWeight: 700 },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' },
  th: { textAlign: 'left', padding: '10px 12px', color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'nowrap' },
  td: { padding: '10px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap' },
  statusPill: { padding: '4px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize' },
  btnPrimary: { padding: '10px 20px', borderRadius: 8, background: '#D4AF37', color: '#000', textDecoration: 'none', fontWeight: 700 },
  btnSecondary: { padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' },
  errorBanner: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: '0.85rem', marginBottom: 16 },
}
