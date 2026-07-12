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
  if (isProd) {
    console.error('[ERROR] SESSION_SECRET is required in production. Set it via Replit Secrets and restart.')
    process.exit(1)
  }
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
const EDO_LGAS = ['Akoko-Edo','Egor','Esan Central','Esan North-East','Esan South-East','Esan West','Etsako Central','Etsako East','Etsako West','Igueben','Ikpoba-Okha','Orhionmwon','Oredo','Ovia North-East','Ovia South-West','Owan East','Owan West','Uhunmwonde']
const KIT_SIZES = ['XS','S','M','L','XL','XXL']
const VALID_MODES = ['individual', 'fan', 'admin']

app.post('/api/auth/register', (req, res) => {
  const { email, password, name, mode, phone, lga, age, kitSize, height, footSize } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }
  if (users.has(email)) {
    return res.status(409).json({ error: 'An account with this email already exists' })
  }
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Full name is required' })
  }
  const resolvedMode = mode || 'individual'
  if (!VALID_MODES.includes(resolvedMode)) {
    return res.status(400).json({ error: 'Invalid registration mode' })
  }

  let playerFields = {}
  if (resolvedMode === 'individual') {
    if (!EDO_LGAS.includes(lga)) {
      return res.status(400).json({ error: 'A valid LGA is required' })
    }
    if (!KIT_SIZES.includes(kitSize)) {
      return res.status(400).json({ error: 'A valid kit size is required' })
    }
    const ageNum    = Number(age)
    const heightNum = Number(height)
    const footNum   = Number(footSize)
    if (!Number.isFinite(ageNum) || ageNum < 5 || ageNum > 60) {
      return res.status(400).json({ error: 'Age must be a number between 5 and 60' })
    }
    if (!Number.isFinite(heightNum) || heightNum < 100 || heightNum > 230) {
      return res.status(400).json({ error: 'Height must be a number between 100 and 230 cm' })
    }
    if (!Number.isFinite(footNum) || footNum < 20 || footNum > 55) {
      return res.status(400).json({ error: 'Foot size must be a number between 20 and 55' })
    }
    playerFields = { lga, age: ageNum, kitSize, height: heightNum, footSize: footNum }
  }

  const user = {
    id: Date.now(),
    email,
    name: name.trim(),
    mode: resolvedMode,
    phone: phone || '',
    ...playerFields,
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
if (isProd && (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)) {
  console.error('[ERROR] ADMIN_EMAIL and ADMIN_PASSWORD are required in production. Set them via Replit Secrets and restart.')
  process.exit(1)
}
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@starcraft2026.com'
const ADMIN_PASSWORD_HASH = hashPassword(process.env.ADMIN_PASSWORD || 'SC2026@Admin')
if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
  console.warn('[WARN] ADMIN_EMAIL / ADMIN_PASSWORD are not set — using insecure defaults. Set them via Replit Secrets before deploying.')
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

// ---------- Admin: Chairman registration approvals ----------
app.get('/api/admin/chairmen', requireAdmin, (req, res) => {
  const all = [...chairmen.values()]
    .map(safeChairman)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json({ chairmen: all })
})

app.patch('/api/admin/chairmen/:id/approve', requireAdmin, (req, res) => {
  const chairman = [...chairmen.values()].find(c => c.id === req.params.id)
  if (!chairman) return res.status(404).json({ error: 'Chairman not found' })
  chairman.status = 'approved'
  chairman.reviewNote = (req.body.note || '').trim()
  chairman.reviewedAt = new Date().toISOString()
  chairmen.set(chairman.email, chairman)
  res.json({ success: true, chairman: safeChairman(chairman) })
})

app.patch('/api/admin/chairmen/:id/reject', requireAdmin, (req, res) => {
  const chairman = [...chairmen.values()].find(c => c.id === req.params.id)
  if (!chairman) return res.status(404).json({ error: 'Chairman not found' })
  if (!req.body.note || !req.body.note.trim()) return res.status(400).json({ error: 'Rejection reason is required' })
  chairman.status = 'rejected'
  chairman.reviewNote = req.body.note.trim()
  chairman.reviewedAt = new Date().toISOString()
  chairmen.set(chairman.email, chairman)
  res.json({ success: true, chairman: safeChairman(chairman) })
})

// ---------- Admin: Player registration approvals ----------
app.get('/api/admin/players', requireAdmin, (req, res) => {
  const all = [...players.values()]
    .map(safePlayer)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json({ players: all })
})

app.patch('/api/admin/players/:id/approve', requireAdmin, (req, res) => {
  const player = players.get(req.params.id)
  if (!player) return res.status(404).json({ error: 'Player not found' })
  player.status = 'approved'
  player.reviewNote = (req.body.note || '').trim()
  player.reviewedAt = new Date().toISOString()
  players.set(player.id, player)
  res.json({ success: true, player: safePlayer(player) })
})

app.patch('/api/admin/players/:id/reject', requireAdmin, (req, res) => {
  const player = players.get(req.params.id)
  if (!player) return res.status(404).json({ error: 'Player not found' })
  if (!req.body.note || !req.body.note.trim()) return res.status(400).json({ error: 'Rejection reason is required' })
  player.status = 'rejected'
  player.reviewNote = req.body.note.trim()
  player.reviewedAt = new Date().toISOString()
  players.set(player.id, player)
  res.json({ success: true, player: safePlayer(player) })
})

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

// ---------- LGA Chairman registration & dashboard ----------
// Separate identity space from the `users` map (fan/individual/admin) and from
// the older team-registration flow — chairmen authenticate with their own
// session key so logging in as a chairman never collides with a fan/admin session.
const chairmen = new Map() // email -> { id, name, lga, email, phone, passwordHash, photoUrl, createdAt }
const chairmanUploadsDir = path.join(__dirname, 'uploads', 'chairmen')
fs.mkdirSync(chairmanUploadsDir, { recursive: true })
app.use('/uploads/chairmen', express.static(chairmanUploadsDir, {
  setHeaders: res => res.setHeader('X-Content-Type-Options', 'nosniff'),
}))
const chairmanPhotoUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } })

