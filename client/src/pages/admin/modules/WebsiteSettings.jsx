import React, { useState } from 'react'
import { c, SectionCard, FormField, ModuleHeader } from './shared'

export default function WebsiteSettings() {
  const [settings, setSettings] = useState({
    siteName: 'StarCraft Cup 2026',
    siteTagline: 'Oredo LGA — Edo State, Nigeria',
    contactEmail: 'info@scup2026.ng',
    contactPhone: '+234 803 555 7788',
    registrationOpen: true,
    ticketsOpen: true,
    maintenanceMode: false,
    showLiveScores: true,
    allowPublicResults: true,
    googleAnalyticsId: '',
    facebookPage: 'https://facebook.com/starcraftcup2026',
    twitterHandle: '@StarCraftCup',
    instagramHandle: '@starcraftcup2026',
    primaryColor: '#D4AF37',
    tournamentYear: '2026',
    prizePool: '₦5,000,000',
    registrationFee: '₦25,000',
  })
  const [saved, setSaved] = useState(false)

  const set = k => e => setSettings(p => ({ ...p, [k]: e.type === 'checkbox' ? e.checked : e.target.value }))
  const setCheck = k => e => setSettings(p => ({ ...p, [k]: e.target.checked }))

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 3000) }

  const toggle = (label, key) => (
    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div>
        <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{label}</div>
      </div>
      <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer', flexShrink: 0 }}>
        <input type="checkbox" checked={settings[key]} onChange={setCheck(key)} style={{ opacity: 0, width: 0, height: 0 }} />
        <span style={{ position: 'absolute', inset: 0, background: settings[key] ? '#D4AF37' : 'rgba(255,255,255,0.15)', borderRadius: 24, transition: '300ms' }}>
          <span style={{ position: 'absolute', height: 18, width: 18, top: 3, left: settings[key] ? 23 : 3, background: '#fff', borderRadius: '50%', transition: '300ms' }} />
        </span>
      </label>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>Website Settings</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>Global configuration for StarCraft Cup 2026</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {saved && <span style={{ color: '#22C55E', fontSize: '0.82rem', fontWeight: 700 }}>✅ Settings saved</span>}
          <button onClick={save} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Settings</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* General */}
        <SectionCard title="🌐 General Information" action="">
          <FormField label="Site Name"><input style={c.input} value={settings.siteName} onChange={set('siteName')} /></FormField>
          <FormField label="Tagline / Subtitle"><input style={c.input} value={settings.siteTagline} onChange={set('siteTagline')} /></FormField>
          <FormField label="Tournament Year"><input style={c.input} value={settings.tournamentYear} onChange={set('tournamentYear')} /></FormField>
          <FormField label="Registration Fee"><input style={c.input} value={settings.registrationFee} onChange={set('registrationFee')} /></FormField>
          <FormField label="Prize Pool"><input style={c.input} value={settings.prizePool} onChange={set('prizePool')} /></FormField>
        </SectionCard>

        {/* Contact */}
        <SectionCard title="📞 Contact Information" action="">
          <FormField label="Contact Email"><input style={c.input} value={settings.contactEmail} onChange={set('contactEmail')} /></FormField>
          <FormField label="Contact Phone"><input style={c.input} value={settings.contactPhone} onChange={set('contactPhone')} /></FormField>
          <FormField label="Facebook Page"><input style={c.input} value={settings.facebookPage} onChange={set('facebookPage')} /></FormField>
          <FormField label="Twitter / X Handle"><input style={c.input} value={settings.twitterHandle} onChange={set('twitterHandle')} /></FormField>
          <FormField label="Instagram Handle"><input style={c.input} value={settings.instagramHandle} onChange={set('instagramHandle')} /></FormField>
        </SectionCard>

        {/* Feature Toggles */}
        <SectionCard title="⚙️ Feature Toggles" action="">
          {toggle('Team/Fan Registration Open', 'registrationOpen')}
          {toggle('Ticket Sales Open', 'ticketsOpen')}
          {toggle('Show Live Scores Publicly', 'showLiveScores')}
          {toggle('Public Match Results', 'allowPublicResults')}
          {toggle('🔴 Maintenance Mode', 'maintenanceMode')}
          {settings.maintenanceMode && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: '0.8rem', color: '#f87171' }}>
              ⚠️ Maintenance mode is ON — public visitors will see a maintenance page.
            </div>
          )}
        </SectionCard>

        {/* Analytics */}
        <SectionCard title="📊 Analytics & Tracking" action="">
          <FormField label="Google Analytics ID">
            <input style={c.input} value={settings.googleAnalyticsId} onChange={set('googleAnalyticsId')} placeholder="G-XXXXXXXXXX" />
          </FormField>
          <div style={{ padding: '14px 0', fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>
            <p style={{ margin: '0 0 8px' }}>Enter your Google Analytics 4 Measurement ID to enable traffic tracking on the public site.</p>
            <p style={{ margin: 0, color: '#D4AF37', fontWeight: 600 }}>Current theme color: {settings.primaryColor}</p>
          </div>
        </SectionCard>
      </div>
    </div>
  )
}
