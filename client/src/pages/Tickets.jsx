import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { fixtures } from '../data/mockData'

const upcomingFixtures = fixtures.filter(f => f.status === 'upcoming')

const TICKET_TIERS = [
  {
    id: 'regular',
    name: 'Regular Stand',
    icon: '🎫',
    color: '#fff',
    prices: { 'Quarter-Final': 1000, 'Semi-Final': 2000, 'Third Place Play-Off': 1500, 'Grand Final': 3000, 'Closing Exhibition': 500 },
    defaultPrice: 1000,
    perks: ['General admission', 'Match programme', 'Souvenir wristband'],
  },
  {
    id: 'vip',
    name: 'VIP Stand',
    icon: '⭐',
    color: '#D4AF37',
    prices: { 'Quarter-Final': 3000, 'Semi-Final': 5000, 'Third Place Play-Off': 4000, 'Grand Final': 8000, 'Closing Exhibition': 2000 },
    defaultPrice: 3000,
    perks: ['Reserved padded seating', 'Complimentary refreshments', 'Match programme', 'VIP lounge access'],
    popular: true,
  },
  {
    id: 'vvip',
    name: 'VVIP Hospitality',
    icon: '👑',
    color: '#D4AF37',
    prices: { 'Quarter-Final': 7500, 'Semi-Final': 12000, 'Third Place Play-Off': 10000, 'Grand Final': 20000, 'Closing Exhibition': 5000 },
    defaultPrice: 7500,
    perks: ['Premium box seating', 'Full hospitality package', 'Meet & greet with officials', 'Exclusive gifts & memorabilia', 'Private parking'],
  },
]

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
}

function roundLabel(round) {
  const map = {
    'Quarter-Final': 'QF',
    'Semi-Final': 'SF',
    'Third Place Play-Off': '3rd Place',
    'Grand Final': 'FINAL',
    'Closing Exhibition': 'Exhibition',
  }
  return map[round] || round
}