function safeChairman(c) {
  const { passwordHash: _p, ...safe } = c
  return safe
}

app.post('/api/chairman/register', (req, res) => {
  const { name, lga, email, phone, password, confirmPassword } = req.body
  if (!name || !name.trim()) return res.status(400).json({ error: 'Full name is required' })
  if (!EDO_LGAS.includes(lga)) return res.status(400).json({ error: 'A valid Local Government Area is required' })
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'A valid email address is required' })
  if (!phone || !phone.trim()) return res.status(400).json({ error: 'Phone number is required' })
  if (!password || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })
  if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' })
  if (chairmen.has(email)) return res.status(409).json({ error: 'A chairman account with this email already exists' })
  // Each LGA has exactly one chairman account — otherwise the chairman dashboard's
  // "players registered under my LGA" view would be shared/ambiguous across accounts.
  if ([...chairmen.values()].some(c => c.lga === lga)) {
    return res.status(409).json({ error: `${lga} already has a registered chairman account` })
  }

  const chairman = {
    id: crypto.randomBytes(8).toString('hex'),
    name: name.trim(),
    lga,
    email,
    phone: phone.trim(),
    photoUrl: '',
    status: 'pending',
    reviewNote: '',
    reviewedAt: null,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  }
  chairmen.set(email, chairman)
  req.session.chairmanEmail = email
  console.log('[ChairmanReg]', { lga, email })
  res.status(201).json({ success: true, chairman: safeChairman(chairman) })
})

app.post('/api/chairman/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
  const chairman = chairmen.get(email)
  if (!chairman || chairman.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  req.session.chairmanEmail = email
  res.json({ success: true, chairman: safeChairman(chairman) })
})

app.post('/api/chairman/logout', (req, res) => {
  delete req.session.chairmanEmail
  res.json({ success: true })
})

function requireChairman(req, res, next) {
  if (!req.session.chairmanEmail || !chairmen.has(req.session.chairmanEmail)) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  next()
}

app.get('/api/chairman/me', requireChairman, (req, res) => {
  res.json({ chairman: safeChairman(chairmen.get(req.session.chairmanEmail)) })
})

app.patch('/api/chairman/profile', requireChairman, (req, res) => {
  const chairman = chairmen.get(req.session.chairmanEmail)
  const { name, phone } = req.body
  if (name !== undefined) {
    if (!name.trim()) return res.status(400).json({ error: 'Full name cannot be empty' })
    chairman.name = name.trim()
  }
  if (phone !== undefined) chairman.phone = phone.trim()
  chairmen.set(chairman.email, chairman)
  res.json({ success: true, chairman: safeChairman(chairman) })
})

