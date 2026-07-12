import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(form.email, form.password)
    setLoading(false)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Invalid email or password')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-container">
        <div className="auth-card card">
          {/* Logo */}
          <div className="auth-logo">
            <span style={{fontSize:'2.5rem'}}>⚽</span>
            <div>
              <div style={{fontFamily:'var(--font-heading)',fontSize:'1rem',fontWeight:900,letterSpacing:'3px',color:'var(--gold)'}}>STARCRAFT</div>
              <div style={{fontFamily:'var(--font-secondary)',fontSize:'0.65rem',letterSpacing:'2px',color:'rgba(255,255,255,0.6)'}}>CUP 2027</div>
            </div>
          </div>

          <h2 style={{textAlign:'center',marginBottom:6,color:'var(--white)'}}>Welcome Back</h2>
          <p style={{textAlign:'center',color:'rgba(255,255,255,0.5)',marginBottom:32}}>Sign in to your StarCraft Cup account</p>

          {error && (
            <div style={{background:'rgba(139,14,18,0.4)',border:'1px solid rgba(212,175,55,0.3)',borderRadius:8,padding:'12px 16px',marginBottom:20,color:'#ff6b6b',fontSize:'0.9rem',textAlign:'center'}}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:4}}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="your@email.com"
                value={form.email}
                onChange={e=>setForm({...form,email:e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div style={{position:'relative'}}>
                <input
                  type={showPass?'text':'password'}
                  className="form-control"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e=>setForm({...form,password:e.target.value})}
                  required
                  style={{paddingRight:48}}
                />
                <button
                  type="button"
                  onClick={()=>setShowPass(!showPass)}
                  style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer',fontSize:'0.85rem'}}
                >
                  {showPass?'🙈':'👁'}
                </button>
              </div>
            </div>
            <div style={{display:'flex',justifyContent:'flex-end',marginBottom:8}}>
              <Link to="#" style={{fontSize:'0.85rem',color:'var(--gold)'}}>Forgot Password?</Link>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{width:'100%',justifyContent:'center',marginBottom:16}}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>

            <div className="divider-text"><span>or sign in with</span></div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:16}}>
              <button type="button" className="btn btn-secondary" style={{justifyContent:'center',gap:8}}>
                <span>G</span> Google
              </button>
              <button type="button" className="btn btn-secondary" style={{justifyContent:'center',gap:8}}>
                <span>f</span> Facebook
              </button>
            </div>

            <p style={{textAlign:'center',marginTop:24,fontSize:'0.9rem',color:'rgba(255,255,255,0.5)'}}>
              Don't have an account?{' '}
              <Link to="/register" style={{color:'var(--gold)',fontWeight:700}}>Register →</Link>
            </p>

            <div style={{marginTop:24,padding:'16px',background:'rgba(212,175,55,0.06)',border:'1px solid rgba(212,175,55,0.15)',borderRadius:10}}>
              <div style={{fontSize:'0.72rem',fontWeight:700,letterSpacing:1,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',marginBottom:10}}>Other Portals</div>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                <Link to="/chairman/login" style={{display:'flex',alignItems:'center',gap:8,fontSize:'0.82rem',color:'rgba(255,255,255,0.7)',textDecoration:'none',padding:'8px 12px',borderRadius:8,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
                  🏛️ <span>LGA Chairman Login</span> <span style={{marginLeft:'auto',color:'var(--gold)'}}>→</span>
                </Link>
                <Link to="/player/login" style={{display:'flex',alignItems:'center',gap:8,fontSize:'0.82rem',color:'rgba(255,255,255,0.7)',textDecoration:'none',padding:'8px 12px',borderRadius:8,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
                  ⚽ <span>Player Login</span> <span style={{marginLeft:'auto',color:'var(--gold)'}}>→</span>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 100px 24px 40px; background: linear-gradient(160deg, #0d0102 0%, #3a0608 50%, #0d0102 100%); }
        .auth-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%); pointer-events: none; }
        .auth-container { width: 100%; max-width: 480px; position: relative; z-index: 1; }
        .auth-card { padding: 48px 40px; }
        .auth-logo { display: flex; align-items: center; gap: 14px; justify-content: center; margin-bottom: 28px; }
        .divider-text { display: flex; align-items: center; gap: 12px; margin: 8px 0; }
        .divider-text::before, .divider-text::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.1); }
        .divider-text span { font-family: var(--font-secondary); font-size: 0.75rem; color: rgba(255,255,255,0.4); white-space: nowrap; }
        @media (max-width: 480px) { .auth-card { padding: 32px 24px; } }
      `}</style>
    </div>
  )
}
