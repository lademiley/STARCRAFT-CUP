import React, { useState, useEffect, useCallback } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const STATUS_COLOR = {
  pending:  '#F59E0B',
  approved: '#22C55E',
  rejected: '#EF4444',
}

const fmt = iso => iso
  ? new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '—'

// ─── Shared approve/reject modal ──────────────────────────────
function ActionModal({ modal, selected, type, note, setNote, onClose, onConfirm, saving }) {
  const isApprove = modal === 'approve'
  const label = type === 'chairman' ? selected?.name : selected?.name
  const sub   = type === 'chairman' ? `LGA: ${selected?.lga}` : `LGA: ${selected?.lga} • ${selected?.email || selected?.phone}`

  return (
    <Modal title={isApprove ? '✅ Approve Registration' : '❌ Reject Registration'} onClose={onClose}>
      <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>
        You are {isApprove ? 'approving' : 'rejecting'} <strong style={{ color: '#fff' }}>{label}</strong>
      </p>
      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>{sub}</p>
      <FormField label={isApprove ? 'Admin Note (optional)' : 'Rejection Reason (required)'}>
        <textarea
          style={{ ...c.input, minHeight: 80, resize: 'vertical' }}
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder={isApprove ? 'e.g. All documents verified.' : 'e.g. Incomplete information submitted.'}
        />
      </FormField>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
        <button onClick={onClose} style={{ ...c.btn, ...c.btnGhost }} disabled={saving}>Cancel</button>
        <button
          onClick={onConfirm}
          disabled={saving}
          style={{
            ...c.btn,
            ...(isApprove
              ? { background: 'linear-gradient(135deg,#22C55E,#15803D)', color: '#fff' }
              : c.btnDanger),
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? 'Saving…' : isApprove ? '✅ Confirm Approval' : '❌ Confirm Rejection'}
        </button>
      </div>
    </Modal>
  )
}

// ─── LGA Chairman Tab ──────────────────────────────────────────
function ChairmanTab() {
  const [list, setList]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [selected, setSelected] = useState(null)
  const [modal, setModal]       = useState(null) // 'view' | 'approve' | 'reject'
  const [note, setNote]         = useState('')
  const [saving, setSaving]     = useState(false)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/admin/chairmen', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to load chairman registrations')
      const data = await res.json()
      setList(data.chairmen || [])
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const openView    = r => { setSelected(r); setNote(''); setModal('view') }
  const openApprove = r => { setSelected(r); setNote(''); setModal('approve') }
  const openReject  = r => { setSelected(r); setNote(''); setModal('reject') }
  const closeModal  = ()  => { setModal(null); setSelected(null); setNote('') }

  const doAction = async action => {
    if (action === 'reject' && !note.trim()) { alert('Please provide a rejection reason.'); return }
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/chairmen/${selected.id}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ note }),
      })
      if (!res.ok) throw new Error('Action failed')
      await load(); closeModal()
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  const pending  = list.filter(r => r.status === 'pending').length
  const approved = list.filter(r => r.status === 'approved').length
  const rejected = list.filter(r => r.status === 'rejected').length
  const q = search.toLowerCase()
  const filtered = list.filter(r =>
    (filter === 'all' || r.status === filter) &&
    ((r.name || '').toLowerCase().includes(q) ||
     (r.lga  || '').toLowerCase().includes(q) ||
     (r.email|| '').toLowerCase().includes(q))
  )

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total"    value={list.length} icon="🏛️" color="#3B82F6" />
        <StatCard label="Pending"  value={pending}     icon="⏳" color="#F59E0B" />
        <StatCard label="Approved" value={approved}    icon="✅" color="#22C55E" />
        <StatCard label="Rejected" value={rejected}    icon="❌" color="#EF4444" />
      </div>

      <SectionCard title="🏛️ LGA Chairman Registrations">
        {error && <ErrorBar msg={error} onRetry={load} />}
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search name, LGA, email…" />
          <select value={filter} onChange={e => setFilter(e.target.value)} style={c.select}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={load} style={{ ...c.btn, ...c.btnGhost, padding: '8px 14px' }}>🔄 Refresh</button>
        </ActionRow>

        {loading ? <LoadingRow /> : filtered.length === 0 ? <EmptyRow label="No chairman registrations" /> : (
          <Table
            cols={['Name', 'LGA', 'Email', 'Phone', 'Submitted', 'Status', 'Actions']}
            rows={filtered}
            renderRow={(r, i) => (
              <tr key={r.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                <td style={{ ...c.td, fontWeight: 600 }}>{r.name}</td>
                <td style={{ ...c.td, fontSize: '0.75rem' }}>{r.lga}</td>
                <td style={{ ...c.td, fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>{r.email}</td>
                <td style={{ ...c.td, fontSize: '0.75rem' }}>{r.phone || '—'}</td>
                <td style={{ ...c.td, fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{fmt(r.createdAt)}</td>
                <td style={c.td}><StatusBadge status={r.status} /></td>
                <td style={c.td}>
                  <RowActions r={r} onView={openView} onApprove={openApprove} onReject={openReject} />
                </td>
              </tr>
            )}
          />
        )}
      </SectionCard>

      {modal === 'view' && selected && (
        <Modal title={`🏛️ ${selected.name}`} onClose={closeModal}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <InfoRow label="Full Name" value={selected.name} />
            <InfoRow label="Status"    value={<StatusBadge status={selected.status} />} />
            <InfoRow label="LGA"       value={selected.lga} />
            <InfoRow label="Email"     value={selected.email} />
            <InfoRow label="Phone"     value={selected.phone || '—'} />
            <InfoRow label="Registered" value={fmt(selected.createdAt)} />
            {selected.reviewedAt && <InfoRow label="Reviewed" value={fmt(selected.reviewedAt)} />}
          </div>
          {selected.reviewNote && <NoteBlock note={selected.reviewNote} />}
          <ModalFooter status={selected.status} onApprove={() => setModal('approve')} onReject={() => setModal('reject')} onClose={closeModal} />
        </Modal>
      )}

      {(modal === 'approve' || modal === 'reject') && selected && (
        <ActionModal modal={modal} selected={selected} type="chairman"
          note={note} setNote={setNote} onClose={closeModal}
          onConfirm={() => doAction(modal)} saving={saving} />
      )}
    </div>
  )
}

// ─── Player Tab ────────────────────────────────────────────────
function PlayerTab() {
  const [list, setList]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('all')
  const [selected, setSelected] = useState(null)
  const [modal, setModal]       = useState(null)
  const [note, setNote]         = useState('')
  const [saving, setSaving]     = useState(false)

  const load = useCallback(async () => {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/admin/players', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to load player registrations')
      const data = await res.json()
      setList(data.players || [])
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const openView    = r => { setSelected(r); setNote(''); setModal('view') }
  const openApprove = r => { setSelected(r); setNote(''); setModal('approve') }
  const openReject  = r => { setSelected(r); setNote(''); setModal('reject') }
  const closeModal  = ()  => { setModal(null); setSelected(null); setNote('') }

  const doAction = async action => {
    if (action === 'reject' && !note.trim()) { alert('Please provide a rejection reason.'); return }
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/players/${selected.id}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ note }),
      })
      if (!res.ok) throw new Error('Action failed')
      await load(); closeModal()
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  const pending  = list.filter(r => r.status === 'pending').length
  const approved = list.filter(r => r.status === 'approved').length
  const rejected = list.filter(r => r.status === 'rejected').length
  const q = search.toLowerCase()
  const filtered = list.filter(r =>
    (filter === 'all' || r.status === filter) &&
    ((r.name  || '').toLowerCase().includes(q) ||
     (r.lga   || '').toLowerCase().includes(q) ||
     (r.email || '').toLowerCase().includes(q) ||
     (r.phone || '').toLowerCase().includes(q))
  )

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total"    value={list.length} icon="👤" color="#3B82F6" />
        <StatCard label="Pending"  value={pending}     icon="⏳" color="#F59E0B" />
        <StatCard label="Approved" value={approved}    icon="✅" color="#22C55E" />
        <StatCard label="Rejected" value={rejected}    icon="❌" color="#EF4444" />
      </div>

      <SectionCard title="👤 Player Registrations">
        {error && <ErrorBar msg={error} onRetry={load} />}
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search name, LGA, email, phone…" />
          <select value={filter} onChange={e => setFilter(e.target.value)} style={c.select}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={load} style={{ ...c.btn, ...c.btnGhost, padding: '8px 14px' }}>🔄 Refresh</button>
        </ActionRow>

        {loading ? <LoadingRow /> : filtered.length === 0 ? <EmptyRow label="No player registrations" /> : (
          <Table
            cols={['Name', 'LGA', 'Age', 'Position', 'Phone', 'Email', 'Submitted', 'Status', 'Actions']}
            rows={filtered}
            renderRow={(r, i) => (
              <tr key={r.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
                <td style={{ ...c.td, fontWeight: 600 }}>{r.name}</td>
                <td style={{ ...c.td, fontSize: '0.75rem' }}>{r.lga}</td>
                <td style={{ ...c.td, textAlign: 'center' }}>{r.age ?? '—'}</td>
                <td style={{ ...c.td, fontSize: '0.75rem' }}>{r.preferredFoot ? `${r.preferredFoot} foot` : '—'}</td>
                <td style={{ ...c.td, fontSize: '0.75rem' }}>{r.phone || '—'}</td>
                <td style={{ ...c.td, fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)' }}>{r.email || '—'}</td>
                <td style={{ ...c.td, fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{fmt(r.createdAt)}</td>
                <td style={c.td}><StatusBadge status={r.status} /></td>
                <td style={c.td}>
                  <RowActions r={r} onView={openView} onApprove={openApprove} onReject={openReject} />
                </td>
              </tr>
            )}
          />
        )}
      </SectionCard>

      {modal === 'view' && selected && (
        <Modal title={`👤 ${selected.name}`} onClose={closeModal}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
            <InfoRow label="Full Name"      value={selected.name} />
            <InfoRow label="Status"         value={<StatusBadge status={selected.status} />} />
            <InfoRow label="LGA"            value={selected.lga} />
            <InfoRow label="Date of Birth"  value={selected.dob || '—'} />
            <InfoRow label="Age"            value={selected.age ?? '—'} />
            <InfoRow label="Height"         value={selected.height ? `${selected.height} cm` : '—'} />
            <InfoRow label="Jersey Size"    value={selected.jerseySize || '—'} />
            <InfoRow label="Preferred Foot" value={selected.preferredFoot || '—'} />
            <InfoRow label="Phone"          value={selected.phone || '—'} />
            <InfoRow label="Email"          value={selected.email || '—'} />
            <InfoRow label="Registered"     value={fmt(selected.createdAt)} />
            {selected.reviewedAt && <InfoRow label="Reviewed" value={fmt(selected.reviewedAt)} />}
          </div>
          {selected.reviewNote && <NoteBlock note={selected.reviewNote} />}
          <ModalFooter status={selected.status} onApprove={() => setModal('approve')} onReject={() => setModal('reject')} onClose={closeModal} />
        </Modal>
      )}

      {(modal === 'approve' || modal === 'reject') && selected && (
        <ActionModal modal={modal} selected={selected} type="player"
          note={note} setNote={setNote} onClose={closeModal}
          onConfirm={() => doAction(modal)} saving={saving} />
      )}
    </div>
  )
}

// ─── Root module with tabs ─────────────────────────────────────
export default function RegistrationApprovals() {
  const [tab, setTab] = useState('chairman')

  return (
    <div>
      <ModuleHeader
        title="Registration Approvals"
        subtitle="Review and approve LGA Chairman and Player registrations"
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {[
          { id: 'chairman', label: '🏛️ LGA Chairmen' },
          { id: 'player',   label: '👤 Players' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              ...c.btn,
              ...(tab === t.id ? c.btnPrimary : c.btnGhost),
              padding: '9px 20px',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'chairman' ? <ChairmanTab /> : <PlayerTab />}
    </div>
  )
}

// ─── Tiny shared helpers ───────────────────────────────────────
function StatusBadge({ status }) {
  return <Badge label={status.charAt(0).toUpperCase() + status.slice(1)} color={STATUS_COLOR[status] || '#888'} />
}

function RowActions({ r, onView, onApprove, onReject }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      <button onClick={() => onView(r)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.7rem' }}>👁 View</button>
      {r.status === 'pending' && (
        <>
          <button onClick={() => onApprove(r)} style={{ ...c.btn, padding: '4px 10px', fontSize: '0.7rem', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}>✅ Approve</button>
          <button onClick={() => onReject(r)}  style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.7rem' }}>❌ Reject</button>
        </>
      )}
    </div>
  )
}

function ModalFooter({ status, onApprove, onReject, onClose }) {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
      {status === 'pending' && (
        <>
          <button onClick={onApprove} style={{ ...c.btn, padding: '7px 16px', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80' }}>✅ Approve</button>
          <button onClick={onReject}  style={{ ...c.btn, ...c.btnDanger }}>❌ Reject</button>
        </>
      )}
      <button onClick={onClose} style={{ ...c.btn, ...c.btnGhost }}>Close</button>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.85)' }}>{value}</div>
    </div>
  )
}

function NoteBlock({ note }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Admin Note</div>
      <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: 8, fontStyle: 'italic' }}>{note}</div>
    </div>
  )
}

function ErrorBar({ msg, onRetry }) {
  return (
    <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#f87171', marginBottom: 16, fontSize: '0.83rem' }}>
      ⚠️ {msg} — <button onClick={onRetry} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.83rem', padding: 0 }}>Retry</button>
    </div>
  )
}

function LoadingRow() {
  return <div style={{ textAlign: 'center', padding: '40px 0', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>⏳ Loading…</div>
}

function EmptyRow({ label }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 0', color: 'rgba(255,255,255,0.3)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
      <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: '0.75rem', marginTop: 4 }}>New registrations will appear here once submitted.</div>
    </div>
  )
}
