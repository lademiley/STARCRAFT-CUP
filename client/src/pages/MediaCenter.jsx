import React from 'react'

export default function MediaCenter() {
  return (
    <div>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">Home <span>›</span> Media Center</div>
          <h1>Media <span className="text-gold">Center</span></h1>
          <p>Resources for press, journalists, and media organizations</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-3" style={{marginBottom:48}}>
            {[
              { icon:'📋', title:'Press Accreditation', desc:'Apply for press credentials to access restricted areas, mixed zones, and press conferences.', cta:'Apply Now', color:'var(--gold)' },
              { icon:'📦', title:'Media Kits', desc:'Download comprehensive media packs containing tournament facts, stats, and backgrounders.', cta:'Download', color:'#3b82f6' },
              { icon:'📸', title:'Press Photos', desc:'High-resolution official photography available for editorial use by accredited media.', cta:'Access Photos', color:'#10b981' },
            ].map(m => (
              <div key={m.title} className="card" style={{padding:32,textAlign:'center'}}>
                <div style={{fontSize:'3rem',marginBottom:16}}>{m.icon}</div>
                <h3 style={{color:'var(--gold)',marginBottom:12}}>{m.title}</h3>
                <p style={{color:'rgba(255,255,255,0.7)',marginBottom:24}}>{m.desc}</p>
                <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}}>{m.cta}</button>
              </div>
            ))}
          </div>

          <div className="grid-2">
            {/* Downloads */}
            <div>
              <h2 style={{marginBottom:24}}>Downloads</h2>
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {[
                  { file:'StarCraft Cup 2027 — Official Logo Pack', type:'ZIP', size:'12.4 MB', icon:'🗂️' },
                  { file:'Brand Guidelines & Style Guide', type:'PDF', size:'4.2 MB', icon:'📏' },
                  { file:'Tournament Fact Sheet', type:'PDF', size:'890 KB', icon:'📄' },
                  { file:'Media Kit 2027', type:'PDF', size:'18.7 MB', icon:'📦' },
                  { file:'Player Photo Pack — Group Stage', type:'ZIP', size:'234 MB', icon:'📸' },
                  { file:'Opening Ceremony Press Release', type:'PDF', size:'520 KB', icon:'📰' },
                  { file:'Tournament Infographic', type:'PNG', size:'3.1 MB', icon:'📊' },
                ].map(f => (
                  <div key={f.file} className="card" style={{padding:'14px 20px',display:'flex',alignItems:'center',gap:16}}>
                    <span style={{fontSize:'1.5rem'}}>{f.icon}</span>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:'0.9rem'}}>{f.file}</div>
                      <div style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.4)',marginTop:2}}>{f.type} • {f.size}</div>
                    </div>
                    <button className="btn btn-secondary btn-sm">⬇ Download</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Press Contacts + Accreditation */}
            <div>
              <h2 style={{marginBottom:24}}>Press Contacts</h2>
              <div style={{display:'flex',flexDirection:'column',gap:12,marginBottom:32}}>
                {[
                  { name:'Miss Blessing Osaghae', role:'Head of Media & Communications', email:'media@starcraftcup.ng', phone:'+234 811 234 5678' },
                  { name:'Mr. Tony Okoye', role:'Press Officer', email:'press@starcraftcup.ng', phone:'+234 812 345 6789' },
                  { name:'Mrs. Chidinma Eze', role:'Digital Media Manager', email:'digital@starcraftcup.ng', phone:'+234 813 456 7890' },
                ].map(c => (
                  <div key={c.name} className="card" style={{padding:20}}>
                    <h4 style={{color:'var(--white)',marginBottom:4}}>{c.name}</h4>
                    <span className="badge badge-gold" style={{marginBottom:10,fontSize:'0.6rem',display:'inline-block'}}>{c.role}</span>
                    <div style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.6)',display:'flex',flexDirection:'column',gap:4}}>
                      <span>✉️ {c.email}</span>
                      <span>📞 {c.phone}</span>
                    </div>
                  </div>
                ))}
              </div>

              <h2 style={{marginBottom:24}}>Accreditation Form</h2>
              <div className="card glass-panel" style={{padding:28}}>
                <div className="form-group"><label>Media Organization</label><input type="text" className="form-control" placeholder="Your publication/channel" /></div>
                <div className="form-group"><label>Full Name</label><input type="text" className="form-control" placeholder="Journalist name" /></div>
                <div className="form-group"><label>Email</label><input type="email" className="form-control" placeholder="email@media.com" /></div>
                <div className="form-group">
                  <label>Media Type</label>
                  <select className="form-control">
                    <option>Print Media</option>
                    <option>Television</option>
                    <option>Online/Digital</option>
                    <option>Radio</option>
                    <option>Photography</option>
                  </select>
                </div>
                <button className="btn btn-primary" style={{width:'100%',justifyContent:'center'}}>Submit Accreditation Request</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`.eyebrow{font-family:var(--font-secondary);font-size:.75rem;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:var(--gold);display:block;margin-bottom:12px}`}</style>
    </div>
  )
}
