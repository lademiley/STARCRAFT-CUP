import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            {/* Brand */}
            <div className="footer-brand">
              <div className="footer-logo">
                <img src={logo} alt="StarCraft Cup" style={{height:64,width:'auto'}} />
              </div>
              <p style={{marginTop:16,fontSize:'0.9rem',color:'rgba(255,255,255,0.6)',lineHeight:1.7}}>
                The premier grassroots football tournament in Edo State, Nigeria. Building champions, creating legends.
              </p>
              <div className="social-links" style={{marginTop:20}}>
                {['𝕏','f','in','📸','▶'].map((s,i) => (
                  <a key={i} href="#" className="social-link">{s}</a>
                ))}
              </div>
            </div>

            {/* Tournament */}
            <div className="footer-col">
              <h4 className="footer-title">Tournament</h4>
              <ul className="footer-links">
                {[['Fixtures','/fixtures'],['Live Scores','/live-scores'],['League Table','/league-table'],['Statistics','/statistics'],['Teams','/teams'],['Players','/players']].map(([l,p]) => (
                  <li key={p}><Link to={p}>{l}</Link></li>
                ))}
              </ul>
            </div>

            {/* Info */}
            <div className="footer-col">
              <h4 className="footer-title">Information</h4>
              <ul className="footer-links">
                {[['About Us','/about'],['News','/news'],['Gallery','/gallery'],['Sponsors','/sponsors'],['Media Center','/media-center'],['Volunteers','/volunteers']].map(([l,p]) => (
                  <li key={p}><Link to={p}>{l}</Link></li>
                ))}
              </ul>
            </div>

            {/* Contact + Newsletter */}
            <div className="footer-col">
              <h4 className="footer-title">Contact Us</h4>
              <div className="footer-contact">
                <p>📍 University of Benin, Ugbowo, Edo State</p>
                <p>📞 +2348155576539</p>
                <p>📞 +2348056042784</p>
                <p>📞 +2347056445844</p>
                <p>✉️ info@starcraftcup.ng</p>
                <p>💬 WhatsApp: +2349077575347</p>
              </div>
              <h4 className="footer-title" style={{marginTop:24}}>Newsletter</h4>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email address" className="form-control" style={{fontSize:'0.85rem',padding:'10px 14px'}} />
                <button className="btn btn-primary btn-sm" style={{marginTop:10,width:'100%',justifyContent:'center'}}>Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-inner">
            <p>© 2027 StarCraft Cup. All rights reserved. Organized by Oredo LGA Football Board.</p>
            <div className="footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer { background: linear-gradient(180deg, #1a0305 0%, #0a0102 100%); border-top: 1px solid rgba(212,175,55,0.15); }
        .footer-top { padding: 80px 0 48px; }
        .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.4fr; gap: 48px; }
        .footer-logo { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
        .footer-title {
          font-family: var(--font-heading);
          font-size: 0.85rem; letter-spacing: 2px;
          text-transform: uppercase; color: var(--gold);
          margin-bottom: 20px;
        }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-links a {
          font-size: 0.9rem; color: rgba(255,255,255,0.6);
          transition: color 200ms ease;
        }
        .footer-links a:hover { color: var(--gold); }
        .footer-contact { display: flex; flex-direction: column; gap: 10px; }
        .footer-contact p { font-size: 0.85rem; color: rgba(255,255,255,0.6); }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.06); padding: 20px 0; }
        .footer-bottom-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .footer-bottom p { font-size: 0.8rem; color: rgba(255,255,255,0.4); }
        .footer-legal { display: flex; gap: 20px; }
        .footer-legal a { font-size: 0.8rem; color: rgba(255,255,255,0.4); transition: color 200ms; }
        .footer-legal a:hover { color: var(--gold); }
        @media (max-width: 1024px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 600px) { .footer-grid { grid-template-columns: 1fr; } .footer-bottom-inner { flex-direction: column; text-align: center; } }
      `}</style>
    </footer>
  )
}
