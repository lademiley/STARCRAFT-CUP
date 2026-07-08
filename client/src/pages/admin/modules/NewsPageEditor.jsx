import React, { useEffect, useRef, useState } from 'react'
import { c, SectionCard, FormField } from './shared'
import { useContentAdmin } from '../../../context/ContentContext'

export default function NewsPageEditor() {
  const { content, setPageContent, reload } = useContentAdmin()
  const [form, setForm] = useState(null)
  const syncedRef = useRef(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    if (!syncedRef.current) {
      if (content.news) { setForm(JSON.parse(JSON.stringify(content.news))); syncedRef.current = true }
      else reload('news').catch(() => setLoadError('Could not load page content from server.'))
    }
  }, [content.news, reload])

  useEffect(() => {
    if (!syncedRef.current && content.news) { setForm(JSON.parse(JSON.stringify(content.news))); syncedRef.current = true }
  }, [content.news])

  const setField = (section, key) => e =>
    setForm(p => ({ ...p, [section]: { ...p[section], [key]: e.target.value } }))

  const setCategoryItem = (index) => e => {
    const value = e.target.value
    setForm(p => { const cats = [...p.categories]; cats[index] = value; return { ...p, categories: cats } })
  }

  const addCategory = () =>
    setForm(p => ({ ...p, categories: [...p.categories, 'New Category'] }))

  const removeCategory = (index) =>
    setForm(p => { const cats = [...p.categories]; cats.splice(index, 1); return { ...p, categories: cats } })

  const save = async () => {
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/content/news', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify({ content: form }),
      })
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || 'Failed to save') }
      const data = await res.json()
      setPageContent('news', data.content)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e) { setError(e.message) }
    finally { setSaving(false) }
  }

  if (!form) return (
    <div style={{ padding: 40, textAlign: 'center', color: loadError ? '#f87171' : 'rgba(255,255,255,0.5)' }}>
      {loadError || 'Loading News page content…'}
      {loadError && <div style={{ marginTop: 12 }}><button onClick={() => { setLoadError(''); reload('news') }} style={{ padding: '6px 14px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 8, color: '#D4AF37', cursor: 'pointer', fontSize: '0.8rem' }}>↻ Retry</button></div>}
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: '0 0 4px', fontFamily: "'Cinzel',serif", fontSize: '1.2rem', color: '#fff' }}>News Page Editor</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>Edit hero text and category filters shown on the public News page.</p>
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

      {/* CATEGORIES */}
      <SectionCard title="🏷️ Filter Categories">
        <p style={{ margin: '0 0 14px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
          These appear as clickable filter buttons above the news grid. "All" is always shown automatically.
        </p>
        {form.categories.map((cat, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input style={{ ...c.input, flex: 1 }} value={cat} onChange={setCategoryItem(i)} />
            <button onClick={() => removeCategory(i)}
              style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.68rem', flexShrink: 0 }}>✕</button>
          </div>
        ))}
        <button onClick={addCategory} style={{ ...c.btn, ...c.btnGhost, fontSize: '0.72rem', marginTop: 4 }}>
          + Add Category
        </button>
      </SectionCard>

      <div style={{ padding: '14px 18px', borderRadius: 10, background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
        💡 <strong style={{ color: 'rgba(255,255,255,0.7)' }}>Tip:</strong> To manage individual news articles (add, edit, delete), use the <strong style={{ color: '#D4AF37' }}>News &amp; Blog CMS</strong> module in the sidebar.
      </div>
    </div>
  )
}
