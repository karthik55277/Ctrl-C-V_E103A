import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import '../../style.css'

const Onboarding = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    businessType: '',
    budget: '₹2,000 – ₹5,000',
    time: 'Less than 30 minutes',
    team: 'Solo',
    goal: 'Increase Sales'
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Save to localStorage
    Object.keys(formData).forEach(key => {
      localStorage.setItem(key, formData[key])
    })
    navigate('/dashboard')
  }

  return (
    <>
      <Navbar />
      <section className="onboarding-page">
        <div className="onboarding-wrapper fade-in">
          <h1>Business Onboarding</h1>
          <p className="subtitle">
            Help us understand your business so our AI can recommend
            <strong> realistic growth actions</strong>.
          </p>

          <form className="onboarding-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Business Type</label>
              <input
                type="text"
                name="businessType"
                placeholder="Eg: Bakery, Clothing Store, Freelancer"
                value={formData.businessType}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Monthly Marketing Budget</label>
              <select
                name="budget"
                value={formData.budget}
                onChange={handleChange}
              >
                <option>₹0 – ₹2,000</option>
                <option>₹2,000 – ₹5,000</option>
                <option>₹5,000 – ₹10,000</option>
                <option>₹10,000+</option>
              </select>
            </div>

            <div className="form-group">
              <label>Daily Time Available</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
              >
                <option>Less than 30 minutes</option>
                <option>30 – 60 minutes</option>
                <option>1 – 2 hours</option>
                <option>More than 2 hours</option>
              </select>
            </div>

            <div className="form-group">
              <label>Team Size</label>
              <select
                name="team"
                value={formData.team}
                onChange={handleChange}
              >
                <option>Solo</option>
                <option>2 – 3 people</option>
                <option>4 – 6 people</option>
                <option>6+ people</option>
              </select>
            </div>

            <div className="form-group">
              <label>Primary Goal</label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
              >
                <option>Increase Sales</option>
                <option>Increase Visibility</option>
                <option>Build Brand</option>
                <option>Raise Funds</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn primary">Continue to Dashboard</button>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default Onboarding
