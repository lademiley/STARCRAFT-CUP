import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Home', path: '/' },
  {
    label: 'Tournament', path: '/tournament',
    sub: [
      { label: 'Overview', path: '/tournament' },
      { label: 'Fixtures', path: '/fixtures' },
      { label: 'Live Scores', path: '/live-scores' },
      { label: 'League Table', path: '/league-table' },
    ]
  },
  {
    label: 'Teams & Players', path: '/teams',
    sub: [
      { label: 'Teams', path: '/teams' },
      { label: 'Players', path: '/players' },
      { label: 'Statistics', path: '/statistics' },
    ]
  },
  { label: 'News', path: '/news' },
  { label: 'Gallery', path: '/gallery' },
  {
    label: 'More', path: '/about',
    sub: [
      { label: 'About', path: '/about' },
      { label: 'Sponsors', path: '/sponsors' },
      { label: 'Media Center', path: '/media-center' },
      { label: 'Volunteers', path: '/volunteers' },
      { label: 'Contact', path: '/contact' },
    ]
  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()
  const { isAdmin, adminLogout } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false); setActiveDropdown(null) }, [location])

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner container">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <div className="logo-icon">⚽</div>
            <div className="logo-text">
              <span className="logo-top">STARCRAFT</span>
              <span className="logo-bottom">CUP 2027</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="nav-links">
            {navLinks.map(link => (
              <li
                key={link.path}
                className={`nav-item ${link.sub ? 'has-dropdown' : ''}`}
                onMouseEnter={() => link.sub && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <NavLink
                  to={link.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  aria-haspopup={link.sub ? 'true' : undefined}
                  aria-expanded={link.sub ? activeDropdown === link.label : undefined}
                  onFocus={() => link.sub && setActiveDropdown(link.label)}
                  onBlur={(e) => {
                    if (!e.currentTarget.closest('li')?.contains(e.relatedTarget)) {
                      setActiveDropdown(null)
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setActiveDropdown(null)
                    if ((e.key === 'Enter' || e.key === ' ') && link.sub) {
                      e.preventDefault()
                      setActiveDropdown(prev => prev === link.label ? null : link.label)
                    }
                  }}
                >
                  {link.label}
                  {link.sub && <span className="caret" aria-hidden="true">▾</span>}
                </NavLink>
                {link.sub && activeDropdown === link.label && (
                  <div className="dropdown" role="menu" aria-label={`${link.label} submenu`}>
                    {link.sub.map((sub, idx) => (
                      <Link
                        key={sub.path}
                        to={sub.path}
                        className="dropdown-item"
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') setActiveDropdown(null)
                        }}
                        onBlur={(e) => {
                          if (idx === link.sub.length - 1 && !e.currentTarget.closest('.dropdown')?.contains(e.relatedTarget)) {
                            setActiveDropdown(null)
                          }
                        }}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Live indicator + Auth */}
          <div className="nav-right">
            <Link to="/live-scores" className="live-btn">
              <span className="live-dot"></span> LIVE
            </Link>
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" className="btn btn-admin btn-sm">🛡️ Admin</Link>
                <button onClick={adminLogout} className="btn btn-secondary btn-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
                <Link to="/admin/login" className="btn btn-admin-ghost btn-sm" title="Admin Portal">🛡️</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
            <span className={mobileOpen ? 'open' : ''}></span>
            <span className={mobileOpen ? 'open' : ''}></span>
            <span className={mobileOpen ? 'open' : ''}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          {navLinks.map(link => (
            <div key={link.path}>
              <Link to={link.path} className="mobile-link">{link.label}</Link>
              {link.sub && link.sub.map(sub => (
                <Link key={sub.path} to={sub.path} className="mobile-sub-link">— {sub.label}</Link>
              ))}
            </div>
          ))}
          <div className="mobile-auth">
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" className="btn btn-admin" style={{width:'100%',justifyContent:'center',marginBottom:12}}>🛡️ Admin Dashboard</Link>
                <button onClick={adminLogout} className="btn btn-secondary" style={{width:'100%',justifyContent:'center'}}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary" style={{width:'100%',justifyContent:'center',marginBottom:12}}>Login</Link>
                <Link to="/register" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginBottom:12}}>Register Team</Link>
                <Link to="/admin/login" className="btn btn-admin-ghost" style={{width:'100%',justifyContent:'center'}}>🛡️ Admin Portal</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          padding: 16px 0;
          background: transparent;
          transition: all 400ms ease;
        }
        .navbar.scrolled {
          background: rgba(30, 2, 4, 0.97);
          backdrop-filter: blur(20px);
          padding: 10px 0;
          box-shadow: 0 4px 30px rgba(0,0,0,0.5);
          border-bottom: 1px solid rgba(212,175,55,0.15);
        }
        .nav-inner {
          display: flex; align-items: center; gap: 24px;
        }
        .nav-logo {
          display: flex; align-items: center; gap: 12px; flex-shrink: 0;
        }
        .logo-icon {
          font-size: 1.8rem;
          filter: drop-shadow(0 0 8px rgba(212,175,55,0.6));
        }
        .logo-text { display: flex; flex-direction: column; line-height: 1; }
        .logo-top {
          font-family: var(--font-heading);
          font-size: 1rem; font-weight: 900;
          letter-spacing: 3px; color: var(--gold);
        }
        .logo-bottom {
          font-family: var(--font-secondary);
          font-size: 0.65rem; font-weight: 700;
          letter-spacing: 2px; color: rgba(255,255,255,0.7);
        }
        .nav-links {
          display: flex; list-style: none; gap: 4px; margin: 0 auto;
        }
        .nav-item { position: relative; }
        .nav-link {
          display: flex; align-items: center; gap: 4px;
          padding: 8px 14px;
          font-family: var(--font-secondary);
          font-size: 0.8rem; font-weight: 600;
          letter-spacing: 0.5px; text-transform: uppercase;
          color: rgba(255,255,255,0.8);
          border-radius: 8px;
          transition: all 300ms ease;
        }
        .nav-link:hover, .nav-link.active {
          color: var(--gold);
          background: rgba(212,175,55,0.08);
        }
        .caret { font-size: 0.6rem; margin-top: 1px; }
        .dropdown {
          position: absolute; top: calc(100% + 8px); left: 0;
          background: rgba(20, 2, 3, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 12px;
          padding: 8px;
          min-width: 180px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
          animation: fadeDown 200ms ease;
        }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .dropdown-item {
          display: block; padding: 10px 14px;
          font-family: var(--font-secondary);
          font-size: 0.8rem; font-weight: 600;
          color: rgba(255,255,255,0.75);
          border-radius: 8px;
          transition: all 200ms ease;
        }
        .dropdown-item:hover { color: var(--gold); background: rgba(212,175,55,0.08); }
        .nav-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .live-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 14px;
          background: rgba(220,38,38,0.15);
          border: 1px solid rgba(220,38,38,0.4);
          border-radius: 20px;
          font-family: var(--font-secondary);
          font-size: 0.7rem; font-weight: 800;
          letter-spacing: 1px; color: #ff6b6b;
          transition: all 300ms ease;
        }
        .live-btn:hover { background: rgba(220,38,38,0.3); }

        /* Admin button styles */
        .btn-admin {
          padding: 6px 14px;
          background: linear-gradient(135deg, rgba(212,175,55,0.2), rgba(140,106,18,0.3));
          border: 1px solid rgba(212,175,55,0.4);
          border-radius: 8px;
          font-family: var(--font-secondary);
          font-size: 0.72rem; font-weight: 800;
          letter-spacing: 0.5px; color: #D4AF37;
          text-transform: uppercase;
          transition: all 300ms ease;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center; gap: 4px;
        }
        .btn-admin:hover {
          background: linear-gradient(135deg, rgba(212,175,55,0.35), rgba(140,106,18,0.4));
          border-color: rgba(212,175,55,0.7);
          box-shadow: 0 0 16px rgba(212,175,55,0.2);
        }
        .btn-admin-ghost {
          padding: 6px 10px;
          background: rgba(212,175,55,0.06);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 8px;
          font-size: 0.85rem;
          color: rgba(212,175,55,0.6);
          transition: all 300ms ease;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex; align-items: center;
        }
        .btn-admin-ghost:hover {
          background: rgba(212,175,55,0.15);
          border-color: rgba(212,175,55,0.4);
          color: #D4AF37;
        }

        .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
        .hamburger span {
          display: block; width: 24px; height: 2px;
          background: var(--gold); border-radius: 2px;
          transition: all 300ms ease;
        }
        .hamburger span.open:nth-child(1) { transform: rotate(45deg) translate(5px,5px); }
        .hamburger span.open:nth-child(2) { opacity: 0; }
        .hamburger span.open:nth-child(3) { transform: rotate(-45deg) translate(5px,-5px); }
        .mobile-menu {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 999;
          background: rgba(10, 1, 2, 0.98);
          backdrop-filter: blur(20px);
          transform: translateX(-100%);
          transition: transform 350ms ease;
          overflow-y: auto;
        }
        .mobile-menu.open { transform: translateX(0); }
        .mobile-menu-inner { padding: 100px 24px 40px; }
        .mobile-link {
          display: block; padding: 14px 0;
          font-family: var(--font-heading);
          font-size: 1.2rem; color: var(--white);
          border-bottom: 1px solid rgba(212,175,55,0.1);
          transition: color 200ms;
        }
        .mobile-link:hover { color: var(--gold); }
        .mobile-sub-link {
          display: block; padding: 8px 12px;
          font-family: var(--font-secondary);
          font-size: 0.85rem; color: rgba(255,255,255,0.6);
          transition: color 200ms;
        }
        .mobile-sub-link:hover { color: var(--gold); }
        .mobile-auth { margin-top: 32px; }
        @media (max-width: 1024px) {
          .nav-links, .nav-right .btn, .nav-right .btn-admin, .nav-right .btn-admin-ghost { display: none; }
          .hamburger { display: flex; margin-left: auto; }
          .live-btn { display: flex; }
        }
        @media (max-width: 480px) { .live-btn { display: none; } }
      `}</style>
    </>
  )
}