app.post('/api/chairman/photo', requireChairman, (req, res) => {
  chairmanPhotoUpload.single('photo')(req, res, err => {
    if (err) return res.status(400).json({ error: err.message })
    if (!req.file) return res.status(400).json({ error: 'No photo uploaded' })
    const ext = detectImageExt(req.file.buffer)
    if (!ext) return res.status(400).json({ error: 'Only JPG, PNG, WEBP and GIF images are allowed' })
    const chairman = chairmen.get(req.session.chairmanEmail)
    const oldUrl = chairman.photoUrl
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`
    fs.writeFileSync(path.join(chairmanUploadsDir, filename), req.file.buffer)
    chairman.photoUrl = `/uploads/chairmen/${filename}`
    chairmen.set(chairman.email, chairman)
    if (oldUrl) fs.unlink(path.join(chairmanUploadsDir, path.basename(oldUrl)), () => {})
    res.json({ success: true, chairman: safeChairman(chairman) })
  })
})

// Chairman: players registered under their LGA
app.get('/api/chairman/players', requireChairman, (req, res) => {
  const chairman = chairmen.get(req.session.chairmanEmail)
  const lgaPlayers = [...players.values()]
    .filter(p => p.lga === chairman.lga)
    .map(safePlayer)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json({ players: lgaPlayers })
})

// Chairman: registration statistics for their LGA
app.get('/api/chairman/stats', requireChairman, (req, res) => {
  const chairman = chairmen.get(req.session.chairmanEmail)
  const lgaPlayers = [...players.values()].filter(p => p.lga === chairman.lga)
  res.json({
    stats: {
      totalPlayers: lgaPlayers.length,
      pending: lgaPlayers.filter(p => p.status === 'pending').length,
      approved: lgaPlayers.filter(p => p.status === 'approved').length,
      rejected: lgaPlayers.filter(p => p.status === 'rejected').length,
    }
  })
})

// ---------- Individual player registration & dashboard ----------
const players = new Map() // accountKey (id) -> { id, name, lga, dob, age, height, jerseySize, preferredFoot, phone, email, passwordHash, photoUrl, status, createdAt }
// Players may log in with either their email or phone number, so both are
// indexed to the same player id — a single Map keyed by only one field would
// make the other field unusable for login and wouldn't enforce uniqueness on it.
const playersByPhone = new Map() // phone -> player id
const playersByEmail = new Map() // email -> player id
const PREFERRED_FEET = ['Left', 'Right', 'Both']
const playerProfileUploadsDir = path.join(__dirname, 'uploads', 'player-profiles')
fs.mkdirSync(playerProfileUploadsDir, { recursive: true })
app.use('/uploads/player-profiles', express.static(playerProfileUploadsDir, {
  setHeaders: res => res.setHeader('X-Content-Type-Options', 'nosniff'),
}))
const playerProfilePhotoUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } })

function calculateAge(dob) {
  const birth = new Date(dob)
  if (Number.isNaN(birth.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const monthDiff = now.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age--
  return age
}

function safePlayer(p) {
  const { passwordHash: _p, ...safe } = p
  return safe
}

app.post('/api/player/register', (req, res) => {
  // Player-specific identity, used only by the individual player portal — a
  // player account is distinct from a chairman account and from the fan/team
  // accounts in `users`, even if the same email is reused across those spaces.
  const { name, lga, dob, height, jerseySize, preferredFoot, phone, email, password, confirmPassword } = req.body
  if (!name || !name.trim()) return res.status(400).json({ error: 'Full name is required' })
  if (!EDO_LGAS.includes(lga)) return res.status(400).json({ error: 'A valid Local Government Area is required' })
  if (!dob) return res.status(400).json({ error: 'Date of birth is required' })
  const age = calculateAge(dob)
  if (age === null || age < 5 || age > 60) return res.status(400).json({ error: 'Please enter a valid date of birth' })
  const heightNum = Number(height)
  if (!Number.isFinite(heightNum) || heightNum < 100 || heightNum > 230) {
    return res.status(400).json({ error: 'Height must be a number between 100 and 230 cm' })
  }
  if (!KIT_SIZES.includes(jerseySize)) return res.status(400).json({ error: 'A valid jersey size is required' })
  if (!PREFERRED_FEET.includes(preferredFoot)) return res.status(400).json({ error: 'Preferred foot must be Left, Right or Both' })
  if (!phone || !phone.trim()) return res.status(400).json({ error: 'Phone number is required' })
  if (!password || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })
  if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' })

  const cleanPhone = phone.trim()
  const cleanEmail = email ? email.trim() : ''
  if (playersByPhone.has(cleanPhone)) return res.status(409).json({ error: 'A player account with this phone number already exists' })
  if (cleanEmail && playersByEmail.has(cleanEmail)) return res.status(409).json({ error: 'A player account with this email already exists' })

  const id = crypto.randomBytes(8).toString('hex')
  const player = {
    id,
    name: name.trim(),
    lga,
    dob,
    age,
    height: heightNum,
    jerseySize,
    preferredFoot,
    phone: cleanPhone,
    email: cleanEmail,
    photoUrl: '',
    status: 'pending',
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  }
  players.set(id, player)
  playersByPhone.set(cleanPhone, id)
  if (cleanEmail) playersByEmail.set(cleanEmail, id)
  req.session.playerId = id
  console.log('[PlayerReg]', { lga, id, cleanPhone })
  res.status(201).json({ success: true, player: safePlayer(player) })
})

app.post('/api/player/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email/phone and password are required' })
  const identifier = email.trim()
  const id = playersByEmail.get(identifier) || playersByPhone.get(identifier)
  const player = id ? players.get(id) : null
  if (!player || player.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email/phone or password' })
  }
  req.session.playerId = player.id
  res.json({ success: true, player: safePlayer(player) })
})

app.post('/api/player/logout', (req, res) => {
  delete req.session.playerId
  res.json({ success: true })
})

function requirePlayer(req, res, next) {
  if (!req.session.playerId || !players.has(req.session.playerId)) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  next()
}

app.get('/api/player/me', requirePlayer, (req, res) => {
  res.json({ player: safePlayer(players.get(req.session.playerId)) })
})

app.patch('/api/player/profile', requirePlayer, (req, res) => {
  const player = players.get(req.session.playerId)
  const { name, phone, height, jerseySize, preferredFoot } = req.body
  if (name !== undefined) {
    if (!name.trim()) return res.status(400).json({ error: 'Full name cannot be empty' })
    player.name = name.trim()
  }
  if (phone !== undefined) player.phone = phone.trim()
  if (height !== undefined) {
    const heightNum = Number(height)
    if (!Number.isFinite(heightNum) || heightNum < 100 || heightNum > 230) {
      return res.status(400).json({ error: 'Height must be a number between 100 and 230 cm' })
    }
    player.height = heightNum
  }
  if (jerseySize !== undefined) {
    if (!KIT_SIZES.includes(jerseySize)) return res.status(400).json({ error: 'A valid jersey size is required' })
    player.jerseySize = jerseySize
  }
  if (preferredFoot !== undefined) {
    if (!PREFERRED_FEET.includes(preferredFoot)) return res.status(400).json({ error: 'Preferred foot must be Left, Right or Both' })
    player.preferredFoot = preferredFoot
  }
  players.set(player.id, player)
  res.json({ success: true, player: safePlayer(player) })
})

app.post('/api/player/photo', requirePlayer, (req, res) => {
  playerProfilePhotoUpload.single('photo')(req, res, err => {
    if (err) return res.status(400).json({ error: err.message })
    if (!req.file) return res.status(400).json({ error: 'No photo uploaded' })
    const ext = detectImageExt(req.file.buffer)
    if (!ext) return res.status(400).json({ error: 'Only JPG, PNG, WEBP and GIF images are allowed' })
    const player = players.get(req.session.playerId)
    const oldUrl = player.photoUrl
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`
    fs.writeFileSync(path.join(playerProfileUploadsDir, filename), req.file.buffer)
    player.photoUrl = `/uploads/player-profiles/${filename}`
    players.set(player.id, player)
    if (oldUrl) fs.unlink(path.join(playerProfileUploadsDir, path.basename(oldUrl)), () => {})
    res.json({ success: true, player: safePlayer(player) })
  })
})

