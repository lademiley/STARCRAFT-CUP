import React, { useState, useEffect } from 'react'
import { c, StatCard, Badge, Modal, ModuleHeader } from './shared'

function StatusBadge({ status }) {
  const map = {
    pending:  { label: 'Pending Review', color: '#F59E0B' },
    approved: { label: 'Approved',       color: '#22C55E' },
    rejected: { label: 'Rejected',       color: '#EF4444' },
  }
  const s = map[status] || map.pending
  return <Badge label={s.label} color={s.color} />
}

export default function TeamRegistrations() {
  const [regs, setRegs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [actionLoading, setActionLoading] = useState(null)
  const [toast, setToast] = useState('')
  const [detail, setDetail] = useState(null)   // registration to view in modal
  const [noteModal, setNoteModal] = useState(null) // { id, action }
  const [note, setNote] = useState('')

  const load = () => {
    setLoading(true)
    fetch('/api/teams/registrations')
      .then(r => r.ok ? r.json() : { registrations: [] })
      .then(d => { setRegs(d.registrations || []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3500) }

  const openAction = (id, action) => { setNote(''); setNoteModal({ id, action }) }

  const submitAction = async () => {
    const { id, action } = noteModal
    setActionLoading(id + '_' + action)
    setNoteModal(null)
    const res = await fetch(`/api/teams/registrations/${id}/${action}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    })
    if (res.ok) {
      load()
      showToast(action === 'approve' ? '✅ Team registration approved!' : '❌ Registration rejected.')
    }
    setActionLoading(null)
  }

  const filtered = filter === 'all' ? regs : regs.filter(r => r.status === filter)
  const pendingCount   = regs.filter(r => r.status === 'pending').length
  const approvedCount  = regs.filter(r => r.status === 'approved').length
  const rejectedCount  = regs.filter(r => r.status === 'rejected').length

  return (
    <div style={{ position: 'relative' }}>
      <ModuleHeader title="Team Registrations" subtitle="Review and approve teams applying to participate in StarCraft Cup 2026" />

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 24, right: 24, background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 10, padding: '12px 20px', zIndex: 9999, fontSize: '0.85rem', color: '#fff', boxShadow: '0 8px 30px rgba(0,0,0,0.6)' }}>
          {toast}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Applications" value={regs.length} icon="📋" color="#3B82F6" />
        <StatCard label="Pending Review" value={pendingCount} icon="⏳" color="#F59E0B" change={pendingCount > 0 ? 'Needs action' : 'All reviewed'} />
        <StatCard label="Approved" value={approvedCount} icon="✅" color="#22C55E" />
        <StatCard label="Rejected" value={rejectedCount} icon="❌" color="#EF4444" />
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[['all','All'], ['pending','Pending'], ['approved','Approved'], ['rejected','Rejected']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '0.78rem', background: filter === v ? '#D4AF37' : 'rgba(255,255,255,0.06)', color: filter === v ? '#000' : 'rgba(255,255,255,0.6)', transition: 'all 200ms' }}>
            {l}{v === 'pending' && pendingCount > 0 ? ` (${pendingCount})` : ''}
          </button>
        ))}
        <button onClick={load} style={{ marginLeft: 'auto', padding: '8px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.78rem' }}>🔄 Refresh</button>
      </div>

      {loading && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 40 }}>Loading registrations…</p>}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📭</div>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>No {filter !== 'all' ? filter : ''} registrations yet.</p>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.82rem' }}>Team applications submitted via the Register page will appear here.</p>
        </div>
      )}

      {filtered.map(reg => (
        <div key={reg.id} style={{
          background: 'rgba(255,255,255,0.03)',
          border: reg.status === 'pending' ? '1px solid rgba(245,158,11,0.35)' : reg.status === 'approved' ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(239,68,68,0.2)',
          borderRadius: 14, marginBottom: 16, overflow: 'hidden',
        }}>
          {/* Card header */}
          <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: '1.05rem', color: '#fff' }}>⚽ {reg.teamName}</span>
                <StatusBadge status={reg.status} />
              </div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>
                Ref: <strong style={{ color: '#D4AF37' }}>{reg.ref}</strong>
                {reg.city && <span style={{ marginLeft: 12 }}>📍 {reg.city}</span>}
                {reg.coach && <span style={{ marginLeft: 12 }}>👔 Coach: {reg.coach}</span>}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>
                Rep: <strong style={{ color: 'rgba(255,255,255,0.65)' }}>{reg.repName}</strong> · {reg.repEmail}
                {reg.repPhone && ` · ${reg.repPhone}`}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.28)', marginTop: 3 }}>
                Submitted: {new Date(reg.submittedAt).toLocaleString('en-NG')}
                {reg.reviewedAt && ` · Reviewed: ${new Date(reg.reviewedAt).toLocaleString('en-NG')}`}
              </div>
              {reg.reviewNote && (
                <div style={{ marginTop: 6, fontSize: '0.75rem', color: reg.status === 'approved' ? '#4ade80' : '#f87171', fontStyle: 'italic' }}>
                  Note: {reg.reviewNote}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setDetail(reg)} style={{ ...c.btn, ...c.btnGhost, fontSize: '0.75rem', padding: '7px 14px' }}>👁️ View Details</button>
              {reg.status === 'pending' && (
                <>
                  <button onClick={() => openAction(reg.id, 'approve')} disabled={!!actionLoading} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(34,197,94,0.4)', background: 'rgba(34,197,94,0.15)', color: '#22C55E', fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}>
                    {actionLoading === reg.id + '_approve' ? '…' : '✅ Approve'}
                  </button>
                  <button onClick={() => openAction(reg.id, 'reject')} disabled={!!actionLoading} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}>
                    {actionLoading === reg.id + '_reject' ? '…' : '❌ Reject'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Quick stats row */}
          <div style={{ padding: '10px 22px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              ['Kit Colors', reg.homeColors || '—'],
              ['Year Founded', reg.yearFounded || '—'],
              ['Players Listed', `${(reg.players || []).length}`],
            ].map(([k, v]) => (
              <div key={k} style={{ fontSize: '0.75rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>{k}: </span>
                <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Detail Modal */}
      {detail && (
        <Modal title={`📋 Registration Details — ${detail.teamName}`} onClose={() => setDetail(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <StatusBadge status={detail.status} />
              <span style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 700 }}>{detail.ref}</span>
            </div>

            {/* Team details */}
            <div style={{ ...c.card, padding: '16px 20px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: 1, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 12 }}>Team Details</div>
              {[
                ['Team Name', detail.teamName],
                ['City / LGA', detail.city || '—'],
                ['Year Founded', detail.yearFounded || '—'],
                ['Head Coach', detail.coach || '—'],
                ['Kit Colors', detail.homeColors || '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.82rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>{k}</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Rep details */}
            <div style={{ ...c.card, padding: '16px 20px' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: 1, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 12 }}>Representative</div>
              {[
                ['Name', detail.repName],
                ['Email', detail.repEmail],
                ['Phone', detail.repPhone || '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.82rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>{k}</span>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Competition history */}
            {detail.competitionHistory && (
              <div style={{ ...c.card, padding: '16px 20px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: 1, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 10 }}>Competition History</div>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.6 }}>{detail.competitionHistory}</p>
              </div>
            )}

            {/* Players */}
            {detail.players?.length > 0 && (
              <div style={{ ...c.card, padding: '16px 20px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: 1, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 12 }}>
                  Players Listed ({detail.players.length})
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {['#', 'Name', 'Age', 'Position', 'Jersey'].map(h => (
                          <th key={h} style={{ ...c.th, fontSize: '0.65rem' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {detail.players.map((p, i) => (
                        <tr key={i}>
                          <td style={c.td}>{i + 1}</td>
                          <td style={{ ...c.td, fontWeight: 600 }}>{p.name || '—'}</td>
                          <td style={c.td}>{p.age || '—'}</td>
                          <td style={c.td}>{p.position || '—'}</td>
                          <td style={c.td}>{p.jersey ? `#${p.jersey}` : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Approve / Reject confirmation modal with note */}
      {noteModal && (
        <Modal title={noteModal.action === 'approve' ? '✅ Approve Registration' : '❌ Reject Registration'} onClose={() => setNoteModal(null)}>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', marginBottom: 16 }}>
            {noteModal.action === 'approve'
              ? 'Approving this application will allow the team to participate in StarCraft Cup 2026. You can add an optional note (e.g. next steps, payment info).'
              : 'Rejecting this application will notify the team. Please add a reason so they can address the issue.'}
          </p>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>
              {noteModal.action === 'approve' ? 'Note (optional)' : 'Rejection Reason'}
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={noteModal.action === 'approve' ? 'e.g. Please make payment of ₦25,000 within 7 days…' : 'e.g. Incomplete player information provided…'}
              style={{ ...c.input, minHeight: 90, resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setNoteModal(null)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={submitAction} style={{ ...c.btn, ...(noteModal.action === 'approve' ? c.btnPrimary : c.btnDanger), padding: '10px 22px' }}>
              {noteModal.action === 'approve' ? '✅ Confirm Approval' : '❌ Confirm Rejection'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
