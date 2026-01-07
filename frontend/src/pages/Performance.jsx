import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import '../../performance.css'

const Performance = () => {
  return (
    <>
      <Navbar />
      <div className="performance-container">
        <Sidebar showTitle={false} />
        <main className="performance-main">
          <h1>Performance Analytics</h1>

          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Engagement Rate</h3>
              <p className="metric">+18%</p>
            </div>

            <div className="metric-card">
              <h3>Profile Reach</h3>
              <p className="metric">12.4K</p>
            </div>

            <div className="metric-card">
              <h3>Content Consistency</h3>
              <p className="metric">Good</p>
            </div>

            <div className="metric-card">
              <h3>AI Improvement Score</h3>
              <p className="metric">↑ Improving</p>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Performance
