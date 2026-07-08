import React, { useEffect, useRef, useState } from 'react'
import { c, SectionCard, FormField } from './shared'
import { useContentAdmin } from '../../../context/ContentContext'

export default function AboutPageEditor() {
  const { content, setPageContent, reload } = useContentAdmin()
  const [form, setForm] = useState(null)
  const syncedRef = useRef(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!syncedRef.current) {
      if (content.about) {
        setForm(JSON.parse(JSON.stringify(content.about)))
        syncedRef.current = true
      } else {
        reload('about').then(() => {})
      }
    }
  }, [content.about, reload])

  useEffect(() => {
    if (!syncedRef.current && content.about) {
      setForm(JSON.parse(JSON.stringify(content.about)))
      syncedRef.current = true
    }
  }, [content.about])

  const setField = (section, key) => e => {
    const value = e.target.value
    setForm(p => ({ ...p, [section]: { ...p[section], [key]: value } }))
  }

  const setListStr = (section, index) => e => {
    const value = e.target.value
    setForm(p => {
      const list = [...p[section]]
      list[index] = value
      return { ...p, [section]: list }
    })
  }

  const setListItem = (section, index, key) => e => {
    const value = e.target.value
    setForm(p => {
      const list = [...p[section]]
      list[index] = { ...list[index], [key]: value }
      return { ...p, [section]: list }
    })
  }

  const addStr = (section, empty = '') =>
    setForm(p => ({ ...p, [section]: [...p[section], empty] }))

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
      const res = await fetch('/api/content/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: form }),
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Failed to save') }
      const data = await res.json()
      setPageContent('about', data.content)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  if (!form) return <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading About page content…</div>

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>About Page Editor</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>Edit the copy shown on the public About page — changes go live immediately after saving.</p>
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

      {/* STORY */}
      <SectionCard title="📖 Our Story">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormField label="Eyebrow"><input style={c.input} value={form.story.eyebrow} onChange={setField('story', 'eyebrow')} /></FormField>
          <FormField label="Heading"><input style={c.input} value={form.story.heading} onChange={setField('story', 'heading')} /></FormField>
        </div>
        <FormField label="Paragraph 1"><textarea style={{ ...c.input, minHeight: 70 }} value={form.story.p1} onChange={setField('story', 'p1')} /></FormField>
        <FormField label="Paragraph 2"><textarea style={{ ...c.input, minHeight: 70 }} value={form.story.p2} onChange={setField('story', 'p2')} /></FormField>
        <FormField label="Paragraph 3"><textarea style={{ ...c.input, minHeight: 70 }} value={form.story.p3} onChange={setField('story', 'p3')} /></FormField>
      </SectionCard>

      {/* MOTTO */}
      <SectionCard title="🏆 Tournament Motto">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormField label="Card Heading"><input style={c.input} value={form.motto.heading} onChange={setField('motto', 'heading')} /></FormField>
          <FormField label="Motto Quote"><input style={c.input} value={form.motto.quote} onChange={setField('motto', 'quote')} /></FormField>
        </div>
        <FormField label="Motto Body Text"><textarea style={{ ...c.input, minHeight: 60 }} value={form.motto.text} onChange={setField('motto', 'text')} /></FormField>
      </SectionCard>

      {/* VISION / MISSION */}
      <SectionCard title="🌟 Vision, Mission & Values">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormField label="Vision Heading"><input style={c.input} value={form.vision.heading} onChange={setField('vision', 'heading')} /></FormField>
          <FormField label="Mission Heading"><input style={c.input} value={form.mission.heading} onChange={setField('mission', 'heading')} /></FormField>
        </div>
        <FormField label="Vision Text"><textarea style={{ ...c.input, minHeight: 80 }} value={form.vision.text} onChange={setField('vision', 'text')} /></FormField>
        <FormField label="Mission Text"><textarea style={{ ...c.input, minHeight: 80 }} value={form.mission.text} onChange={setField('mission', 'text')} /></FormField>
        <FormField label="Core Values">
          {form.values.map((v, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input style={c.input} value={v} onChange={setListStr('values', i)} />
              {removeBtn(() => removeItem('values', i))}
            </div>
          ))}
          <button onClick={() => addStr('values', 'New Value — description')} style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem' }}>+ Add Value</button>
        </FormField>
      </SectionCard>

      {/* OBJECTIVES */}
      <SectionCard title="🎯 Tournament Objectives">
        {form.objectives.map((o, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 200px 1fr auto', gap: 8, marginBottom: 12, alignItems: 'start' }}>
            <input style={c.input} placeholder="Icon" value={o.icon} onChange={setListItem('objectives', i, 'icon')} />
            <input style={c.input} placeholder="Title" value={o.title} onChange={setListItem('objectives', i, 'title')} />
            <textarea style={{ ...c.input, minHeight: 48 }} placeholder="Description" value={o.desc} onChange={setListItem('objectives', i, 'desc')} />
            {removeBtn(() => removeItem('objectives', i))}
          </div>
        ))}
        <button onClick={() => addObj('objectives', { icon: '⭐', title: 'New Objective', desc: '' })} style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem' }}>+ Add Objective</button>
      </SectionCard>
    </div>
  )
}
