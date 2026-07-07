import React from 'react'
import { c, StatCard, SectionCard, Badge, Table } from './shared'

const stats = [
  { label: 'Total Teams', value: '12', icon: '🏆', change: '+2 this season', color: '#D4AF37' },
  { label: 'Registered Players', value: '284', icon: '👤', change: '+18 this week', color: '#3B82F6' },
  { label: 'Matches Played', value: '36', icon: '⚽', change: '13 remaining', color: '#22C55E' },
  { label: 'Ticket Sales', value: '₦4.2M', icon: '🎫', change: '+12% vs last week', color: '#F59E0B' },
  { label: 'Registered Users', value: '1,847', icon: '👥', change: '+134 this week', color: '#EC4899' },
  { label: 'Active Sponsors', value: '14', icon: '💼', change: '₦85M total value', color: '#8B5CF6' },
  { label: 'Volunteers', value: '63', icon: '🤝', change: '12 pending approval', color: '#14B8A6' },
  { label: 'News Articles', value: '48', icon: '📰', change: '6 drafts pending', color: '#F97316' },
]

const recentActivity = [
  { time: '2 min ago', event: 'Match result updated', detail: 'Edo Warriors 3–1 Oredo United', type: 'match' },
  { time: '15 min ago', event: 'New user registered', detail: 'chukwuemeka.obi@gmail.com', type: 'user' },
  { time: '1 hr ago', event: 'Sponsor confirmed', detail: 'GTBank — Gold Tier, ₦15M', type: 'finance' },
  { time: '2 hrs ago', event: 'Article published', detail: 'Quarter-Final Preview: Warriors vs Royals', type: 'content' },
  { time: '3 hrs ago', event: 'Volunteer approved', detail: 'Adaeze Okonkwo — Media Team', type: 'people' },
  { time: '5 hrs ago', event: 'Fixture updated', detail: 'Semi-Final venue changed to Ogbemudia Stadium', type: 'match' },
  { time: '1 day ago', event: 'Ticket batch sold', detail: 'VIP Stand — 40 tickets (₦200,000)', type: 'finance' },
  { time: '1 day ago', event: 'Gallery updated', detail: '24 new photos from Quarter-Final 1', type: 'content' },
]

const typeColor = { match: '#3B82F6', user: '#22C55E', finance: '#F59E0B', content: '#EC4899', people: '#8B5CF6' }

const topScorers = [
  { name: 'Chukwuemeka Obi', team: 'Edo Warriors', goals: 7, rating: 9.1 },
  { name: 'David Akhigbe', team: 'Delta Eagles', goals: 5, rating: 8.0 },
  { name: 'Felix Agbonlahor', team: 'Oredo United', goals: 4, rating: 7.9 },
  { name: 'Victor Ehigie', team: 'Oredo United', goals: 4, rating: 8.7 },
]

export default function DashboardAnalytics() {
  return (
    <div>
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...c.card, borderTop: `3px solid ${s.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <span style={{ fontSize: '1.8rem' }}>{s.icon}</span>
              <span style={{ ...c.badge, background: `${s.color}20`, color: s.color, border: `1px solid ${s.color}30` }}>↑</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: '0.7rem', color: s.color, fontWeight: 600 }}>{s.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 24 }}>
        {/* Revenue Chart */}
        <SectionCard title="📈 Monthly Revenue (₦)" action="">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 180, padding: '0 0 8px' }}>
            {[
              { month: 'Nov', val: 40 }, { month: 'Dec', val: 65 }, { month: 'Jan', val: 55 },
              { month: 'Feb', val: 80 }, { month: 'Mar', val: 100 }, { month: 'Apr', val: 72 },
            ].map(({ month, val }) => (
              <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
                  {Math.round(val * 0.9)}M
                </div>
                <div style={{
                  flex: 1, width: '100%', maxHeight: `${val}%`,
                  background: val === 100
                    ? 'linear-gradient(180deg, #D4AF37, #8C6A12)'
                    : 'linear-gradient(180deg, rgba(212,175,55,0.5), rgba(212,175,55,0.2))',
                  borderRadius: '4px 4px 0 0',
                  minHeight: 8, alignSelf: 'flex-end',
                  border: val === 100 ? '1px solid #D4AF37' : '1px solid rgba(212,175,55,0.2)',
                }} />
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{month}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Top Scorers */}
        <SectionCard title="🥇 Golden Boot Race" action="">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topScorers.map((p, i) => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                  background: i === 0 ? 'linear-gradient(135deg,#D4AF37,#8C6A12)' : i === 1 ? 'rgba(192,192,192,0.2)' : i === 2 ? 'rgba(158,91,40,0.2)' : 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 800, color: i === 0 ? '#000' : '#fff',
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>{p.name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{p.team}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Badge label={`${p.goals} ⚽`} color="#22C55E" />
                  <Badge label={`${p.rating}★`} color="#D4AF37" />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Recent Activity */}
      <SectionCard title="🕐 Recent Activity" action="">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {recentActivity.map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0',
              borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: typeColor[a.type] || '#D4AF37',
              }} />
              <div style={{ width: 80, fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', flexShrink: 0 }}>{a.time}</div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{a.event}</span>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', marginLeft: 8 }}>— {a.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
