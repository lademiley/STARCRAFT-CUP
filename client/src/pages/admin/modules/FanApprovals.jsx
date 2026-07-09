import React, { useState, useEffect, useCallback } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, ModuleHeader, SearchBar, ActionRow } from './shared'

const STATUS_COLOR = {
  pending_payment: '#6B7280',
  pending_approval: '#F59E0B',
  approved: '#22C55E',
  rejected: '#EF4444',
}
const STATUS_LABEL = {
  pending_payment: 'Awaiting Payment',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  rejected: 'Rejected',
}

const fmt = iso => iso ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

export default function FanApprovals() {
  const [fans, setFans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('pending_approval')
  const [selected, setSelected] = useState(null)
  const [modal, setModal] = useState(null) // 'view' | 'reject'
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/fans', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to load fan accounts')
      const data = await res.json()
      setFans(data.fans || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openView = f => { setSelected(f); setNote(''); setModal('view') }
  const openReject = f => { setSelected(f); setNote(''); setModal('reject') }
  const closeModal = () => { setModal(null); setSelected(null); setNote('') }

  const approve = async f => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/fans/${f.id}/approve`, { method: 'PATCH', credentials: 'include' })
      if (!res.ok) throw new Error((await res.json()).error || 'Approval failed')
      await load()
      closeModal()
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  const reject = async () => {
    if (!note.trim()) { alert('Please provide a reason for rejection.'); return }
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/fans/${selected.id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ note }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Rejection failed')
      await load()
      closeModal()
    } catch (e) {
      alert(e.message)
    } finally {
      setSaving(false)
    }
  }

  const pendingApproval = fans.filter(f => f.status === 'pending_approval').length
  const approved = fans.filter(f => f.status === 'approved').length
  const rejected = fans.filter(f => f.status === 'rejected').length

  const q = search.toLowerCase()
  const filtered = fans.filter(f =>
    (filter === 'all' || f.status === filter) &&
    ((f.name || '').toLowerCase().includes(q) || (f.email || '').toLowerCase().includes(q) || (f.preferredTeam || '').toLowerCase().includes(q))
  )

  return (
    <div>
      <ModuleHeader
        title="Fan / Ticket Approvals"
        subtitle="Verify payments and approve digital tickets for fan accounts"
        action="Refresh"
        onAction={load}
        count={fans.length}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Fans" value={fans.length} icon="🎟️" color="#3B82F6" />
        <StatCard label="Pending Approval" value={pendingApproval} icon="⏳" color="#F59E0B" />
        <StatCard label="Approved" value={approved} icon="✅" color="#22C55E" />
        <StatCard label="Rejected" value={rejected} icon="❌" color="#EF4444" />
      </div>

      <SectionCard title="🎫 All Fan Accounts">
        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#f87171', marginBottom: 16, fontSize: '0.83rem' }}>
            ⚠️ {error} — <button onClick={load} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.83rem', padding: 0 }}>Retry</button>
          </div>
        )}

        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search name, email, team…" />
          <select value={filter} onChange={e => setFilter(e.target.value)} style={c.select}>
            <option value="all">All Statuses</option>
            <option value="pending_payment">Awaiting Payment</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </ActionRow>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>⏳ Loading fan accounts…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 6 }}>No fan accounts found</div>
          </div>
        ) : (
          <Table
            cols={['Fan', 'Team', 'Category', 'Price', 'Payment', 'Status', 'Registered', 'Actions']}
            rows={filtered}
            renderRow={(f, i) => (
              <tr key={f.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                <td style={{ ...c.td, fontWeight: 600 }}>
                  <div>{f.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem' }}>{f.email}</div>
                </td>
                <td style={{ ...c.td, fontSize: '0.75rem' }}>{f.preferredTeam}</td>
                <td style={{ ...c.td, fontSize: '0.75rem' }}>{f.ticketCategory}</td>
                <td style={{ ...c.td, fontSize: '0.75rem' }}>₦{f.ticketPrice.toLocaleString()}</td>
                <td style={{ ...c.td, fontSize: '0.72rem' }}>{f.payment ? `${f.payment.status} · •••${f.payment.last4}` : '—'}</td>
                <td style={c.td}><Badge label={STATUS_LABEL[f.status]} color={STATUS_COLOR[f.status]} /></td>
                <td style={{ ...c.td, fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>{fmt(f.createdAt)}</td>
                <td style={c.td}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button onClick={() => openView(f)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.7rem' }}>👁 View</button>
                    {f.status === 'pending_approval' && (
                      <>
                        <button onClick={() => approve(f)} disabled={saving} style={{ ...c.btn, padding: '4px 10px', fontSize: '0.7rem', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}>✅ Approve</button>
                        <button onClick={() => openReject(f)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.7rem' }}>❌ Reject</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )}
          />
        )}
      </SectionCard>

      {modal === 'view' && selected && (
        <Modal title={`🎟️ ${selected.name}`} onClose={closeModal}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <InfoRow label="Status" value={<Badge label={STATUS_LABEL[selected.status]} color={STATUS_COLOR[selected.status]} />} />
            <InfoRow label="Email" value={selected.email} />
            <InfoRow label="Phone" value={selected.phone} />
            <InfoRow label="LGA" value={selected.lga} />
            <InfoRow label="Preferred Team" value={selected.preferredTeam} />
            <InfoRow label="Ticket Category" value={selected.ticketCategory} />
            <InfoRow label="Ticket Price" value={`₦${selected.ticketPrice.toLocaleString()}`} />
            <InfoRow label="Registered" value={fmt(selected.createdAt)} />
            {selected.payment && <InfoRow label="Payment Ref" value={selected.payment.reference} />}
            {selected.payment && <InfoRow label="Card" value={`•••• ${selected.payment.last4}`} />}
            {selected.ticket && <InfoRow label="Ticket ID" value={selected.ticket.id} />}
            {selected.ticket?.seatNumber && <InfoRow label="Seat" value={selected.ticket.seatNumber} />}
          </div>
          {selected.status === 'pending_approval' && (
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => approve(selected)} disabled={saving} style={{ ...c.btn, flex: 1, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}>✅ Approve Ticket</button>
              <button onClick={() => { setModal('reject') }} style={{ ...c.btn, ...c.btnDanger, flex: 1 }}>❌ Reject</button>
            </div>
          )}
        </Modal>
      )}

      {modal === 'reject' && selected && (
        <Modal title={`❌ Reject ${selected.name}`} onClose={closeModal}>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>
            Provide a reason. The fan will be notified on their dashboard.
          </p>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={4} style={{ ...c.input, marginBottom: 16, resize: 'vertical' }} placeholder="e.g. Payment could not be verified against bank records" />
          <button onClick={reject} disabled={saving} style={{ ...c.btn, ...c.btnDanger, width: '100%' }}>{saving ? 'Submitting…' : 'Confirm Rejection'}</button>
        </Modal>
      )}
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: '0.85rem', color: '#fff' }}>{value}</div>
    </div>
  )
}
