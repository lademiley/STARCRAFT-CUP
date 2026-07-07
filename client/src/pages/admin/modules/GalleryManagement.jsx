import React, { useState } from 'react'
import { c, StatCard, SectionCard, Badge, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const initAlbums = [
  { id: 1,  title: 'Opening Ceremony', date: '2026-12-01', photos: 84, videos: 3, event: 'Opening Exhibition', status: 'Published', featured: true },
  { id: 2,  title: 'Group Stage MD1 — Dec 2',  date: '2026-12-02', photos: 62, videos: 4, event: 'Group Stage', status: 'Published', featured: false },
  { id: 3,  title: 'Group Stage MD1 — Dec 3',  date: '2026-12-03', photos: 58, videos: 4, event: 'Group Stage', status: 'Published', featured: false },
  { id: 4,  title: 'Group Stage Highlights Week 1', date: '2026-12-07', photos: 45, videos: 8, event: 'Group Stage', status: 'Published', featured: false },
  { id: 5,  title: 'Chukwuemeka Obi — Player Spotlight', date: '2026-12-08', photos: 22, videos: 1, event: 'Player Feature', status: 'Published', featured: true },
  { id: 6,  title: 'Group Stage Final Matchday',  date: '2026-12-11', photos: 70, videos: 6, event: 'Group Stage', status: 'Published', featured: false },
  { id: 7,  title: 'Quarter-Final Preview Gallery', date: '2026-12-13', photos: 18, videos: 2, event: 'Quarter-Final', status: 'Draft', featured: false },
  { id: 8,  title: 'Behind the Scenes — Tournament Staff', date: '2026-12-05', photos: 34, videos: 1, event: 'Behind The Scenes', status: 'Published', featured: false },
]

const eventColors = { 'Opening Exhibition': '#D4AF37', 'Group Stage': '#3B82F6', 'Quarter-Final': '#F59E0B', 'Semi-Final': '#EC4899', 'Final': '#22C55E', 'Player Feature': '#8B5CF6', 'Behind The Scenes': '#14B8A6' }
const blank = { title: '', date: '', photos: 0, videos: 0, event: 'Group Stage', status: 'Draft', featured: false }

export default function GalleryManagement() {
  const [albums, setAlbums]   = useState(initAlbums)
  const [search, setSearch]   = useState('')
  const [evtFilter, setEvtFilter] = useState('All')
  const [modal, setModal]     = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(blank)

  const filtered = albums.filter(a =>
    (evtFilter === 'All' || a.event === evtFilter) &&
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  const toggleFeature = id => setAlbums(p => p.map(a => a.id === id ? { ...a, featured: !a.featured } : a))
  const togglePublish = id => setAlbums(p => p.map(a => a.id === id ? { ...a, status: a.status === 'Published' ? 'Draft' : 'Published' } : a))
  const openAdd  = () => { setForm({ ...blank, date: new Date().toISOString().split('T')[0] }); setModal('add') }
  const openEdit = a => { setEditing(a.id); setForm({ ...a }); setModal('edit') }
  const save     = () => {
    if (modal === 'add') setAlbums(p => [...p, { ...form, id: Date.now(), photos: Number(form.photos), videos: Number(form.videos) }])
    else setAlbums(p => p.map(a => a.id === editing ? { ...form, id: editing } : a))
    setModal(null)
  }
  const del = id => { if (confirm('Delete album?')) setAlbums(p => p.filter(a => a.id !== id)) }
  const f   = k  => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const totalPhotos = albums.reduce((s, a) => s + Number(a.photos), 0)
  const totalVideos = albums.reduce((s, a) => s + Number(a.videos), 0)

  return (
    <div>
      <ModuleHeader title="Gallery Management" subtitle="Photo and video albums for StarCraft Cup 2026" action="Create Album" onAction={openAdd} count={albums.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Albums"      value={albums.length}  icon="🖼️" color="#D4AF37" />
        <StatCard label="Total Photos" value={totalPhotos}   icon="📸" color="#3B82F6" />
        <StatCard label="Total Videos" value={totalVideos}   icon="🎬" color="#22C55E" />
        <StatCard label="Featured"    value={albums.filter(a => a.featured).length} icon="⭐" color="#F59E0B" />
      </div>

      <SectionCard title="🖼️ Photo Albums" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search albums..." />
          <select value={evtFilter} onChange={e => setEvtFilter(e.target.value)} style={c.select}>
            <option value="All">All Events</option>
            {[...new Set(albums.map(a => a.event))].map(e => <option key={e}>{e}</option>)}
          </select>
        </ActionRow>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
          {filtered.map(a => (
            <div key={a.id} style={{ ...c.card, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.9rem' }}>{a.featured && '⭐ '}{a.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{a.date}</div>
                </div>
                <Badge label={a.status} color={a.status === 'Published' ? '#22C55E' : '#F59E0B'} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Badge label={a.event} color={eventColors[a.event] || '#D4AF37'} />
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                <span>📸 {a.photos} photos</span>
                <span>🎬 {a.videos} videos</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button onClick={() => togglePublish(a.id)} style={{ ...c.btn, ...c.btnGhost, flex: 1, fontSize: '0.7rem', padding: '5px 8px' }}>
                  {a.status === 'Published' ? 'Unpublish' : '📢 Publish'}
                </button>
                <button onClick={() => toggleFeature(a.id)} style={{ ...c.btn, ...c.btnGhost, fontSize: '0.7rem', padding: '5px 8px' }} title="Toggle Featured">⭐</button>
                <button onClick={() => openEdit(a)} style={{ ...c.btn, ...c.btnGhost, fontSize: '0.7rem', padding: '5px 8px' }}>✏️</button>
                <button onClick={() => del(a.id)} style={{ ...c.btn, ...c.btnDanger, fontSize: '0.7rem', padding: '5px 8px' }}>🗑️</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p style={{ color: 'rgba(255,255,255,0.35)', padding: 24 }}>No albums found.</p>}
        </div>
      </SectionCard>

      {modal && (
        <Modal title={modal === 'add' ? 'Create Album' : 'Edit Album'} onClose={() => setModal(null)}>
          <FormField label="Album Title"><input style={c.input} value={form.title} onChange={f('title')} placeholder="e.g. Quarter-Final Gallery" /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Date"><input style={c.input} type="date" value={form.date} onChange={f('date')} /></FormField>
            <FormField label="Event">
              <select style={{ ...c.select, width: '100%' }} value={form.event} onChange={f('event')}>
                {['Opening Exhibition','Group Stage','Quarter-Final','Semi-Final','Final','Player Feature','Behind The Scenes'].map(e => <option key={e}>{e}</option>)}
              </select>
            </FormField>
            <FormField label="Photos"><input style={c.input} type="number" value={form.photos} onChange={f('photos')} /></FormField>
            <FormField label="Videos"><input style={c.input} type="number" value={form.videos} onChange={f('videos')} /></FormField>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button onClick={() => setModal(null)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={save} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Album</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
