import React, { useState } from 'react'
import { news } from '../data/mockData'

const categories = ['All', 'Tournament Updates', 'Match Reports', 'Press Releases', 'Statistics', 'Awards', 'Interviews']

const bgColors = ['linear-gradient(135deg,#4A090B,#8B0E12)','linear-gradient(135deg,#1a0a00,#5c3010)','linear-gradient(135deg,#00192a,#005a8e)','linear-gradient(135deg,#0a1a00,#2e5c0a)','linear-gradient(135deg,#1a001a,#5c0a5c)','linear-gradient(135deg,#001a1a,#0a5c5c)']

export default function News() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = news
    .filter(n => filter === 'All' || n.category === filter)
    .filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.summary.toLowerCase().includes(search.toLowerCase()))

  if (selected) {
    const article = news.find(n => n.id === selected)
    return (
      <div>
        <section className="page-hero">
          <div className="container">
            <button className="btn btn-secondary btn-sm" style={{marginBottom:16}} onClick={()=>setSelected(null)}>← Back to News</button>
            <div className="breadcrumb">Home <span>›</span> News <span>›</span> {article.category}</div>
            <span className="badge badge-gold" style={{marginBottom:12,display:'inline-block'}}>{article.category}</span>
            <h1 style={{fontSize:'clamp(1.5rem,3.5vw,2.8rem)'}}>{article.title}</h1>
            <div style={{display:'flex',gap:16,marginTop:12,flexWrap:'wrap'}}>
              <span style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.5)'}}>✍️ {article.author}</span>
              <span style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.5)'}}>📅 {article.date}</span>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container" style={{maxWidth:800}}>
            <div className="card" style={{height:300,background:'linear-gradient(135deg,var(--burgundy),var(--red-primary))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'5rem',marginBottom:32,borderRadius:20,border:'none'}}>⚽</div>
            <div style={{lineHeight:1.9,fontSize:'1.05rem',color:'rgba(255,255,255,0.85)'}}>
              <p style={{fontSize:'1.15rem',fontWeight:500,marginBottom:24}}>{article.summary}</p>
              <p style={{marginBottom:20}}>The StarCraft Cup 2027 continues to captivate audiences across Edo State and beyond, as the tournament maintains its impressive standard of football and organization. With each passing matchday, the excitement builds towards what promises to be an unforgettable final.</p>
              <p style={{marginBottom:20}}>Tournament Director, Chief James Osagie Edomwonyi, expressed his satisfaction with the progress: "We set out to create a world-class football experience right here in Oredo LGA, and the results have exceeded our expectations. The level of talent on display, the quality of organization, and the enthusiasm of the fans have all been exceptional."</p>
              <p style={{marginBottom:20}}>The Edo State Sports Commission has also weighed in, praising the tournament as a model for community sports development across Nigeria. With live television coverage, professional commentary, and social media reach extending well beyond Edo State, the StarCraft Cup is rapidly building a national profile.</p>
              <p>As the tournament moves into its knockout stages, anticipation is at fever pitch. Tickets for the quarter-finals have sold out within hours of release, a testament to the growing stature of the competition.</p>
            </div>
            <div style={{marginTop:40,padding:24,background:'rgba(212,175,55,0.06)',border:'1px solid rgba(212,175,55,0.15)',borderRadius:16}}>
              <div style={{fontFamily:'var(--font-secondary)',fontWeight:700,color:'var(--gold)',marginBottom:8}}>Tags</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {[article.category,'StarCraft Cup 2027','Football','Edo State','Oredo LGA'].map(t=><span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Home <span>›</span> News</div>
          <h1>News & <span className="text-gold">Updates</span></h1>
          <p>Latest tournament news, press releases, match reports, and interviews</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Search + Filters */}
          <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:32,alignItems:'center'}}>
            <input type="text" placeholder="🔍 Search news..." className="form-control" value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:320}} />
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {categories.map(c => <button key={c} className={`tag ${filter===c?'active':''}`} onClick={()=>setFilter(c)}>{c}</button>)}
            </div>
          </div>

          {/* Featured Article */}
          {filtered.length > 0 && (
            <div className="card featured-article" onClick={()=>setSelected(filtered[0].id)} style={{marginBottom:32,cursor:'pointer'}}>
              <div className="fa-img" style={{background:bgColors[0]}}>
                <span style={{fontSize:'5rem',opacity:0.4}}>⚽</span>
                <div className="fa-overlay">
                  <span className="badge badge-gold">{filtered[0].category}</span>
                  <div style={{marginTop:8,fontFamily:'var(--font-secondary)',fontSize:'0.8rem',color:'rgba(255,255,255,0.6)'}}>FEATURED STORY</div>
                </div>
              </div>
              <div className="fa-content">
                <span style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.4)'}}>📅 {filtered[0].date} • ✍️ {filtered[0].author}</span>
                <h2 style={{margin:'12px 0 16px',color:'var(--white)'}}>{filtered[0].title}</h2>
                <p style={{color:'rgba(255,255,255,0.7)',marginBottom:20}}>{filtered[0].summary}</p>
                <button className="btn btn-primary btn-sm">Read Full Story →</button>
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="grid-3">
            {filtered.slice(1).map((n,i) => (
              <div key={n.id} className="card news-card-2" onClick={()=>setSelected(n.id)}>
                <div style={{height:160,background:bgColors[(i+1)%bgColors.length],display:'flex',alignItems:'center',justifyContent:'center',position:'relative',borderRadius:'20px 20px 0 0'}}>
                  <span style={{fontSize:'3rem',opacity:0.3}}>⚽</span>
                  <span className="badge badge-gold" style={{position:'absolute',bottom:12,left:12,fontSize:'0.65rem'}}>{n.category}</span>
                </div>
                <div style={{padding:20}}>
                  <span style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.4)'}}>📅 {n.date} • ✍️ {n.author}</span>
                  <h4 style={{color:'var(--white)',margin:'8px 0 10px',lineHeight:1.4}}>{n.title}</h4>
                  <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.6)',marginBottom:16}}>{n.summary}</p>
                  <button className="btn btn-secondary btn-sm">Read More →</button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="card" style={{padding:60,textAlign:'center',color:'rgba(255,255,255,0.4)'}}>
              <div style={{fontSize:'3rem',marginBottom:16}}>📰</div>
              <h3>No articles found</h3>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .featured-article { display: grid; grid-template-columns: 1.2fr 1fr; overflow: hidden; }
        .fa-img { display: flex; align-items: center; justify-content: center; position: relative; min-height: 300px; }
        .fa-overlay { position: absolute; bottom: 20px; left: 20px; }
        .fa-content { padding: 40px; display: flex; flex-direction: column; justify-content: center; }
        .news-card-2 { cursor: pointer; }
        .news-card-2:hover h4 { color: var(--gold); }
        @media (max-width: 768px) { .featured-article { grid-template-columns: 1fr; } .fa-img { min-height: 200px; } .fa-content { padding: 24px; } }
      `}</style>
    </div>
  )
}
