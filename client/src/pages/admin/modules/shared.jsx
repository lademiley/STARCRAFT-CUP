import React, { useState } from 'react'

// ─── Shared design tokens ─────────────────────────────────────
export const c = {
  card: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14, padding: 20,
  },
  sectionCard: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, padding: '20px 24px', marginBottom: 20,
  },
  badge: {
    display: 'inline-flex', alignItems: 'center',
    padding: '2px 8px', borderRadius: 20,
    fontSize: '0.7rem', fontWeight: 700,
  },
  btn: {
    padding: '8px 16px', borderRadius: 8, border: 'none',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
    transition: 'all 200ms',
  },
  btnPrimary: {
    background: 'linear-gradient(135deg,#D4AF37,#8C6A12)',
    color: '#000',
  },
  btnDanger: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171',
  },
  btnGhost: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.7)',
  },
  input: {
    width: '100%', padding: '10px 14px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, color: '#fff',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '0.85rem', outline: 'none',
  },
  select: {
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, color: '#fff',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '0.85rem', outline: 'none', cursor: 'pointer',
  },
  th: {
    padding: '10px 14px', textAlign: 'left',
    fontSize: '0.68rem', fontWeight: 700,
    color: 'rgba(255,255,255,0.35)', letterSpacing: 0.8,
    textTransform: 'uppercase',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  },
  td: {
    padding: '11px 14px',
    fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
}

// ─── Reusable components ──────────────────────────────────────

export function StatCard({ label, value, icon, change, color = '#D4AF37', sub }) {
  return (
    <div style={{ ...c.card, borderLeft: `3px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
        {sub && <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>{sub}</span>}
      </div>
      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', marginBottom: 2 }}>{value}</div>
      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>{label}</div>
      {change && <div style={{ fontSize: '0.68rem', color, fontWeight: 600 }}>{change}</div>}
    </div>
  )
}

export function SectionCard({ title, action, onAction, children }) {
  return (
    <div style={c.sectionCard}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontFamily: "'Cinzel',serif", fontSize: '0.95rem', color: '#fff', fontWeight: 700 }}>
          {title}
        </h3>
        {action && (
          <button onClick={onAction} style={{ ...c.btn, ...c.btnPrimary, fontSize: '0.72rem', padding: '6px 14px' }}>
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

export function Badge({ label, color = '#D4AF37' }) {
  return (
    <span style={{
      ...c.badge,
      background: `${color}18`,
      color,
      border: `1px solid ${color}30`,
    }}>
      {label}
    </span>
  )
}

export function Table({ cols, rows, renderRow }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {cols.map(col => (
              <th key={col} style={c.th}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => renderRow(row, i))}
        </tbody>
      </table>
    </div>
  )
}

export function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#1a1a2e', border: '1px solid rgba(212,175,55,0.2)',
        borderRadius: 16, padding: '28px 32px', width: '100%', maxWidth: 520,
        maxHeight: '85vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontFamily: "'Cinzel',serif", color: '#D4AF37', fontSize: '1rem' }}>{title}</h3>
          <button onClick={onClose} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function FormField({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

export function ModuleHeader({ title, subtitle, action, onAction, count }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
      <div>
        <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>{title}</h2>
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>
          {subtitle} {count !== undefined && <Badge label={`${count} total`} color="#D4AF37" />}
        </p>
      </div>
      {action && (
        <button onClick={onAction} style={{ ...c.btn, ...c.btnPrimary }}>
          + {action}
        </button>
      )}
    </div>
  )
}

export function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ ...c.input, width: 260 }}
    />
  )
}

export function ActionRow({ children }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
      {children}
    </div>
  )
}
