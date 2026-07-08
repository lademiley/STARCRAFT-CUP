import React, { useState, useEffect } from 'react'

const eventColors = {
  'Opening Exhibition': 'linear-gradient(135deg,#4A090B,#8B0E12)',
  'Group Stage': 'linear-gradient(135deg,#00192a,#005a8e)',
  'Quarter-Final': 'linear-gradient(135deg,#1a0a00,#7c3a10)',
  'Semi-Final': 'linear-gradient(135deg,#1a001a,#5c0a5c)',
  'Final': 'linear-gradient(135deg,#0a1a00,#2e5c0a)',
  'Player Feature': 'linear-gradient(135deg,#1a001a,#5c0a5c)',
  'Behind The Scenes': 'linear-gradient(135deg,#001a1a,#0a5c5c)',
}
const fallbackGradient = 'linear-gradient(135deg,#2a0a0a,#4A090B)'

export default function Gallery() {
  const [albums, setAlbums]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('All')
  const [lightbox, setLightbox] = useState(null) // { photo, album }

  useEffect(() => {
    fetch('/api/gallery/albums')
      .then(r => r.ok ? r.json() : null)
      .then(d => setAlbums(d?.albums || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Flatten every published album's photos into a single feed, each tagged with its album's event/title
  const items = albums.flatMap(a =>
    a.photos.map(p => ({ ...p, event: a.event, albumTitle: a.title, albumId: a.id }))
  )

  const categories = ['All', ...[...new Set(albums.map(a => a.event))]]
  const filtered = filter === 'All' ? items : items.filter(i => i.event === filter)
  const totalPhotos = items.length
  const totalCategories = categories.length - 1

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Home <span>›</span> Gallery</div>
          <h1>Photo & Video <span className="text-gold">Gallery</span></h1>
          <p>Relive the best moments from StarCraft Cup 2026</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filter */}
          {categories.length > 1 && (
            <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:32}}>
              {categories.map(c => (
                <button key={c} className={`tag ${filter===c?'active':''}`} onClick={()=>setFilter(c)}>{c}</button>
              ))}
            </div>
          )}

          {/* Stats */}
          <div style={{display:'flex',gap:24,marginBottom:32,flexWrap:'wrap'}}>
            {[['📸','Photos',totalPhotos],['🖼️','Albums',albums.length],['📁','Categories',totalCategories]].map(([icon,label,count]) => (
              <div key={label} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 18px',background:'rgba(212,175,55,0.08)',border:'1px solid rgba(212,175,55,0.2)',borderRadius:30}}>
                <span>{icon}</span>
                <span style={{fontFamily:'var(--font-secondary)',fontWeight:700,color:'var(--gold)'}}>{count}</span>
                <span style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.6)'}}>{label}</span>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="card" style={{padding:60,textAlign:'center',color:'rgba(255,255,255,0.4)'}}>
              <div style={{fontSize:'3rem',marginBottom:16}}>⏳</div>
              <h3>Loading gallery…</h3>
            </div>
          ) : (
            <>
              {/* Masonry Grid — real admin-uploaded photos */}
              <div className="gallery-grid">
                {filtered.map((item, i) => (
                  <div
                    key={item.id}
                    className={`gallery-item ${i % 5 === 0 ? 'large' : ''}`}
                    onClick={() => setLightbox(item)}
                  >
                    <img src={item.url} alt={item.albumTitle} className="gallery-photo" loading="lazy" />
                    <div className="gallery-overlay">
                      <div className="gallery-type-badge">📸 Photo</div>
                      <div className="gallery-info">
                        <span className="badge badge-gold" style={{marginBottom:6,fontSize:'0.65rem'}}>{item.event}</span>
                        <div style={{fontFamily:'var(--font-secondary)',fontWeight:700,fontSize:'0.9rem',color:'var(--white)'}}>{item.albumTitle}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="card" style={{padding:60,textAlign:'center',color:'rgba(255,255,255,0.4)'}}>
                  <div style={{fontSize:'3rem',marginBottom:16}}>📸</div>
                  <h3>{albums.length === 0 ? 'No photos published yet' : 'No items in this category yet'}</h3>
                  <p style={{marginTop:8,fontSize:'0.85rem'}}>
                    {albums.length === 0 ? 'Check back soon — the committee will publish event photos here.' : ''}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            <div className="lightbox-img">
              <img src={lightbox.url} alt={lightbox.albumTitle} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div className="lightbox-meta">
              <span className="badge badge-gold">{lightbox.event}</span>
              <h3 style={{margin:'12px 0 8px'}}>{lightbox.albumTitle}</h3>
              <div style={{display:'flex',gap:10,marginTop:16}}>
                <a href={lightbox.url} download className="btn btn-secondary btn-sm">⬇ Download</a>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .gallery-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 200px; gap: 12px; }
        .gallery-item { position: relative; border-radius: 12px; overflow: hidden; cursor: pointer; transition: transform 300ms; background: ${fallbackGradient}; }
        .gallery-item.large { grid-column: span 2; grid-row: span 2; }
        .gallery-item:hover { transform: scale(1.02); }
        .gallery-item:hover .gallery-overlay { opacity: 1; }
        .gallery-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .gallery-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%); opacity: 0; transition: opacity 300ms; display: flex; flex-direction: column; justify-content: space-between; padding: 12px; }
        .gallery-type-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: rgba(0,0,0,0.5); border-radius: 20px; font-family: var(--font-secondary); font-size: 0.7rem; font-weight: 700; color: var(--white); align-self: flex-end; }
        .gallery-info { }
        .lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(10px); }
        .lightbox-content { background: linear-gradient(145deg, rgba(74,9,11,0.95), rgba(20,2,3,0.98)); border: 1px solid rgba(212,175,55,0.3); border-radius: 20px; overflow: hidden; max-width: 700px; width: 100%; position: relative; }
        .lightbox-close { position: absolute; top: 16px; right: 16px; z-index: 1; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; width: 36px; height: 36px; color: white; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .lightbox-img { height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); }
        .lightbox-meta { padding: 24px; }
        @media (max-width: 768px) { .gallery-grid { grid-template-columns: repeat(2, 1fr); } .gallery-item.large { grid-column: span 1; grid-row: span 1; } }
      `}</style>
    </div>
  )
}
