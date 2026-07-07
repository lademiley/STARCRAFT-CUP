import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
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

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/tournament" element={<Tournament />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/players" element={<Players />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/live-scores" element={<LiveScores />} />
          <Route path="/league-table" element={<LeagueTable />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/news" element={<News />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/media-center" element={<MediaCenter />} />
          <Route path="/volunteers" element={<Volunteers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default App
