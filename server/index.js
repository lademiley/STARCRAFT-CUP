import express from 'express'
import session from 'express-session'
import cors from 'cors'
import crypto from 'crypto'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = 3001
const isProd = process.env.NODE_ENV === 'production'

// Restrict CORS to same origin / known frontend origins
const allowedOrigins = isProd
  ? [process.env.FRONTEND_URL].filter(Boolean)
  : ['http://localhost:5000', 'http://127.0.0.1:5000']

// Replit proxies the app through *.replit.dev / *.repl.co domains in dev
// These can have multiple subdomain labels (e.g. app-name.username.replit.dev)
const replitOriginPattern = /^https:\/\/.+\.(replit\.dev|repl\.co)(:\d+)?$/

app.use(cors({
  origin: (origin, cb) => {
    // No origin = same-origin proxy request (Vite dev server) — always allow
    if (!origin) return cb(null, true)
    if (allowedOrigins.includes(origin)) return cb(null, true)
    // Always allow Replit preview/deployment domains
    if (replitOriginPattern.test(origin)) return cb(null, true)
    // Allow everything in development
    if (!isProd) return cb(null, true)
    cb(new Error('Not allowed by CORS'))
  },
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (!process.env.SESSION_SECRET) {
  console.warn('[WARN] SESSION_SECRET is not set — using insecure fallback. Set it via environment secrets.')
}

app.use(session({
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: isProd,       // HTTPS-only in production
    httpOnly: true,       // Prevent XSS access to cookie
    sameSite: 'lax',      // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}))

// ---------- Simple CSRF check for state-changing API routes ----------
// In production, prefer a dedicated CSRF token library (e.g. csurf, csrf-csrf)
app.use('/api', (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next()
  const origin = req.headers.origin || ''
  if (isProd && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  next()
})

// ---------- In-memory user store (replace with a real DB in production) ----------
// Passwords are stored as SHA-256 hashes (use bcrypt in production)
const users = new Map() // email → { id, email, name, mode, passwordHash, createdAt }

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// ---------- Auth routes ----------
app.post('/api/auth/register', (req, res) => {
  const { email, password, name, mode } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }
  if (users.has(email)) {
    return res.status(409).json({ error: 'An account with this email already exists' })
  }

  const user = {
    id: Date.now(),
    email,
    name: name || email.split('@')[0],
    mode: mode || 'fan',
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  }
  users.set(email, user)
  req.session.userId = user.id
  req.session.userEmail = user.email

  const { passwordHash: _, ...safeUser } = user
  res.status(201).json({ success: true, user: safeUser })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const user = users.get(email)
  if (!user || user.passwordHash !== hashPassword(password)) {
    // Intentionally vague to prevent user enumeration
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  req.session.userId = user.id
  req.session.userEmail = user.email

  const { passwordHash: _, ...safeUser } = user
  res.json({ success: true, user: safeUser, requires2FA: false })
})

// ---------- Admin auth ----------
// Admin credentials loaded from environment variables. Set ADMIN_EMAIL and
// ADMIN_PASSWORD in your environment secrets before deploying to production.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@starcraft2026.com'
const ADMIN_PASSWORD_HASH = hashPassword(process.env.ADMIN_PASSWORD || 'SC2026@Admin')
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  console.warn('[WARN] ADMIN_EMAIL / ADMIN_PASSWORD are not set — using insecure defaults. Set them via environment secrets.')
}

app.post('/api/auth/admin-login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }
  if (email !== ADMIN_EMAIL || hashPassword(password) !== ADMIN_PASSWORD_HASH) {
    return res.status(401).json({ error: 'Invalid admin credentials' })
  }
  req.session.userId = 'admin'
  req.session.userEmail = ADMIN_EMAIL
  req.session.isAdmin = true
  res.json({ success: true, admin: { email: ADMIN_EMAIL, name: 'Super Admin', role: 'superadmin' } })
})

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' })
    res.clearCookie('connect.sid')
    res.json({ success: true })
  })
})

app.get('/api/auth/me', (req, res) => {
  if (!req.session.userId || !req.session.userEmail) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  // Admin sessions aren't backed by the `users` store — handle them separately
  // so a page reload doesn't destroy a valid admin session.
  if (req.session.isAdmin) {
    return res.json({ user: null, admin: { email: req.session.userEmail, name: 'Super Admin', role: 'superadmin' } })
  }
  const user = users.get(req.session.userEmail)
  if (!user) {
    req.session.destroy(() => {})
    return res.status(401).json({ error: 'Session invalid — please log in again' })
  }
  const { passwordHash: _, ...safeUser } = user
  res.json({ user: safeUser })
})

// ---------- Contact form ----------
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' })
  }
  // In production: send via Nodemailer / SendGrid
  console.log('[Contact]', { name, email, subject })
  res.json({ success: true, message: 'Message received. We will respond within 24 hours.' })
})

