import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// --- Module Imports ---
import DashboardAnalytics from './modules/DashboardAnalytics'
import TeamManagement from './modules/TeamManagement'
import PlayerManagement from './modules/PlayerManagement'
import FixtureGenerator from './modules/FixtureGenerator'
import MatchResults from './modules/MatchResults'
import LiveScoreControl from './modules/LiveScoreControl'
import RefereeAssignment from './modules/RefereeAssignment'
import StadiumManagement from './modules/StadiumManagement'
import StaffManagement from './modules/StaffManagement'
import VolunteerManagement from './modules/VolunteerManagement'
import SponsorshipManagement from './modules/SponsorshipManagement'
import NewsBlogCMS from './modules/NewsBlogCMS'
import GalleryManagement from './modules/GalleryManagement'
import UserManagement from './modules/UserManagement'
import Notifications from './modules/Notifications'
import FinancialReports from './modules/FinancialReports'
import TicketSales from './modules/TicketSales'
import PaymentOrders from './modules/PaymentOrders'
import PaymentSettings from './modules/PaymentSettings'
import Merchandise from './modules/Merchandise'
import AuditLogs from './modules/AuditLogs'
import WebsiteSettings from './modules/WebsiteSettings'
import RolePermissions from './modules/RolePermissions'
import TeamManagerDashboard from './modules/TeamManagerDashboard'
import TeamRegistrations from './modules/TeamRegistrations'

const MENU = [
  {
    category: 'Overview',
    items: [
      { id: 'analytics', label: 'Dashboard Analytics', icon: '📊' },
    ]
  },
  {
    category: 'Tournament',
    items: [
      { id: 'teams', label: 'Team Management', icon: '🏆' },
      { id: 'registrations', label: 'Team Registrations', icon: '📝' },
      { id: 'players', label: 'Player Management', icon: '👤' },
      { id: 'fixtures', label: 'Fixture Generator', icon: '📅' },
      { id: 'results', label: 'Match Results', icon: '⚽' },
      { id: 'live', label: 'Live Score Control', icon: '🔴' },
      { id: 'referees', label: 'Referee Assignment', icon: '🟡' },
      { id: 'teammanager', label: 'Team Manager Dashboard', icon: '📌' },
    ]
  },
  {
    category: 'Infrastructure',
    items: [
      { id: 'stadiums', label: 'Stadium Management', icon: '🏟️' },
    ]
  },
  {
    category: 'People',
    items: [
      { id: 'staff', label: 'Staff Management', icon: '👔' },
      { id: 'volunteers', label: 'Volunteer Management', icon: '🤝' },
      { id: 'users', label: 'User Management', icon: '👥' },
    ]
  },
  {
    category: 'Content',
    items: [
      { id: 'news', label: 'News & Blog CMS', icon: '📰' },
      { id: 'gallery', label: 'Gallery Management', icon: '🖼️' },
    ]
  },
  {
    category: 'Finance',
    items: [
      { id: 'sponsors', label: 'Sponsorship Management', icon: '💼' },
      { id: 'finance', label: 'Financial Reports', icon: '💰' },
      { id: 'tickets', label: 'Ticket Sales', icon: '🎫' },
      { id: 'payments', label: 'Payment Orders', icon: '💳' },
      { id: 'paymentSettings', label: 'Payment Methods', icon: '🏦' },
      { id: 'merch', label: 'Merchandise', icon: '👕' },
    ]
  },
  {
    category: 'Administration',
    items: [
      { id: 'notifications', label: 'Notifications', icon: '🔔' },
      { id: 'audit', label: 'Audit Logs', icon: '📋' },
      { id: 'settings', label: 'Website Settings', icon: '⚙️' },
      { id: 'roles', label: 'Role & Permissions', icon: '🔐' },
    ]
  },
]

