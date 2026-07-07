import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Table, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initArticles = [
  { id: 1, title: 'StarCraft Cup 2027 Officially Kicks Off to Massive Fanfare', category: 'Tournament Updates', author: 'Sports Desk', date: '2027-03-01', status: 'Published', views: 3420 },
  { id: 2, title: 'Chukwuemeka Obi Fires Edo Warriors to Dominant 4-0 Victory', category: 'Match Reports', author: 'John Adeyemi', date: '2027-03-02', status: 'Published', views: 2180 },
  { id: 3, title: 'Edo State Governor Hails StarCraft Cup as Nation-Building Initiative', category: 'Press Releases', author: 'Press Office', date: '2027-03-04', status: 'Published', views: 1540 },
  { id: 4, title: 'Golden Boot Race: Obi Leads with 7 Goals After Group Stage', category: 'Statistics', author: 'Sports Desk', date: '2027-03-18', status: 'Published', views: 4200 },
  { id: 5, title: 'Quarter-Final Draw: Edo Warriors Face Benin Royals', category: 'Tournament Updates', author: 'John Adeyemi', date: '2027-03-15', status: 'Published', views: 5670 },
  { id: 6, title: 'Emmanuel Okuosa Named Best Goalkeeper of Group Stage', category: 'Awards', author: 'Press Office', date: '2027-03-17', status: 'Published', views: 1980 },
  { id: 7, title: 'Preview: Warrior Spirit vs Royal Authority — QF Match Preview', category: 'Match Reports', author: 'Sports Desk', date: '2027-03-19', status: 'Draft', views: 0 },
  { id: 8, title: 'Fan Experience at StarCraft Cup 2027: A World-Class Event', category: 'Features', author: 'Editorial', date: '2027-03-20', status: 'Draft', views: 0 },
]

const categories = ['Tournament Updates', 'Match Reports', 'Press Releases', 'Statistics', 'Awards', 'Features', 'Announcements']
const blank = { title: '', category: 'Tournament Updates', author: '', date: '', status: 'Draft', views: 0, content: '' }
const catColor = { 'Tournament Updates': '#D4AF37', 'Match Reports': '#3B82F6', 'Press Releases': '#EC4899', Statistics: '#22C55E', Awards: '#F59E0B', Features: '#8B5CF6', Announcements: '#14B8A6' }

export default function NewsBlogCMS() {
  const [articles, setArticles] = useState(initArticles)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = articles.filter(a =>
    (catFilter === 'All' || a.category === catFilter) &&
    (statusFilter === 'All' || a.status === statusFilter) &&
    a.title.toLowerCase().includes(search.toLowerCase())
  )
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const openEdit = a => { setForm({ ...a, content: a.content || '' }); setEditing(a.id); setModal(true) }
  const handleSave = () => {
    if (editing) setArticles(prev => prev.map(a => a.id === editing ? { ...form, id: editing } : a))
    else setArticles(prev => [...prev, { ...form, id: Date.now(), views: 0 }])
    setModal(false); setEditing(null)
  }
  const handleDelete = id => { if (confirm('Delete article?')) setArticles(prev => prev.filter(a => a.id !== id)) }
  const publish = id => setArticles(prev => prev.map(a => a.id === id ? { ...a, status: 'Published', date: new Date().toISOString().split('T')[0] } : a))

  return (
    <div>
      <ModuleHeader title="News & Blog CMS" subtitle="Manage all articles and press releases" action="New Article" onAction={() => { setForm(blank); setEditing(null); setModal(true) }} count={articles.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Articles" value={articles.length} icon="📰" color="#D4AF37" />
        <StatCard label="Published" value={articles.filter(a => a.status === 'Published').length} icon="✅" color="#22C55E" />
        <StatCard label="Drafts" value={articles.filter(a => a.status === 'Draft').length} icon="📝" color="#F59E0B" />
        <StatCard label="Total Views" value={articles.reduce((s, a) => s + a.views, 0).toLocaleString()} icon="👁️" color="#3B82F6" />
      </div>

      <SectionCard title="📰 Articles" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search articles..." />
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={c.select}>
            <option value="All">All Categories</option>
            {categories.map(cat => <option key={cat}>{cat}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={c.select}>
            <option value="All">All Status</option>
            <option>Published</option><option>Draft</option>
          </select>
        </ActionRow>
        <Table
          cols={['Title', 'Category', 'Author', 'Date', 'Views', 'Status', 'Actions']}
          rows={filtered}
          renderRow={(a, i) => (
            <tr key={a.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)' }}>
              <td style={{ ...c.td, maxWidth: 260 }}>
                <div style={{ fontWeight: 600, fontSize: '0.82rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</div>
              </td>
              <td style={c.td}><Badge label={a.category} color={catColor[a.category] || '#D4AF37'} /></td>
              <td style={c.td}>{a.author}</td>
              <td style={c.td}>{a.date}</td>
              <td style={{ ...c.td, color: '#3B82F6', fontWeight: 600 }}>{a.views.toLocaleString()}</td>
              <td style={c.td}><Badge label={a.status} color={a.status === 'Published' ? '#22C55E' : '#F59E0B'} /></td>
              <td style={c.td}>
                <div style={{ display: 'flex', gap: 6 }}>
                  {a.status === 'Draft' && <button onClick={() => publish(a.id)} style={{ ...c.btn, padding: '4px 8px', fontSize: '0.7rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', borderRadius: 6 }}>Publish</button>}
                  <button onClick={() => openEdit(a)} style={{ ...c.btn, ...c.btnGhost, padding: '4px 8px', fontSize: '0.7rem' }}>✏️</button>
                  <button onClick={() => handleDelete(a.id)} style={{ ...c.btn, ...c.btnDanger, padding: '4px 8px', fontSize: '0.7rem' }}>🗑️</button>
                </div>
              </td>
            </tr>
          )}
        />
      </SectionCard>

      {modal && (
        <Modal title={editing ? 'Edit Article' : 'New Article'} onClose={() => { setModal(false); setEditing(null) }}>
          <FormField label="Title"><input style={c.input} value={form.title} onChange={set('title')} placeholder="Article headline..." /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Category">
              <select style={{ ...c.select, width: '100%' }} value={form.category} onChange={set('category')}>
                {categories.map(cat => <option key={cat}>{cat}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select style={{ ...c.select, width: '100%' }} value={form.status} onChange={set('status')}>
                <option>Draft</option><option>Published</option>
              </select>
            </FormField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Author"><input style={c.input} value={form.author} onChange={set('author')} /></FormField>
            <FormField label="Date"><input style={c.input} type="date" value={form.date} onChange={set('date')} /></FormField>
          </div>
          <FormField label="Content">
            <textarea style={{ ...c.input, minHeight: 120, resize: 'vertical' }} value={form.content} onChange={set('content')} placeholder="Write article content here..." />
          </FormField>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => { setModal(false); setEditing(null) }} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={handleSave} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Article</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
