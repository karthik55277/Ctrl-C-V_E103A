import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Signup = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !password) return alert('Please fill all fields')
    // TODO: call backend signup endpoint
    // on success proceed to onboarding
    navigate('/onboarding')
  }

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-wrapper">
          <div className="auth-card fade-in">
            <h2>Create account</h2>
            <p className="auth-sub">Sign up to get started with your business onboarding.</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Name</label>
                <input className="auth-input" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@business.com" />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input className="auth-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" />
              </div>

              <div className="auth-actions">
                <button type="submit" className="btn primary" style={{width:'100%'}}>Create account & Get Started</button>
              </div>

              <div className="auth-footer">
                <Link to="/login" style={{color:'#22c55e',fontWeight:600}}>Already have an account? Login</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup
