import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a2a4a 0%, #2d4a7a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif'
    }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '420px', padding: '0 20px' }}>
        
        {/* Church Logo */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: '#f0a500', margin: '0 auto 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '36px'
        }}>✝️</div>

        <h1 style={{ color: 'white', fontSize: '24px', letterSpacing: '2px', marginBottom: '4px' }}>
          Apostolic Faith Mission
        </h1>
        <p style={{ color: '#aac4e0', marginBottom: '32px' }}>Management System</p>

        {/* Login Card */}
        <div style={{
          background: 'white', borderRadius: '12px',
          padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ marginBottom: '24px', color: '#1a2a4a' }}>Welcome Back</h2>

          {error && (
            <div style={{
              background: '#fee2e2', color: '#dc2626', padding: '12px',
              borderRadius: '8px', marginBottom: '16px', fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px',
                  border: '1px solid #d1d5db', fontSize: '14px',
                  boxSizing: 'border-box', outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px', textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%', padding: '12px', borderRadius: '8px',
                  border: '1px solid #d1d5db', fontSize: '14px',
                  boxSizing: 'border-box', outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: '8px',
                background: loading ? '#93c5fd' : '#1a2a4a',
                color: 'white', fontSize: '16px', fontWeight: 'bold',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login