// ---------- Newsletter ----------
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' })
  }
  console.log('[Newsletter]', email)
  res.json({ success: true, message: 'Subscribed successfully!' })
})

// ---------- Volunteer registration ----------
app.post('/api/volunteers', (req, res) => {
  const { name, email, role } = req.body
  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role are required' })
  }
  console.log('[Volunteer]', { name, email, role })
  res.json({ success: true, reference: `VOL-${Date.now()}` })
})

// ---------- Team registration ----------
const teamRegistrations = new Map() // refId -> registration object

app.post('/api/teams/register', (req, res) => {
  const { teamName, city, yearFounded, coach, homeColors, competitionHistory,
          repName, repEmail, repPhone, players } = req.body
  if (!teamName || !repEmail) {
    return res.status(400).json({ error: 'Team name and representative email are required' })
  }
  const ref            = `SC2026-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
  const dashboardToken = crypto.randomBytes(32).toString('hex')
  const id             = crypto.randomBytes(16).toString('hex')
  const registration = {
    id,
    ref,
    dashboardToken,
    teamName, city: city || '', yearFounded: yearFounded || '',
    coach: coach || '', homeColors: homeColors || '',
    competitionHistory: competitionHistory || '',
    repName: repName || '', repEmail, repPhone: repPhone || '',
    players: players || [],
    status: 'pending',
    submittedAt: new Date().toISOString(),
    reviewedAt: null,
    reviewNote: '',
  }
  teamRegistrations.set(registration.id, registration)
  console.log('[TeamReg]', { ref, teamName, repEmail })
  res.status(201).json({ success: true, reference: ref, dashboardToken })
})

// Public: look up a single registration by ref + dashboardToken
app.get('/api/teams/registrations/by-ref/:ref', (req, res) => {
  const token = req.query.token || ''
  const found = [...teamRegistrations.values()].find(r => r.ref === req.params.ref)
  if (!found) return res.status(404).json({ error: 'Registration not found' })
  // Constant-time comparison to prevent timing attacks
  const expected = Buffer.from(found.dashboardToken)
  const provided  = Buffer.from(token.padEnd(found.dashboardToken.length, '\0').slice(0, found.dashboardToken.length))
  if (expected.length !== provided.length || !crypto.timingSafeEqual(expected, provided)) {
    return res.status(403).json({ error: 'Invalid access token' })
  }
  // Backfill id/photoUrl on players added before per-player edit/photo/delete existed.
  // id and photoUrl are backfilled independently so a player missing only one of them
  // isn't skipped. Node's single-threaded event loop means this synchronous read-modify-write
  // cannot interleave with another request, so generated ids stay stable across concurrent loads.
  let changed = false
  found.players = found.players.map(p => {
    let next = p
    if (!next.id) { changed = true; next = { id: crypto.randomBytes(6).toString('hex'), ...next } }
    if (next.photoUrl == null) { changed = true; next = { ...next, photoUrl: '' } }
    return next
  })
  if (changed) teamRegistrations.set(found.id, found)
  // Strip token before sending to client
  const { dashboardToken: _t, ...safe } = found
  res.json({ registration: safe })
})

// Shared token check for team-rep self-service routes
function checkDashboardToken(reg, token) {
  const expected = Buffer.from(reg.dashboardToken)
  const provided = Buffer.from((token || '').padEnd(reg.dashboardToken.length, '\0').slice(0, reg.dashboardToken.length))
  return expected.length === provided.length && crypto.timingSafeEqual(expected, provided)
}

const MAX_SQUAD_SIZE = 22

// Team rep: add a player — authenticated by ref + dashboardToken in body
app.patch('/api/teams/registrations/by-ref/:ref/players', (req, res) => {
  const { token, player } = req.body
  const reg = [...teamRegistrations.values()].find(r => r.ref === req.params.ref)
  if (!reg) return res.status(404).json({ error: 'Registration not found' })
  if (!checkDashboardToken(reg, token)) return res.status(403).json({ error: 'Invalid access token' })
  if (reg.status === 'rejected') return res.status(400).json({ error: 'Cannot modify a rejected registration' })
  if (reg.players.length >= MAX_SQUAD_SIZE) return res.status(400).json({ error: `Maximum squad size of ${MAX_SQUAD_SIZE} reached` })
  if (!player || !player.name || !player.name.trim()) return res.status(400).json({ error: 'Player name is required' })
  const newPlayer = { id: crypto.randomBytes(6).toString('hex'), name: player.name, age: player.age || '', position: player.position || '', jersey: player.jersey || '', photoUrl: '' }
  reg.players = [...reg.players, newPlayer]
  teamRegistrations.set(reg.id, reg)
  console.log('[TeamReg AddPlayer]', reg.ref, player.name)
  const { dashboardToken: _t, ...safe } = reg
  res.json({ success: true, registration: safe })
})

// Team rep: edit an existing player's profile — authenticated by ref + dashboardToken
app.patch('/api/teams/registrations/by-ref/:ref/players/:playerId', (req, res) => {
  const { token, player } = req.body
  const reg = [...teamRegistrations.values()].find(r => r.ref === req.params.ref)
  if (!reg) return res.status(404).json({ error: 'Registration not found' })
  if (!checkDashboardToken(reg, token)) return res.status(403).json({ error: 'Invalid access token' })
  if (reg.status === 'rejected') return res.status(400).json({ error: 'Cannot modify a rejected registration' })
  const idx = reg.players.findIndex(p => p.id === req.params.playerId)
  if (idx === -1) return res.status(404).json({ error: 'Player not found' })
  if (!player || !player.name || !player.name.trim()) return res.status(400).json({ error: 'Player name is required' })
  reg.players[idx] = {
    ...reg.players[idx],
    name: player.name,
    age: player.age || '',
    position: player.position || '',
    jersey: player.jersey || '',
  }
  teamRegistrations.set(reg.id, reg)
  console.log('[TeamReg EditPlayer]', reg.ref, player.name)
  const { dashboardToken: _t, ...safe } = reg
  res.json({ success: true, registration: safe })
})

// Team rep: remove a player — authenticated by ref + dashboardToken
app.delete('/api/teams/registrations/by-ref/:ref/players/:playerId', (req, res) => {
  const token = req.query.token || ''
  const reg = [...teamRegistrations.values()].find(r => r.ref === req.params.ref)
  if (!reg) return res.status(404).json({ error: 'Registration not found' })
  if (!checkDashboardToken(reg, token)) return res.status(403).json({ error: 'Invalid access token' })
  if (reg.status === 'rejected') return res.status(400).json({ error: 'Cannot modify a rejected registration' })
  const idx = reg.players.findIndex(p => p.id === req.params.playerId)
  if (idx === -1) return res.status(404).json({ error: 'Player not found' })
  const [removed] = reg.players.splice(idx, 1)
  if (removed.photoUrl) {
    fs.unlink(path.join(playerUploadsDir, path.basename(removed.photoUrl)), () => {})
  }
  teamRegistrations.set(reg.id, reg)
  console.log('[TeamReg RemovePlayer]', reg.ref, removed.name)
  const { dashboardToken: _t, ...safe } = reg
  res.json({ success: true, registration: safe })
})

// ---------- Player profile photo uploads ----------
const playerUploadsDir = path.join(__dirname, 'uploads', 'players')
fs.mkdirSync(playerUploadsDir, { recursive: true })
app.use('/uploads/players', express.static(playerUploadsDir, {
  setHeaders: res => res.setHeader('X-Content-Type-Options', 'nosniff'),
}))
const playerPhotoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
})

// Team rep: upload/replace a player's profile photo — authenticated by ref + dashboardToken
app.post('/api/teams/registrations/by-ref/:ref/players/:playerId/photo', (req, res) => {
  playerPhotoUpload.single('photo')(req, res, err => {
    if (err) return res.status(400).json({ error: err.message })
    const reg = [...teamRegistrations.values()].find(r => r.ref === req.params.ref)
    if (!reg) return res.status(404).json({ error: 'Registration not found' })
    if (!checkDashboardToken(reg, req.body.token)) return res.status(403).json({ error: 'Invalid access token' })
    if (reg.status === 'rejected') return res.status(400).json({ error: 'Cannot modify a rejected registration' })
    const idx = reg.players.findIndex(p => p.id === req.params.playerId)
    if (idx === -1) return res.status(404).json({ error: 'Player not found' })
    if (!req.file) return res.status(400).json({ error: 'No photo uploaded' })
    // Sniff real file signature rather than trusting client-supplied MIME/extension.
    const ext = detectImageExt(req.file.buffer)
    if (!ext) return res.status(400).json({ error: 'Only JPG, PNG, WEBP and GIF images are allowed' })
    const oldUrl = reg.players[idx].photoUrl
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`
    fs.writeFileSync(path.join(playerUploadsDir, filename), req.file.buffer)
    reg.players[idx] = { ...reg.players[idx], photoUrl: `/uploads/players/${filename}` }
    teamRegistrations.set(reg.id, reg)
    if (oldUrl) fs.unlink(path.join(playerUploadsDir, path.basename(oldUrl)), () => {})
    console.log('[TeamReg PlayerPhoto]', reg.ref, reg.players[idx].name)
    const { dashboardToken: _t, ...safe } = reg
    res.json({ success: true, registration: safe })
  })
})

