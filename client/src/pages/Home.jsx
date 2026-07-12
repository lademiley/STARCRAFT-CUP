import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { teams, players, fixtures, news, sponsors, tournamentStats } from '../data/mockData'
import { useContent } from '../context/ContentContext'

// Countdown Timer
function Countdown() {
  const target = new Date('2026-12-01T10:00:00')
  const [time, setTime] = useState({})
  useEffect(() => {
    const calc = () => {
      const diff = target - new Date()
      if (diff <= 0) return setTime({ d:0,h:0,m:0,s:0 })
      setTime({
        d: Math.floor(diff/86400000),
        h: Math.floor((diff%86400000)/3600000),
        m: Math.floor((diff%3600000)/60000),
        s: Math.floor((diff%60000)/1000),
      })
    }
    calc(); const t = setInterval(calc,1000); return ()=>clearInterval(t)
  }, [])
  return (
    <div className="countdown">
      {[['Days','d'],['Hours','h'],['Mins','m'],['Secs','s']].map(([l,k]) => (
        <div key={k} className="countdown-unit">
          <span className="countdown-num">{String(time[k]||0).padStart(2,'0')}</span>
          <span className="countdown-label">{l}</span>
        </div>
      ))}
    </div>
  )
}

// Particle Canvas
function Particles() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = canvas.width = canvas.offsetWidth
    let H = canvas.height = canvas.offsetHeight
    const pts = Array.from({length:60},()=>({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-.5)*.4, vy: (Math.random()-.5)*.4,
      size: Math.random()*2+0.5,
      alpha: Math.random()*0.6+0.2
    }))
    let raf
    const draw = () => {
      ctx.clearRect(0,0,W,H)
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if(p.x<0||p.x>W) p.vx*=-1
        if(p.y<0||p.y>H) p.vy*=-1
        ctx.beginPath()
        ctx.arc(p.x,p.y,p.size,0,Math.PI*2)
        ctx.fillStyle = `rgba(212,175,55,${p.alpha})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    const onResize = () => { W=canvas.width=canvas.offsetWidth; H=canvas.height=canvas.offsetHeight }
    window.addEventListener('resize',onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize',onResize) }
  }, [])
  return <canvas ref={canvasRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}} />
}

export default function Home() {
  const home = useContent('home')
  const { hero, overview, hostCity, testimonials, newsletter } = home
  const [activeTab, setActiveTab] = useState('upcoming')
  const upcoming = fixtures.filter(f=>f.status==='upcoming').slice(0,3)
  const completed = fixtures.filter(f=>f.status==='completed').slice(0,3)
  const displayed = activeTab === 'upcoming' ? upcoming : completed

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <Particles />
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-badge"><span className="badge badge-gold">{hero.badge}</span></div>
          <h1 className="hero-title">
            <span className="text-shimmer">{hero.titleLine1}</span>
            <br /><span style={{color:'#fff'}}>{hero.titleLine2}</span>
          </h1>
          <p className="hero-sub">{hero.subtitle}</p>
          <div className="hero-info">
            <div className="hero-info-item"><span>{hero.location}</span></div>
            <div className="hero-divider" />
            <div className="hero-info-item"><span>{hero.venue}</span></div>
            <div className="hero-divider" />
            <div className="hero-info-item"><span>{hero.dates}</span></div>
          </div>
          <Countdown />
          <div className="hero-ctas">
            <Link to="/register" className="btn btn-primary btn-lg">Register Team 🚀</Link>
            <Link to="/live-scores" className="btn btn-secondary btn-lg">
              <span className="live-dot"></span> Watch Live
            </Link>
            <Link to="/fixtures" className="btn btn-red btn-lg">View Fixtures</Link>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Scroll Down</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* SPONSOR TICKER */}
      {(() => {
        const items = [
          { tier: 'PREMIUM TIER',    names: sponsors.platinum.map(s=>s.name) },
          { tier: 'SUPPORTING TIER', names: [...sponsors.gold, ...sponsors.silver].map(s=>s.name) },
        ].flatMap(({ tier, names }) => names.map(name => ({ tier, name })))
        const doubled = [...items, ...items]
        return (
          <div className="sponsor-ticker">
            <div className="sponsor-ticker-arrow">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="#D4AF37" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="sponsor-ticker-track">
              {doubled.map(({ tier, name }, i) => (
                <span key={i} className="sponsor-ticker-item">
                  <span className={`sponsor-ticker-tier ${tier === 'PREMIUM TIER' ? 'tier-premium' : 'tier-supporting'}`}>{tier}</span>
                  <span className="sponsor-ticker-name">{name}</span>
                  <span className="sponsor-ticker-sep">✦</span>
                </span>
              ))}
            </div>
          </div>
        )
      })()}

      {/* STATS BAR */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-bar-grid">
            {[
              { label: 'Teams', value: tournamentStats.totalTeams, icon: '👕' },
              { label: 'Matches', value: tournamentStats.totalMatches, icon: '⚽' },
              { label: 'Goals Scored', value: tournamentStats.totalGoals, icon: '🥅' },
              { label: 'Fan Attendance', value: tournamentStats.totalAttendance, icon: '👥' },
              { label: 'Prize Pool', value: '₦10M+', icon: '🏆' },
              { label: 'Age Group', value: 'U17–U20', icon: '🧒' },
            ].map(s => (
              <div key={s.label} className="stat-item">
                <span className="stat-icon">{s.icon}</span>
                <span className="stat-number" style={{fontSize:'2rem'}}>{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOURNAMENT OVERVIEW */}
      <section className="section">
        <div className="container">
          <div className="overview-grid-3col">
            {/* Left — text */}
            <div className="overview-text">
              <span className="eyebrow">{overview.eyebrow}</span>
              <h2>{overview.heading}</h2>
              <p style={{marginBottom:16}}>{overview.paragraph1}</p>
              <p style={{marginBottom:24}}>{overview.paragraph2}</p>
              <div className="overview-features">
                {overview.features.map(f => (
                  <div key={f} className="feature-chip">✦ {f}</div>
                ))}
              </div>
              <Link to="/about" className="btn btn-primary" style={{marginTop:28}}>Learn More →</Link>
            </div>

            {/* Centre — trophy */}
            <div className="overview-trophy-col">
              <div className="overview-trophy-glow" />
              <img
                src="/trophy-home.png"
                alt="StarCraft Cup Trophy"
                className="overview-trophy-img"
              />
              <div className="overview-trophy-label">
                <span style={{fontFamily:'var(--font-heading)',fontSize:'1rem',letterSpacing:'3px',color:'var(--gold)'}}>THE PRIZE</span>
                <span style={{fontFamily:'var(--font-secondary)',fontSize:'0.68rem',letterSpacing:'2px',color:'rgba(255,255,255,0.45)',marginTop:4}}>STARCRAFT CUP 2026</span>
              </div>
            </div>

            {/* Right — info card */}
            <div className="overview-card-wrap">
              <div className="card glass-panel" style={{padding:0,overflow:'visible'}}>
                <div style={{padding:'28px 28px 0',borderBottom:'1px solid rgba(212,175,55,0.15)',paddingBottom:20}}>
                  <h4 style={{color:'var(--gold)',marginBottom:16,fontFamily:'var(--font-heading)',letterSpacing:'1px'}}>🏆 Tournament Info</h4>
                  {overview.infoCard.map(({label,value}) => (
                    <div key={label} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
                      <span style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.5)'}}>{label}</span>
                      <span style={{fontSize:'0.85rem',fontWeight:600,color:'var(--white)'}}>{value}</span>
                    </div>
                  ))}
                </div>
                <div style={{padding:20}}>
                  <Link to="/tournament" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}}>Full Tournament Details</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE SCORES + FIXTURES */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Matches</span>
            <h2>Fixtures & Results</h2>
            <div className="divider" />
          </div>
          <div className="fixture-tabs">
            {['upcoming','completed'].map(t => (
              <button key={t} className={`tab-btn ${activeTab===t?'active':''}`} onClick={()=>setActiveTab(t)}>
                {t === 'upcoming' ? '📅 Upcoming' : '✅ Results'}
              </button>
            ))}
          </div>
          <div className="fixtures-list">
            {displayed.map(f => (
              <div key={f.id} className="fixture-card card">
                <div className="fixture-header">
                  <span className="badge badge-gold">{f.round || 'Group Stage'}</span>
                  <span style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.5)'}}>
                    📅 {f.date} • {f.time}
                  </span>
                </div>
                <div className="fixture-teams">
                  <div className="fixture-team">
                    <span className="team-logo-sm">{teams.find(t=>t.name===f.homeTeam)?.logo||'⚽'}</span>
                    <span className="team-name">{f.homeTeam}</span>
                  </div>
                  <div className="fixture-score">
                    {f.status === 'completed'
                      ? <span className="score">{f.homeScore} – {f.awayScore}</span>
                      : <span className="vs">VS</span>}
                  </div>
                  <div className="fixture-team" style={{flexDirection:'row-reverse'}}>
                    <span className="team-logo-sm">{teams.find(t=>t.name===f.awayTeam)?.logo||'⚽'}</span>
                    <span className="team-name">{f.awayTeam}</span>
                  </div>
                </div>
                <div className="fixture-footer">
                  <span>🏟️ {f.venue}</span>
                  {f.status === 'upcoming' && <Link to="/fixtures" className="btn btn-secondary btn-sm">Preview</Link>}
                  {f.status === 'completed' && <Link to="/fixtures" className="btn btn-secondary btn-sm">Report</Link>}
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:32}}>
            <Link to="/fixtures" className="btn btn-secondary">View All Fixtures →</Link>
          </div>
        </div>
      </section>

      {/* FEATURED PLAYERS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Star Players</span>
            <h2>Featured Players</h2>
            <p>Meet the tournament's top performers and crowd favourites</p>
            <div className="divider" />
          </div>
          <div className="grid-4">
            {players.slice(0,8).map(p => (
              <div key={p.id} className="card player-card">
                <div className="player-card-top">
                  <div className="player-avatar">{p.nationality}</div>
                  <div className="player-jersey">#{p.jersey}</div>
                </div>
                <div className="player-card-body">
                  <div className="badge badge-gold" style={{marginBottom:8,fontSize:'0.65rem'}}>{p.position}</div>
                  <h4 style={{color:'var(--white)',marginBottom:4,lineHeight:1.2}}>{p.name}</h4>
                  <p style={{fontSize:'0.8rem',color:'rgba(255,255,255,0.5)',marginBottom:12}}>{p.team}</p>
                  <div className="player-stats">
                    <div className="pstat"><span className="pstat-val">{p.goals}</span><span className="pstat-label">Goals</span></div>
                    <div className="pstat"><span className="pstat-val">{p.assists}</span><span className="pstat-label">Assists</span></div>
                    <div className="pstat"><span className="pstat-val">{p.rating}</span><span className="pstat-label">Rating</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:32}}>
            <Link to="/players" className="btn btn-primary">All Players →</Link>
          </div>
        </div>
      </section>

      {/* LEAGUE TABLE PREVIEW */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Standings</span>
            <h2>League Table — Group A</h2>
            <div className="divider" />
          </div>
          <div className="table-wrapper card">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th><th>Form</th>
                </tr>
              </thead>
              <tbody>
                {teams.filter(t=>t.group==='A').sort((a,b)=>b.points-a.points).map((t,i) => (
                  <tr key={t.id} className={i<2?'qualify-row':''}>
                    <td><strong style={{color: i<2?'var(--gold)':'inherit'}}>{i+1}</strong></td>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <span style={{fontSize:'1.2rem'}}>{t.logo}</span>
                        <span style={{fontWeight:600}}>{t.name}</span>
                      </div>
                    </td>
                    <td>{t.played}</td><td>{t.won}</td><td>{t.draw}</td><td>{t.lost}</td>
                    <td>{t.gf}</td><td>{t.ga}</td>
                    <td style={{color:t.gd>0?'#2ecc71':t.gd<0?'#ef4444':'inherit'}}>{t.gd>0?'+':''}{t.gd}</td>
                    <td><strong style={{color:'var(--gold)',fontSize:'1rem'}}>{t.points}</strong></td>
                    <td>
                      <div style={{display:'flex',gap:3}}>
                        {t.form.map((r,j)=>(
                          <span key={j} style={{width:20,height:20,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.6rem',fontWeight:700,background:r==='W'?'#2ecc71':r==='D'?'#f59e0b':'#ef4444',color:'#fff'}}>{r}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{textAlign:'center',marginTop:24}}>
            <Link to="/league-table" className="btn btn-secondary">Full Standings →</Link>
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Latest</span>
            <h2>News & Updates</h2>
            <div className="divider" />
          </div>
          <div className="grid-3">
            {news.slice(0,3).map(n => (
              <div key={n.id} className="card news-card">
                <div className="news-img">
                  {n.image
                    ? <img src={n.image} alt={n.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
                    : <div className="news-img-placeholder">⚽</div>
                  }
                  <span className="badge badge-gold news-cat">{n.category}</span>
                </div>
                <div className="news-body">
                  <span style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.4)',fontFamily:'var(--font-secondary)'}}>{n.date} • {n.author}</span>
                  <h4 style={{color:'var(--white)',margin:'8px 0',lineHeight:1.4}}>{n.title}</h4>
                  <p style={{fontSize:'0.85rem',color:'rgba(255,255,255,0.6)',marginBottom:16}}>{n.summary}</p>
                  <Link to="/news" className="btn btn-secondary btn-sm">Read More →</Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:32}}>
            <Link to="/news" className="btn btn-primary">All News →</Link>
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Partners</span>
            <h2>Our Sponsors</h2>
            <div className="divider" />
          </div>
          <div style={{textAlign:'center',marginBottom:16}}>
            <span className="badge badge-gold" style={{marginBottom:20,display:'inline-block',padding:'6px 20px',fontSize:'0.7rem'}}>PLATINUM SPONSORS</span>
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:32,flexWrap:'wrap',marginBottom:40}}>
            {sponsors.platinum.map(s => (
              <div key={s.name} className="sponsor-logo-card card">
                <span style={{fontSize:'2.5rem'}}>{s.logo}</span>
                <span style={{fontFamily:'var(--font-secondary)',fontWeight:700,fontSize:'0.9rem',color:'var(--gold)'}}>{s.name}</span>
                <span style={{fontSize:'0.75rem',color:'rgba(255,255,255,0.5)'}}>{s.description}</span>
              </div>
            ))}
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:20,flexWrap:'wrap'}}>
            {[...sponsors.gold,...sponsors.silver].map(s => (
              <div key={s.name} className="sponsor-logo-sm">
                <span style={{fontSize:'1.5rem'}}>{s.logo}</span>
                <span style={{fontSize:'0.8rem',fontWeight:600}}>{s.name}</span>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:32}}>
            <Link to="/sponsors" className="btn btn-secondary">Become a Sponsor →</Link>
          </div>
        </div>
      </section>

      {/* HOST CITY */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">{hostCity.eyebrow}</span>
            <h2>{hostCity.heading}</h2>
            <p>{hostCity.subheading}</p>
            <div className="divider" />
          </div>
          <div className="grid-3">
            {hostCity.cards.map(item => (
              <div key={item.title} className="card" style={{padding:28}}>
                <div style={{fontSize:'2.5rem',marginBottom:14}}>{item.icon}</div>
                <h4 style={{color:'var(--gold)',marginBottom:8}}>{item.title}</h4>
                <p style={{fontSize:'0.9rem',color:'rgba(255,255,255,0.65)'}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">{testimonials.eyebrow}</span>
            <h2>{testimonials.heading}</h2>
            <div className="divider" />
          </div>
          <div className="grid-3">
            {testimonials.items.map(t => (
              <div key={t.name} className="card glass-panel" style={{padding:28}}>
                <div style={{fontSize:'2rem',color:'var(--gold)',marginBottom:12,fontFamily:'Georgia'}}>❝</div>
                <p style={{fontSize:'0.95rem',fontStyle:'italic',lineHeight:1.7,color:'rgba(255,255,255,0.85)',marginBottom:20}}>{t.quote}</p>
                <div style={{borderTop:'1px solid rgba(212,175,55,0.2)',paddingTop:16}}>
                  <div style={{fontWeight:700,color:'var(--white)',fontSize:'0.9rem'}}>{t.name}</div>
                  <div style={{fontSize:'0.8rem',color:'var(--gold)'}}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="section newsletter-section">
        <div className="container">
          <div className="newsletter-box card glass-panel">
            <div style={{textAlign:'center',maxWidth:560,margin:'0 auto'}}>
              <span style={{fontSize:'3rem'}}>📧</span>
              <h2 style={{margin:'16px 0 8px'}}>{newsletter.heading}</h2>
              <p style={{marginBottom:32}}>{newsletter.text}</p>
              <div style={{display:'flex',gap:12,flexWrap:'wrap',justifyContent:'center'}}>
                <input type="email" placeholder="Enter your email address" className="form-control" style={{flex:1,minWidth:250,maxWidth:380}} />
                <button className="btn btn-primary">Subscribe Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home { overflow-x: hidden; }
        .hero {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          background: linear-gradient(160deg, #0d0102 0%, #4A090B 40%, #8B0E12 70%, #3a0608 100%);
        }
        .hero-bg {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 60% 50%, rgba(212,175,55,0.08) 0%, transparent 70%);
        }
        .hero-content {
          position: relative; z-index: 2; text-align: center;
          padding: 120px 24px 80px;
          display: flex; flex-direction: column; align-items: center; gap: 20px;
        }
        .hero-badge { animation: fadeUp 0.5s ease; }
        .hero-title { animation: fadeUp 0.6s ease; text-shadow: 0 4px 30px rgba(0,0,0,0.5); letter-spacing: 4px; }
        .hero-sub {
          font-family: var(--font-secondary); font-size: 1rem; font-weight: 600;
          letter-spacing: 4px; text-transform: uppercase; color: rgba(255,255,255,0.6);
          animation: fadeUp 0.7s ease;
        }
        .hero-info {
          display: flex; align-items: center; gap: 20px; flex-wrap: wrap; justify-content: center;
          animation: fadeUp 0.8s ease;
        }
        .hero-info-item { display: flex; align-items: center; gap: 8px; font-family: var(--font-secondary); font-size: 0.85rem; color: rgba(255,255,255,0.75); }
        .hero-divider { width: 1px; height: 20px; background: rgba(212,175,55,0.3); }
        .countdown { display: flex; gap: 16px; animation: fadeUp 0.9s ease; }
        .countdown-unit {
          display: flex; flex-direction: column; align-items: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(212,175,55,0.3);
          border-radius: 12px; padding: 16px 20px;
          min-width: 80px; backdrop-filter: blur(10px);
        }
        .countdown-num { font-family: var(--font-heading); font-size: 2.4rem; font-weight: 900; color: var(--gold); line-height: 1; }
        .countdown-label { font-family: var(--font-secondary); font-size: 0.65rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-top: 6px; }
        .hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; animation: fadeUp 1s ease; }
        .hero-scroll { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); text-align: center; color: rgba(255,255,255,0.4); font-family: var(--font-secondary); font-size: 0.7rem; letter-spacing: 2px; }
        .scroll-arrow { animation: bounce 1.5s infinite; margin-top: 6px; }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
        .stats-bar { background: linear-gradient(135deg, var(--burgundy), #600b0e); border-top: 1px solid rgba(212,175,55,0.15); border-bottom: 1px solid rgba(212,175,55,0.15); padding: 32px 0; }
        .stats-bar-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 24px; }
        .stat-item { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }
        .stat-icon { font-size: 1.6rem; }
        .stat-label { font-family: var(--font-secondary); font-size: 0.75rem; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.5); }
        .overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .overview-grid-3col { display: grid; grid-template-columns: 1fr 280px 1fr; gap: 48px; align-items: center; }
        .overview-trophy-col { display: flex; flex-direction: column; align-items: center; gap: 0; position: relative; }
        .overview-trophy-glow {
          position: absolute; top: 10%; left: 50%; transform: translateX(-50%);
          width: 260px; height: 260px; border-radius: 50%;
          background: radial-gradient(circle, rgba(212,175,55,0.22) 0%, transparent 70%);
          pointer-events: none; filter: blur(24px);
        }
        .overview-trophy-img {
          width: 100%; max-width: 260px; height: auto;
          position: relative; z-index: 1;
          filter: drop-shadow(0 12px 48px rgba(212,175,55,0.4));
          animation: trophyFloat 4s ease-in-out infinite;
        }
        @keyframes trophyFloat {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-12px); }
        }
        .overview-trophy-label {
          display: flex; flex-direction: column; align-items: center;
          margin-top: 16px; gap: 2px; z-index: 1;
        }
        .eyebrow { font-family: var(--font-secondary); font-size: 0.75rem; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: var(--gold); display: block; margin-bottom: 12px; }
        .overview-text h2 { margin-bottom: 16px; }
        .overview-features { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
        .feature-chip { padding: 6px 14px; background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.2); border-radius: 20px; font-size: 0.8rem; font-family: var(--font-secondary); font-weight: 600; color: rgba(255,255,255,0.8); }
        .fixture-tabs { display: flex; gap: 12px; margin-bottom: 28px; justify-content: center; }
        .tab-btn { padding: 10px 24px; border-radius: 30px; border: 2px solid rgba(212,175,55,0.25); background: transparent; color: rgba(255,255,255,0.6); font-family: var(--font-secondary); font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 300ms; }
        .tab-btn.active, .tab-btn:hover { border-color: var(--gold); background: rgba(212,175,55,0.1); color: var(--gold); }
        .fixtures-list { display: flex; flex-direction: column; gap: 16px; }
        .fixture-card { padding: 20px 24px; }
        .fixture-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .fixture-teams { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 16px; margin-bottom: 16px; }
        .fixture-team { display: flex; align-items: center; gap: 12px; }
        .team-logo-sm { font-size: 1.8rem; }
        .team-name { font-family: var(--font-secondary); font-weight: 700; font-size: 0.95rem; }
        .fixture-score { text-align: center; }
        .score { font-family: var(--font-heading); font-size: 1.8rem; font-weight: 900; color: var(--gold); }
        .vs { font-family: var(--font-heading); font-size: 1rem; color: rgba(255,255,255,0.3); letter-spacing: 2px; }
        .fixture-footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: rgba(255,255,255,0.5); padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
        .player-card { cursor: pointer; }
        .player-card-top { height: 100px; background: linear-gradient(135deg, var(--burgundy), var(--red-primary)); display: flex; align-items: center; justify-content: center; position: relative; }
        .player-avatar { font-size: 2.5rem; }
        .player-jersey { position: absolute; top: 8px; right: 12px; font-family: var(--font-heading); font-size: 1.2rem; font-weight: 900; color: rgba(255,255,255,0.3); }
        .player-card-body { padding: 16px; }
        .player-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.08); }
        .pstat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .pstat-val { font-family: var(--font-heading); font-size: 1.2rem; font-weight: 700; color: var(--gold); }
        .pstat-label { font-family: var(--font-secondary); font-size: 0.6rem; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: rgba(255,255,255,0.4); }
        .qualify-row { background: rgba(212,175,55,0.04); }
        .news-card { display: flex; flex-direction: column; }
        .news-img { position: relative; height: 160px; background: linear-gradient(135deg, var(--burgundy), var(--red-primary)); display: flex; align-items: center; justify-content: center; }
        .news-img-placeholder { font-size: 3rem; opacity: 0.4; }
        .news-cat { position: absolute; bottom: 12px; left: 12px; }
        .news-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
        .sponsor-logo-card { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 24px 32px; min-width: 200px; text-align: center; }
        .sponsor-logo-sm { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 16px 20px; background: rgba(255,255,255,0.04); border: 1px solid rgba(212,175,55,0.1); border-radius: 12px; font-family: var(--font-secondary); font-size: 0.8rem; color: rgba(255,255,255,0.7); min-width: 120px; text-align: center; }
        .newsletter-box { padding: 60px 40px; }
        @media (max-width: 768px) {
          .stats-bar-grid { grid-template-columns: repeat(2, 1fr); }
          .overview-grid { grid-template-columns: 1fr; }
          .overview-grid-3col { grid-template-columns: 1fr; }
          .overview-trophy-img { max-width: 200px; }
          .countdown { gap: 10px; }
          .countdown-unit { min-width: 65px; padding: 12px 14px; }
          .countdown-num { font-size: 1.8rem; }
        }
        @media (max-width: 480px) {
          .stats-bar-grid { grid-template-columns: repeat(2, 1fr); }
          .hero-ctas { flex-direction: column; width: 100%; max-width: 320px; }
          .hero-ctas .btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  )
}
