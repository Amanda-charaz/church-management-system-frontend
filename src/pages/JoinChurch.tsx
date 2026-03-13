import React, { useState } from 'react'
import API from '../api/axios'
import { useNavigate } from 'react-router-dom'

const JoinChurch = () => {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', department: '', baptized: false
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const departments = [
    'General', 'Choir', 'Youth', 'Ushering', 'Evangelism',
    'Media', 'Children Ministry', 'Women Ministry', 'Men Ministry'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.post('/members/register', form)
      setSubmitted(true)
    } catch (err) {
      console.error('Error registering:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a2a4a 0%, #2d4a7a 60%, #e67e22 100%)',
      fontFamily: "'Georgia', serif"
    }}>
      {/* NAV */}
      <nav style={{ padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/')} style={{
          background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
          color: 'white', padding: '8px 20px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px'
        }}>← Back to Home</button>
        <div style={{ color: 'white', fontWeight: 'bold', letterSpacing: '2px', fontSize: '14px' }}>APOSTOLIC FAITH MISSION</div>
      </nav>

      <div style={{ padding: '20px 20px 60px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '40px', color: 'white' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>👥</div>
            <h1 style={{ fontSize: '36px', margin: '0 0 8px', letterSpacing: '2px' }}>Join Our Church</h1>
            <p style={{ color: '#aac4e0', fontSize: '16px', margin: 0 }}>
              Register as a member of Apostolic Faith Mission Zimbabwe
            </p>
          </div>

          {submitted ? (
            <div style={{
              background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '48px',
              textAlign: 'center', color: 'white', border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
              <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>Registration Submitted!</h2>
              <p style={{ color: '#aac4e0', lineHeight: 1.7, marginBottom: '32px' }}>
                Thank you for registering! Your application is pending approval by our admin team.
                We will be in touch soon. God bless you!
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => setSubmitted(false)} style={{
                  padding: '12px 24px', background: '#e67e22', color: 'white',
                  border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                }}>Register Another</button>
                <button onClick={() => navigate('/')} style={{
                  padding: '12px 24px', background: 'rgba(255,255,255,0.15)', color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', cursor: 'pointer'
                }}>Back to Home</button>
              </div>
            </div>
          ) : (
            <div style={{
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
              borderRadius: '20px', padding: '40px', border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>First Name *</label>
                    <input type="text" required value={form.firstName}
                      onChange={e => setForm({ ...form, firstName: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>Last Name *</label>
                    <input type="text" required value={form.lastName}
                      onChange={e => setForm({ ...form, lastName: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                </div>

                {/* Contact */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>Email</label>
                    <input type="email" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>Phone</label>
                    <input type="tel" value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                </div>

                {/* Address */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>Address</label>
                  <input type="text" value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="e.g. 123 Main Street, Harare"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>

                {/* Department */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>Department</label>
                  <select value={form.department}
                    onChange={e => setForm({ ...form, department: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)', background: '#2d4a7a', color: 'white', fontSize: '14px', boxSizing: 'border-box' }}>
                    <option value="">Select a department</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Baptized */}
                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>Are you baptized?</label>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', cursor: 'pointer' }}>
                      <input type="radio" name="baptized" value="true"
                        checked={form.baptized === true}
                        onChange={() => setForm({ ...form, baptized: true })} />
                      Yes
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', cursor: 'pointer' }}>
                      <input type="radio" name="baptized" value="false"
                        checked={form.baptized === false}
                        onChange={() => setForm({ ...form, baptized: false })} />
                      No
                    </label>
                  </div>
                </div>

                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '16px',
                  background: loading ? '#aaa' : 'linear-gradient(135deg, #e67e22, #f0a500)',
                  color: 'white', border: 'none', borderRadius: '10px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px', fontWeight: 'bold', letterSpacing: '1px'
                }}>
                  {loading ? 'Submitting...' : '✝️ Register as Member'}
                </button>
              </form>
              <p style={{ color: '#aac4e0', fontSize: '13px', textAlign: 'center', marginTop: '20px', marginBottom: 0 }}>
                Your registration will be reviewed and approved by our admin team.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default JoinChurch