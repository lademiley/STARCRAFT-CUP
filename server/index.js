import express from 'express'
import session from 'express-session'
import cors from 'cors'
import crypto from 'crypto'

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
  // Strip token before sending to client
  const { dashboardToken: _t, ...safe } = found
  res.json({ registration: safe })
})

// Team rep: add a player — authenticated by ref + dashboardToken in body
app.patch('/api/teams/registrations/by-ref/:ref/players', (req, res) => {
  const { token, player } = req.body
  const reg = [...teamRegistrations.values()].find(r => r.ref === req.params.ref)
  if (!reg) return res.status(404).json({ error: 'Registration not found' })
  const expected = Buffer.from(reg.dashboardToken)
  const provided  = Buffer.from((token || '').padEnd(reg.dashboardToken.length, '\0').slice(0, reg.dashboardToken.length))
  if (expected.length !== provided.length || !crypto.timingSafeEqual(expected, provided)) {
    return res.status(403).json({ error: 'Invalid access token' })
  }
  if (reg.status === 'rejected') return res.status(400).json({ error: 'Cannot modify a rejected registration' })
  if (reg.players.length >= 18) return res.status(400).json({ error: 'Maximum squad size of 18 reached' })
  if (!player || !player.name || !player.name.trim()) return res.status(400).json({ error: 'Player name is required' })
  reg.players = [...reg.players, player]
  teamRegistrations.set(reg.id, reg)
  console.log('[TeamReg AddPlayer]', reg.ref, player.name)
  const { dashboardToken: _t, ...safe } = reg
  res.json({ success: true, registration: safe })
})

// Admin: get all team registrations
app.get('/api/teams/registrations', requireAuth, (req, res) => {
  const all = [...teamRegistrations.values()]
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
  res.json({ registrations: all })
})

// Admin: approve a team registration
app.patch('/api/teams/registrations/:id/approve', requireAuth, (req, res) => {
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
app.patch('/api/teams/registrations/:id/reject', requireAuth, (req, res) => {
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
app.get('/api/orders', (req, res) => {
  const allOrders = [...orders.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  res.json({ orders: allOrders })
})

// Admin: confirm a payment
app.patch('/api/orders/:id/confirm', (req, res) => {
  const order = orders.get(req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  order.status = 'confirmed'
  order.confirmedAt = new Date().toISOString()
  orders.set(order.id, order)
  console.log('[Order Confirmed]', order.ref, '->', order.userEmail)
  res.json({ success: true, order })
})

// Admin: reject / cancel an order
app.patch('/api/orders/:id/reject', (req, res) => {
  const order = orders.get(req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  order.status = 'rejected'
  orders.set(order.id, order)
  res.json({ success: true, order })
})

// Admin: list all registered users (strip password hashes)
app.get('/api/users', (req, res) => {
  const allUsers = [...users.values()].map(({ passwordHash, ...safe }) => safe)
  res.json({ users: allUsers })
})

// ---------- Generic error handler ----------
app.use((err, req, res, next) => {
  console.error('[Error]', err.message)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`StarCraft Cup API server running on port ${PORT} [${isProd ? 'production' : 'development'}]`)
})