export default function Tickets() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [cart, setCart] = useState([]) // [{fixtureId, tier, qty}]
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [selectedTier, setSelectedTier] = useState('vip')
  const [qty, setQty] = useState(1)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderRef, setOrderRef] = useState('')

  const addToCart = () => {
    if (!selectedMatch) return
    const existing = cart.findIndex(c => c.fixtureId === selectedMatch.id && c.tier === selectedTier)
    if (existing >= 0) {
      const updated = [...cart]
      updated[existing].qty += qty
      setCart(updated)
    } else {
      setCart(prev => [...prev, { fixtureId: selectedMatch.id, fixture: selectedMatch, tier: selectedTier, qty }])
    }
    setSelectedMatch(null)
    setQty(1)
  }

  const removeFromCart = (idx) => setCart(prev => prev.filter((_, i) => i !== idx))

  const getPrice = (tier, round) => {
    const t = TICKET_TIERS.find(t => t.id === tier)
    return t?.prices[round] || t?.defaultPrice || 0
  }

  const cartTotal = cart.reduce((sum, item) => sum + getPrice(item.tier, item.fixture.round) * item.qty, 0)

  const handleCheckout = () => {
    const ref = `SCT-${Date.now().toString(36).toUpperCase().slice(-6)}`
    setOrderRef(ref)
    setOrderPlaced(true)
    setCart([])
  }

  if (orderPlaced) {
    return (
      <div style={styles.page}>
        <div style={{...styles.card, maxWidth: 520, margin: '60px auto', textAlign: 'center', padding: '48px 40px'}}>
          <div style={{fontSize: '4rem', marginBottom: 16}}>🎉</div>
          <h2 style={{color: 'var(--gold)', marginBottom: 8}}>Booking Confirmed!</h2>
          <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: 28}}>
            Your tickets have been reserved, {user?.name}. Check your email for the e-ticket.
          </p>
          <div style={{background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 12, padding: '20px', marginBottom: 28}}>
            <div style={{fontFamily: 'var(--font-secondary)', fontSize: '0.75rem', letterSpacing: '1px', color: 'var(--gold)', marginBottom: 8, textTransform: 'uppercase'}}>Booking Reference</div>
            <div style={{fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, letterSpacing: 4}}>{orderRef}</div>
          </div>
          <button onClick={() => setOrderPlaced(false)} className="btn btn-primary" style={{width: '100%', justifyContent: 'center', marginBottom: 12}}>
            Buy More Tickets
          </button>
          <Link to="/" className="btn btn-secondary" style={{width: '100%', justifyContent: 'center'}}>Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.heroBand}>
        <div style={{maxWidth: 900, margin: '0 auto', padding: '0 24px'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16}}>
            <div>
              <div style={{fontFamily: 'var(--font-secondary)', fontSize: '0.75rem', letterSpacing: '3px', color: 'rgba(212,175,55,0.7)', textTransform: 'uppercase', marginBottom: 6}}>
                🎫 Official Ticket Office
              </div>
              <h1 style={{fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--white)', margin: 0}}>
                Buy Match <span style={{color: 'var(--gold)'}}>Tickets</span>
              </h1>
              <p style={{color: 'rgba(255,255,255,0.5)', marginTop: 8, margin: 0}}>
                StarCraft Cup 2026 · Edo State, Nigeria
              </p>
            </div>
            <div style={{textAlign: 'right'}}>
              <div style={{color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem'}}>Logged in as</div>
              <div style={{color: 'var(--gold)', fontWeight: 700}}>{user?.name}</div>
              <button
                onClick={() => { logout(); navigate('/login') }}
                style={{background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.8rem', marginTop: 4}}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{maxWidth: 900, margin: '0 auto', padding: '40px 24px'}}>
        <div style={{display: 'grid', gridTemplateColumns: cart.length ? '1fr 320px' : '1fr', gap: 32, alignItems: 'start'}}>

          {/* Match List */}
          <div>
            <h3 style={{color: 'var(--gold)', fontFamily: 'var(--font-secondary)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 20}}>
              Upcoming Matches
            </h3>

            {upcomingFixtures.map(fixture => (
              <div
                key={fixture.id}
                style={{
                  ...styles.card,
                  marginBottom: 16,
                  cursor: 'pointer',
                  border: selectedMatch?.id === fixture.id
                    ? '1px solid rgba(212,175,55,0.6)'
                    : '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 200ms',
                }}
                onClick={() => setSelectedMatch(selectedMatch?.id === fixture.id ? null : fixture)}
              >
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap'}}>
                  <div style={{flex: 1}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10}}>
                      <span style={styles.roundBadge}>{roundLabel(fixture.round)}</span>
                      <span style={{color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem'}}>
                        {formatDate(fixture.date)} · {fixture.time}
                      </span>
                    </div>
                    <div style={{fontFamily: 'var(--font-heading)', fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 700, marginBottom: 6}}>
                      {fixture.homeTeam} <span style={{color: 'rgba(255,255,255,0.3)', fontWeight: 400}}>vs</span> {fixture.awayTeam}
                    </div>
                    <div style={{color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem'}}>
                      📍 {fixture.venue}
                    </div>
                  </div>
                  <div style={{textAlign: 'right', flexShrink: 0}}>
                    <div style={{color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', marginBottom: 4}}>From</div>
                    <div style={{fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--gold)', fontWeight: 900}}>
                      ₦{(1000).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Expanded ticket selector */}
                {selectedMatch?.id === fixture.id && (
                  <div style={{marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20}} onClick={e => e.stopPropagation()}>
                    <div style={{fontFamily: 'var(--font-secondary)', fontSize: '0.75rem', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: 12}}>
                      Select Ticket Type
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10, marginBottom: 16}}>
                      {TICKET_TIERS.map(tier => {
                        const price = tier.prices[fixture.round] || tier.defaultPrice
                        return (
                          <div
                            key={tier.id}
                            onClick={() => setSelectedTier(tier.id)}
                            style={{
                              padding: '14px 12px',
                              borderRadius: 10,
                              border: selectedTier === tier.id
                                ? '1px solid rgba(212,175,55,0.7)'
                                : '1px solid rgba(255,255,255,0.08)',
                              background: selectedTier === tier.id
                                ? 'rgba(212,175,55,0.1)'
                                : 'rgba(255,255,255,0.03)',
                              cursor: 'pointer',
                              position: 'relative',
                              transition: 'all 200ms',
                            }}
                          >
                            {tier.popular && (
                              <div style={{position: 'absolute', top: -8, right: 8, background: 'var(--gold)', color: '#000', fontSize: '0.6rem', fontWeight: 800, padding: '2px 8px', borderRadius: 20, fontFamily: 'var(--font-secondary)', letterSpacing: '0.5px'}}>
                                POPULAR
                              </div>
                            )}
                            <div style={{fontSize: '1.4rem', marginBottom: 4}}>{tier.icon}</div>
                            <div style={{fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.8rem', color: selectedTier === tier.id ? 'var(--gold)' : 'var(--white)', marginBottom: 4}}>
                              {tier.name}
                            </div>
                            <div style={{fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 900}}>
                              ₦{price.toLocaleString()}
                            </div>
                            <ul style={{marginTop: 8, paddingLeft: 0, listStyle: 'none', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)'}}>
                              {tier.perks.map(p => <li key={p} style={{marginBottom: 3}}>✓ {p}</li>)}
                            </ul>
                          </div>
                        )
                      })}
                    </div>

                    <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: 0, border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, overflow: 'hidden'}}>
                        <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{...styles.qtyBtn}}>−</button>
                        <span style={{width: 40, textAlign: 'center', fontWeight: 700, fontFamily: 'var(--font-secondary)'}}>{qty}</span>
                        <button onClick={() => setQty(q => Math.min(10, q + 1))} style={{...styles.qtyBtn}}>+</button>
                      </div>
                      <button onClick={addToCart} className="btn btn-primary" style={{flex: 1, justifyContent: 'center'}}>
                        Add to Basket — ₦{(getPrice(selectedTier, fixture.round) * qty).toLocaleString()}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Cart */}
          {cart.length > 0 && (
            <div style={{position: 'sticky', top: 100}}>
              <h3 style={{color: 'var(--gold)', fontFamily: 'var(--font-secondary)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16}}>
                🛒 Your Basket ({cart.reduce((s, c) => s + c.qty, 0)} tickets)
              </h3>
              <div style={styles.card}>
                {cart.map((item, i) => {
                  const price = getPrice(item.tier, item.fixture.round)
                  const tier = TICKET_TIERS.find(t => t.id === item.tier)
                  return (
                    <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: 8}}>
                      <div style={{flex: 1, minWidth: 0}}>
                        <div style={{fontFamily: 'var(--font-secondary)', fontWeight: 700, fontSize: '0.8rem', marginBottom: 2, color: 'var(--white)'}}>
                          {item.fixture.homeTeam} vs {item.fixture.awayTeam}
                        </div>
                        <div style={{fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)'}}>
                          {tier?.icon} {tier?.name} × {item.qty}
                        </div>
                        <div style={{fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: 2}}>
                          {new Date(item.fixture.date).toLocaleDateString('en-NG', {day:'numeric',month:'short'})} · {item.fixture.time}
                        </div>
                      </div>
                      <div style={{textAlign: 'right', flexShrink: 0}}>
                        <div style={{color: 'var(--gold)', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem'}}>
                          ₦{(price * item.qty).toLocaleString()}
                        </div>
                        <button onClick={() => removeFromCart(i)} style={{background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.75rem', marginTop: 4}}>
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                })}

                <div style={{display: 'flex', justifyContent: 'space-between', padding: '16px 0 8px', borderTop: '1px solid rgba(212,175,55,0.2)', marginTop: 4}}>
                  <span style={{fontFamily: 'var(--font-secondary)', fontWeight: 800, letterSpacing: '1px', fontSize: '0.85rem'}}>TOTAL</span>
                  <span style={{fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: 'var(--gold)', fontWeight: 900}}>
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>

                <button onClick={handleCheckout} className="btn btn-primary" style={{width: '100%', justifyContent: 'center', marginTop: 8}}>
                  Proceed to Payment →
                </button>
                <p style={{fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginTop: 10}}>
                  Secure payment via bank transfer or card
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .tickets-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #0d0102 0%, #2a0406 60%, #0d0102 100%)',
    paddingBottom: 80,
  },
  heroBand: {
    background: 'linear-gradient(90deg, rgba(212,175,55,0.08) 0%, rgba(139,14,18,0.3) 50%, rgba(212,175,55,0.08) 100%)',
    borderBottom: '1px solid rgba(212,175,55,0.15)',
    padding: '100px 0 32px',
  },
  card: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 14,
    padding: '20px',
  },
  roundBadge: {
    background: 'rgba(212,175,55,0.15)',
    border: '1px solid rgba(212,175,55,0.3)',
    color: 'var(--gold)',
    fontFamily: 'var(--font-secondary)',
    fontSize: '0.68rem',
    fontWeight: 800,
    letterSpacing: '1px',
    padding: '3px 10px',
    borderRadius: 20,
    textTransform: 'uppercase',
  },
  qtyBtn: {
    width: 36,
    height: 36,
    background: 'rgba(255,255,255,0.06)',
    border: 'none',
    color: 'var(--white)',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 700,
    transition: 'background 200ms',
  },
}