// ---------- Fan / Ticket registration, checkout & dashboard ----------
// Separate identity space from the `users` map (legacy individual/fan mode,
// left untouched for backward compatibility) — fans authenticate with their
// own session key, matching the chairman/player pattern above.
const FAN_TEAMS = [
  'Akoko-Edo Panthers', 'Egor United', 'Esan Central FC', 'Esan North Stars', 'Esan South FC',
  'Esan West Rangers', 'Etsako Central FC', 'Etsako East United', 'Etsako West FC', 'Igueben FC',
  'Ikpoba-Okha FC', 'Oredo City FC', 'Orhionmwon FC', 'Ovia North Rangers', 'Ovia South United',
  'Owan East FC', 'Owan West United', 'Uhunmwonde FC', 'Egor Host XI', 'Oredo Youth',
]
// Fan-favourite / high-demand teams command a premium on VIP & VVIP tiers.
const FAN_PREMIUM_TEAMS = new Set(['Oredo City FC', 'Oredo Youth', 'Egor Host XI'])
const FAN_BASE_PRICES = { Regular: 2000, VIP: 5000, VVIP: 10000 }
const FAN_PREMIUM_PRICES = { Regular: 2500, VIP: 7500, VVIP: 15000 }
const FAN_TICKET_CATEGORIES = Object.keys(FAN_BASE_PRICES)

function getTicketPrice(team, category) {
  const table = FAN_PREMIUM_TEAMS.has(team) ? FAN_PREMIUM_PRICES : FAN_BASE_PRICES
  return table[category]
}

const fans = new Map() // email -> { id, name, lga, email, phone, preferredTeam, ticketCategory, ticketPrice, passwordHash, photoUrl, status, payment, ticket, notifications, createdAt }
const fanUploadsDir = path.join(__dirname, 'uploads', 'fans')
fs.mkdirSync(fanUploadsDir, { recursive: true })
app.use('/uploads/fans', express.static(fanUploadsDir, {
  setHeaders: res => res.setHeader('X-Content-Type-Options', 'nosniff'),
}))
const fanPhotoUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024, files: 1 } })

function safeFan(f) {
  const { passwordHash: _p, ...safe } = f
  return safe
}

function addFanNotification(fan, title, message) {
  fan.notifications.unshift({
    id: crypto.randomBytes(6).toString('hex'),
    title,
    message,
    createdAt: new Date().toISOString(),
    read: false,
  })
  fan.notifications = fan.notifications.slice(0, 30)
}

app.get('/api/fan/teams', (req, res) => {
  res.json({
    teams: FAN_TEAMS,
    categories: FAN_TICKET_CATEGORIES,
    prices: Object.fromEntries(FAN_TEAMS.map(t => [t, Object.fromEntries(FAN_TICKET_CATEGORIES.map(c => [c, getTicketPrice(t, c)]))])),
  })
})

app.post('/api/fan/register', (req, res) => {
  const { name, lga, email, phone, preferredTeam, ticketCategory, password, confirmPassword } = req.body
  if (!name || !name.trim()) return res.status(400).json({ error: 'Full name is required' })
  if (!EDO_LGAS.includes(lga)) return res.status(400).json({ error: 'A valid Local Government Area is required' })
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'A valid email address is required' })
  if (!phone || !phone.trim()) return res.status(400).json({ error: 'Phone number is required' })
  if (!FAN_TEAMS.includes(preferredTeam)) return res.status(400).json({ error: 'Please select a valid preferred team' })
  if (!FAN_TICKET_CATEGORIES.includes(ticketCategory)) return res.status(400).json({ error: 'Please select a valid ticket category' })
  if (!password || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' })
  if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' })
  const canonicalEmail = email.trim().toLowerCase()
  if (fans.has(canonicalEmail)) return res.status(409).json({ error: 'A fan account with this email already exists' })

  const fan = {
    id: crypto.randomBytes(8).toString('hex'),
    name: name.trim(),
    lga,
    email: canonicalEmail,
    phone: phone.trim(),
    preferredTeam,
    ticketCategory,
    ticketPrice: getTicketPrice(preferredTeam, ticketCategory),
    photoUrl: '',
    status: 'pending_payment', // pending_payment -> pending_approval -> approved / rejected
    payment: null,
    ticket: null,
    notifications: [],
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  }
  addFanNotification(fan, 'Account created', 'Complete secure checkout to submit your ticket for approval.')
  fans.set(fan.email, fan)
  req.session.fanEmail = fan.email
  console.log('[FanReg]', { lga, email: fan.email, preferredTeam, ticketCategory })
  res.status(201).json({ success: true, fan: safeFan(fan) })
})