const MODULE_MAP = {
  analytics: DashboardAnalytics,
  teams: TeamManagement,
  registrations: TeamRegistrations,
  players: PlayerManagement,
  fixtures: FixtureGenerator,
  results: MatchResults,
  live: LiveScoreControl,
  referees: RefereeAssignment,
  teammanager: TeamManagerDashboard,
  stadiums: StadiumManagement,
  staff: StaffManagement,
  volunteers: VolunteerManagement,
  users: UserManagement,
  news: NewsBlogCMS,
  gallery: GalleryManagement,
  sponsors: SponsorshipManagement,
  finance: FinancialReports,
  tickets: TicketSales,
  payments: PaymentOrders,
  paymentSettings: PaymentSettings,
  merch: Merchandise,
  notifications: Notifications,
  audit: AuditLogs,
  settings: WebsiteSettings,
  roles: RolePermissions,
}

export default function AdminDashboard() {
  const [activeModule, setActiveModule] = useState('analytics')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { admin, adminLogout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    adminLogout()
    navigate('/admin/login')
  }

  const ActiveComponent = MODULE_MAP[activeModule] || DashboardAnalytics
  const activeLabel = MENU.flatMap(g => g.items).find(i => i.id === activeModule)?.label || 'Dashboard'
  const activeIcon = MENU.flatMap(g => g.items).find(i => i.id === activeModule)?.icon || '📊'

  return (
    <div style={s.root}>
      {/* Sidebar */}
      <aside style={{ ...s.sidebar, width: sidebarOpen ? 260 : 64 }}>
        {/* Logo */}
        <div style={s.sidebarLogo}>
          <span style={s.logoIcon}>⚽</span>
          {sidebarOpen && (
            <div style={s.logoText}>
              <span style={s.logoTop}>STARCRAFT</span>
              <span style={s.logoBot}>ADMIN 2027</span>
            </div>
          )}
          <button style={s.collapseBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Menu */}
        <nav style={s.sidebarNav}>
          {MENU.map(group => (
            <div key={group.category} style={s.menuGroup}>
              {sidebarOpen && <div style={s.menuCategory}>{group.category}</div>}
              {group.items.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  style={{
                    ...s.menuItem,
                    background: activeModule === item.id
                      ? 'linear-gradient(90deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%)'
                      : 'transparent',
                    borderLeft: activeModule === item.id
                      ? '3px solid #D4AF37'
                      : '3px solid transparent',
                    color: activeModule === item.id ? '#D4AF37' : 'rgba(255,255,255,0.65)',
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  }}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <span style={s.menuIcon}>{item.icon}</span>
                  {sidebarOpen && <span style={s.menuLabel}>{item.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* User */}
        <div style={s.sidebarUser}>
          <div style={s.userAvatar}>👤</div>
          {sidebarOpen && (
            <div style={s.userInfo}>
              <div style={s.userName}>{admin?.name}</div>
              <div style={s.userRole}>Super Administrator</div>
            </div>
          )}
          {sidebarOpen && (
            <button style={s.logoutBtn} onClick={handleLogout} title="Logout">⏻</button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div style={s.main}>
        {/* Top bar */}
        <header style={s.topbar}>
          <div style={s.topbarLeft}>
            <span style={{ fontSize: '1.3rem' }}>{activeIcon}</span>
            <h2 style={s.pageTitle}>{activeLabel}</h2>
          </div>
          <div style={s.topbarRight}>
            <div style={s.topbarBadge}>
              <span style={s.liveDot}></span>
              LIVE SYSTEM
            </div>
            <span style={s.topbarDate}>{new Date().toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short', year:'numeric' })}</span>
            <button style={s.topbarLogout} onClick={handleLogout}>Logout ⏻</button>
          </div>
        </header>

        {/* Module Content */}
        <div style={s.content}>
          <ActiveComponent />
        </div>
      </div>
    </div>
  )
}

const s = {
  root: {
    display: 'flex', minHeight: '100vh',
    background: '#0d0d16', color: '#fff',
    fontFamily: "'Poppins', sans-serif",
  },
  sidebar: {
    background: '#111120',
    borderRight: '1px solid rgba(212,175,55,0.12)',
    display: 'flex', flexDirection: 'column',
    transition: 'width 250ms ease',
    flexShrink: 0, overflow: 'hidden',
    position: 'sticky', top: 0, height: '100vh',
  },
  sidebarLogo: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '20px 16px',
    borderBottom: '1px solid rgba(212,175,55,0.1)',
    minHeight: 72, flexShrink: 0,
  },
  logoIcon: { fontSize: '1.6rem', flexShrink: 0 },
  logoText: { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' },
  logoTop: { fontFamily: "'Cinzel', serif", fontSize: '0.8rem', fontWeight: 900, color: '#D4AF37', letterSpacing: 2, whiteSpace: 'nowrap' },
  logoBot: { fontFamily: "'Montserrat', sans-serif", fontSize: '0.55rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, whiteSpace: 'nowrap' },
  collapseBtn: {
    marginLeft: 'auto', background: 'none', border: 'none',
    color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.7rem',
    flexShrink: 0, padding: 4,
  },
  sidebarNav: { flex: 1, overflowY: 'auto', padding: '8px 0' },
  menuGroup: { marginBottom: 8 },
  menuCategory: {
    fontSize: '0.6rem', fontWeight: 700, letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase',
    padding: '10px 20px 4px',
  },
  menuItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    width: '100%', padding: '9px 16px',
    background: 'transparent', border: 'none',
    cursor: 'pointer', textAlign: 'left',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '0.78rem', fontWeight: 500,
    transition: 'all 200ms ease',
    borderRadius: 0,
  },
  menuIcon: { fontSize: '1rem', flexShrink: 0, width: 20, textAlign: 'center' },
  menuLabel: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  sidebarUser: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '14px 16px',
    borderTop: '1px solid rgba(212,175,55,0.1)',
    flexShrink: 0,
  },
  userAvatar: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'rgba(212,175,55,0.15)',
    border: '1px solid rgba(212,175,55,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.9rem', flexShrink: 0,
  },
  userInfo: { flex: 1, overflow: 'hidden' },
  userName: { fontSize: '0.78rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userRole: { fontSize: '0.62rem', color: '#D4AF37', fontWeight: 600 },
  logoutBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'rgba(255,255,255,0.3)', fontSize: '1rem',
    transition: 'color 200ms', flexShrink: 0,
  },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' },
  topbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 28px', height: 64, flexShrink: 0,
    background: 'rgba(17,17,32,0.8)',
    borderBottom: '1px solid rgba(212,175,55,0.1)',
    backdropFilter: 'blur(10px)',
    position: 'sticky', top: 0, zIndex: 100,
  },
  topbarLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  pageTitle: {
    fontFamily: "'Cinzel', serif", fontSize: '1.1rem',
    fontWeight: 700, color: '#fff', margin: 0,
  },
  topbarRight: { display: 'flex', alignItems: 'center', gap: 16 },
  topbarBadge: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '4px 12px',
    background: 'rgba(34,197,94,0.1)',
    border: '1px solid rgba(34,197,94,0.3)',
    borderRadius: 20,
    fontSize: '0.65rem', fontWeight: 800,
    color: '#4ade80', letterSpacing: 1,
  },
  liveDot: {
    display: 'inline-block', width: 6, height: 6,
    borderRadius: '50%', background: '#4ade80',
    animation: 'pulse 1.5s infinite',
  },
  topbarDate: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontFamily: "'Montserrat', sans-serif" },
  topbarLogout: {
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
    color: '#f87171', borderRadius: 8, padding: '5px 12px',
    cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
    fontFamily: "'Montserrat', sans-serif",
  },
  content: { flex: 1, overflow: 'auto', padding: 28 },
}
