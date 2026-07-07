import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Modal, FormField, ModuleHeader, ActionRow } from './shared'

const initAlbums = [
  { id: 1, title: 'Opening Ceremony', date: '2027-03-01', type: 'Photos', count: 48, status: 'Published', cover: '🎉' },
  { id: 2, title: 'Group Stage — Week 1', date: '2027-03-02', type: 'Photos', count: 124, status: 'Published', cover: '⚽' },
  { id: 3, title: 'Group Stage — Week 2', date: '2027-03-09', type: 'Photos', count: 98, status: 'Published', cover: '📸' },
  { id: 4, title: 'Quarter-Final Highlights', date: '2027-03-20', type: 'Photos', count: 64, status: 'Draft', cover: '🏆' },
  { id: 5, title: 'Match Highlights Reel', date: '2027-03-18', type: 'Videos', count: 6, status: 'Published', cover: '🎬' },
  { id: 6, title: 'Fan Zone Gallery', date: '2027-03-10', type: 'Photos', count: 87, status: 'Published', cover: '👥' },
  { id: 7, title: 'Behind the Scenes', date: '2027-03-05', type: 'Photos', count: 33, status: 'Published', cover: '🎭' },
  { id: 8, title: 'Quarter-Final Video Coverage', date: '2027-03-21', type: 'Videos', count: 4, status: 'Draft', cover: '📹' },
]

const blank = { title: '', date: '', type: 'Photos', count: 0, status: 'Draft', cover: '📸' }

export default function GalleryManagement() {
  const [albums, setAlbums] = useState(initAlbums)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState(null)

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const openEdit = a => { setForm({ ...a }); setEditing(a.id); setModal(true) }
  const handleSave = () => {
    if (editing) setAlbums(prev => prev.map(a => a.id === editing ? { ...form, id: editing, count: Number(form.count) } : a))
    else setAlbums(prev => [...prev, { ...form, id: Date.now(), count: Number(form.count) }])
    setModal(false); setEditing(null)
  }
  const handleDelete = id => { if (confirm('Delete album?')) setAlbums(prev => prev.filter(a => a.id !== id)) }
  const publish = id => setAlbums(prev => prev.map(a => a.id === id ? { ...a, status: 'Published' } : a))

  return (
    <div>
      <ModuleHeader title="Gallery Management" subtitle="Manage photo and video galleries" action="New Album" onAction={() => { setForm(blank); setEditing(null); setModal(true) }} count={albums.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total Albums" value={albums.length} icon="🖼️" color="#D4AF37" />
        <StatCard label="Published" value={albums.filter(a => a.status === 'Published').length} icon="✅" color="#22C55E" />
        <StatCard label="Total Photos" value={albums.filter(a => a.type === 'Photos').reduce((s, a) => s + a.count, 0)} icon="📸" color="#3B82F6" />
        <StatCard label="Videos" value={albums.filter(a => a.type === 'Videos').reduce((s, a) => s + a.count, 0)} icon="🎬" color="#8B5CF6" />
      </div>

      <SectionCard title="🖼️ All Albums" action="">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {albums.map(a => (
            <div key={a.id} style={{ ...c.card, position: 'relative', overflow: 'hidden' }}>
              {/* Cover */}
              <div style={{
                height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '3rem', marginBottom: 14, borderRadius: 8,
                background: a.status === 'Published' ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${a.status === 'Published' ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)'}`,
              }}>
                {a.cover}
              </div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', marginBottom: 4 }}>{a.title}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>
                {a.date} · {a.type} · {a.count} items
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 12 }}>
                <Badge label={a.status} color={a.status === 'Published' ? '#22C55E' : '#F59E0B'} />
                <Badge label={a.type} color={a.type === 'Photos' ? '#3B82F6' : '#8B5CF6'} />
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {a.status === 'Draft' && <button onClick={() => publish(a.id)} style={{ ...c.btn, padding: '5px 8px', fontSize: '0.7rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', borderRadius: 6 }}>↑ Publish</button>}
                <button onClick={() => openEdit(a)} style={{ ...c.btn, ...c.btnGhost, flex: 1, fontSize: '0.72rem' }}>✏️ Edit</button>
                <button onClick={() => handleDelete(a.id)} style={{ ...c.btn, ...c.btnDanger, padding: '5px 10px', fontSize: '0.72rem' }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {modal && (
        <Modal title={editing ? 'Edit Album' : 'New Album'} onClose={() => { setModal(false); setEditing(null) }}>
          <FormField label="Album Title"><input style={c.input} value={form.title} onChange={set('title')} placeholder="Opening Ceremony" /></FormField>
          <FormField label="Cover Emoji"><input style={c.input} value={form.cover} onChange={set('cover')} /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Type">
              <select style={{ ...c.select, width: '100%' }} value={form.type} onChange={set('type')}>
                <option>Photos</option><option>Videos</option>
              </select>
            </FormField>
            <FormField label="Status">
              <select style={{ ...c.select, width: '100%' }} value={form.status} onChange={set('status')}>
                <option>Draft</option><option>Published</option>
              </select>
            </FormField>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Date"><input style={c.input} type="date" value={form.date} onChange={set('date')} /></FormField>
            <FormField label="Item Count"><input style={c.input} type="number" value={form.count} onChange={set('count')} /></FormField>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => { setModal(false); setEditing(null) }} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={handleSave} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Album</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
