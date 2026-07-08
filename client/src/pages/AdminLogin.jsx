import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { adminLogin, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAdmin) navigate('/admin/dashboard', { replace: true })
  }, [isAdmin, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await adminLogin(email, password)
    if (result.success) {
      navigate('/admin/dashboard', { replace: true })
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div style={styles.page}>
      {/* Background pattern */}
      <div style={styles.bg} />
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.shield}>🛡️</div>
          <h1 style={styles.title}>Admin Portal</h1>
          <p style={styles.subtitle}>StarCraft Cup 2026 — Restricted Access</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>✉️</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@starcraft2026.com"
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                style={{ ...styles.input, paddingRight: 44 }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && (
            <div style={styles.error}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            ...styles.submitBtn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? (
              <span>Authenticating<span style={styles.dots}>...</span></span>
            ) : (
              '🔓 Access Dashboard'
            )}
          </button>
        </form>

        <div style={styles.footer}>
          <a href="/" style={styles.backLink}>← Back to Public Site</a>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0a14 0%, #110816 50%, #0d0a04 100%)',
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  bg: {
    position: 'absolute', inset: 0,
    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212,175,55,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139,14,18,0.1) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  card: {
    width: '100%', maxWidth: 440,
    background: 'rgba(20,18,30,0.95)',
    border: '1px solid rgba(212,175,55,0.2)',
    borderRadius: 24,
    padding: '40px 36px',
    boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(212,175,55,0.05)',
    position: 'relative',
  },
  header: {
    textAlign: 'center', marginBottom: 24,
  },
  shield: {
    fontSize: 48, display: 'block', marginBottom: 12,
    filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.4))',
  },
  title: {
    fontFamily: "'Cinzel', serif",
    fontSize: '1.8rem', fontWeight: 900,
    color: '#D4AF37',
    letterSpacing: 2,
    textTransform: 'uppercase',
    margin: '0 0 6px',
  },
  subtitle: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.75rem', fontWeight: 600,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.75rem', fontWeight: 700,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5, textTransform: 'uppercase',
  },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: 14, fontSize: '1rem', pointerEvents: 'none' },
  input: {
    width: '100%', padding: '13px 14px 13px 42px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#fff',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 200ms',
  },
  eyeBtn: {
    position: 'absolute', right: 12, background: 'none', border: 'none',
    cursor: 'pointer', fontSize: '1rem', padding: 4,
  },
  error: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: 8, padding: '10px 14px',
    color: '#fca5a5',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '0.85rem',
  },
  submitBtn: {
    padding: '14px',
    background: 'linear-gradient(135deg, #D4AF37, #8C6A12)',
    border: 'none', borderRadius: 12,
    color: '#000', fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.9rem', fontWeight: 800,
    letterSpacing: 1, textTransform: 'uppercase',
    cursor: 'pointer', marginTop: 4,
    boxShadow: '0 4px 20px rgba(212,175,55,0.3)',
    transition: 'all 200ms ease',
  },
  dots: { display: 'inline-block' },
  footer: { textAlign: 'center', marginTop: 24 },
  backLink: {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)',
    textDecoration: 'none', transition: 'color 200ms',
  },
}
