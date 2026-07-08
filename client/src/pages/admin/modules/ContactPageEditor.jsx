import React, { useEffect, useRef, useState } from 'react'
import { c, SectionCard, FormField } from './shared'
import { useContentAdmin } from '../../../context/ContentContext'

export default function ContactPageEditor() {
  const { content, setPageContent, reload } = useContentAdmin()
  const [form, setForm] = useState(null)
  const syncedRef = useRef(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!syncedRef.current) {
      if (content.contact) {
        setForm(JSON.parse(JSON.stringify(content.contact)))
        syncedRef.current = true
      } else {
        reload('contact').then(() => {})
      }
    }
  }, [content.contact, reload])

  useEffect(() => {
    if (!syncedRef.current && content.contact) {
      setForm(JSON.parse(JSON.stringify(content.contact)))
      syncedRef.current = true
    }
  }, [content.contact])

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
      const res = await fetch('/api/content/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: form }),
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Failed to save') }
      const data = await res.json()
      setPageContent('contact', data.content)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  if (!form) return <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading Contact page content…</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>Contact Page Editor</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>Edit contact details and FAQ shown on the public Contact page.</p>
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

      {/* CONTACT INFO */}
      <SectionCard title="📞 Contact Information Cards">
        {form.info.map((item, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 200px 1fr auto', gap: 8, marginBottom: 8, alignItems: 'start' }}>
            <input style={c.input} placeholder="Icon" value={item.icon} onChange={setListItem('info', i, 'icon')} />
            <input style={c.input} placeholder="Label" value={item.label} onChange={setListItem('info', i, 'label')} />
            <textarea style={{ ...c.input, minHeight: 48 }} placeholder="Value (use \n for line breaks)" value={item.value} onChange={setListItem('info', i, 'value')} />
            {removeBtn(() => removeItem('info', i))}
          </div>
        ))}
        <button onClick={() => addObj('info', { icon: '📌', label: 'New Contact', value: '' })}
          style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem' }}>+ Add Contact Card</button>
      </SectionCard>

      {/* FAQ */}
      <SectionCard title="❓ Frequently Asked Questions">
        {form.faq.map((item, i) => (
          <div key={i} style={{ ...c.card, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 700 }}>FAQ #{i + 1}</span>
              {removeBtn(() => removeItem('faq', i))}
            </div>
            <FormField label="Question"><input style={c.input} value={item.q} onChange={setListItem('faq', i, 'q')} /></FormField>
            <FormField label="Answer"><textarea style={{ ...c.input, minHeight: 70 }} value={item.a} onChange={setListItem('faq', i, 'a')} /></FormField>
          </div>
        ))}
        <button onClick={() => addObj('faq', { q: 'New Question?', a: 'Answer here.' })}
          style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem' }}>+ Add FAQ</button>
      </SectionCard>
    </div>
  )
}