app.post('/api/fan/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' })
  const fan = fans.get(email.trim().toLowerCase())
  if (!fan || fan.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }
  req.session.fanEmail = fan.email
  res.json({ success: true, fan: safeFan(fan) })
})

app.post('/api/fan/logout', (req, res) => {
  delete req.session.fanEmail
  res.json({ success: true })
})

function requireFan(req, res, next) {
  if (!req.session.fanEmail || !fans.has(req.session.fanEmail)) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  next()
}

app.get('/api/fan/me', requireFan, (req, res) => {
  res.json({ fan: safeFan(fans.get(req.session.fanEmail)) })
})

// Secure checkout — validates and masks card details (only last 4 digits are
// ever persisted); no raw PAN/CVV is stored, matching PCI-conscious handling
// even though this in-memory demo does not call out to a real card network.
function luhnValid(num) {
  let sum = 0, alt = false
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i], 10)
    if (alt) { n *= 2; if (n > 9) n -= 9 }
    sum += n
    alt = !alt
  }
  return sum % 10 === 0
}

app.post('/api/fan/pay', requireFan, (req, res) => {
  const fan = fans.get(req.session.fanEmail)
  if (fan.status !== 'pending_payment') {
    return res.status(400).json({ error: 'This account has already completed checkout' })
  }
  const { cardName, cardNumber, expiry, cvv } = req.body
  const digits = (cardNumber || '').replace(/\s+/g, '')
  if (!cardName || !cardName.trim()) return res.status(400).json({ error: 'Cardholder name is required' })
  if (!/^\d{13,19}$/.test(digits) || !luhnValid(digits)) return res.status(400).json({ error: 'Invalid card number' })
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry || '')) return res.status(400).json({ error: 'Expiry must be in MM/YY format' })
  const [mm, yy] = expiry.split('/').map(Number)
  const expDate = new Date(2000 + yy, mm, 0, 23, 59, 59)
  if (expDate < new Date()) return res.status(400).json({ error: 'Card has expired' })
  if (!/^\d{3,4}$/.test(cvv || '')) return res.status(400).json({ error: 'Invalid CVV' })

  fan.payment = {
    status: 'paid',
    method: 'card',
    last4: digits.slice(-4),
    amount: fan.ticketPrice,
    reference: `PAY-${crypto.randomBytes(6).toString('hex').toUpperCase()}`,
    paidAt: new Date().toISOString(),
  }
  fan.status = 'pending_approval'
  addFanNotification(fan, 'Payment received', `Your payment of ₦${fan.ticketPrice.toLocaleString()} was received. Awaiting admin approval.`)
  fans.set(fan.email, fan)
  res.json({ success: true, fan: safeFan(fan) })
})

app.patch('/api/fan/profile', requireFan, (req, res) => {
  const fan = fans.get(req.session.fanEmail)
  const { name, phone } = req.body
  // Email, LGA, preferred team and ticket category are locked once submitted —
  // they determine the ticket price/category already paid for, so only an
  // admin can change them (via a full refund/reissue, not implemented here).
  if (name !== undefined) {
    if (!name.trim()) return res.status(400).json({ error: 'Full name cannot be empty' })
    fan.name = name.trim()
  }
  if (phone !== undefined) {
    if (!phone.trim()) return res.status(400).json({ error: 'Phone number cannot be empty' })
    fan.phone = phone.trim()
  }
  fans.set(fan.email, fan)
  res.json({ success: true, fan: safeFan(fan) })
})