// Admin: get all team registrations
app.get('/api/teams/registrations', requireAdmin, (req, res) => {
  const all = [...teamRegistrations.values()]
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
  res.json({ registrations: all })
})

// Admin: approve a team registration
app.patch('/api/teams/registrations/:id/approve', requireAdmin, (req, res) => {
  const reg = teamRegistrations.get(req.params.id)
  if (!reg) return res.status(404).json({ error: 'Registration not found' })
  reg.status = 'approved'
  reg.reviewedAt = new Date().toISOString()
  reg.reviewNote = req.body.note || ''
  teamRegistrations.set(reg.id, reg)
  console.log('[TeamReg Approved]', reg.ref, reg.teamName)
  res.json({ success: true, registration: reg })
})

// Admin: reject a team registration
app.patch('/api/teams/registrations/:id/reject', requireAdmin, (req, res) => {
  const reg = teamRegistrations.get(req.params.id)
  if (!reg) return res.status(404).json({ error: 'Registration not found' })
  reg.status = 'rejected'
  reg.reviewedAt = new Date().toISOString()
  reg.reviewNote = req.body.note || ''
  teamRegistrations.set(reg.id, reg)
  console.log('[TeamReg Rejected]', reg.ref, reg.teamName)
  res.json({ success: true, registration: reg })
})

