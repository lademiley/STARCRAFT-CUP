import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, ModuleHeader, SearchBar, ActionRow } from './shared'

const initLogs = []

const levelColors = { info: '#3B82F6', warning: '#F59E0B', error: '#EF4444', critical: '#8B5CF6' }
const levelIcons  = { info: 'ℹ️', warning: '⚠️', error: '❌', critical: '🔴' }

export default function AuditLogs() {
  const [logs, setLogs]     = useState(initLogs)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('All')

  const filtered = logs.filter(l =>
    (levelFilter === 'All' || l.level === levelFilter) &&
    (l.action.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase()) || l.target.toLowerCase().includes(search.toLowerCase()))
  )

  const exportCSV = () => {
    const csv = ['Time,User,Action,Target,Level', ...logs.map(l => `"${l.time}","${l.user}","${l.action}","${l.target}","${l.level}"`)].join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'audit-log-scup2026.csv'
    a.click()
  }

  const clear = () => { if (confirm('Clear all log entries?')) setLogs([]) }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>Audit Logs</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>System activity trail — StarCraft Cup 2026</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={exportCSV} style={{ ...c.btn, ...c.btnGhost, fontSize: '0.78rem' }}>⬇️ Export CSV</button>
          <button onClick={clear} style={{ ...c.btn, ...c.btnDanger, fontSize: '0.78rem' }}>🗑️ Clear</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Events" value={logs.length}                                      icon="📋" color="#D4AF37" />
        <StatCard label="Info"         value={logs.filter(l => l.level === 'info').length}      icon="ℹ️" color="#3B82F6" />
        <StatCard label="Warnings"     value={logs.filter(l => l.level === 'warning').length}   icon="⚠️" color="#F59E0B" />
        <StatCard label="Errors"       value={logs.filter(l => l.level === 'error').length}     icon="❌" color="#EF4444" />
      </div>

      <SectionCard title="📋 Activity Log" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search actions, users, targets..." />
          <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} style={c.select}>
            <option value="All">All Levels</option>
            {['info','warning','error','critical'].map(l => <option key={l}>{l}</option>)}
          </select>
        </ActionRow>

        {filtered.length === 0 && <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: 24 }}>No log entries found.</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {filtered.map((log, i) => (
            <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{levelIcons[log.level] || 'ℹ️'}</span>
              <div style={{ width: 140, fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>{log.time}</div>
              <div style={{ width: 120, flexShrink: 0 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D4AF37' }}>{log.user}</span>
              </div>
              <div style={{ flex: 1, fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>{log.action}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', flexShrink: 0, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.target}</div>
              <Badge label={log.level} color={levelColors[log.level] || '#3B82F6'} />
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
