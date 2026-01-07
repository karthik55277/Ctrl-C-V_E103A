import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import Growth from './pages/Growth'
import Content from './pages/Content'
import Engagement from './pages/Engagement'
import Performance from './pages/Performance'
import Fundraising from './pages/Fundraising'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/growth" element={<Growth />} />
        <Route path="/content" element={<Content />} />
        <Route path="/engagement" element={<Engagement />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/fundraising" element={<Fundraising />} />
      </Routes>
    </Router>
  )
}

export default App
