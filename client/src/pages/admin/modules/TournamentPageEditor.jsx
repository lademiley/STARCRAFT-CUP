import React, { useEffect, useRef, useState } from 'react'
import { c, SectionCard, FormField } from './shared'
import { useContentAdmin } from '../../../context/ContentContext'

export default function TournamentPageEditor() {
  const { content, setPageContent, reload } = useContentAdmin()
  const [form, setForm] = useState(null)
  const syncedRef = useRef(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!syncedRef.current) {
      if (content.tournament) {
        setForm(JSON.parse(JSON.stringify(content.tournament)))
        syncedRef.current = true
      } else {
        reload('tournament').then(() => {})
      }
    }
  }, [content.tournament, reload])

  useEffect(() => {
    if (!syncedRef.current && content.tournament) {
      setForm(JSON.parse(JSON.stringify(content.tournament)))
      syncedRef.current = true
    }
  }, [content.tournament])

  const setField = (section, key) => e => {
    const value = e.target.value
    setForm(p => ({ ...p, [section]: { ...p[section], [key]: value } }))
  }

  const setListItem = (section, index, key) => e => {
    const value = e.target.value
    setForm(p => {
      const list = [...p[section]]
      list[index] = { ...list[index], [key]: value }
      return { ...p, [section]: list }
    })
  }

  const addObj = (section, emptyObj) =>
    setForm(p => ({ ...p, [section]: [...p[section], emptyObj] }))

  const removeItem = (section, index) =>
    setForm(p => { const list = [...p[section]]; list.splice(index, 1); return { ...p, [section]: list } })

  const removeBtn = onClick => (
    <button onClick={onClick} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.68rem', flexShrink: 0 }}>✕</button>
  )

  const save = async () => {
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/content/tournament', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: form }),
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Failed to save') }
      const data = await res.json()
      setPageContent('tournament', data.content)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  if (!form) return <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading Tournament page content…</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>Tournament Page Editor</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>Edit rules, venues, and format shown on the public Tournament page.</p>
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

      {/* FORMAT */}
      <SectionCard title="📋 Competition Format">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <FormField label="Eyebrow"><input style={c.input} value={form.format.eyebrow} onChange={setField('format', 'eyebrow')} /></FormField>
          <FormField label="Heading"><input style={c.input} value={form.format.heading} onChange={setField('format', 'heading')} /></FormField>
        </div>
        <FormField label="Phases">
          {form.format.phases.map((p, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '220px 1fr auto', gap: 8, marginBottom: 8, alignItems: 'start' }}>
              <input style={c.input} placeholder="Phase name" value={p.phase} onChange={e => {
                const value = e.target.value
                setForm(prev => {
                  const phases = [...prev.format.phases]
                  phases[i] = { ...phases[i], phase: value }
                  return { ...prev, format: { ...prev.format, phases } }
                })
              }} />
              <textarea style={{ ...c.input, minHeight: 48 }} placeholder="Description" value={p.desc} onChange={e => {
                const value = e.target.value
                setForm(prev => {
                  const phases = [...prev.format.phases]
                  phases[i] = { ...phases[i], desc: value }
                  return { ...prev, format: { ...prev.format, phases } }
                })
              }} />
              <button onClick={() => setForm(prev => {
                const phases = [...prev.format.phases]; phases.splice(i, 1)
                return { ...prev, format: { ...prev.format, phases } }
              })} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.68rem' }}>✕</button>
            </div>
          ))}
          <button onClick={() => setForm(p => ({ ...p, format: { ...p.format, phases: [...p.format.phases, { phase: 'New Phase', desc: '' }] } }))}
            style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem' }}>+ Add Phase</button>
        </FormField>
      </SectionCard>

      {/* RULES */}
      <SectionCard title="📜 Tournament Rules">
        {form.rules.map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input style={c.input} value={r.rule} onChange={setListItem('rules', i, 'rule')} placeholder="Rule text" />
            {removeBtn(() => removeItem('rules', i))}
          </div>
        ))}
        <button onClick={() => addObj('rules', { rule: 'New rule text here.' })} style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem' }}>+ Add Rule</button>
      </SectionCard>

      {/* VENUES */}
      <SectionCard title="🏟️ Venues">
        {form.venues.map((v, i) => (
          <div key={i} style={{ ...c.card, marginBottom: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
              <FormField label="Icon"><input style={c.input} value={v.icon} onChange={setListItem('venues', i, 'icon')} /></FormField>
              <FormField label="Name"><input style={c.input} value={v.name} onChange={setListItem('venues', i, 'name')} /></FormField>
              <FormField label="Capacity"><input style={c.input} value={v.capacity} onChange={setListItem('venues', i, 'capacity')} /></FormField>
              <FormField label="Surface"><input style={c.input} value={v.surface} onChange={setListItem('venues', i, 'surface')} /></FormField>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Facilities"><input style={c.input} value={v.facilities} onChange={setListItem('venues', i, 'facilities')} /></FormField>
              <FormField label="Role"><input style={c.input} value={v.role} onChange={setListItem('venues', i, 'role')} /></FormField>
              <FormField label="Match Dates"><input style={c.input} value={v.matches} onChange={setListItem('venues', i, 'matches')} /></FormField>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                {removeBtn(() => removeItem('venues', i))}
              </div>
            </div>
          </div>
        ))}
        <button onClick={() => addObj('venues', { icon: '🏟️', name: 'New Venue', capacity: '', surface: '', facilities: '', role: '', matches: '' })}
          style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem' }}>+ Add Venue</button>
      </SectionCard>
    </div>
  )
}
