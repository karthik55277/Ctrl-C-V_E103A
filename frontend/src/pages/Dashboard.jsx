import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Link } from 'react-router-dom'
import '../../dashboard.css'

const Dashboard = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [originalData, setOriginalData] = useState({})
  const [formData, setFormData] = useState({
    businessType: 'Bakery',
    budget: '₹2,000 – ₹5,000',
    time: 'Less than 30 minutes',
    team: 'Solo',
    goal: 'Increase Sales'
  })

  useEffect(() => {
    // Load from localStorage
    const savedData = {
      businessType: localStorage.getItem('businessType') || formData.businessType,
      budget: localStorage.getItem('budget') || formData.budget,
      time: localStorage.getItem('time') || formData.time,
      team: localStorage.getItem('team') || formData.team,
      goal: localStorage.getItem('goal') || formData.goal
    }
    setFormData(savedData)
  }, [])

  const enableEdit = () => {
    setOriginalData({ ...formData })
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setFormData(originalData)
    setIsEditing(false)
  }

  const saveProfile = () => {
    Object.keys(formData).forEach(key => {
      localStorage.setItem(key, formData[key])
    })
    setIsEditing(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar showTitle={true} title="Dashboard" />
        <main className="dashboard-main">
          <section className="dashboard-header">
            <h1>Business Overview</h1>
            <p>Manage your business profile and AI settings.</p>
          </section>

          <section className="profile-card">
            <div className="card-header">
              <h2>Business Profile</h2>
              <div className="card-actions">
                {!isEditing ? (
                  <button className="btn outline" onClick={enableEdit}>Edit</button>
                ) : (
                  <button className="btn ghost" onClick={cancelEdit}>Cancel</button>
                )}
              </div>
            </div>

            <div className="profile-grid">
              <div className="field">
                <label>Business Type</label>
                <input
                  id="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="field">
                <label>Monthly Budget</label>
                <select
                  id="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option>₹0 – ₹2,000</option>
                  <option>₹2,000 – ₹5,000</option>
                  <option>₹5,000 – ₹10,000</option>
                  <option>₹10,000+</option>
                </select>
              </div>

              <div className="field">
                <label>Daily Time Available</label>
                <select
                  id="time"
                  value={formData.time}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option>Less than 30 minutes</option>
                  <option>30 – 60 minutes</option>
                  <option>1 – 2 hours</option>
                  <option>More than 2 hours</option>
                </select>
              </div>

              <div className="field">
                <label>Team Size</label>
                <select
                  id="team"
                  value={formData.team}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option>Solo</option>
                  <option>2 – 3 people</option>
                  <option>4 – 6 people</option>
                  <option>6+ people</option>
                </select>
              </div>

              <div className="field">
                <label>Primary Goal</label>
                <select
                  id="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option>Increase Sales</option>
                  <option>Increase Visibility</option>
                  <option>Build Brand</option>
                  <option>Raise Funds</option>
                </select>
              </div>
            </div>

            {isEditing && (
              <div className="save-actions">
                <button className="btn primary" onClick={saveProfile}>Save Changes</button>
              </div>
            )}
          </section>

          <section className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/growth" className="action-card">📋 View Growth Plan</Link>
              <Link to="/content" className="action-card">✍️ Generate Content</Link>
              <Link to="/engagement" className="action-card">💬 Reply Suggestions</Link>
              <Link to="/fundraising" className="action-card">🤝 Create Funding Pitch</Link>
              <Link to="/image-assistant" className="action-card">🖼️ AI Image Content</Link>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default Dashboard
