import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, ModuleHeader, SearchBar, ActionRow } from './shared'

const initLogs = [
  { id: 1, time: '2027-03-20 14:32:11', user: 'admin@starcraft2027.com', action: 'UPDATE', resource: 'Match Result', detail: 'Updated QF1 result: Edo Warriors 3–1 Benin Royals', ip: '197.210.x.x', severity: 'Info' },
  { id: 2, time: '2027-03-20 13:45:02', user: 'admin@starcraft2027.com', action: 'CREATE', resource: 'Notification', detail: 'Sent push notification to All Users: "Quarter-Final Results"', ip: '197.210.x.x', severity: 'Info' },
  { id: 3, time: '2027-03-19 18:12:55', user: 'admin@starcraft2027.com', action: 'DELETE', resource: 'User', detail: 'Deleted user account: j.suspect@gmail.com (spam)', ip: '197.210.x.x', severity: 'Warning' },
  { id: 4, time: '2027-03-19 16:00:33', user: 'admin@starcraft2027.com', action: 'LOGIN', resource: 'Admin Portal', detail: 'Successful admin login from 197.210.x.x', ip: '197.210.x.x', severity: 'Info' },
  { id: 5, time: '2027-03-18 11:22:08', user: 'admin@starcraft2027.com', action: 'UPDATE', resource: 'Fixture', detail: 'Changed QF3 venue from Ogbe Stadium to UNIBEN Bowl', ip: '197.210.x.x', severity: 'Info' },
  { id: 6, time: '2027-03-18 09:55:41', user: 'admin@starcraft2027.com', action: 'CREATE', resource: 'Article', detail: 'Published: "Quarter-Final Draw Announced"', ip: '197.210.x.x', severity: 'Info' },
  { id: 7, time: '2027-03-17 14:10:19', user: 'admin@starcraft2027.com', action: 'UPDATE', resource: 'Sponsor', detail: 'Updated GTBank status to Negotiating (₦15M deal pending)', ip: '197.210.x.x', severity: 'Info' },
  { id: 8, time: '2027-03-16 08:30:00', user: 'admin@starcraft2027.com', action: 'FAILED_LOGIN', resource: 'Admin Portal', detail: 'Failed login attempt from unknown IP 45.142.x.x', ip: '45.142.x.x', severity: 'Critical' },
  { id: 9, time: '2027-03-15 17:45:22', user: 'admin@starcraft2027.com', action: 'UPDATE', resource: 'Player', detail: 'Updated Monday Ogunbor status to Suspended (yellow card accumulation)', ip: '197.210.x.x', severity: 'Warning' },
  { id: 10, time: '2027-03-14 12:05:33', user: 'admin@starcraft2027.com', action: 'CREATE', resource: 'Team', detail: 'No new team added (tested form validation)', ip: '197.210.x.x', severity: 'Info' },
]

const actionColor = { CREATE: '#22C55E', UPDATE: '#3B82F6', DELETE: '#EF4444', LOGIN: '#D4AF37', FAILED_LOGIN: '#FF0000' }
const severityColor = { Info: '#3B82F6', Warning: '#F59E0B', Critical: '#EF4444' }

export default function AuditLogs() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('All')
  const [severityFilter, setSeverityFilter] = useState('All')

  const filtered = initLogs.filter(l =>
    (actionFilter === 'All' || l.action === actionFilter) &&
    (severityFilter === 'All' || l.severity === severityFilter) &&
    (l.detail.toLowerCase().includes(search.toLowerCase()) || l.resource.toLowerCase().includes(search.toLowerCase()))
  )

  const exportLogs = () => {
    const csv = ['Time,User,Action,Resource,Detail,IP,Severity', ...initLogs.map(l => `${l.time},${l.user},${l.action},${l.resource},"${l.detail}",${l.ip},${l.severity}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'audit-log.csv'; a.click()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>Audit Logs</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>Complete system activity trail</p>
        </div>
        <button onClick={exportLogs} style={{ ...c.btn, ...c.btnGhost }}>⬇️ Export CSV</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Events" value={initLogs.length} icon="📋" color="#D4AF37" />
        <StatCard label="Today" value={3} icon="📅" color="#3B82F6" />
        <StatCard label="Warnings" value={initLogs.filter(l => l.severity === 'Warning').length} icon="⚠️" color="#F59E0B" />
        <StatCard label="Critical" value={initLogs.filter(l => l.severity === 'Critical').length} icon="🚨" color="#EF4444" change="Needs review" />
      </div>

      <SectionCard title="📋 Activity Log" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search logs..." />
          <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} style={c.select}>
            <option value="All">All Actions</option>
            <option>CREATE</option><option>UPDATE</option><option>DELETE</option><option>LOGIN</option><option>FAILED_LOGIN</option>
          </select>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} style={c.select}>
            <option value="All">All Severity</option>
            <option>Info</option><option>Warning</option><option>Critical</option>
          </select>
        </ActionRow>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((l, i) => (
            <div key={l.id} style={{
              display: 'grid', gridTemplateColumns: 'auto auto 1fr auto',
              alignItems: 'center', gap: 14, padding: '12px 16px',
              background: l.severity === 'Critical' ? 'rgba(239,68,68,0.06)' : l.severity === 'Warning' ? 'rgba(245,158,11,0.04)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${l.severity === 'Critical' ? 'rgba(239,68,68,0.2)' : l.severity === 'Warning' ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.05)'}`,
              borderRadius: 8,
            }}>
              <Badge label={l.action} color={actionColor[l.action] || '#D4AF37'} />
              <Badge label={l.resource} color="#8B5CF6" />
              <div>
                <div style={{ fontSize: '0.82rem', color: '#fff', marginBottom: 2 }}>{l.detail}</div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)' }}>{l.time} · {l.user} · IP: {l.ip}</div>
              </div>
              <Badge label={l.severity} color={severityColor[l.severity]} />
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>No logs matching your filters</div>
          )}
        </div>
      </SectionCard>
    </div>
  )
}
