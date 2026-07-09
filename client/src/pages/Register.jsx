import React from 'react'
import { Link } from 'react-router-dom'

export default function Register() {
  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-container" style={{ maxWidth: 780 }}>
        <div className="auth-card card">

          {/* Logo */}
          <div className="auth-logo">
            <span style={{ fontSize: '2rem' }}>⚽</span>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: 900, letterSpacing: '3px', color: 'var(--gold)' }}>STARCRAFT CUP 2026</div>
          </div>

          <h2 style={{ textAlign: 'center', marginBottom: 6 }}>Create Account</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
            Join StarCraft Cup 2026 — Edo State
          </p>

          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            <Link to="/register/chairman" className="card" style={choiceCardStyle}>
              <div style={{ fontSize: '2.4rem', marginBottom: 10 }}>🏛️</div>
              <div style={choiceTitleStyle}>LGA Chairman</div>
              <p style={choiceDescStyle}>Register your Local Government Area and manage players from your dashboard.</p>
            </Link>
            <Link to="/register/player" className="card" style={choiceCardStyle}>
              <div style={{ fontSize: '2.4rem', marginBottom: 10 }}>🧑‍⚽️</div>
              <div style={choiceTitleStyle}>Player</div>
              <p style={choiceDescStyle}>Register as an individual player to take part in the tournament.</p>
            </Link>
            <Link to="/register/fan" className="card" style={choiceCardStyle}>
              <div style={{ fontSize: '2.4rem', marginBottom: 10 }}>🎟️</div>
              <div style={choiceTitleStyle}>Fan / Ticket Account</div>
              <p style={choiceDescStyle}>Pick your team, choose a ticket category and pay securely online.</p>
            </Link>
          </div>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 700 }}>Sign In →</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:100px 24px 40px;background:linear-gradient(160deg,#0d0102 0%,#3a0608 50%,#0d0102 100%)}
        .auth-bg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(212,175,55,.06) 0%,transparent 70%);pointer-events:none}
        .auth-container{width:100%;position:relative;z-index:1}
        .auth-card{padding:40px}
        .auth-logo{display:flex;align-items:center;gap:14px;justify-content:center;margin-bottom:24px}
        @media(max-width:480px){.auth-card{padding:28px 20px}}
      `}</style>
    </div>
  )
}

const choiceCardStyle = {
  display: 'block', padding: 24, textAlign: 'center',
  border: '1px solid rgba(212,175,55,0.2)', borderRadius: 14,
  textDecoration: 'none', color: '#fff', transition: 'transform 200ms, border-color 200ms',
  cursor: 'pointer',
}
const choiceTitleStyle = { fontFamily: 'var(--font-secondary)', fontWeight: 800, fontSize: '1rem', color: 'var(--gold)', marginBottom: 8 }
const choiceDescStyle = { fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, margin: 0 }
