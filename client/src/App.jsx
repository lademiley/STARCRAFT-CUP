import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Tournament from './pages/Tournament'
import Teams from './pages/Teams'
import Players from './pages/Players'
import Fixtures from './pages/Fixtures'
import LiveScores from './pages/LiveScores'
import LeagueTable from './pages/LeagueTable'
import Statistics from './pages/Statistics'
import Gallery from './pages/Gallery'
import News from './pages/News'
import Sponsors from './pages/Sponsors'
import MediaCenter from './pages/MediaCenter'
import Volunteers from './pages/Volunteers'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import Tickets from './pages/Tickets'
import Profile from './pages/Profile'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// Layout wrapper for public pages (with Navbar + Footer)
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Admin routes — no Navbar/Footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Public routes — with Navbar + Footer */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/tournament" element={<PublicLayout><Tournament /></PublicLayout>} />
          <Route path="/teams" element={<PublicLayout><Teams /></PublicLayout>} />
          <Route path="/players" element={<PublicLayout><Players /></PublicLayout>} />
          <Route path="/fixtures" element={<PublicLayout><Fixtures /></PublicLayout>} />
          <Route path="/live-scores" element={<PublicLayout><LiveScores /></PublicLayout>} />
          <Route path="/league-table" element={<PublicLayout><LeagueTable /></PublicLayout>} />
          <Route path="/statistics" element={<PublicLayout><Statistics /></PublicLayout>} />
          <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
          <Route path="/news" element={<PublicLayout><News /></PublicLayout>} />
          <Route path="/sponsors" element={<PublicLayout><Sponsors /></PublicLayout>} />
          <Route path="/media-center" element={<PublicLayout><MediaCenter /></PublicLayout>} />
          <Route path="/volunteers" element={<PublicLayout><Volunteers /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
          <Route path="/tickets" element={<PublicLayout><Tickets /></PublicLayout>} />
          <Route path="/profile" element={<PublicLayout><Profile /></PublicLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
