import React, { useState } from 'react'
import { galleryItems } from '../data/mockData'

const categories = ['All', 'Opening Ceremony', 'Matches', 'Fan Moments', 'Awards', 'Highlights', 'Behind the Scenes', 'Drone Footage']

const galleryColors = [
  'linear-gradient(135deg,#4A090B,#8B0E12)',
  'linear-gradient(135deg,#1a0a00,#7c3a10)',
  'linear-gradient(135deg,#00192a,#005a8e)',
  'linear-gradient(135deg,#0a1a00,#2e5c0a)',
  'linear-gradient(135deg,#1a001a,#5c0a5c)',
  'linear-gradient(135deg,#001a1a,#0a5c5c)',
]

export default function Gallery() {
  const [filter, setFilter] = useState('All')
  const [lightbox, setLightbox] = useState(null)

  const filtered = galleryItems.filter(g => filter === 'All' || g.category === filter)

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Home <span>›</span> Gallery</div>
          <h1>Photo & Video <span className="text-gold">Gallery</span></h1>
          <p>Relive the best moments from StarCraft Cup 2027</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filter */}
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:32}}>
            {categories.map(c => (
              <button key={c} className={`tag ${filter===c?'active':''}`} onClick={()=>setFilter(c)}>{c}</button>
            ))}
          </div>

          {/* Stats */}
          <div style={{display:'flex',gap:24,marginBottom:32,flexWrap:'wrap'}}>
            {[['📸','Photos',galleryItems.filter(g=>g.type==='photo').length],['🎬','Videos',galleryItems.filter(g=>g.type==='video').length],['📁','Categories',categories.length-1]].map(([icon,label,count]) => (
              <div key={label} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 18px',background:'rgba(212,175,55,0.08)',border:'1px solid rgba(212,175,55,0.2)',borderRadius:30}}>
                <span>{icon}</span>
                <span style={{fontFamily:'var(--font-secondary)',fontWeight:700,color:'var(--gold)'}}>{count}</span>
                <span style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.6)'}}>{label}</span>
              </div>
            ))}
          </div>

          {/* Masonry Grid */}
          <div className="gallery-grid">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className={`gallery-item ${i % 5 === 0 ? 'large' : ''}`}
                onClick={() => setLightbox(item)}
                style={{background: galleryColors[i % galleryColors.length]}}
              >
                <div className="gallery-overlay">
                  <div className="gallery-type-badge">
                    {item.type === 'video' ? '▶ Video' : '📸 Photo'}
                  </div>
                  <div className="gallery-info">
                    <span className="badge badge-gold" style={{marginBottom:6,fontSize:'0.65rem'}}>{item.category}</span>
                    <div style={{fontFamily:'var(--font-secondary)',fontWeight:700,fontSize:'0.9rem',color:'var(--white)'}}>{item.title}</div>
                  </div>
                </div>
                <div className="gallery-placeholder">
                  {item.type === 'video' ? '🎬' : '📸'}
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="card" style={{padding:60,textAlign:'center',color:'rgba(255,255,255,0.4)'}}>
              <div style={{fontSize:'3rem',marginBottom:16}}>📸</div>
              <h3>No items in this category yet</h3>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            <div className="lightbox-img" style={{background: galleryColors[lightbox.id % galleryColors.length]}}>
              <div style={{fontSize:'5rem'}}>{lightbox.type === 'video' ? '🎬' : '📸'}</div>
              {lightbox.type === 'video' && (
                <div style={{marginTop:16}}>
                  <button className="btn btn-primary">▶ Play Video</button>
                </div>
              )}
            </div>
            <div className="lightbox-meta">
              <span className="badge badge-gold">{lightbox.category}</span>
              <h3 style={{margin:'12px 0 8px'}}>{lightbox.title}</h3>
              <p style={{color:'rgba(255,255,255,0.6)'}}>{lightbox.description}</p>
              <div style={{display:'flex',gap:10,marginTop:16}}>
                <button className="btn btn-secondary btn-sm">⬇ Download</button>
                <button className="btn btn-secondary btn-sm">🔗 Share</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .gallery-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: 200px; gap: 12px; }
        .gallery-item { position: relative; border-radius: 12px; overflow: hidden; cursor: pointer; transition: transform 300ms; }
        .gallery-item.large { grid-column: span 2; grid-row: span 2; }
        .gallery-item:hover { transform: scale(1.02); }
        .gallery-item:hover .gallery-overlay { opacity: 1; }
        .gallery-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 3rem; opacity: 0.3; }
        .gallery-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%); opacity: 0; transition: opacity 300ms; display: flex; flex-direction: column; justify-content: space-between; padding: 12px; }
        .gallery-type-badge { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; background: rgba(0,0,0,0.5); border-radius: 20px; font-family: var(--font-secondary); font-size: 0.7rem; font-weight: 700; color: var(--white); align-self: flex-end; }
        .gallery-info { }
        .lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(10px); }
        .lightbox-content { background: linear-gradient(145deg, rgba(74,9,11,0.95), rgba(20,2,3,0.98)); border: 1px solid rgba(212,175,55,0.3); border-radius: 20px; overflow: hidden; max-width: 700px; width: 100%; position: relative; }
        .lightbox-close { position: absolute; top: 16px; right: 16px; z-index: 1; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); border-radius: 50%; width: 36px; height: 36px; color: white; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .lightbox-img { height: 320px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .lightbox-meta { padding: 24px; }
        @media (max-width: 768px) { .gallery-grid { grid-template-columns: repeat(2, 1fr); } .gallery-item.large { grid-column: span 1; grid-row: span 1; } }
      `}</style>
    </div>
  )
}
