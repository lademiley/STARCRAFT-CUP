import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Modal, FormField, ModuleHeader } from './shared'

const initNotifs = [
  { id: 1, title: 'Quarter-Final Draw Announced', message: 'The quarter-final draw has been made. Edo Warriors face Benin Royals on March 20th at Ogbemudia Stadium.', target: 'All Users', sent: '2027-03-15 10:00', type: 'Announcement', status: 'Sent' },
  { id: 2, title: 'Match Result: Edo Warriors 4–0 Ughelli Rangers', message: 'Final score confirmed. Match report and stats now available on the website.', target: 'All Users', sent: '2027-03-01 17:30', type: 'Match Update', status: 'Sent' },
  { id: 3, title: 'Ticket Sales Now Open', message: 'Quarter-final tickets are on sale. VIP ₦5,000 | Regular ₦2,000 | Student ₦1,000. Limited availability.', target: 'All Users', sent: '2027-03-16 09:00', type: 'Commercial', status: 'Sent' },
  { id: 4, title: 'Team Manager Deadline Reminder', message: 'Reminder: Final squad submissions are due by March 18th. Please log in to submit your squad list.', target: 'Team Managers', sent: '2027-03-12 08:00', type: 'Reminder', status: 'Sent' },
  { id: 5, title: 'Semi-Final Schedule Released', message: 'Semi-final fixtures confirmed. Check the fixtures page for full details.', target: 'All Users', sent: null, type: 'Announcement', status: 'Scheduled' },
]

const blank = { title: '', message: '', target: 'All Users', type: 'Announcement', status: 'Draft' }
const typeColor = { Announcement: '#D4AF37', 'Match Update': '#3B82F6', Commercial: '#22C55E', Reminder: '#F59E0B', Alert: '#EF4444' }

export default function Notifications() {
  const [notifs, setNotifs] = useState(initNotifs)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(blank)

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const handleSend = () => {
    const n = { ...form, id: Date.now(), sent: new Date().toLocaleString(), status: 'Sent' }
    setNotifs(prev => [n, ...prev])
    setModal(false); setForm(blank)
    alert(`✅ Notification sent to: ${form.target}`)
  }
  const handleDelete = id => { if (confirm('Delete notification?')) setNotifs(prev => prev.filter(n => n.id !== id)) }

  return (
    <div>
      <ModuleHeader title="Notifications" subtitle="Send push notifications and announcements" action="Send Notification" onAction={() => { setForm(blank); setModal(true) }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Sent" value={notifs.filter(n => n.status === 'Sent').length} icon="📤" color="#D4AF37" />
        <StatCard label="Scheduled" value={notifs.filter(n => n.status === 'Scheduled').length} icon="⏰" color="#F59E0B" />
        <StatCard label="This Week" value={3} icon="📅" color="#3B82F6" />
        <StatCard label="Reach" value="1,847" icon="👥" color="#22C55E" sub="users" />
      </div>

      <SectionCard title="🔔 Notification History" action="">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notifs.map((n, i) => (
            <div key={n.id} style={{
              ...c.card,
              borderLeft: `3px solid ${typeColor[n.type] || '#D4AF37'}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                  <Badge label={n.type} color={typeColor[n.type] || '#D4AF37'} />
                  <Badge label={n.target} color="#8B5CF6" />
                  <Badge label={n.status} color={n.status === 'Sent' ? '#22C55E' : '#F59E0B'} />
                </div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: 4 }}>{n.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', marginBottom: 6 }}>{n.message}</div>
                {n.sent && <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>Sent: {n.sent}</div>}
              </div>
              <button onClick={() => handleDelete(n.id)} style={{ ...c.btn, ...c.btnDanger, padding: '6px 10px', fontSize: '0.72rem', flexShrink: 0 }}>🗑️</button>
            </div>
          ))}
        </div>
      </SectionCard>

      {modal && (
        <Modal title="Send Notification" onClose={() => setModal(false)}>
          <FormField label="Title"><input style={c.input} value={form.title} onChange={set('title')} placeholder="Notification title..." /></FormField>
          <FormField label="Message">
            <textarea style={{ ...c.input, minHeight: 100, resize: 'vertical' }} value={form.message} onChange={set('message')} placeholder="Write your notification message here..." />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Target Audience">
              <select style={{ ...c.select, width: '100%' }} value={form.target} onChange={set('target')}>
                <option>All Users</option><option>Fans</option><option>Team Managers</option><option>Media</option><option>Sponsors</option>
              </select>
            </FormField>
            <FormField label="Type">
              <select style={{ ...c.select, width: '100%' }} value={form.type} onChange={set('type')}>
                {Object.keys(typeColor).map(t => <option key={t}>{t}</option>)}
              </select>
            </FormField>
          </div>
          <div style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: 8, padding: '10px 14px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
            📢 This notification will be sent to <strong style={{ color: '#D4AF37' }}>{form.target}</strong> immediately.
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setModal(false)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={handleSend} style={{ ...c.btn, ...c.btnPrimary }}>📤 Send Now</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
