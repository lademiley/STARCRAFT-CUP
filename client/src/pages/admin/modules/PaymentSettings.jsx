import React, { useState, useEffect } from 'react'
import { c, ModuleHeader, SectionCard, FormField } from './shared'

const EMPTY_METHOD = {
  id: '',
  type: 'bank',
  enabled: true,
  label: 'Bank Transfer',
  bankName: '',
  accountName: '',
  accountNumber: '',
  sortCode: '',
  instructions: '',
}

function Toggle({ checked, onChange }) {
  return (
    <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer', flexShrink: 0 }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity: 0, width: 0, height: 0 }} />
      <span style={{ position: 'absolute', inset: 0, background: checked ? '#D4AF37' : 'rgba(255,255,255,0.15)', borderRadius: 24, transition: '300ms' }}>
        <span style={{ position: 'absolute', height: 18, width: 18, top: 3, left: checked ? 23 : 3, background: '#fff', borderRadius: '50%', transition: '300ms' }} />
      </span>
    </label>
  )
}

export default function PaymentSettings() {
  const [methods, setMethods] = useState([])
  const [footerNote, setFooterNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ msg: '', ok: true })
  const [expanded, setExpanded] = useState(null)

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast({ msg: '', ok: true }), 3500)
  }

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/settings/payment')
      const data = await res.json()
      setMethods(data.settings?.methods || [])
      setFooterNote(data.settings?.footerNote || '')
    } catch {
      showToast('Failed to load settings', false)
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings/payment', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ methods, footerNote }),
      })
      if (res.ok) {
        showToast('✅ Payment settings saved — fans will see these details immediately')
      } else {
        showToast('❌ Save failed', false)
      }
    } catch {
      showToast('❌ Network error', false)
    }
    setSaving(false)
  }

  const addMethod = () => {
    const newMethod = { ...EMPTY_METHOD, id: `bank_${Date.now()}` }
    setMethods(prev => [...prev, newMethod])
    setExpanded(newMethod.id)
  }

  const removeMethod = (id) => {
    setMethods(prev => prev.filter(m => m.id !== id))
    if (expanded === id) setExpanded(null)
  }

  const updateMethod = (id, key, value) => {
    setMethods(prev => prev.map(m => m.id === id ? { ...m, [key]: value } : m))
  }

  const moveMethod = (id, dir) => {
    setMethods(prev => {
      const idx = prev.findIndex(m => m.id === id)
      const next = [...prev]
      const swapIdx = idx + dir
      if (swapIdx < 0 || swapIdx >= next.length) return prev
      ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
      return next
    })
  }

  return (
    <div style={{ position: 'relative' }}>
      <ModuleHeader
        title="Payment Methods"
        subtitle="Configure bank accounts and payment instructions shown to fans at checkout"
      />

      {/* Toast */}
      {toast.msg && (
        <div style={{
          position: 'fixed', top: 24, right: 24,
          background: '#1a1a2e', border: `1px solid ${toast.ok ? 'rgba(212,175,55,0.4)' : 'rgba(239,68,68,0.4)'}`,
          borderRadius: 10, padding: '12px 20px', zIndex: 9999,
          fontFamily: 'var(--font-secondary)', fontSize: '0.85rem', color: '#fff',
          boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
        }}>
          {toast.msg}
        </div>
      )}

      {loading && <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: 40 }}>Loading…</p>}

      {!loading && (
        <>
          {/* Info banner */}
          <div style={{ background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 12, padding: '14px 20px', marginBottom: 24, fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>ℹ️</span>
            <div>
              Changes are live immediately — fans will see the updated payment details as soon as you save.
              Disabled methods are hidden from fans but kept for your records.
            </div>
          </div>

          {/* Methods list */}
          <div style={{ marginBottom: 20 }}>
            {methods.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 16 }}>
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>🏦</div>
                <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0 }}>No payment methods yet. Add one below.</p>
              </div>
            )}

            {methods.map((m, idx) => (
              <div
                key={m.id}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: m.enabled ? '1px solid rgba(212,175,55,0.25)' : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  marginBottom: 12,
                  overflow: 'hidden',
                  opacity: m.enabled ? 1 : 0.6,
                  transition: 'opacity 200ms',
                }}
              >
                {/* Header row */}
                <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                  {/* Drag handle / order */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
                    <button
                      onClick={() => moveMethod(m.id, -1)}
                      disabled={idx === 0}
                      style={{ ...c.btn, ...c.btnGhost, padding: '2px 6px', fontSize: '0.65rem', opacity: idx === 0 ? 0.3 : 1 }}
                      title="Move up"
                    >▲</button>
                    <button
                      onClick={() => moveMethod(m.id, 1)}
                      disabled={idx === methods.length - 1}
                      style={{ ...c.btn, ...c.btnGhost, padding: '2px 6px', fontSize: '0.65rem', opacity: idx === methods.length - 1 ? 0.3 : 1 }}
                      title="Move down"
                    >▼</button>
                  </div>

                  {/* Icon */}
                  <span style={{ fontSize: '1.4rem' }}>🏦</span>

                  {/* Label & details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.9rem', color: m.enabled ? '#D4AF37' : 'rgba(255,255,255,0.5)' }}>
                      {m.label || 'Unnamed Method'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                      {m.bankName && `${m.bankName}`}{m.accountNumber && ` · ${m.accountNumber}`}
                    </div>
                  </div>

                  {/* Enabled toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>
                      {m.enabled ? 'Visible to fans' : 'Hidden'}
                    </span>
                    <Toggle checked={m.enabled} onChange={e => updateMethod(m.id, 'enabled', e.target.checked)} />
                  </div>

                  {/* Expand / Delete */}
                  <button
                    onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                    style={{ ...c.btn, ...c.btnGhost, padding: '6px 14px', fontSize: '0.75rem', flexShrink: 0 }}
                  >
                    {expanded === m.id ? '▲ Collapse' : '✏️ Edit'}
                  </button>
                  <button
                    onClick={() => removeMethod(m.id)}
                    style={{ ...c.btn, ...c.btnDanger, padding: '6px 10px', fontSize: '0.75rem', flexShrink: 0 }}
                    title="Remove method"
                  >🗑️</button>
                </div>

                {/* Expanded editor */}
                {expanded === m.id && (
                  <div style={{ padding: '0 20px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ paddingTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <FormField label="Display Label (shown to fans)">
                        <input
                          style={c.input}
                          value={m.label}
                          onChange={e => updateMethod(m.id, 'label', e.target.value)}
                          placeholder="e.g. Bank Transfer"
                        />
                      </FormField>
                      <FormField label="Bank Name">
                        <input
                          style={c.input}
                          value={m.bankName}
                          onChange={e => updateMethod(m.id, 'bankName', e.target.value)}
                          placeholder="e.g. First Bank Nigeria"
                        />
                      </FormField>
                      <FormField label="Account Name">
                        <input
                          style={c.input}
                          value={m.accountName}
                          onChange={e => updateMethod(m.id, 'accountName', e.target.value)}
                          placeholder="e.g. StarCraft Cup 2026 Committee"
                        />
                      </FormField>
                      <FormField label="Account Number">
                        <input
                          style={c.input}
                          value={m.accountNumber}
                          onChange={e => updateMethod(m.id, 'accountNumber', e.target.value)}
                          placeholder="e.g. 0123456789"
                        />
                      </FormField>
                      <FormField label="Sort Code / Branch (optional)">
                        <input
                          style={c.input}
                          value={m.sortCode}
                          onChange={e => updateMethod(m.id, 'sortCode', e.target.value)}
                          placeholder="e.g. 01-23-45"
                        />
                      </FormField>
                    </div>
                    <FormField label="Payment Instructions (shown under bank details)">
                      <textarea
                        style={{ ...c.input, minHeight: 80, resize: 'vertical' }}
                        value={m.instructions}
                        onChange={e => updateMethod(m.id, 'instructions', e.target.value)}
                        placeholder="e.g. Transfer the exact amount and use your order reference as the narration."
                      />
                    </FormField>

                    {/* Live preview */}
                    <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 10, padding: '16px 20px', marginTop: 8 }}>
                      <div style={{ fontFamily: 'var(--font-secondary)', fontSize: '0.65rem', letterSpacing: '2px', color: 'rgba(212,175,55,0.7)', textTransform: 'uppercase', marginBottom: 12 }}>
                        🔍 Fan Preview
                      </div>
                      {[['Bank', m.bankName], ['Account Name', m.accountName], ['Account Number', m.accountNumber], m.sortCode && ['Sort Code', m.sortCode]].filter(Boolean).map(([k, v]) => v && (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.82rem', gap: 12 }}>
                          <span style={{ color: 'rgba(255,255,255,0.45)' }}>{k}</span>
                          <span style={{ fontWeight: 700, textAlign: 'right', wordBreak: 'break-word' }}>{v}</span>
                        </div>
                      ))}
                      {m.instructions && (
                        <p style={{ margin: '10px 0 0', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>{m.instructions}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add method button */}
          <button onClick={addMethod} style={{ ...c.btn, ...c.btnGhost, width: '100%', justifyContent: 'center', padding: '12px', marginBottom: 24, border: '1px dashed rgba(212,175,55,0.3)', color: '#D4AF37' }}>
            + Add Payment Method
          </button>

          {/* Footer note */}
          <SectionCard title="📋 Checkout Footer Note">
            <FormField label="Message shown to fans after bank details">
              <textarea
                style={{ ...c.input, minHeight: 72, resize: 'vertical' }}
                value={footerNote}
                onChange={e => setFooterNote(e.target.value)}
                placeholder="e.g. QR code tickets will be activated once your payment is confirmed."
              />
            </FormField>
          </SectionCard>

          {/* Save bar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, alignItems: 'center', marginTop: 8 }}>
            <button onClick={load} style={{ ...c.btn, ...c.btnGhost }}>↺ Discard changes</button>
            <button onClick={save} disabled={saving} style={{ ...c.btn, ...c.btnPrimary, padding: '10px 28px', fontSize: '0.88rem' }}>
              {saving ? 'Saving…' : '💾 Save Payment Settings'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
