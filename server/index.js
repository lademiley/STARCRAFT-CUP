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

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, server-to-server) only in dev
    if (!origin && !isProd) return cb(null, true)
    if (allowedOrigins.includes(origin)) return cb(null, true)
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
app.post('/api/teams/register', (req, res) => {
  const { teamName, coach, email } = req.body
  if (!teamName || !email) {
    return res.status(400).json({ error: 'Team name and email are required' })
  }
  console.log('[TeamReg]', { teamName, coach, email })
  res.json({
    success: true,
    reference: `SC2027-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
  })
})

// ---------- Generic error handler ----------
app.use((err, req, res, next) => {
  console.error('[Error]', err.message)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`StarCraft Cup API server running on port ${PORT} [${isProd ? 'production' : 'development'}]`)
})
