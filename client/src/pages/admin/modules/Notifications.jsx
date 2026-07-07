import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Modal, FormField, ModuleHeader } from './shared'

const initSent = [
  { id: 1,  title: 'Quarter-Finals Tomorrow!',                audience: 'All Fans', type: 'Announcement', sent: '2026-12-13 18:00', recipients: 1847 },
  { id: 2,  title: 'Your ticket payment has been confirmed',  audience: 'Confirmed Buyers', type: 'Transactional', sent: '2026-12-10 14:22', recipients: 423 },
  { id: 3,  title: 'Match Result: Panthers 3–0 Esan South',  audience: 'All Fans', type: 'Match Update', sent: '2026-12-02 11:45', recipients: 1820 },
  { id: 4,  title: 'Early Bird Ticket Reminder',              audience: 'Unverified Fans', type: 'Promotional', sent: '2026-11-28 09:00', recipients: 380 },
]

const typeColors = { Announcement: '#D4AF37', Transactional: '#22C55E', 'Match Update': '#3B82F6', Promotional: '#EC4899', Alert: '#EF4444' }
const blank = { title: '', body: '', type: 'Announcement', audience: 'All Fans' }

export default function Notifications() {
  const [sent, setSent]   = useState(initSent)
  const [modal, setModal] = useState(false)
  const [form, setForm]   = useState(blank)
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState('')

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const send = () => {
    if (!form.title) return
    setSending(true)
    setTimeout(() => {
      setSent(p => [{ ...form, id: Date.now(), sent: new Date().toLocaleString('en-NG'), recipients: Math.floor(Math.random() * 500) + 100 }, ...p])
      setModal(false)
      setForm(blank)
      setSending(false)
      showToast('✅ Notification sent successfully!')
    }, 800)
  }
  const del = id => { if (confirm('Delete record?')) setSent(p => p.filter(n => n.id !== id)) }
  const f   = k  => e => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>Notifications</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>Send announcements and updates to fans</p>
        </div>
        <button onClick={() => setModal(true)} style={{ ...c.btn, ...c.btnPrimary }}>+ Send Notification</button>
      </div>

      {toast && (
        <div style={{ position: 'fixed', top: 24, right: 24, background: '#1a1a1a', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 10, padding: '12px 20px', zIndex: 9999, fontSize: '0.85rem', color: '#fff' }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Sent Total"     value={sent.length}                                             icon="📤" color="#D4AF37" />
        <StatCard label="Announcements"  value={sent.filter(n => n.type === 'Announcement').length}      icon="📢" color="#3B82F6" />
        <StatCard label="Match Updates"  value={sent.filter(n => n.type === 'Match Update').length}      icon="⚽" color="#22C55E" />
        <StatCard label="Total Reached"  value={sent.reduce((s, n) => s + n.recipients, 0).toLocaleString()} icon="👥" color="#F59E0B" />
      </div>

      <SectionCard title="📬 Notification History" action="">
        {sent.length === 0 && <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: 24 }}>No notifications sent yet.</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sent.map(n => (
            <div key={n.id} style={{ ...c.card, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: '14px 18px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{n.title}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <span>📅 {n.sent}</span>
                  <span>👥 {n.recipients?.toLocaleString()} recipients</span>
                  <span>To: {n.audience}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Badge label={n.type} color={typeColors[n.type] || '#D4AF37'} />
                <button onClick={() => del(n.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.7rem' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {modal && (
        <Modal title="📢 Send Notification" onClose={() => setModal(false)}>
          <FormField label="Title / Subject"><input style={c.input} value={form.title} onChange={f('title')} placeholder="e.g. Quarter-Finals start tomorrow!" /></FormField>
          <FormField label="Body Message">
            <textarea style={{ ...c.input, minHeight: 90, resize: 'vertical' }} value={form.body} onChange={f('body')} placeholder="Full message body..." />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Type">
              <select style={{ ...c.select, width: '100%' }} value={form.type} onChange={f('type')}>
                {['Announcement','Match Update','Transactional','Promotional','Alert'].map(t => <option key={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Audience">
              <select style={{ ...c.select, width: '100%' }} value={form.audience} onChange={f('audience')}>
                {['All Fans','Confirmed Buyers','Unverified Fans','Team Representatives','VIP Ticket Holders'].map(a => <option key={a}>{a}</option>)}
              </select>
            </FormField>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button onClick={() => setModal(false)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={send} disabled={sending || !form.title} style={{ ...c.btn, ...c.btnPrimary }}>
              {sending ? '…Sending' : '📤 Send Now'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
