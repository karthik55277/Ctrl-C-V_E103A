import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import '../../growth.css'

const Growth = () => {
  return (
    <>
      <Navbar />
      <div className="growth-container">
        <Sidebar showTitle={true} />
        <main className="growth-main fade-in">
          <section className="growth-header">
            <h1>Weekly Growth Plan</h1>
            <p>AI-generated roadmap based on your time, budget, and goals.</p>
          </section>

          <section className="ai-summary">
            <h2>AI Strategy Summary</h2>
            <p>
              With limited time and budget, AI recommends a
              <strong> low-cost, consistency-first strategy</strong>
              focused on organic content and audience engagement.
            </p>
          </section>

          <section className="weekly-plan">
            <h2>This Week's Action Plan</h2>
            <div className="plan-grid">
              <div className="task-card high">
                <div className="task-header">
                  <span className="priority high">HIGH PRIORITY</span>
                  <span>⏱ 20 min/day</span>
                </div>
                <h3>Post 3 Instagram Stories</h3>
                <p>Show behind-the-scenes bakery moments to build trust.</p>
                <div className="tags">
                  <span>#Organic</span><span>#LowEffort</span>
                </div>
              </div>

              <div className="task-card medium">
                <div className="task-header">
                  <span className="priority medium">MEDIUM</span>
                  <span>⏱ 15 min/day</span>
                </div>
                <h3>Reply to Comments & DMs</h3>
                <p>Increase reach through consistent engagement.</p>
                <div className="tags">
                  <span>#Engagement</span>
                </div>
              </div>

              <div className="task-card low">
                <div className="task-header">
                  <span className="priority low">LOW</span>
                  <span>⏱ One-time</span>
                </div>
                <h3>Optimize Profile Bio</h3>
                <p>Update bio with location, contact, and USP.</p>
                <div className="tags">
                  <span>#Branding</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default Growth
