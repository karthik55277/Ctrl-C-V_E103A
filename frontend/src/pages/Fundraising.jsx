import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import '../../fundraising.css'

const Fundraising = () => {
  return (
    <>
      <Navbar />
      <div className="fundraising-container">
        <Sidebar showTitle={false} />
        <main className="fundraising-main">
          <h1>Fundraising & Collaboration</h1>

          <div className="pitch-card">
            <h3>Business Pitch</h3>
            <p>
              We are a local bakery focused on quality, freshness, and customer trust.
              Seeking small funding to expand reach and production.
            </p>

            <h4>Funding Required</h4>
            <p>₹50,000 – ₹1,00,000</p>

            <h4>Looking For</h4>
            <span className="tag">Marketing Help</span>
            <span className="tag">Delivery Partner</span>

            <div style={{ marginTop: '20px' }}>
              <button className="btn primary">Publish Pitch</button>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Fundraising
