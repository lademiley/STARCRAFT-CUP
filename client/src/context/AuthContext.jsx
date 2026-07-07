import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Admin credentials (in production these would be verified server-side)
const ADMIN_CREDENTIALS = {
  email: 'admin@starcraft2027.com',
  password: 'SC2027@Admin',
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
    <AuthContext.Provider value={{ user, setUser, admin, isAdmin, adminLogin, adminLogout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
