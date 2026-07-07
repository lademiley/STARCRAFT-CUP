import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, FormField, ModuleHeader } from './shared'

export default function WebsiteSettings() {
  const [settings, setSettings] = useState({
    siteName: 'StarCraft Cup 2027',
    tagline: 'Premier Football Tournament · Edo State, Nigeria',
    contactEmail: 'info@starcraft2027.ng',
    contactPhone: '+234 800 SC 2027',
    maintenanceMode: false,
    registrationOpen: true,
    ticketSalesOpen: true,
    liveScoreEnabled: true,
    volunteerApplicationsOpen: true,
    sponsorEnquiryEnabled: true,
    tournamentStartDate: '2027-03-01',
    tournamentEndDate: '2027-04-20',
    finalVenue: 'Samuel Ogbemudia Stadium',
    prizePool: '₦15,000,000',
    maxTeams: 12,
    primaryColor: '#D4AF37',
    seoTitle: 'StarCraft Cup 2027 | Premier Football in Edo State',
    seoDescription: 'The StarCraft Cup 2027 is a world-class football tournament in Oredo LGA, Edo State, Nigeria.',
    googleAnalyticsId: 'G-XXXXXXXXXX',
    socialFacebook: 'https://facebook.com/sc2027',
    socialInstagram: 'https://instagram.com/sc2027',
    socialTwitter: 'https://twitter.com/sc2027',
  })

  const [saved, setSaved] = useState(false)
  const set = k => e => setSettings(p => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const Toggle = ({ name, label, desc }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{label}</div>
        {desc && <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{desc}</div>}
      </div>
      <button
        onClick={() => setSettings(p => ({ ...p, [name]: !p[name] }))}
        style={{
          width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
          background: settings[name] ? '#D4AF37' : 'rgba(255,255,255,0.15)',
          position: 'relative', transition: 'background 200ms', flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: settings[name] ? 25 : 3,
          width: 20, height: 20, borderRadius: '50%',
          background: settings[name] ? '#000' : 'rgba(255,255,255,0.7)',
          transition: 'left 200ms',
        }} />
      </button>
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>Website Settings</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>Configure tournament website settings</p>
        </div>
        {saved && <Badge label="✅ Settings Saved!" color="#22C55E" />}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Site Identity */}
        <SectionCard title="🌐 Site Identity" action="">
          <FormField label="Site Name"><input style={c.input} value={settings.siteName} onChange={set('siteName')} /></FormField>
          <FormField label="Tagline"><input style={c.input} value={settings.tagline} onChange={set('tagline')} /></FormField>
          <FormField label="Contact Email"><input style={c.input} type="email" value={settings.contactEmail} onChange={set('contactEmail')} /></FormField>
          <FormField label="Contact Phone"><input style={c.input} value={settings.contactPhone} onChange={set('contactPhone')} /></FormField>
        </SectionCard>

        {/* Tournament Config */}
        <SectionCard title="⚽ Tournament Config" action="">
          <FormField label="Start Date"><input style={c.input} type="date" value={settings.tournamentStartDate} onChange={set('tournamentStartDate')} /></FormField>
          <FormField label="End Date"><input style={c.input} type="date" value={settings.tournamentEndDate} onChange={set('tournamentEndDate')} /></FormField>
          <FormField label="Final Venue"><input style={c.input} value={settings.finalVenue} onChange={set('finalVenue')} /></FormField>
          <FormField label="Prize Pool"><input style={c.input} value={settings.prizePool} onChange={set('prizePool')} /></FormField>
        </SectionCard>
      </div>

      {/* Feature Toggles */}
      <SectionCard title="⚙️ Feature Toggles" action="">
        <div style={{ background: settings.maintenanceMode ? 'rgba(239,68,68,0.08)' : 'transparent', borderRadius: 8, padding: settings.maintenanceMode ? '0 12px' : '0', marginBottom: settings.maintenanceMode ? 8 : 0, transition: 'all 300ms' }}>
          <Toggle name="maintenanceMode" label="🔧 Maintenance Mode" desc="Takes the site offline for visitors. Use during major updates." />
        </div>
        <Toggle name="registrationOpen" label="📝 Team Registration" desc="Allow new teams to register for the tournament" />
        <Toggle name="ticketSalesOpen" label="🎫 Ticket Sales" desc="Enable online ticket purchasing" />
        <Toggle name="liveScoreEnabled" label="🔴 Live Score Updates" desc="Show live match scores and commentary" />
        <Toggle name="volunteerApplicationsOpen" label="🤝 Volunteer Applications" desc="Accept new volunteer applications" />
        <Toggle name="sponsorEnquiryEnabled" label="💼 Sponsor Enquiries" desc="Enable sponsorship enquiry form on the Sponsors page" />
      </SectionCard>

      {/* SEO & Analytics */}
      <SectionCard title="🔍 SEO & Analytics" action="">
        <FormField label="SEO Title"><input style={c.input} value={settings.seoTitle} onChange={set('seoTitle')} /></FormField>
        <FormField label="SEO Description"><textarea style={{ ...c.input, minHeight: 72, resize: 'vertical' }} value={settings.seoDescription} onChange={set('seoDescription')} /></FormField>
        <FormField label="Google Analytics ID"><input style={c.input} value={settings.googleAnalyticsId} onChange={set('googleAnalyticsId')} placeholder="G-XXXXXXXXXX" /></FormField>
      </SectionCard>

      {/* Social Media */}
      <SectionCard title="📱 Social Media" action="">
        <FormField label="Facebook"><input style={c.input} value={settings.socialFacebook} onChange={set('socialFacebook')} /></FormField>
        <FormField label="Instagram"><input style={c.input} value={settings.socialInstagram} onChange={set('socialInstagram')} /></FormField>
        <FormField label="Twitter / X"><input style={c.input} value={settings.socialTwitter} onChange={set('socialTwitter')} /></FormField>
      </SectionCard>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleSave} style={{ ...c.btn, ...c.btnPrimary, padding: '12px 32px', fontSize: '0.9rem' }}>
          💾 Save All Settings
        </button>
      </div>
    </div>
  )
}
