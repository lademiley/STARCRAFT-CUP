import React, { useState, useEffect } from 'react'
import { c, StatCard, SectionCard, Badge, Modal, FormField, ModuleHeader, SearchBar, ActionRow } from './shared'

const eventColors = { 'Opening Exhibition': '#D4AF37', 'Group Stage': '#3B82F6', 'Quarter-Final': '#F59E0B', 'Semi-Final': '#EC4899', 'Final': '#22C55E', 'Player Feature': '#8B5CF6', 'Behind The Scenes': '#14B8A6' }
const eventTags = Object.keys(eventColors)
const blank = { title: '', date: '', event: 'Group Stage', status: 'Draft', featured: false }

export default function GalleryManagement() {
  const [albums, setAlbums]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [evtFilter, setEvtFilter] = useState('All')
  const [modal, setModal]       = useState(null)   // 'add' | 'edit' | null
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(blank)
  const [error, setError]       = useState('')
  const [photoAlbum, setPhotoAlbum] = useState(null) // album currently open in the photo manager
  const [uploading, setUploading]   = useState(false)

  const loadAlbums = () => {
    setLoading(true)
    fetch('/api/gallery/albums', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setAlbums(d.albums || []))
      .catch(() => setError('Failed to load albums'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadAlbums() }, [])

  const filtered = albums.filter(a =>
    (evtFilter === 'All' || a.event === evtFilter) &&
    a.title.toLowerCase().includes(search.toLowerCase())
  )

  const totalPhotos = albums.reduce((s, a) => s + a.photos.length, 0)
  const totalFeatured = albums.filter(a => a.featured).length

  const openAdd  = () => { setForm({ ...blank, date: new Date().toISOString().split('T')[0] }); setError(''); setModal('add') }
  const openEdit = a => { setEditing(a.id); setForm({ title: a.title, date: a.date, event: a.event, status: a.status, featured: a.featured }); setError(''); setModal('edit') }
  const f = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const save = async () => {
    if (!form.title.trim()) { setError('Album title is required'); return }
    setError('')
    try {
      const url = modal === 'add' ? '/api/gallery/albums' : `/api/gallery/albums/${editing}`
      const method = modal === 'add' ? 'POST' : 'PUT'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Failed to save album'); return }
      setModal(null)
      loadAlbums()
    } catch {
      setError('Network error — please try again.')
    }
  }

  const del = async id => {
    if (!confirm('Delete this album and all its photos?')) return
    await fetch(`/api/gallery/albums/${id}`, { method: 'DELETE', credentials: 'include' })
    loadAlbums()
  }

  const togglePublish = async a => {
    await fetch(`/api/gallery/albums/${a.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status: a.status === 'Published' ? 'Draft' : 'Published' }),
    })
    loadAlbums()
  }

  const toggleFeature = async a => {
    await fetch(`/api/gallery/albums/${a.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ featured: !a.featured }),
    })
    loadAlbums()
  }

  const uploadPhotos = async (albumId, files) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setError('')
    const fd = new FormData()
    for (const file of files) fd.append('photos', file)
    try {
      const res = await fetch(`/api/gallery/albums/${albumId}/photos`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Upload failed'); setUploading(false); return }
      setAlbums(prev => prev.map(a => a.id === albumId ? data.album : a))
      setPhotoAlbum(data.album)
    } catch {
      setError('Network error during upload.')
    } finally {
      setUploading(false)
    }
  }

  const deletePhoto = async (albumId, photoId) => {
    if (!confirm('Remove this photo?')) return
    const res = await fetch(`/api/gallery/albums/${albumId}/photos/${photoId}`, { method: 'DELETE', credentials: 'include' })
    const data = await res.json()
    if (res.ok) {
      setAlbums(prev => prev.map(a => a.id === albumId ? data.album : a))
      setPhotoAlbum(data.album)
    }
  }

  return (
    <div>
      <ModuleHeader title="Gallery Management" subtitle="Photo and video albums for StarCraft Cup 2026" action="Create Album" onAction={openAdd} count={albums.length} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard label="Albums"       value={albums.length}  icon="🖼️" color="#D4AF37" />
        <StatCard label="Total Photos" value={totalPhotos}    icon="📸" color="#3B82F6" />
        <StatCard label="Published"    value={albums.filter(a => a.status === 'Published').length} icon="📢" color="#22C55E" />
        <StatCard label="Featured"     value={totalFeatured}  icon="⭐" color="#F59E0B" />
      </div>

      {error && !modal && !photoAlbum && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#f87171', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <SectionCard title="🖼️ Photo Albums" action="">
        <ActionRow>
          <SearchBar value={search} onChange={setSearch} placeholder="Search albums..." />
          <select value={evtFilter} onChange={e => setEvtFilter(e.target.value)} style={c.select}>
            <option value="All">All Events</option>
            {eventTags.map(e => <option key={e}>{e}</option>)}
          </select>
        </ActionRow>

        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.35)', padding: 24 }}>Loading albums…</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
            {filtered.map(a => (
              <div key={a.id} style={{ ...c.card, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Cover thumbnail */}
                <div style={{ width: '100%', height: 120, borderRadius: 10, overflow: 'hidden', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {a.photos[0] ? (
                    <img src={a.photos[0].url} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '2rem', opacity: 0.3 }}>🖼️</span>
                  )}
                </div>

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
                  <span>📸 {a.photos.length} photos</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button onClick={() => setPhotoAlbum(a)} style={{ ...c.btn, ...c.btnPrimary, flex: 1, fontSize: '0.7rem', padding: '5px 8px' }}>
                    📤 Add Pictures
                  </button>
                  <button onClick={() => togglePublish(a)} style={{ ...c.btn, ...c.btnGhost, fontSize: '0.7rem', padding: '5px 8px' }}>
                    {a.status === 'Published' ? 'Unpublish' : '📢 Publish'}
                  </button>
                  <button onClick={() => toggleFeature(a)} style={{ ...c.btn, ...c.btnGhost, fontSize: '0.7rem', padding: '5px 8px' }} title="Toggle Featured">⭐</button>
                  <button onClick={() => openEdit(a)} style={{ ...c.btn, ...c.btnGhost, fontSize: '0.7rem', padding: '5px 8px' }}>✏️</button>
                  <button onClick={() => del(a.id)} style={{ ...c.btn, ...c.btnDanger, fontSize: '0.7rem', padding: '5px 8px' }}>🗑️</button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p style={{ color: 'rgba(255,255,255,0.35)', padding: 24 }}>No albums found. Click "+ Create Album" to add one.</p>}
          </div>
        )}
      </SectionCard>

      {/* Create / Edit album modal */}
      {modal && (
        <Modal title={modal === 'add' ? 'Create Album' : 'Edit Album'} onClose={() => setModal(null)}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, color: '#f87171', fontSize: '0.83rem' }}>
              {error}
            </div>
          )}
          <FormField label="Album Title"><input style={c.input} value={form.title} onChange={f('title')} placeholder="e.g. Quarter-Final Gallery" /></FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FormField label="Date"><input style={c.input} type="date" value={form.date} onChange={f('date')} /></FormField>
            <FormField label="Event">
              <select style={{ ...c.select, width: '100%' }} value={form.event} onChange={f('event')}>
                {eventTags.map(e => <option key={e}>{e}</option>)}
              </select>
            </FormField>
            <FormField label="Status">
              <select style={{ ...c.select, width: '100%' }} value={form.status} onChange={f('status')}>
                <option>Draft</option>
                <option>Published</option>
              </select>
            </FormField>
            <FormField label="Featured">
              <select style={{ ...c.select, width: '100%' }} value={form.featured ? 'yes' : 'no'} onChange={e => setForm(p => ({ ...p, featured: e.target.value === 'yes' }))}>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </FormField>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
            <button onClick={() => setModal(null)} style={{ ...c.btn, ...c.btnGhost }}>Cancel</button>
            <button onClick={save} style={{ ...c.btn, ...c.btnPrimary }}>💾 Save Album</button>
          </div>
        </Modal>
      )}

      {/* Photo manager modal — upload & view/delete pictures in an album */}
      {photoAlbum && (
        <Modal title={`📸 Photos — ${photoAlbum.title}`} onClose={() => { setPhotoAlbum(null); setError('') }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, color: '#f87171', fontSize: '0.83rem' }}>
              {error}
            </div>
          )}

          <label
            htmlFor="gallery-photo-input"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
              border: '2px dashed rgba(212,175,55,0.35)', borderRadius: 12, padding: '28px 16px',
              cursor: uploading ? 'default' : 'pointer', marginBottom: 18,
              background: 'rgba(212,175,55,0.04)', opacity: uploading ? 0.6 : 1,
            }}
          >
            <span style={{ fontSize: '1.8rem' }}>{uploading ? '⏳' : '📤'}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#D4AF37' }}>
              {uploading ? 'Uploading…' : 'Click to add pictures'}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>JPG, PNG, WEBP or GIF · up to 8MB each · multiple allowed</span>
            <input
              id="gallery-photo-input"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              disabled={uploading}
              style={{ display: 'none' }}
              onChange={e => { uploadPhotos(photoAlbum.id, e.target.files); e.target.value = '' }}
            />
          </label>

          {photoAlbum.photos.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '20px 0' }}>No pictures yet — add some above.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 10 }}>
              {photoAlbum.photos.map(p => (
                <div key={p.id} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', aspectRatio: '1', background: 'rgba(255,255,255,0.05)' }}>
                  <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => deletePhoto(photoAlbum.id, p.id)}
                    title="Remove photo"
                    style={{
                      position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.65)', color: '#f87171', border: 'none', cursor: 'pointer',
                      fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >✕</button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
            <button onClick={() => { setPhotoAlbum(null); setError('') }} style={{ ...c.btn, ...c.btnGhost }}>Done</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
