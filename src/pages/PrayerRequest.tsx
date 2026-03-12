import React, { useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

const PrayerRequest = (): JSX.Element=> {
  const [form, setForm] = useState({ name: '', request: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.post('/prayer', form)
      setSubmitted(true)
      setForm({ name: '', request: '' })
    } catch (err) {
      console.error('Error submitting prayer request:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a4a 0%, #2d4a7a 60%, #e67e22 100%)', fontFamily: "'Georgia', serif", display: 'flex', flexDirection: 'column' }}>
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px' }}>← Back to Home</button>
        <div style={{ color: 'white', fontWeight: 'bold', letterSpacing: '2px', fontSize: '14px' }}>APOSTOLIC FAITH MISSION</div>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: '560px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px', color: 'white' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🙏</div>
            <h1 style={{ fontSize: '36px', margin: '0 0 8px', letterSpacing: '2px' }}>Prayer Requests</h1>
            <p style={{ color: '#aac4e0', fontSize: '16px', margin: 0 }}>Share your prayer needs with us. Our pastors pray over every request.</p>
          </div>

          {submitted ? (
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '48px', textAlign: 'center', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>✝️</div>
              <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Your request has been received!</h2>
              <p style={{ color: '#aac4e0', lineHeight: 1.7, marginBottom: '32px' }}>Our pastors will be praying for you. May God's grace and peace be with you.</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => setSubmitted(false)} style={{ padding: '12px 24px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Submit Another</button>
                <button onClick={() => navigate('/')} style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', cursor: 'pointer' }}>Back to Home</button>
              </div>
            </div>
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '40px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>Your Name <span style={{ color: '#aac4e0', fontWeight: 'normal' }}>(optional — anonymous)</span></label>
                  <input type="text" placeholder="Anonymous" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '15px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>Your Prayer Request *</label>
                  <textarea required rows={6} placeholder="Share what's on your heart..."
                    value={form.request} onChange={e => setForm({ ...form, request: e.target.value })}
                    style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '15px', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>
                <button type="submit" disabled={loading} style={{ width: '100%', padding: '16px', background: loading ? '#aaa' : 'linear-gradient(135deg, #e67e22, #f0a500)', color: 'white', border: 'none', borderRadius: '10px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                  {loading ? 'Submitting...' : '🙏 Submit Prayer Request'}
                </button>
              </form>
              <p style={{ color: '#aac4e0', fontSize: '13px', textAlign: 'center', marginTop: '20px', marginBottom: 0 }}>All prayer requests are handled with care and confidentiality.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PrayerRequest