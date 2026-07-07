import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Admin credentials (in production these would be verified server-side)
const ADMIN_CREDENTIALS = {
  email: 'admin@starcraft2026.com',
  password: 'SC2026@Admin',
  name: 'Super Admin',
  role: 'superadmin',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [admin, setAdmin] = useState(() => {
    try {
      const stored = sessionStorage.getItem('sc_admin')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  // Restore session on page load
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.user) setUser(data.user) })
      .catch(() => {})
  }, [])

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { success: false, error: data.error || 'Login failed' }
      setUser(data.user)
      return { success: true, user: data.user }
    } catch {
      return { success: false, error: 'Network error — please try again' }
    }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {})
    setUser(null)
  }

  const adminLogin = (email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminData = {
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role,
        loginAt: new Date().toISOString(),
      }
      sessionStorage.setItem('sc_admin', JSON.stringify(adminData))
      setAdmin(adminData)
      return { success: true }
    }
    return { success: false, error: 'Invalid admin credentials' }
  }

  const adminLogout = () => {
    sessionStorage.removeItem('sc_admin')
    setAdmin(null)
  }

  const isAdmin = !!admin && admin.role === 'superadmin'

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, admin, isAdmin, adminLogin, adminLogout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