app.post('/api/fan/photo', requireFan, (req, res) => {
  fanPhotoUpload.single('photo')(req, res, err => {
    if (err) return res.status(400).json({ error: err.message })
    if (!req.file) return res.status(400).json({ error: 'No photo uploaded' })
    const ext = detectImageExt(req.file.buffer)
    if (!ext) return res.status(400).json({ error: 'Only JPG, PNG, WEBP and GIF images are allowed' })
    const fan = fans.get(req.session.fanEmail)
    const oldUrl = fan.photoUrl
    const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`
    fs.writeFileSync(path.join(fanUploadsDir, filename), req.file.buffer)
    fan.photoUrl = `/uploads/fans/${filename}`
    fans.set(fan.email, fan)
    if (oldUrl) fs.unlink(path.join(fanUploadsDir, path.basename(oldUrl)), () => {})
    res.json({ success: true, fan: safeFan(fan) })
  })
})

app.patch('/api/fan/notifications/:id/read', requireFan, (req, res) => {
  const fan = fans.get(req.session.fanEmail)
  const n = fan.notifications.find(n => n.id === req.params.id)
  if (!n) return res.status(404).json({ error: 'Notification not found' })
  n.read = true
  fans.set(fan.email, fan)
  res.json({ success: true })
})

// ---------- Admin: fan/ticket approval workflow ----------
app.get('/api/admin/fans', requireAdmin, (req, res) => {
  res.json({ fans: [...fans.values()].map(safeFan).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) })
})

app.patch('/api/admin/fans/:id/approve', requireAdmin, (req, res) => {
  const fan = [...fans.values()].find(f => f.id === req.params.id)
  if (!fan) return res.status(404).json({ error: 'Fan account not found' })
  if (fan.status !== 'pending_approval') return res.status(400).json({ error: 'Only fans awaiting approval can be approved' })

  const needsSeat = fan.ticketCategory !== 'Regular'
  const seatNumber = needsSeat
    ? `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}${1 + Math.floor(Math.random() * 30)}`
    : null
  const ticketId = `SCC26-${crypto.randomBytes(4).toString('hex').toUpperCase()}`
  const qrData = [
    'STARCRAFT CUP 2026', ticketId, fan.ticketCategory, fan.preferredTeam,
    'Ugbowo Campus Main Bowl — Group Stage · 1 Dec 2026, 4:00 PM',
    fan.name, fan.email,
  ].join('|')

  fan.status = 'approved'
  fan.ticket = {
    id: ticketId,
    qrData,
    matchDetails: 'Ugbowo Campus Main Bowl — Group Stage · 1 Dec 2026, 4:00 PM',
    seatNumber,
    generatedAt: new Date().toISOString(),
  }
  addFanNotification(fan, 'Ticket approved 🎉', `Your ${fan.ticketCategory} ticket for ${fan.preferredTeam} has been approved. Ticket ID: ${ticketId}.`)
  fans.set(fan.email, fan)
  res.json({ success: true, fan: safeFan(fan) })
})

app.patch('/api/admin/fans/:id/reject', requireAdmin, (req, res) => {
  const fan = [...fans.values()].find(f => f.id === req.params.id)
  if (!fan) return res.status(404).json({ error: 'Fan account not found' })
  if (fan.status !== 'pending_approval') return res.status(400).json({ error: 'Only fans awaiting approval can be rejected' })
  fan.status = 'rejected'
  addFanNotification(fan, 'Payment not approved', req.body?.note || 'Your payment could not be verified. Please contact support.')
  fans.set(fan.email, fan)
  res.json({ success: true, fan: safeFan(fan) })
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

  about: {
    hero: {
      title: 'About StarCraft Cup',
      subtitle: "The story, vision, and mission behind Edo State's premier youth football tournament",
    },
    story: {
      eyebrow: 'Our Story',
      heading: 'About StarCraft Cup',
      p1: 'The StarCraft Cup is a premier youth football tournament organized by the Oredo Local Government Area Football Board in partnership with the Edo State Sports Commission and the Edo State Government.',
      p2: 'Founded to unearth and develop raw U17–U20 talent from every community across Edo State, the tournament brings together one team from each of the state\'s 18 Local Government Areas, the tournament host, and the defending champion — 20 teams competing for glory on a world-class stage.',
      p3: 'The 2026 Premier Edition marks the founding of a competition designed to grow annually, creating a direct pathway for Edo\'s finest young players to reach professional football.',
    },
    motto: {
      heading: 'Tournament Motto',
      quote: 'Building Champions, Uniting Communities',
      text: 'Every match is a step toward excellence. Every player is a potential legend. Every community in Edo State is part of the legacy.',
    },
    vision: { heading: 'Vision', text: 'To become the most prestigious youth football tournament in Nigeria, producing world-class U17–U20 players, fostering community development, and elevating Edo State as a centre of sporting excellence across all five annual editions from 2026 to 2030.' },
    mission: { heading: 'Mission', text: 'To discover, develop, and promote youth football talent (ages U17–U20) from all 18 LGAs in Edo State through a structured, transparent, and world-class tournament that creates opportunities, employment, and community pride.' },
    values: [
      'Excellence — in every aspect of organization',
      'Integrity — fair play and transparency',
      'Inclusion — all 18 LGAs represented',
      'Innovation — world-class production standards',
      'Community — football for the people of Edo',
    ],
    objectives: [
      { icon: '🌍', title: 'Talent Discovery', desc: 'Identify and develop the next generation of Nigerian football stars from all 18 LGAs in Edo State, providing a structured U17–U20 competitive platform.' },
      { icon: '💰', title: 'Economic Impact', desc: 'Generate significant economic activity in Edo State through tourism, local business patronage, and job creation across all 20 match days.' },
      { icon: '🤝', title: 'LGA Unity', desc: 'Bring all 18 Local Government Areas together under one flag — representing every Edo community through the universal language of football.' },
      { icon: '🏟️', title: 'Infrastructure Development', desc: 'Maximize and sustain both the Ugbowo Campus Main Bowl and Ogbemudia Main Bowl for long-term community benefit and future editions.' },
      { icon: '📺', title: 'Media Visibility', desc: 'Showcase Edo State youth talent to national and international audiences through broadcast, social media coverage, and the Dec 19 media tour.' },
      { icon: '🌱', title: 'Youth Development', desc: 'Provide structured pathways for U17–U20 players to grow, compete, and progress — with scouting opportunities and the StarCraft Elite XI training program.' },
    ],
  },

  tournament: {
    hero: {
      title: 'The Tournament',
      subtitle: 'Competition format, schedule, rules, venues, and prize structure',
    },
    rules: [
      { rule: 'Players must be aged U17 to U20 (born between 2006 and 2009).' },
      { rule: 'Each team must register a squad of 18 players with valid NIN or student ID.' },
      { rule: 'Players must have verifiable ties to the LGA they represent.' },
      { rule: 'Matches are 90 minutes (two halves of 45 minutes).' },
      { rule: 'Knockout matches level at full time proceed to extra time (30 mins), then penalty shootout.' },
      { rule: 'A player receiving 2 yellow cards in the tournament is suspended for one match.' },
      { rule: 'A player receiving a red card is suspended for a minimum of one match.' },
      { rule: 'Teams must arrive at the venue at least 60 minutes before kickoff.' },
      { rule: 'All disputes are resolved by the Tournament Technical Committee.' },
      { rule: 'Anti-doping regulations as per NADAC guidelines apply to all players.' },
      { rule: 'The host LGA and defending champion are guaranteed automatic entry each edition.' },
    ],
    venues: [
      { icon: '🏟️', name: 'Ugbowo Campus Main Bowl', capacity: '10,000', surface: 'Hybrid Grass', facilities: 'Changing rooms, Medical bay, VIP lounge, Floodlights', role: 'Group Stage, Quarter-Finals & Semi-Finals', matches: 'Dec 2–12 (Group Stage) • Dec 14 (QF) • Dec 16 (SF)' },
      { icon: '🏆', name: 'Ogbemudia Main Bowl', capacity: '20,000', surface: 'Natural Grass', facilities: 'Full broadcast suite, Press box, VIP suites, LED screens', role: 'Grand Final & Closing Ceremony', matches: 'Dec 18 (Final + 3rd Place) • Dec 20 (Closing)' },
    ],
    format: {
      eyebrow: 'Competition Format',
      heading: 'How the Tournament Works',
      phases: [
        { phase: 'Group Stage', desc: '20 teams split into 4 groups of 5. Top 2 from each group advance to Quarter-Finals.' },
        { phase: 'Quarter-Finals', desc: '8 teams compete in single-elimination knockout matches.' },
        { phase: 'Semi-Finals', desc: '4 teams compete; winners advance to the Grand Final.' },
        { phase: 'Third Place Play-Off', desc: 'Semi-final losers compete for the bronze medal.' },
        { phase: 'Grand Final', desc: 'The two remaining teams compete for the StarCraft Cup and ₦5 million prize.' },
        { phase: 'Closing Ceremony', desc: 'Awards, prize giving, and the closing exhibition match.' },
      ],
    },
  },

  contact: {
    hero: {
      title: 'Get in Touch',
      subtitle: "We'd love to hear from you. Reach out for any enquiries.",
    },
    info: [
      { icon: '📍', label: 'Office Address', value: 'Oredo LGA Secretariat, Ring Road, Benin City, Edo State, Nigeria' },
      { icon: '📞', label: 'Phone Numbers', value: '+2348155576539\n+2348056042784\n+2347056445844' },
      { icon: '✉️', label: 'Email', value: 'info@starcraftcup.ng\npress@starcraftcup.ng' },
      { icon: '💬', label: 'WhatsApp', value: '+2349077575347' },
    ],
    faq: [
      { q: 'How do I register my team?', a: 'Click "Register Team" on the home page or visit our team registration page. Registration costs ₦25,000 per team and is open until February 15, 2027.' },
      { q: 'How can I buy tickets?', a: 'Tickets are available online on our website and at designated outlets across Benin City. Group/season tickets are also available.' },
      { q: 'When does the tournament start?', a: 'The StarCraft Cup 2026 Group Stage begins on December 1, 2026, with the Grand Final on December 18, 2026.' },
      { q: 'Who is eligible to play?', a: 'Players must be aged U17 to U20 with verifiable ties to the LGA they represent and valid NIN or student ID.' },
    ],
  },

  mediacenter: {
    hero: {
      title: 'Media Center',
      subtitle: 'Resources for press, journalists, and media organizations',
    },
    cards: [
      { icon: '📋', title: 'Press Accreditation', desc: 'Apply for press credentials to access restricted areas, mixed zones, and press conferences.', cta: 'Apply Now' },
      { icon: '📦', title: 'Media Kits', desc: 'Download comprehensive media packs containing tournament facts, stats, and backgrounders.', cta: 'Download' },
      { icon: '📸', title: 'Press Photos', desc: 'High-resolution official photography available for editorial use by accredited media.', cta: 'Access Photos' },
    ],
    downloads: [
      { icon: '🗂️', file: 'StarCraft Cup 2026 — Official Logo Pack', type: 'ZIP', size: '12.4 MB' },
      { icon: '📏', file: 'Brand Guidelines & Style Guide', type: 'PDF', size: '4.2 MB' },
      { icon: '📄', file: 'Tournament Fact Sheet', type: 'PDF', size: '890 KB' },
      { icon: '📦', file: 'Media Kit 2026', type: 'PDF', size: '18.7 MB' },
      { icon: '📸', file: 'Player Photo Pack — Group Stage', type: 'ZIP', size: '234 MB' },
      { icon: '📰', file: 'Opening Ceremony Press Release', type: 'PDF', size: '520 KB' },
      { icon: '📊', file: 'Tournament Infographic', type: 'PNG', size: '3.1 MB' },
    ],
    contacts: [
      { name: 'Miss Blessing Osaghae', role: 'Head of Media & Communications', email: 'media@starcraftcup.ng', phone: '+234 811 234 5678' },
      { name: 'Mr. Tony Okoye', role: 'Press Officer', email: 'press@starcraftcup.ng', phone: '+234 812 345 6789' },
      { name: 'Mrs. Chidinma Eze', role: 'Digital Media Manager', email: 'digital@starcraftcup.ng', phone: '+234 813 456 7890' },
    ],
  },

  news: {
    hero: {
      title: 'News & Updates',
      subtitle: 'Latest tournament news, press releases, match reports, and interviews',
    },
    categories: ['Tournament Updates', 'Match Reports', 'Press Releases', 'Statistics', 'Awards', 'Interviews'],
  },

  sponsors: {
    hero: {
      title: 'Our Sponsors',
      subtitle: 'The partners who make StarCraft Cup 2027 possible',
    },
    benefits: [
      { icon: '👥', title: 'Massive Reach', desc: 'Direct access to 47,500+ match attendees and 200,000+ social media followers across Nigeria.' },
      { icon: '📺', title: 'Broadcast Coverage', desc: 'Brand visibility on Supersport, Channels TV, and Silverbird Television throughout the tournament.' },
      { icon: '🏆', title: 'Brand Association', desc: "Associate your brand with excellence, youth development, and Nigeria's brightest football talent." },
      { icon: '🤝', title: 'Community Goodwill', desc: 'Build deep community goodwill by investing in the development of sport in Edo State.' },
      { icon: '📱', title: 'Digital Exposure', desc: 'Prominent placement on website, social media, email campaigns, and official tournament app.' },
      { icon: '🎖️', title: 'Exclusive Access', desc: 'VIP match tickets, access to players and coaches, and exclusive sponsor events.' },
    ],
    packages: [
      { tier: 'Platinum', price: '₦5,000,000', color: '#D4AF37', perks: 'Main shirt logo\nTV broadcast mentions\n10 VIP tickets per match\nFull digital package\nExclusive sponsor event' },
      { tier: 'Gold', price: '₦2,000,000', color: '#FFD700', perks: 'Shirt sleeve logo\nMatch programme full page\n6 VIP tickets per match\nSocial media features\nSponsor networking' },
      { tier: 'Silver', price: '₦750,000', color: '#c0c0c0', perks: 'Perimeter board advertising\nMatch programme half page\n4 tickets per match\nWebsite logo placement\nNewsletter mention' },
    ],
  },

  volunteers: {
    hero: {
      title: 'Be a Volunteer',
      subtitle: 'Join our team of passionate volunteers and be part of football history',
    },
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
  about: {
    hero: { title: isStr, subtitle: isStr },
    story: { eyebrow: isStr, heading: isStr, p1: isStr, p2: isStr, p3: isStr },
    motto: { heading: isStr, quote: isStr, text: isStr },
    vision: { heading: isStr, text: isStr },
    mission: { heading: isStr, text: isStr },
    values: isStrArray,
    objectives: isShapeArray({ icon: isStr, title: isStr, desc: isStr }),
  },
  tournament: {
    hero: { title: isStr, subtitle: isStr },
    rules: isShapeArray({ rule: isStr }),
    venues: isShapeArray({ icon: isStr, name: isStr, capacity: isStr, surface: isStr, facilities: isStr, role: isStr, matches: isStr }),
    format: {
      eyebrow: isStr, heading: isStr,
      phases: isShapeArray({ phase: isStr, desc: isStr }),
    },
  },
  contact: {
    hero: { title: isStr, subtitle: isStr },
    info: isShapeArray({ icon: isStr, label: isStr, value: isStr }),
    faq: isShapeArray({ q: isStr, a: isStr }),
  },
  mediacenter: {
    hero: { title: isStr, subtitle: isStr },
    cards: isShapeArray({ icon: isStr, title: isStr, desc: isStr, cta: isStr }),
    downloads: isShapeArray({ icon: isStr, file: isStr, type: isStr, size: isStr }),
    contacts: isShapeArray({ name: isStr, role: isStr, email: isStr, phone: isStr }),
  },
  news: {
    hero: { title: isStr, subtitle: isStr },
    categories: isStrArray,
  },
  sponsors: {
    hero: { title: isStr, subtitle: isStr },
    benefits: isShapeArray({ icon: isStr, title: isStr, desc: isStr }),
    packages: isShapeArray({ tier: isStr, price: isStr, color: isStr, perks: isStr }),
  },
  volunteers: {
    hero: { title: isStr, subtitle: isStr },
    benefits: isShapeArray({ icon: isStr, title: isStr, desc: isStr }),
    roles: isShapeArray({ role: isStr, slots: isStr, desc: isStr, requirements: isStr }),
    training: isShapeArray({ date: isStr, session: isStr, location: isStr }),
  },
}

function validateContent(page, content) {
  const schema = CONTENT_SCHEMAS[page]
  if (!schema) return 'No validation schema for this page'
  if (!content || typeof content !== 'object' || Array.isArray(content)) return 'content must be an object'
  for (const [section, fields] of Object.entries(schema)) {
    const value = content[section]
    // Section schema is a direct validator function (e.g. isStrArray, isShapeArray result)
    // meaning the section itself is an array/primitive — validate it directly.
    if (typeof fields === 'function') {
      if (!fields(value)) return `Missing or invalid section "${section}"`
      continue
    }
    // Section schema is an object map of field → validator
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
