import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import '../../style.css'

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="container">
        <Sidebar showTitle={true} title="Modules" />
        <main className="main">
          <section className="hero fade-in">
            <h1>AI Advertising & Fundraising Assistant</h1>
            <p>
              A constraint-aware AI system that acts as a <strong>virtual growth manager</strong>
              for small businesses.
            </p>
            <div className="hero-buttons">
              <Link to="/onboarding" className="btn primary">Start Onboarding</Link>
              <Link to="/dashboard" className="btn secondary">View Dashboard</Link>
            </div>
          </section>

          <section className="modules">
            <h2>System Modules</h2>
            <div className="module-grid">
              <div className="card">
                <h3>📋 Business Profiling</h3>
                <p>Understands budget, time, and goals with minimal effort.</p>
              </div>
              <div className="card">
                <h3>🧠 AI Decision Engine</h3>
                <p>Suggests only feasible and realistic growth actions.</p>
              </div>
              <div className="card">
                <h3>✍️ Content Creation</h3>
                <p>Generates captions, ideas, hashtags, and stories.</p>
              </div>
              <div className="card">
                <h3>💬 Engagement Support</h3>
                <p>AI-assisted replies for comments and DMs.</p>
              </div>
              <div className="card">
                <h3>📈 Performance Tracking</h3>
                <p>Tracks engagement and improves future plans.</p>
              </div>
              <div className="card">
                <h3>🤝 Fundraising</h3>
                <p>Connects vendors with funders and collaborators.</p>
              </div>
            </div>
          </section>

          <footer className="footer">
            <p>© 2026 AI Advertising & Fundraising Assistant</p>
          </footer>
        </main>
      </div>
    </>
  )
}

export default Home