// ---------- Auth middleware ----------
function requireAuth(req, res, next) {
  if (!req.session.userId || !req.session.userEmail) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  next()
}

// Admin-only routes must check the isAdmin flag, not just "any logged-in user" —
// otherwise a regular fan/team account could call moderation or content-management endpoints.
function requireAdmin(req, res, next) {
  if (!req.session.userId || !req.session.userEmail || !req.session.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

// ---------- In-memory orders store ----------
const orders = new Map() // orderId -> { id, userId, userEmail, userName, items, total, ref, status, createdAt, confirmedAt }

// Create order (fan submits after bank transfer)
app.post('/api/orders', requireAuth, (req, res) => {
  const { items, total, ref } = req.body
  if (!items || !total || !ref) {
    return res.status(400).json({ error: 'Missing order details' })
  }
  const user = users.get(req.session.userEmail)
  const order = {
    id: Date.now().toString(),
    userId: req.session.userId,
    userEmail: req.session.userEmail,
    userName: user?.name || 'Fan',
    items,
    total,
    ref,
    status: 'pending',
    createdAt: new Date().toISOString(),
    confirmedAt: null,
  }
  orders.set(order.id, order)
  console.log('[Order]', { ref, total, email: order.userEmail })
  res.status(201).json({ success: true, order })
})

// Get current user's orders
app.get('/api/orders/my', requireAuth, (req, res) => {
  const myOrders = [...orders.values()]
    .filter(o => o.userId === req.session.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json({ orders: myOrders })
})

// Admin: get all orders
app.get('/api/orders', requireAdmin, (req, res) => {
  const allOrders = [...orders.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json({ orders: allOrders })
})

// Admin: confirm a payment
app.patch('/api/orders/:id/confirm', requireAdmin, (req, res) => {
  const order = orders.get(req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  order.status = 'confirmed'
  order.confirmedAt = new Date().toISOString()
  orders.set(order.id, order)
  console.log('[Order Confirmed]', order.ref, '->', order.userEmail)
  res.json({ success: true, order })
})

// Admin: reject / cancel an order
app.patch('/api/orders/:id/reject', requireAdmin, (req, res) => {
  const order = orders.get(req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  order.status = 'rejected'
  orders.set(order.id, order)
  res.json({ success: true, order })
})

// Admin: list all registered users (strip password hashes)
app.get('/api/users', requireAdmin, (req, res) => {
  const allUsers = [...users.values()].map(({ passwordHash, ...safe }) => safe)
  res.json({ users: allUsers })
})

// ---------- Site Content (admin-editable page copy, starting with Home) ----------
// Keyed by page slug so this can grow to about/tournament/etc. without changing shape.
let siteContent = {
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
      paragraph1: 'The StarCraft Cup 2026 — Premier Edition — is Edo State\'s most ambitious youth football tournament, bringing together 20 teams from all 18 LGAs, the tournament host, and the defending champion to compete for glory and a share of ₦10 million in prizes.',
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
        { icon: '🧒', title: 'U17–U20 Showcase', desc: 'The Premier Edition gives Edo\'s most gifted youth players (U17–U20) their biggest competitive stage yet.' },
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

// Public: anyone can fetch a page's content (public site renders from this)
app.get('/api/content/:page', (req, res) => {
  const page = siteContent[req.params.page]
  if (!page) return res.status(404).json({ error: 'Unknown page' })
  res.json({ page: req.params.page, content: page })
})

// Strict per-page schemas so a malformed admin payload can never reach the
// public site and crash rendering (e.g. .map() on a missing array).
const isStr = v => typeof v === 'string'
const isStrArray = v => Array.isArray(v) && v.every(isStr)
const isShapeArray = shape => v => Array.isArray(v) && v.every(item =>
  item && typeof item === 'object' && Object.keys(shape).every(k => isStr(item[k]))
)
const CONTENT_SCHEMAS = {
  home: {
    hero: { badge: isStr, titleLine1: isStr, titleLine2: isStr, subtitle: isStr, location: isStr, venue: isStr, dates: isStr },
    overview: {
      eyebrow: isStr, heading: isStr, paragraph1: isStr, paragraph2: isStr,
      features: isStrArray,
      infoCard: isShapeArray({ label: isStr, value: isStr }),
    },
    hostCity: {
      eyebrow: isStr, heading: isStr, subheading: isStr,
      cards: isShapeArray({ icon: isStr, title: isStr, desc: isStr }),
    },
    testimonials: {
      eyebrow: isStr, heading: isStr,
      items: isShapeArray({ quote: isStr, name: isStr, role: isStr }),
    },
    newsletter: { heading: isStr, text: isStr },
  },
}

function validateContent(page, content) {
  const schema = CONTENT_SCHEMAS[page]
  if (!schema) return 'No validation schema for this page'
  if (!content || typeof content !== 'object' || Array.isArray(content)) return 'content must be an object'
  for (const [section, fields] of Object.entries(schema)) {
    const value = content[section]
    if (!value || typeof value !== 'object' || Array.isArray(value)) return `Missing or invalid section "${section}"`
    for (const [field, check] of Object.entries(fields)) {
      if (!check(value[field])) return `Invalid field "${section}.${field}"`
    }
  }
  return null
}

// Admin: replace a page's content wholesale. We only accept pages that already
// exist in siteContent so this can't be used to inject arbitrary new keys, and
// we validate the full shape so a bad payload can never reach the public site.
app.put('/api/content/:page', requireAdmin, (req, res) => {
  const key = req.params.page
  if (!siteContent[key]) return res.status(404).json({ error: 'Unknown page' })
  const { content } = req.body
  const validationError = validateContent(key, content)
  if (validationError) return res.status(400).json({ error: validationError })
  siteContent[key] = content
  console.log(`[SiteContent] "${key}" page updated by admin`)
  res.json({ success: true, page: key, content: siteContent[key] })
})

// ---------- Payment Settings ----------
// Stores admin-configurable payment methods shown to fans on the Tickets page
let paymentSettings = {
  methods: [
    {
      id: 'bank1',
      type: 'bank',
      enabled: true,
      label: 'Bank Transfer',
      bankName: 'First Bank Nigeria',
      accountName: 'StarCraft Cup 2026 Tournament Committee',
      accountNumber: '3085762491',
      sortCode: '',
      instructions: 'Transfer the exact amount and use your order reference as the payment narration.',
    }
  ],
  footerNote: 'QR code tickets will be activated on your profile once payment is confirmed by our team.',
}

// Public: anyone can fetch payment methods (fans need it during checkout)
app.get('/api/settings/payment', (req, res) => {
  res.json({ settings: paymentSettings })
})

// Admin: update payment settings (requires authentication)
app.put('/api/settings/payment', requireAdmin, (req, res) => {
  const { methods, footerNote } = req.body
  if (!Array.isArray(methods)) {
    return res.status(400).json({ error: 'methods must be an array' })
  }
  // Sanitise each method — only allow known fields
  const allowed = ['id','type','enabled','label','bankName','accountName','accountNumber','sortCode','instructions']
  paymentSettings = {
    methods: methods.map(m => {
      const clean = {}
      for (const k of allowed) if (k in m) clean[k] = m[k]
      return clean
    }),
    footerNote: typeof footerNote === 'string' ? footerNote : paymentSettings.footerNote,
  }
  console.log('[PaymentSettings] Updated by admin')
  res.json({ success: true, settings: paymentSettings })
})

// ---------- Gallery: albums + photo uploads ----------
const uploadsDir = path.join(__dirname, 'uploads', 'gallery')
fs.mkdirSync(uploadsDir, { recursive: true })
// Serve uploads with nosniff so browsers never execute a misidentified file as
// HTML/script even if an attacker somehow smuggled one past validation.
app.use('/uploads/gallery', express.static(uploadsDir, {
  setHeaders: res => res.setHeader('X-Content-Type-Options', 'nosniff'),
}))

// Never trust the client-supplied filename/MIME type for what gets written to
// disk — sniff the real file signature (magic bytes) and derive the extension
// from that. This blocks disguised-extension / stored-XSS upload attacks.
function detectImageExt(buf) {
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return '.png'
  if (buf.length >= 3 && buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return '.jpg'
  if (buf.length >= 6 && buf.slice(0, 3).toString('ascii') === 'GIF' && (buf.slice(3, 6).toString('ascii') === '87a' || buf.slice(3, 6).toString('ascii') === '89a')) return '.gif'
  if (buf.length >= 12 && buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP') return '.webp'
  return null
}

// Use memory storage so we can inspect the real bytes before ever writing to disk.
const galleryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 20 },
})

const eventTags = ['Opening Exhibition', 'Group Stage', 'Quarter-Final', 'Semi-Final', 'Final', 'Player Feature', 'Behind The Scenes']
const galleryAlbums = new Map() // id -> { id, title, date, event, status, featured, photos: [{id, url, caption, uploadedAt}], createdAt }

// Public: list published albums (for the public gallery page). Drafts are only
// visible to authenticated admins, not to any logged-in fan/team account.
app.get('/api/gallery/albums', (req, res) => {
  const all = [...galleryAlbums.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  const visible = req.session.isAdmin ? all : all.filter(a => a.status === 'Published')
  res.json({ albums: visible })
})

// Admin: create album
app.post('/api/gallery/albums', requireAdmin, (req, res) => {
  const { title, date, event, status, featured } = req.body
  if (!title || !title.trim()) return res.status(400).json({ error: 'Album title is required' })
  const id = crypto.randomBytes(8).toString('hex')
  const album = {
    id,
    title: title.trim(),
    date: date || new Date().toISOString().split('T')[0],
    event: eventTags.includes(event) ? event : 'Group Stage',
    status: status === 'Published' ? 'Published' : 'Draft',
    featured: !!featured,
    photos: [],
    createdAt: new Date().toISOString(),
  }
  galleryAlbums.set(id, album)
  res.json({ success: true, album })
})

// Admin: update album metadata
app.put('/api/gallery/albums/:id', requireAdmin, (req, res) => {
  const album = galleryAlbums.get(req.params.id)
  if (!album) return res.status(404).json({ error: 'Album not found' })
  const { title, date, event, status, featured } = req.body
  if (title !== undefined) album.title = String(title).trim() || album.title
  if (date !== undefined) album.date = date
  if (event !== undefined && eventTags.includes(event)) album.event = event
  if (status !== undefined) album.status = status === 'Published' ? 'Published' : 'Draft'
  if (featured !== undefined) album.featured = !!featured
  galleryAlbums.set(album.id, album)
  res.json({ success: true, album })
})

// Admin: delete album (also removes its photo files from disk)
app.delete('/api/gallery/albums/:id', requireAdmin, (req, res) => {
  const album = galleryAlbums.get(req.params.id)
  if (!album) return res.status(404).json({ error: 'Album not found' })
  for (const photo of album.photos) {
    const filePath = path.join(uploadsDir, path.basename(photo.url))
    fs.unlink(filePath, () => {})
  }
  galleryAlbums.delete(req.params.id)
  res.json({ success: true })
})

// Admin: upload one or more photos into an album
app.post('/api/gallery/albums/:id/photos', requireAdmin, (req, res) => {
  galleryUpload.array('photos', 20)(req, res, err => {
    if (err) return res.status(400).json({ error: err.message })
    const album = galleryAlbums.get(req.params.id)
    if (!album) return res.status(404).json({ error: 'Album not found' })
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No photos uploaded' })

    // Sniff each file's real signature — reject anything that isn't a genuine
    // JPG/PNG/GIF/WEBP, regardless of what extension or MIME type the client sent.
    const rejected = []
    const newPhotos = []
    for (const file of req.files) {
      const ext = detectImageExt(file.buffer)
      if (!ext) { rejected.push(file.originalname); continue }
      const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`
      fs.writeFileSync(path.join(uploadsDir, filename), file.buffer)
      newPhotos.push({
        id: crypto.randomBytes(8).toString('hex'),
        url: `/uploads/gallery/${filename}`,
        caption: '',
        uploadedAt: new Date().toISOString(),
      })
    }
    if (newPhotos.length === 0) {
      return res.status(400).json({ error: 'No valid images found — only JPG, PNG, WEBP and GIF are allowed' })
    }
    album.photos = [...album.photos, ...newPhotos]
    galleryAlbums.set(album.id, album)
    console.log('[Gallery] Uploaded', newPhotos.length, 'photo(s) to', album.title, rejected.length ? `(rejected ${rejected.length} invalid)` : '')
    res.json({ success: true, album, rejectedCount: rejected.length })
  })
})

// Admin: delete a single photo from an album
app.delete('/api/gallery/albums/:id/photos/:photoId', requireAdmin, (req, res) => {
  const album = galleryAlbums.get(req.params.id)
  if (!album) return res.status(404).json({ error: 'Album not found' })
  const photo = album.photos.find(p => p.id === req.params.photoId)
  if (!photo) return res.status(404).json({ error: 'Photo not found' })
  fs.unlink(path.join(uploadsDir, path.basename(photo.url)), () => {})
  album.photos = album.photos.filter(p => p.id !== req.params.photoId)
  galleryAlbums.set(album.id, album)
  res.json({ success: true, album })
})

// ---------- Generic error handler ----------
app.use((err, req, res, next) => {
  console.error('[Error]', err.message)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`StarCraft Cup API server running on port ${PORT} [${isProd ? 'production' : 'development'}]`)
})
