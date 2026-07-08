import React, { useEffect, useRef, useState } from 'react'
import { c, SectionCard, FormField } from './shared'
import { useContentAdmin } from '../../../context/ContentContext'

// Deep-clones the home content into local editable state, lets the admin edit
// every copy block on the Home page, and PUTs the whole object back on save.
export default function HomePageEditor() {
  const { content, setPageContent, loading } = useContentAdmin()
  // The provider fetches /api/content/home asynchronously; content.home is
  // fallback copy until that resolves. Don't seed editable form state from it
  // until `loading` flips to false, or the admin could edit/save stale
  // fallback text over real published content.
  const [form, setForm] = useState(null)
  const syncedRef = useRef(false)
  useEffect(() => {
    if (!loading && !syncedRef.current) {
      setForm(JSON.parse(JSON.stringify(content.home)))
      syncedRef.current = true
    }
  }, [loading, content.home])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const setField = (section, key) => e => {
    const value = e.target.value
    setForm(p => ({ ...p, [section]: { ...p[section], [key]: value } }))
  }

  const setListItem = (section, listKey, index, itemKey) => e => {
    const value = e.target.value
    setForm(p => {
      const list = [...p[section][listKey]]
      if (itemKey === null) {
        list[index] = value
      } else {
        list[index] = { ...list[index], [itemKey]: value }
      }
      return { ...p, [section]: { ...p[section], [listKey]: list } }
    })
  }

  const addListItem = (section, listKey, emptyItem) => {
    setForm(p => ({ ...p, [section]: { ...p[section], [listKey]: [...p[section][listKey], emptyItem] } }))
  }

  const removeListItem = (section, listKey, index) => {
    setForm(p => {
      const list = [...p[section][listKey]]
      list.splice(index, 1)
      return { ...p, [section]: { ...p[section], [listKey]: list } }
    })
  }

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/content/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: form }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to save')
      }
      const data = await res.json()
      setPageContent('home', data.content)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const removeBtn = onClick => (
    <button onClick={onClick} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.68rem' }}>✕</button>
  )

  if (!form) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading home page content…</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>Home Page Editor</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>Edit the copy shown on the public homepage — changes go live immediately after saving.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {saved && <span style={{ color: '#22C55E', fontSize: '0.82rem', fontWeight: 700 }}>✅ Saved — live on the site</span>}
          {error && <span style={{ color: '#f87171', fontSize: '0.82rem', fontWeight: 700 }}>⚠️ {error}</span>}
          <button onClick={save} disabled={saving} style={{ ...c.btn, ...c.btnPrimary, opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving…' : '💾 Save & Publish'}
          </button>
        </div>
      </div>

      {/* HERO */}
      <SectionCard title="🎬 Hero Section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormField label="Badge Text"><input style={c.input} value={form.hero.badge} onChange={setField('hero','badge')} /></FormField>
          <FormField label="Subtitle"><input style={c.input} value={form.hero.subtitle} onChange={setField('hero','subtitle')} /></FormField>
          <FormField label="Title Line 1"><input style={c.input} value={form.hero.titleLine1} onChange={setField('hero','titleLine1')} /></FormField>
          <FormField label="Title Line 2"><input style={c.input} value={form.hero.titleLine2} onChange={setField('hero','titleLine2')} /></FormField>
          <FormField label="Location"><input style={c.input} value={form.hero.location} onChange={setField('hero','location')} /></FormField>
          <FormField label="Venue"><input style={c.input} value={form.hero.venue} onChange={setField('hero','venue')} /></FormField>
          <FormField label="Dates"><input style={c.input} value={form.hero.dates} onChange={setField('hero','dates')} /></FormField>
        </div>
      </SectionCard>

      {/* OVERVIEW */}
      <SectionCard title="📖 Tournament Overview">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormField label="Eyebrow"><input style={c.input} value={form.overview.eyebrow} onChange={setField('overview','eyebrow')} /></FormField>
          <FormField label="Heading"><input style={c.input} value={form.overview.heading} onChange={setField('overview','heading')} /></FormField>
        </div>
        <FormField label="Paragraph 1"><textarea style={{ ...c.input, minHeight: 70 }} value={form.overview.paragraph1} onChange={setField('overview','paragraph1')} /></FormField>
        <FormField label="Paragraph 2"><textarea style={{ ...c.input, minHeight: 70 }} value={form.overview.paragraph2} onChange={setField('overview','paragraph2')} /></FormField>

        <FormField label="Feature Chips">
          {form.overview.features.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input style={c.input} value={f} onChange={setListItem('overview','features',i,null)} />
              {removeBtn(() => removeListItem('overview','features',i))}
            </div>
          ))}
          <button onClick={() => addListItem('overview','features','New Feature')} style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem' }}>+ Add Chip</button>
        </FormField>

        <FormField label="Tournament Info Card Rows">
          {form.overview.infoCard.map((row, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input style={{ ...c.input, maxWidth: 180 }} placeholder="Label" value={row.label} onChange={setListItem('overview','infoCard',i,'label')} />
              <input style={c.input} placeholder="Value" value={row.value} onChange={setListItem('overview','infoCard',i,'value')} />
              {removeBtn(() => removeListItem('overview','infoCard',i))}
            </div>
          ))}
          <button onClick={() => addListItem('overview','infoCard',{ label:'New Row', value:'' })} style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem' }}>+ Add Row</button>
        </FormField>
      </SectionCard>

      {/* HOST CITY */}
      <SectionCard title="🏙️ Host City Section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormField label="Eyebrow"><input style={c.input} value={form.hostCity.eyebrow} onChange={setField('hostCity','eyebrow')} /></FormField>
          <FormField label="Heading"><input style={c.input} value={form.hostCity.heading} onChange={setField('hostCity','heading')} /></FormField>
        </div>
        <FormField label="Subheading"><input style={c.input} value={form.hostCity.subheading} onChange={setField('hostCity','subheading')} /></FormField>
        <FormField label="Cards">
          {form.hostCity.cards.map((card, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 200px 1fr auto', gap: 8, marginBottom: 8, alignItems: 'start' }}>
              <input style={c.input} placeholder="Icon" value={card.icon} onChange={setListItem('hostCity','cards',i,'icon')} />
              <input style={c.input} placeholder="Title" value={card.title} onChange={setListItem('hostCity','cards',i,'title')} />
              <textarea style={{ ...c.input, minHeight: 40 }} placeholder="Description" value={card.desc} onChange={setListItem('hostCity','cards',i,'desc')} />
              {removeBtn(() => removeListItem('hostCity','cards',i))}
            </div>
          ))}
          <button onClick={() => addListItem('hostCity','cards',{ icon:'⭐', title:'New Card', desc:'' })} style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem' }}>+ Add Card</button>
        </FormField>
      </SectionCard>

      {/* TESTIMONIALS */}
      <SectionCard title="💬 Testimonials">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormField label="Eyebrow"><input style={c.input} value={form.testimonials.eyebrow} onChange={setField('testimonials','eyebrow')} /></FormField>
          <FormField label="Heading"><input style={c.input} value={form.testimonials.heading} onChange={setField('testimonials','heading')} /></FormField>
        </div>
        <FormField label="Quotes">
          {form.testimonials.items.map((t, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 180px 180px auto', gap: 8, marginBottom: 8, alignItems: 'start' }}>
              <textarea style={{ ...c.input, minHeight: 40 }} placeholder="Quote" value={t.quote} onChange={setListItem('testimonials','items',i,'quote')} />
              <input style={c.input} placeholder="Name" value={t.name} onChange={setListItem('testimonials','items',i,'name')} />
              <input style={c.input} placeholder="Role" value={t.role} onChange={setListItem('testimonials','items',i,'role')} />
              {removeBtn(() => removeListItem('testimonials','items',i))}
            </div>
          ))}
          <button onClick={() => addListItem('testimonials','items',{ quote:'', name:'New Person', role:'' })} style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem' }}>+ Add Testimonial</button>
        </FormField>
      </SectionCard>

      {/* NEWSLETTER */}
      <SectionCard title="📧 Newsletter Section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <FormField label="Heading"><input style={c.input} value={form.newsletter.heading} onChange={setField('newsletter','heading')} /></FormField>
          <FormField label="Text"><input style={c.input} value={form.newsletter.text} onChange={setField('newsletter','text')} /></FormField>
        </div>
      </SectionCard>
    </div>
  )
}
