import React from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-container">
        <div className="auth-card card">
          {/* Logo */}
          <div className="auth-logo" style={{justifyContent:'center'}}>
            <img src="/logo.png" alt="StarCraft Cup" style={{width:110,height:110,objectFit:'contain'}} />
          </div>

          <h2 style={{textAlign:'center',marginBottom:6,color:'var(--white)'}}>Welcome Back</h2>
          <p style={{textAlign:'center',color:'rgba(255,255,255,0.5)',marginBottom:36}}>Choose your portal to sign in</p>

          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <Link to="/chairman/login" style={{display:'flex',alignItems:'center',gap:16,textDecoration:'none',padding:'20px 24px',borderRadius:12,background:'rgba(212,175,55,0.08)',border:'1px solid rgba(212,175,55,0.3)',transition:'all 0.2s'}}>
              <span style={{fontSize:'2rem',flexShrink:0}}>🏛️</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:'var(--font-heading)',fontSize:'0.95rem',fontWeight:900,letterSpacing:'2px',color:'var(--gold)',marginBottom:2}}>LGA CHAIRMAN LOGIN</div>
                <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.45)'}}>Register & manage your LGA team</div>
              </div>
              <span style={{color:'var(--gold)',fontSize:'1.2rem',flexShrink:0}}>→</span>
            </Link>

            <Link to="/player/login" style={{display:'flex',alignItems:'center',gap:16,textDecoration:'none',padding:'20px 24px',borderRadius:12,background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.12)',transition:'all 0.2s'}}>
              <span style={{fontSize:'2rem',flexShrink:0}}>⚽</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:'var(--font-heading)',fontSize:'0.95rem',fontWeight:900,letterSpacing:'2px',color:'var(--white)',marginBottom:2}}>PLAYER LOGIN</div>
                <div style={{fontSize:'0.78rem',color:'rgba(255,255,255,0.45)'}}>Access your player dashboard</div>
              </div>
              <span style={{color:'rgba(255,255,255,0.4)',fontSize:'1.2rem',flexShrink:0}}>→</span>
            </Link>
          </div>

          <div style={{marginTop:32,paddingTop:24,borderTop:'1px solid rgba(255,255,255,0.08)',textAlign:'center'}}>
            <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.4)',marginBottom:12}}>New to StarCraft Cup?</p>
            <Link to="/register" className="btn btn-secondary" style={{width:'100%',justifyContent:'center'}}>
              Register Your Team →
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 100px 24px 40px; background: linear-gradient(160deg, #0d0102 0%, #3a0608 50%, #0d0102 100%); }
        .auth-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.06) 0%, transparent 70%); pointer-events: none; }
        .auth-container { width: 100%; max-width: 440px; position: relative; z-index: 1; }
        .auth-card { padding: 48px 40px; }
        .auth-logo { display: flex; align-items: center; gap: 14px; justify-content: center; margin-bottom: 28px; }
        @media (max-width: 480px) { .auth-card { padding: 32px 24px; } }
      `}</style>
    </div>
  )
}
