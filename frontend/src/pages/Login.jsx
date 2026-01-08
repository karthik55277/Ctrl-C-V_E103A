import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) return alert('Please enter email and password')
    // TODO: integrate real auth
    navigate('/dashboard')
  }

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-wrapper">
          <div className="auth-card fade-in">
            <h2>Welcome Back</h2>
            <p className="auth-sub">Login to your account to continue</p>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>Username</label>
                <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input className="auth-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
              </div>

              <div className="auth-actions">
                <button type="submit" className="btn primary" style={{width:'100%'}}>Login</button>
              </div>

              <div className="auth-footer">
                <Link to="/signup" style={{color:'#22c55e',fontWeight:600}}>Create account</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
