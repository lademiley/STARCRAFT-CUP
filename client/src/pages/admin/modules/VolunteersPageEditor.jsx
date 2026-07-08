import React, { useEffect, useRef, useState } from 'react'
import { c, SectionCard, FormField } from './shared'
import { useContentAdmin } from '../../../context/ContentContext'

export default function VolunteersPageEditor() {
  const { content, setPageContent, reload } = useContentAdmin()
  const [form, setForm] = useState(null)
  const syncedRef = useRef(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!syncedRef.current) {
      if (content.volunteers) { setForm(JSON.parse(JSON.stringify(content.volunteers))); syncedRef.current = true }
      else reload('volunteers').catch(() => setLoadError('Could not load page content from server.'))
    }
  }, [content.volunteers, reload])

  useEffect(() => {
    if (!syncedRef.current && content.volunteers) { setForm(JSON.parse(JSON.stringify(content.volunteers))); syncedRef.current = true }
  }, [content.volunteers])

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
      const res = await fetch('/api/content/volunteers', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify({ content: form }),
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Failed to save') }
      const data = await res.json()
      setPageContent('volunteers', data.content)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  if (!form) return (
    <div style={{ padding: 40, textAlign: 'center', color: loadError ? '#f87171' : 'rgba(255,255,255,0.5)' }}>
      {loadError || 'Loading Volunteers page content…'}
      {loadError && <div style={{ marginTop: 12 }}><button onClick={() => { setLoadError(''); reload('volunteers') }} style={{ padding: '6px 14px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, color: '#D4AF37', cursor: 'pointer', fontSize: '0.8rem' }}>↻ Retry</button></div>}
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>Volunteers Page Editor</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>Edit hero text, benefits, roles, and training schedule on the public Volunteers page.</p>
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
      <SectionCard title="🌟 Why Volunteer — Benefit Cards">
        {form.benefits.map((b, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 180px 1fr auto', gap: 10, marginBottom: 10, alignItems: 'start' }}>
            <input style={c.input} placeholder="Icon" value={b.icon} onChange={setListItem('benefits', i, 'icon')} />
            <input style={c.input} placeholder="Title" value={b.title} onChange={setListItem('benefits', i, 'title')} />
            <input style={c.input} placeholder="Description" value={b.desc} onChange={setListItem('benefits', i, 'desc')} />
            {removeBtn(() => removeItem('benefits', i))}
          </div>
        ))}
        <button onClick={() => addObj('benefits', { icon: '⭐', title: 'New Benefit', desc: 'Describe this benefit here.' })}
          style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem', marginTop: 4 }}>+ Add Benefit</button>
      </SectionCard>

      {/* ROLES */}
      <SectionCard title="👷 Volunteer Roles">
        {form.roles.map((r, i) => (
          <div key={i} style={{ ...c.card, marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 700 }}>Role #{i + 1}</span>
              {removeBtn(() => removeItem('roles', i))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 10, marginBottom: 10 }}>
              <FormField label="Role Title"><input style={c.input} value={r.role} onChange={setListItem('roles', i, 'role')} /></FormField>
              <FormField label="Slots"><input style={c.input} value={r.slots} onChange={setListItem('roles', i, 'slots')} placeholder="40" /></FormField>
            </div>
            <FormField label="Description">
              <textarea style={{ ...c.input, minHeight: 60 }} value={r.desc} onChange={setListItem('roles', i, 'desc')} />
            </FormField>
            <FormField label="Requirements">
              <input style={c.input} value={r.requirements} onChange={setListItem('roles', i, 'requirements')} placeholder="18+, physically fit" />
            </FormField>
          </div>
        ))}
        <button onClick={() => addObj('roles', { role: 'New Role', slots: '10', desc: 'Describe this role.', requirements: 'Requirements here.' })}
          style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem' }}>+ Add Role</button>
      </SectionCard>

      {/* TRAINING */}
      <SectionCard title="📅 Training Schedule">
        {form.training.map((t, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 200px auto', gap: 10, marginBottom: 10, alignItems: 'start' }}>
            <input style={c.input} placeholder="Date" value={t.date} onChange={setListItem('training', i, 'date')} />
            <input style={c.input} placeholder="Session name" value={t.session} onChange={setListItem('training', i, 'session')} />
            <input style={c.input} placeholder="Location" value={t.location} onChange={setListItem('training', i, 'location')} />
            {removeBtn(() => removeItem('training', i))}
          </div>
        ))}
        <button onClick={() => addObj('training', { date: 'TBC', session: 'New Session', location: 'Venue TBC' })}
          style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem', marginTop: 4 }}>+ Add Training Session</button>
      </SectionCard>
    </div>
  )
}
