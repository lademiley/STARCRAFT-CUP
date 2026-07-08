import React, { useEffect, useRef, useState } from 'react'
import { c, SectionCard, FormField } from './shared'
import { useContentAdmin } from '../../../context/ContentContext'

export default function SponsorsPageEditor() {
  const { content, setPageContent, reload } = useContentAdmin()
  const [form, setForm] = useState(null)
  const syncedRef = useRef(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!syncedRef.current) {
      if (content.sponsors) { setForm(JSON.parse(JSON.stringify(content.sponsors))); syncedRef.current = true }
      else reload('sponsors').catch(() => setLoadError('Could not load page content from server.'))
    }
  }, [content.sponsors, reload])

  useEffect(() => {
    if (!syncedRef.current && content.sponsors) { setForm(JSON.parse(JSON.stringify(content.sponsors))); syncedRef.current = true }
  }, [content.sponsors])

  const setField = (section, key) => e =>
    setForm(p => ({ ...p, [section]: { ...p[section], [key]: e.target.value } }))

  const setListItem = (section, index, key) => e => {
    const value = e.target.value
    setForm(p => { const list = [...p[section]]; list[index] = { ...list[index], [key]: value }; return { ...p, [section]: list } })
  }

  const addObj = (section, emptyObj) =>
    setForm(p => ({ ...p, [section]: [...p[section], emptyObj] }))

  const removeItem = (section, index) =>
    setForm(p => { const list = [...p[section]]; list.splice(index, 1); return { ...p, [section]: list } })

  const removeBtn = (onClick) => (
    <button onClick={onClick} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.68rem', flexShrink: 0 }}>✕</button>
  )

  const save = async () => {
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/content/sponsors', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify({ content: form }),
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Failed to save') }
      const data = await res.json()
      setPageContent('sponsors', data.content)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  if (!form) return (
    <div style={{ padding: 40, textAlign: 'center', color: loadError ? '#f87171' : 'rgba(255,255,255,0.5)' }}>
      {loadError || 'Loading Sponsors page content…'}
      {loadError && <div style={{ marginTop: 12 }}><button onClick={() => { setLoadError(''); reload('sponsors') }} style={{ padding: '6px 14px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, color: '#D4AF37', cursor: 'pointer', fontSize: '0.8rem' }}>↻ Retry</button></div>}
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>Sponsors Page Editor</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>Edit hero text, sponsorship benefits, and package tiers on the public Sponsors page.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {saved && <span style={{ color: '#22C55E', fontSize: '0.82rem', fontWeight: 700 }}>✅ Saved — live on site</span>}
          {error && <span style={{ color: '#f87171', fontSize: '0.82rem', fontWeight: 700 }}>⚠️ {error}</span>}
          <button onClick={save} disabled={saving} style={{ ...c.btn, ...c.btnPrimary, opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving…' : '💾 Save & Publish'}
          </button>
        </div>
      </div>

      {/* HERO */}
      <SectionCard title="🎬 Hero Section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormField label="Page Title"><input style={c.input} value={form.hero.title} onChange={setField('hero', 'title')} /></FormField>
          <FormField label="Subtitle"><input style={c.input} value={form.hero.subtitle} onChange={setField('hero', 'subtitle')} /></FormField>
        </div>
      </SectionCard>

      {/* BENEFITS */}
      <SectionCard title="✨ Sponsorship Benefits">
        <p style={{ margin: '0 0 14px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>These benefit cards appear in the "Why sponsor?" section.</p>
        {form.benefits.map((b, i) => (
          <div key={i} style={{ ...c.card, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 700 }}>Benefit #{i + 1}</span>
              {removeBtn(() => removeItem('benefits', i))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 200px 1fr', gap: 10 }}>
              <FormField label="Icon"><input style={c.input} value={b.icon} onChange={setListItem('benefits', i, 'icon')} placeholder="👥" /></FormField>
              <FormField label="Title"><input style={c.input} value={b.title} onChange={setListItem('benefits', i, 'title')} /></FormField>
              <FormField label="Description"><input style={c.input} value={b.desc} onChange={setListItem('benefits', i, 'desc')} /></FormField>
            </div>
          </div>
        ))}
        <button onClick={() => addObj('benefits', { icon: '⭐', title: 'New Benefit', desc: 'Describe this benefit here.' })}
          style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem' }}>+ Add Benefit</button>
      </SectionCard>

      {/* PACKAGES */}
      <SectionCard title="📦 Sponsorship Packages">
        <p style={{ margin: '0 0 14px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
          Each package tier shown in the "Become a Sponsor" section. List perks one per line in the Perks field.
        </p>
        {form.packages.map((pkg, i) => (
          <div key={i} style={{ ...c.card, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 700 }}>Package #{i + 1}</span>
              {removeBtn(() => removeItem('packages', i))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 10, marginBottom: 10 }}>
              <FormField label="Tier Name"><input style={c.input} value={pkg.tier} onChange={setListItem('packages', i, 'tier')} placeholder="Platinum" /></FormField>
              <FormField label="Price"><input style={c.input} value={pkg.price} onChange={setListItem('packages', i, 'price')} placeholder="₦5,000,000" /></FormField>
              <FormField label="Badge Colour"><input style={c.input} value={pkg.color} onChange={setListItem('packages', i, 'color')} placeholder="#D4AF37" /></FormField>
            </div>
            <FormField label="Perks (one per line)">
              <textarea style={{ ...c.input, minHeight: 90 }} value={pkg.perks} onChange={setListItem('packages', i, 'perks')} placeholder="Main shirt logo&#10;TV broadcast mentions&#10;10 VIP tickets per match" />
            </FormField>
          </div>
        ))}
        <button onClick={() => addObj('packages', { tier: 'New Tier', price: '₦0', color: '#ffffff', perks: 'Perk one\nPerk two' })}
          style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem' }}>+ Add Package</button>
      </SectionCard>
    </div>
  )
}
