import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import '../styles/navbar.css'

const Navbar = () => {
  const location = useLocation()

  return (
    <nav className="navbar">
      <div className="logo">AI Growth Assistant</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><a href="#modules">Modules</a></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><a href="#fundraising">Fundraising</a></li>
        <li><Link to="/onboarding" className="btn-nav">Get Started</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar
