import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a2a4a 0%, #2d4a7a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif'
    }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '500px', padding: '0 20px' }}>
        
        {/* Logo */}
        <img
          src="/afm-logo.png"
          alt="AFM Logo"
          style={{ width: '90px', margin: '0 auto 16px', display: 'block' }}
        />
        <h1 style={{ color: 'white', fontSize: '24px', letterSpacing: '2px', marginBottom: '4px' }}>
          Apostolic Faith Mission
        </h1>
        <p style={{ color: '#aac4e0', marginBottom: '40px' }}>Management System</p>

        {/* Role Selection */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <h2 style={{ color: '#1a2a4a', marginBottom: '8px' }}>Who are you?</h2>
          <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '14px' }}>Select your role to continue</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            {/* Member - no login required */}
            <button
              onClick={() => navigate('/announcements-public')}
              style={{
                padding: '20px', borderRadius: '12px', border: '2px solid #e5e7eb',
                background: '#f9fafb', cursor: 'pointer', textAlign: 'center',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🙏</div>
              <div style={{ fontWeight: 'bold', color: '#1a2a4a' }}>Member</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>View announcements</div>
            </button>

            {/* Admin */}
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '20px', borderRadius: '12px', border: '2px solid #e5e7eb',
                background: '#f9fafb', cursor: 'pointer', textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>👑</div>
              <div style={{ fontWeight: 'bold', color: '#1a2a4a' }}>Admin</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Full access</div>
            </button>

            {/* Pastor */}
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '20px', borderRadius: '12px', border: '2px solid #e5e7eb',
                background: '#f9fafb', cursor: 'pointer', textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>✝️</div>
              <div style={{ fontWeight: 'bold', color: '#1a2a4a' }}>Pastor</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Members & visitors</div>
            </button>

            {/* Finance */}
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '20px', borderRadius: '12px', border: '2px solid #e5e7eb',
                background: '#f9fafb', cursor: 'pointer', textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
              <div style={{ fontWeight: 'bold', color: '#1a2a4a' }}>Finance</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Financial records</div>
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Home