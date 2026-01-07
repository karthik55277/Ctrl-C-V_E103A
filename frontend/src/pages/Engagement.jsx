import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import '../../engagement.css'

const Engagement = () => {
  return (
    <>
      <Navbar />
      <div className="engagement-container">
        <Sidebar showTitle={true} />
        <main className="engagement-main">
          <h1>Engagement & Reply Assistant</h1>
          <p>AI-generated reply suggestions for comments and DMs.</p>

          <div className="engagement-grid">
            <div className="message-card">
              <h3>Customer Comment</h3>
              <p className="incoming">
                "Do you make eggless cakes?"
              </p>

              <h4>AI Suggested Reply</h4>
              <p className="suggested">
                "Yes! We offer a variety of delicious eggless cakes 😊  
                Feel free to DM us for today's options."
              </p>

              <div className="actions">
                <button className="btn primary">Approve</button>
                <button className="btn ghost">Edit</button>
              </div>
            </div>

            <div className="message-card">
              <h3>Instagram DM</h3>
              <p className="incoming">
                "What's the price for a 1kg chocolate cake?"
              </p>

              <h4>AI Suggested Reply</h4>
              <p className="suggested">
                "Our 1kg chocolate cake starts at ₹900 🍫  
                Let us know if you'd like customization!"
              </p>

              <div className="actions">
                <button className="btn primary">Approve</button>
                <button className="btn ghost">Edit</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Engagement
