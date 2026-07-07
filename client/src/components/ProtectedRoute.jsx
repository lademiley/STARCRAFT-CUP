import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAdmin, user } = useAuth()

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
