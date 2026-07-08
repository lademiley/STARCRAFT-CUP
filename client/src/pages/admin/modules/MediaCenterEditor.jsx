import React, { useEffect, useRef, useState } from 'react'
import { c, SectionCard, FormField } from './shared'
import { useContentAdmin } from '../../../context/ContentContext'

export default function MediaCenterEditor() {
  const { content, setPageContent, reload } = useContentAdmin()
  const [form, setForm] = useState(null)
  const syncedRef = useRef(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!syncedRef.current) {
      if (content.mediacenter) {
        setForm(JSON.parse(JSON.stringify(content.mediacenter)))
        syncedRef.current = true
      } else {
        reload('mediacenter').then(() => {})
      }
    }
  }, [content.mediacenter, reload])

  useEffect(() => {
    if (!syncedRef.current && content.mediacenter) {
      setForm(JSON.parse(JSON.stringify(content.mediacenter)))
      syncedRef.current = true
    }
  }, [content.mediacenter])

  const setField = (section, key) => e =>
    setForm(p => ({ ...p, [section]: { ...p[section], [key]: e.target.value } }))

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
      const res = await fetch('/api/content/mediacenter', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: form }),
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Failed to save') }
      const data = await res.json()
      setPageContent('mediacenter', data.content)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  if (!form) return <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading Media Center content…</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>Media Center Editor</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>Edit press info, downloads, and contacts shown on the Media Center page.</p>
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

      {/* INFO CARDS */}
      <SectionCard title="📋 Media Service Cards">
        {form.cards.map((card, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 200px 1fr 120px auto', gap: 8, marginBottom: 8, alignItems: 'start' }}>
            <input style={c.input} placeholder="Icon" value={card.icon} onChange={setListItem('cards', i, 'icon')} />
            <input style={c.input} placeholder="Title" value={card.title} onChange={setListItem('cards', i, 'title')} />
            <textarea style={{ ...c.input, minHeight: 48 }} placeholder="Description" value={card.desc} onChange={setListItem('cards', i, 'desc')} />
            <input style={c.input} placeholder="Button text" value={card.cta} onChange={setListItem('cards', i, 'cta')} />
            {removeBtn(() => removeItem('cards', i))}
          </div>
        ))}
        <button onClick={() => addObj('cards', { icon: '📁', title: 'New Card', desc: '', cta: 'Learn More' })}
          style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem' }}>+ Add Card</button>
      </SectionCard>

      {/* DOWNLOADS */}
      <SectionCard title="⬇️ Downloads">
        {form.downloads.map((d, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px 100px auto', gap: 8, marginBottom: 8, alignItems: 'center' }}>
            <input style={c.input} placeholder="Icon" value={d.icon} onChange={setListItem('downloads', i, 'icon')} />
            <input style={c.input} placeholder="File name" value={d.file} onChange={setListItem('downloads', i, 'file')} />
            <input style={c.input} placeholder="Type (PDF)" value={d.type} onChange={setListItem('downloads', i, 'type')} />
            <input style={c.input} placeholder="Size (1.2 MB)" value={d.size} onChange={setListItem('downloads', i, 'size')} />
            {removeBtn(() => removeItem('downloads', i))}
          </div>
        ))}
        <button onClick={() => addObj('downloads', { icon: '📄', file: 'New File', type: 'PDF', size: '' })}
          style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem' }}>+ Add Download</button>
      </SectionCard>

      {/* PRESS CONTACTS */}
      <SectionCard title="👤 Press Contacts">
        {form.contacts.map((contact, i) => (
          <div key={i} style={{ ...c.card, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 700 }}>Contact #{i + 1}</span>
              {removeBtn(() => removeItem('contacts', i))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormField label="Full Name"><input style={c.input} value={contact.name} onChange={setListItem('contacts', i, 'name')} /></FormField>
              <FormField label="Role / Title"><input style={c.input} value={contact.role} onChange={setListItem('contacts', i, 'role')} /></FormField>
              <FormField label="Email"><input style={c.input} value={contact.email} onChange={setListItem('contacts', i, 'email')} /></FormField>
              <FormField label="Phone"><input style={c.input} value={contact.phone} onChange={setListItem('contacts', i, 'phone')} /></FormField>
            </div>
          </div>
        ))}
        <button onClick={() => addObj('contacts', { name: 'New Contact', role: '', email: '', phone: '' })}
          style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem' }}>+ Add Contact</button>
      </SectionCard>
    </div>
  )
}
