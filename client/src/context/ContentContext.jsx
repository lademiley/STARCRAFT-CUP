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
