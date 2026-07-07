import React, { useState, useEffect, useCallback } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const STATUS_COLOR = {
  pending:  '#F59E0B',
  approved: '#22C55E',
  rejected: '#EF4444',
}

const fmt = iso => iso ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

export default function TeamRegistrations() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [search, setSearch]               = useState('')
  const [filter, setFilter]               = useState('all')
  const [selected, setSelected]           = useState(null)   // registration being reviewed
  const [modal, setModal]                 = useState(null)   // 'view' | 'approve' | 'reject'
  const [note, setNote]                   = useState('')
  const [saving, setSaving]               = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/teams/registrations')
      if (!res.ok) throw new Error('Failed to load registrations')
      const data = await res.json()
      setRegistrations(data.registrations || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openView    = reg => { setSelected(reg); setNote(''); setModal('view') }
  const openApprove = reg => { setSelected(reg); setNote(''); setModal('approve') }
  const openReject  = reg => { setSelected(reg); setNote(''); setModal('reject') }
  const closeModal  = ()  => { setModal(null); setSelected(null); setNote('') }

  const doAction = async action => {
    if (!selected) return
    if (action === 'reject' && !note.trim()) {
      alert('Please provide a rejection reason before confirming.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/teams/registrations/${selected.id}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note }),
      })
      if (!res.ok) throw new Error('Action failed')
      await load()
      closeModal()
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  const pending  = registrations.filter(r => r.status === 'pending').length
  const approved = registrations.filter(r => r.status === 'approved').length
  const rejected = registrations.filter(r => r.status === 'rejected').length

  const q = search.toLowerCase()
  const filtered = registrations.filter(r =>
    (filter === 'all' || r.status === filter) &&
    ((r.teamName || '').toLowerCase().includes(q) ||
     (r.repName  || '').toLowerCase().includes(q) ||
     (r.city     || '').toLowerCase().includes(q) ||
     (r.ref      || '').toLowerCase().includes(q))
  )

  return (
    <div>
      <ModuleHeader
        title="Team Registrations"
        subtitle="Review and approve new team applications for StarCraft Cup 2026"
        action="Refresh"
        onAction={load}
        count={registrations.length}
      />

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Submitted"  value={registrations.length} icon="📋" color="#3B82F6" />
        <StatCard label="Pending Review"   value={pending}              icon="⏳" color="#F59E0B" />
        <StatCard label="Approved"         value={approved}             icon="✅" color="#22C55E" />
        <StatCard label="Rejected"         value={rejected}             icon="❌" color="#EF4444" />
      </div>

      {/* Table */}
      <SectionCard title="📋 All Applications">
        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#f87171', marginBottom: 16, fontSize: '0.83rem' }}>
            ⚠️ {error} — <button onClick={load} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.83rem', padding: 0 }}>Retry</button>
          </div>
        )}

        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search team, rep, city, ref…" />
          <select value={filter} onChange={e => setFilter(e.target.value)} style={c.select}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </ActionRow>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
            ⏳ Loading registrations…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 6 }}>No registrations yet</div>
            <div style={{ fontSize: '0.75rem' }}>New team applications will appear here once submitted.</div>
          </div>
        ) : (
          <Table
            cols={['Ref', 'Team Name', 'City', 'Coach', 'Rep', 'Players', 'Submitted', 'Status', 'Actions']}
            rows={filtered}
            renderRow={(r, i) => (
              <tr key={r.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                <td style={{ ...c.td, fontFamily: 'monospace', fontSize: '0.72rem', color: '#D4AF37' }}>{r.ref}</td>
                <td style={{ ...c.td, fontWeight: 600 }}>{r.teamName}</td>
                <td style={{ ...c.td, fontSize: '0.75rem' }}>{r.city || '—'}</td>
                <td style={{ ...c.td, fontSize: '0.75rem' }}>{r.coach || '—'}</td>
                <td style={{ ...c.td, fontSize: '0.75rem' }}>
                  <div>{r.repName || '—'}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem' }}>{r.repEmail}</div>
                </td>
                <td style={{ ...c.td, textAlign: 'center' }}>{r.players?.length ?? 0}</td>
                <td style={{ ...c.td, fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>{fmt(r.submittedAt)}</td>
                <td style={c.td}>
                  <Badge label={r.status.charAt(0).toUpperCase() + r.status.slice(1)} color={STATUS_COLOR[r.status]} />
                </td>
                <td style={c.td}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button onClick={() => openView(r)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.7rem' }}>👁 View</button>
                    {r.status === 'pending' && (
                      <>
                        <button onClick={() => openApprove(r)} style={{ ...c.btn, padding: '4px 10px', fontSize: '0.7rem', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}>✅ Approve</button>
                        <button onClick={() => openReject(r)}  style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.7rem' }}>❌ Reject</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )}
          />
        )}
      </SectionCard>

      {/* ── View Detail Modal ── */}
      {modal === 'view' && selected && (
        <Modal title={`📋 ${selected.teamName}`} onClose={closeModal}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <InfoRow label="Reference" value={<span style={{ fontFamily: 'monospace', color: '#D4AF37' }}>{selected.ref}</span>} />
            <InfoRow label="Status"    value={<Badge label={selected.status.charAt(0).toUpperCase() + selected.status.slice(1)} color={STATUS_COLOR[selected.status]} />} />
            <InfoRow label="City"           value={selected.city || '—'} />
            <InfoRow label="Year Founded"   value={selected.yearFounded || '—'} />
            <InfoRow label="Head Coach"     value={selected.coach || '—'} />
            <InfoRow label="Home Kit"       value={selected.homeColors || '—'} />
            <InfoRow label="Representative" value={selected.repName || '—'} />
            <InfoRow label="Rep Email"      value={selected.repEmail} />
            <InfoRow label="Rep Phone"      value={selected.repPhone || '—'} />
            <InfoRow label="Submitted"      value={fmt(selected.submittedAt)} />
            {selected.reviewedAt && <InfoRow label="Reviewed" value={fmt(selected.reviewedAt)} />}
          </div>

          {selected.competitionHistory && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Competition History</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: 8 }}>
                {selected.competitionHistory}
              </div>
            </div>
          )}

          {/* Squad list */}
          {selected.players?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                Squad — {selected.players.length} Players
              </div>
              <div style={{ maxHeight: 180, overflowY: 'auto', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['#', 'Name', 'Position', 'Age'].map(h => (
                        <th key={h} style={{ ...c.th, padding: '8px 12px' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selected.players.map((p, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ ...c.td, padding: '7px 12px', width: 32, color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>{idx + 1}</td>
                        <td style={{ ...c.td, padding: '7px 12px', fontWeight: 600 }}>{p.name || '—'}</td>
                        <td style={{ ...c.td, padding: '7px 12px' }}><Badge label={p.position || '—'} color="#3B82F6" /></td>
                        <td style={{ ...c.td, padding: '7px 12px' }}>{p.age || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selected.reviewNote && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Admin Note</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: 8, fontStyle: 'italic' }}>
                {selected.reviewNote}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            {selected.status === 'pending' && (
              <>
                <button onClick={() => setModal('approve')} style={{ ...c.btn, padding: '7px 16px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}>✅ Approve</button>
                <button onClick={() => setModal('reject')}  style={{ ...c.btn, ...c.btnDanger }}>❌ Reject</button>
              </>
            )}
            <button onClick={closeModal} style={{ ...c.btn, ...c.btnGhost }}>Close</button>
          </div>
        </Modal>
      )}

      {/* ── Approve Modal ── */}
      {modal === 'approve' && selected && (
        <Modal title="✅ Approve Registration" onClose={closeModal}>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginBottom: 16 }}>
            You are approving <strong style={{ color: '#fff' }}>{selected.teamName}</strong> ({selected.ref}) for StarCraft Cup 2026. An optional note will be saved with the decision.
          </p>
          <FormField label="Admin Note (optional)">
            <textarea
              style={{ ...c.input, minHeight: 80, resize: 'vertical' }}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Team meets all eligibility criteria."
            />
          </FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button onClick={closeModal} style={{ ...c.btn, ...c.btnGhost }} disabled={saving}>Cancel</button>
            <button
              onClick={() => doAction('approve')}
              disabled={saving}
              style={{ ...c.btn, background: 'linear-gradient(135deg,#22C55E,#15803D)', color: '#fff', opacity: saving ? 0.6 : 1 }}
            >
              {saving ? 'Saving…' : '✅ Confirm Approval'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Reject Modal ── */}
      {modal === 'reject' && selected && (
        <Modal title="❌ Reject Registration" onClose={closeModal}>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginBottom: 16 }}>
            You are rejecting <strong style={{ color: '#fff' }}>{selected.teamName}</strong> ({selected.ref}). Please provide a reason — this will be stored with the record.
          </p>
          <FormField label="Rejection Reason">
            <textarea
              style={{ ...c.input, minHeight: 80, resize: 'vertical' }}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Incomplete squad list — fewer than 11 players submitted."
            />
          </FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button onClick={closeModal} style={{ ...c.btn, ...c.btnGhost }} disabled={saving}>Cancel</button>
            <button
              onClick={() => doAction('reject')}
              disabled={saving}
              style={{ ...c.btn, ...c.btnDanger, opacity: saving ? 0.6 : 1 }}
            >
              {saving ? 'Saving…' : '❌ Confirm Rejection'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// Small helper for the detail modal
function InfoRow({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.85)' }}>{value}</div>
    </div>
  )
}
