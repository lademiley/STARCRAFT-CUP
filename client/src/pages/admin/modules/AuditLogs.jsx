import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, ModuleHeader, SearchBar, ActionRow } from './shared'

const initLogs = [
  { id: 1,  time: '2026-12-13 19:45', user: 'admin',             action: 'Confirmed payment order',           target: 'Order SCT-AB12CD',    level: 'info'    },
  { id: 2,  time: '2026-12-13 18:30', user: 'system',            action: 'Ticket order submitted',            target: 'Order SCT-XY9Z21',    level: 'info'    },
  { id: 3,  time: '2026-12-13 17:00', user: 'admin',             action: 'Match result updated',              target: 'Fixture ID 5',        level: 'info'    },
  { id: 4,  time: '2026-12-12 15:22', user: 'adaeze.uwaifo',     action: 'Article published',                 target: 'QF Preview Article',  level: 'info'    },
  { id: 5,  time: '2026-12-12 14:10', user: 'admin',             action: 'Volunteer approved',                target: 'Adaeze Okonkwo',       level: 'info'    },
  { id: 6,  time: '2026-12-11 12:05', user: 'system',            action: 'Failed login attempt',              target: 'admin@scup2026.ng',   level: 'warning' },
  { id: 7,  time: '2026-12-10 09:30', user: 'admin',             action: 'Team registration approved',        target: 'SC2026-DEMO01',       level: 'info'    },
  { id: 8,  time: '2026-12-09 11:00', user: 'admin',             action: 'Payment order rejected',            target: 'Order SCT-ZZZZ00',    level: 'warning' },
  { id: 9,  time: '2026-12-08 08:45', user: 'system',            action: 'Server started',                    target: 'API v1.0',            level: 'info'    },
  { id: 10, time: '2026-12-07 16:20', user: 'admin',             action: 'Fixture schedule updated',          target: 'QF Fixtures',         level: 'info'    },
  { id: 11, time: '2026-12-06 10:00', user: 'admin',             action: 'Admin login',                       target: 'admin@scup2026.ng',   level: 'info'    },
  { id: 12, time: '2026-12-05 14:30', user: 'system',            action: 'Sponsor payment recorded',          target: 'Access Bank',         level: 'info'    },
]

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
