import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

// Fallback copy mirrors the defaults seeded on the server so the site still
// renders correctly if the API call hasn't resolved yet (or is unreachable).
const FALLBACK = {
  home: {
    hero: {
      badge: '🏆 Official Tournament',
      titleLine1: 'STARCRAFT',
      titleLine2: 'CUP 2026',
      subtitle: 'Premier Youth Football Tournament • U17–U20 • Edo State, Nigeria',
      location: '📍 Edo State, Nigeria',
      venue: '🏟️ Ugbowo Campus Main Bowl',
      dates: '📅 Dec 1 – 20, 2026',
    },
    overview: {
      eyebrow: 'About the Tournament',
      heading: "Edo State's Premier U17–U20 Football Competition",
      paragraph1: "The StarCraft Cup 2026 — Premier Edition — is Edo State's most ambitious youth football tournament, bringing together 20 teams from all 18 LGAs, the tournament host, and the defending champion to compete for glory and a share of ₦10 million in prizes.",
      paragraph2: 'Played across two iconic Edo State venues — Ugbowo Campus Main Bowl and Ogbemudia Main Bowl — from December 1 to 20, 2026, the tournament is designed to unearth the next generation of Nigerian football stars at U17–U20 level.',
      features: ['20 LGA Teams', 'U17–U20 Age Group', '4 Groups of 5', '₦10M Prize Pool', 'Two World-class Venues', 'Dec 1–20, 2026'],
      infoCard: [
        { label: 'Edition', value: 'Premier Edition — 2026' },
        { label: 'Location', value: 'Edo State, Nigeria' },
        { label: 'Age Group', value: 'U17 – U20' },
        { label: 'Group Venue', value: 'Ugbowo Campus Main Bowl' },
        { label: 'Final Venue', value: 'Ogbemudia Main Bowl' },
        { label: 'Format', value: '4 Groups of 5 → Knockout' },
        { label: 'Teams', value: '20 (18 LGAs + Host + Champion)' },
        { label: 'Dates', value: 'Dec 1 – 20, 2026' },
      ],
    },
    hostCity: {
      eyebrow: 'Venue',
      heading: 'Host State: Edo State, Nigeria',
      subheading: 'A land of culture, history, and deep football passion',
      cards: [
        { icon: '🏛️', title: 'Historical Legacy', desc: 'Edo State is home to the ancient Benin Kingdom, one of the oldest and most sophisticated civilisations in Africa.' },
        { icon: '🏟️', title: 'Two World-Class Venues', desc: 'Ugbowo Campus Main Bowl (10,000) hosts group/knockout matches; Ogbemudia Main Bowl (20,000) crowns the champion.' },
        { icon: '⚽', title: 'Football Culture', desc: 'Edo State has produced Super Eagles legends including John Obi Mikel, Victor Moses, and Osaze Odemwingie.' },
        { icon: '🧒', title: 'U17–U20 Showcase', desc: "The Premier Edition gives Edo's most gifted youth players (U17–U20) their biggest competitive stage yet." },
        { icon: '🏙️', title: 'Modern Infrastructure', desc: 'Excellent road networks, hotels, and facilities across all 18 LGAs making travel and logistics seamless.' },
        { icon: '🌿', title: 'All 18 LGAs Represented', desc: 'Every Local Government Area in Edo State sends one team — making this a true celebration of the whole state.' },
      ],
    },
    testimonials: {
      eyebrow: 'Voices',
      heading: 'What People Are Saying',
      items: [
        { quote: 'This is the best-organized grassroots football tournament I have ever attended. The level of professionalism is outstanding.', name: 'Chief Osaro Idehen', role: 'Football Fan, Benin City' },
        { quote: 'The StarCraft Cup has given our boys a platform to shine. This tournament can change lives and produce the next Super Eagles stars.', name: 'Coach Victor Ihejirika', role: 'Head Coach, Oredo United' },
        { quote: "As a sponsor, I'm proud to be associated with an event that promotes youth development and community pride in Edo State.", name: 'Mrs. Grace Akhimienro', role: 'Corporate Sponsor' },
      ],
    },
    newsletter: {
      heading: 'Stay in the Loop',
      text: 'Get match alerts, team news, and exclusive tournament updates delivered to your inbox.',
    },
  },
  news: {
    hero: { title: 'News & Updates', subtitle: 'Latest tournament news, press releases, match reports, and interviews' },
    categories: ['Tournament Updates', 'Match Reports', 'Press Releases', 'Statistics', 'Awards', 'Interviews'],
  },
  sponsors: {
    hero: { title: 'Our Sponsors', subtitle: 'The partners who make StarCraft Cup 2027 possible' },
    benefits: [
      { icon: '👥', image: '/sponsors/benefit-reach.png', title: 'Massive Reach', desc: 'Direct access to 47,500+ match attendees and 200,000+ social media followers across Nigeria.' },
      { icon: '📺', image: '/sponsors/benefit-broadcast.png', title: 'Broadcast Coverage', desc: 'Brand visibility on Supersport, Channels TV, and Silverbird Television throughout the tournament.' },
      { icon: '🏆', image: '/sponsors/benefit-trophy.png', title: 'Brand Association', desc: "Associate your brand with excellence, youth development, and Nigeria's brightest football talent." },
      { icon: '🤝', image: '/sponsors/benefit-community.png', title: 'Community Goodwill', desc: 'Build deep community goodwill by investing in the development of sport in Edo State.' },
      { icon: '📱', image: '/sponsors/benefit-digital.png', title: 'Digital Exposure', desc: 'Prominent placement on website, social media, email campaigns, and official tournament app.' },
      { icon: '🎖️', image: '/sponsors/benefit-exclusive.png', title: 'Exclusive Access', desc: 'VIP match tickets, access to players and coaches, and exclusive sponsor events.' },
    ],
    packages: [
      { tier: 'Platinum', price: '₦5,000,000', color: '#D4AF37', perks: 'Main shirt logo\nTV broadcast mentions\n10 VIP tickets per match\nFull digital package\nExclusive sponsor event' },
      { tier: 'Gold', price: '₦2,000,000', color: '#FFD700', perks: 'Shirt sleeve logo\nMatch programme full page\n6 VIP tickets per match\nSocial media features\nSponsor networking' },
      { tier: 'Silver', price: '₦750,000', color: '#c0c0c0', perks: 'Perimeter board advertising\nMatch programme half page\n4 tickets per match\nWebsite logo placement\nNewsletter mention' },
    ],
  },
  volunteers: {
    hero: { title: 'Be a Volunteer', subtitle: 'Join our team of passionate volunteers and be part of football history' },
    benefits: [
      { icon: '🏆', title: 'Be Part of History', desc: "Help organize Edo State's greatest football tournament." },
      { icon: '🎓', title: 'Learn & Grow', desc: 'Gain event management skills and sports industry experience.' },
      { icon: '🤝', title: 'Network', desc: 'Connect with football professionals, media, and corporate sponsors.' },
      { icon: '🎁', title: 'Exclusive Benefits', desc: 'Free tournament merchandise, meals, and access to all matches.' },
      { icon: '📜', title: 'Certificate', desc: 'Receive an official volunteer certificate and reference letter.' },
      { icon: '⚽', title: 'Football Access', desc: 'Behind-the-scenes access including training sessions and player areas.' },
      { icon: '👥', title: 'Community', desc: 'Join a family of passionate football lovers from across Edo State.' },
      { icon: '💼', title: 'Career Boost', desc: 'Build your CV with a prestigious sports event management credential.' },
    ],
    roles: [
      { role: 'Match Day Steward', slots: '40', desc: 'Manage crowd flow, assist fans with seating, and ensure a safe match environment.', requirements: '18+, physically fit, team player' },
      { role: 'Media & Photography', slots: '12', desc: 'Assist the media team with photography, video, and social media content creation.', requirements: 'Photography experience preferred' },
      { role: 'Registration Desk', slots: '20', desc: 'Manage team and fan registration, handle ticketing, and provide information.', requirements: 'Customer service skills, organized' },
      { role: 'Medical Support', slots: '8', desc: 'Assist medical personnel with first aid, logistics, and player welfare.', requirements: 'First aid certification preferred' },
      { role: 'Transportation Coordinator', slots: '15', desc: 'Coordinate team transport, logistics, and driver management across venues.', requirements: "Valid driver's license, local knowledge" },
      { role: 'Hospitality & VIP Host', slots: '10', desc: 'Manage VIP areas, sponsor hospitality, and ensure top-tier guest experience.', requirements: 'Presentable, fluent in English' },
      { role: 'Technical & IT Support', slots: '6', desc: 'Support live streaming, scoring systems, and technical equipment setup.', requirements: 'IT skills required' },
      { role: 'Community Ambassador', slots: '25', desc: 'Represent the tournament in communities, promote matches, and engage fans.', requirements: 'Outgoing personality, social media savvy' },
    ],
    training: [
      { date: 'March 10, 2027', session: 'Orientation & Welcome Day', location: 'Oredo LGA Civic Centre' },
      { date: 'March 12, 2027', session: 'Role-Specific Training', location: 'University of Benin' },
      { date: 'March 14, 2027', session: 'Venue Walkthrough & Simulation', location: 'Samuel Ogbemudia Stadium' },
      { date: 'March 16, 2027', session: 'First Aid & Emergency Procedures', location: 'Oredo LGA Health Centre' },
      { date: 'March 18, 2027', session: 'Final Briefing & Kit Distribution', location: 'University of Benin Bowl' },
    ],
  },
}

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(FALLBACK)
  const [loading, setLoading] = useState(true)

  const loadPage = useCallback(async (page) => {
    try {
      const res = await fetch(`/api/content/${page}`, { credentials: 'include' })
      if (!res.ok) return
      const data = await res.json()
      setContent(prev => ({ ...prev, [page]: data.content }))
    } catch {
      // Keep fallback copy if the API is unreachable
    }
  }, [])

  useEffect(() => {
    loadPage('home').finally(() => setLoading(false))
    // Pre-load other editable pages so editors open instantly
    loadPage('about')
    loadPage('tournament')
    loadPage('contact')
    loadPage('mediacenter')
    loadPage('news')
    loadPage('sponsors')
    loadPage('volunteers')
  }, [loadPage])

  // Admin dashboard calls this after a successful save so it can push the
  // freshly-saved copy into context without a full reload.
  const setPageContent = useCallback((page, data) => {
    setContent(prev => ({ ...prev, [page]: data }))
  }, [])

  return (
    <ContentContext.Provider value={{ content, loading, reload: loadPage, setPageContent }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent(page) {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within a ContentProvider')
  return page ? ctx.content[page] : ctx.content
}

export function useContentAdmin() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContentAdmin must be used within a ContentProvider')
  return ctx
}
