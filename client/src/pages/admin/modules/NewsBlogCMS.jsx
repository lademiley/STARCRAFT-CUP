import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initArticles = []

const catColors = { 'Match Report': '#3B82F6', Preview: '#F59E0B', Analysis: '#8B5CF6', 'Player Feature': '#22C55E', Tournament: '#D4AF37', Official: '#EC4899' }
const blank = { title: '', category: 'Match Report', status: 'Draft', date: '', author: 'Admin', content: '', views: 0 }

export default function NewsBlogCMS() {
  const [articles, setArticles] = useState(initArticles)
  const [search, setSearch]     = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modal, setModal]       = useState(null)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(blank)

  const filtered = articles.filter(a =>
    (catFilter === 'All' || a.category === catFilter) &&
    (statusFilter === 'All' || a.status === statusFilter) &&
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd  = () => { setForm({ ...blank, date: new Date().toISOString().split('T')[0] }); setModal('add') }
  const openEdit = a => { setEditing(a.id); setForm({ ...a }); setModal('edit') }
  const publish  = id => setArticles(p => p.map(a => a.id === id ? { ...a, status: a.status === 'Published' ? 'Draft' : 'Published' } : a))
  const save     = () => {
    if (modal === 'add') setArticles(p => [...p, { ...form, id: Date.now() }])
    else setArticles(p => p.map(a => a.id === editing ? { ...form, id: editing } : a))
    setModal(null)
  }
  const del = id => { if (confirm('Delete article?')) setArticles(p => p.filter(a => a.id !== id)) }
  const f   = k  => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const totalViews = articles.filter(a => a.status === 'Published').reduce((s, a) => s + a.views, 0)

  return (
    <div>
      <ModuleHeader title="News & Blog CMS" subtitle="Manage articles, match reports, and announcements" action="Write Article" onAction={openAdd} count={articles.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Articles"  value={articles.length}                                       icon="📰" color="#D4AF37" />
        <StatCard label="Published"       value={articles.filter(a => a.status === 'Published').length} icon="✅" color="#22C55E" />
        <StatCard label="Drafts"          value={articles.filter(a => a.status === 'Draft').length}     icon="📝" color="#F59E0B" />
        <StatCard label="Total Views"     value={totalViews.toLocaleString()}                           icon="👁️" color="#3B82F6" />
      </div>

      <SectionCard title="📰 Articles" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search articles..." />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={c.select}>
            <option value="All">All Categories</option>
            {['Match Report','Preview','Analysis','Player Feature','Tournament','Official'].map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={c.select}>
            <option value="All">All</option><option>Published</option><option>Draft</option>
          </select>
        </ActionRow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((a, i) => (
            <div key={a.id} style={{ ...c.card, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: '14px 18px' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 600, marginBottom: 4, lineHeight: 1.4 }}>{a.title}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <span>{a.date}</span>
                  <span>By {a.author}</span>
                  {a.status === 'Published' && <span>👁️ {a.views.toLocaleString()} views</span>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <Badge label={a.category} color={catColors[a.category] || '#D4AF37'} />
                <Badge label={a.status} color={a.status === 'Published' ? '#22C55E' : '#F59E0B'} />
                <button onClick={() => publish(a.id)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.7rem' }}>
                  {a.status === 'Published' ? 'Unpublish' : '📢 Publish'}
                </button>
                <button onClick={() => openEdit(a)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 10px', fontSize: '0.7rem' }}>✏️</button>
                <button onClick={() => del(a.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 10px', fontSize: '0.7rem' }}>🗑️</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: 24 }}>No articles found.</p>}
        </div>
      </SectionCard>

      {modal && (
        <Modal title={modal === 'add' ? 'Write New Article' : 'Edit Article'} onClose={() => setModal(null)}>
          <FormField label="Title"><input style={c.input} value={form.title} onChange={f('title')} placeholder="Article headline" /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Category">
              <select style={{ ...c.select, width: '100%' }} value={form.category} onChange={f('category')}>
                {['Match Report','Preview','Analysis','Player Feature','Tournament','Official'].map(cat => <option key={cat}>{cat}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select style={{ ...c.select, width: '100%' }} value={form.status} onChange={f('status')}>
                <option>Draft</option><option>Published</option>
              </select>
            </FormField>
            <FormField label="Author"><input style={c.input} value={form.author} onChange={f('author')} /></FormField>
            <FormField label="Date"><input style={c.input} type="date" value={form.date} onChange={f('date')} /></FormField>
          </div>
          <FormField label="Content">
            <textarea style={{ ...c.input, minHeight: 120, resize: 'vertical' }} value={form.content} onChange={f('content')} placeholder="Article body..." />
          </FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button onClick={() => setModal(null)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={save} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Article</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
