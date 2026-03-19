import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import API from '../api/axios'

const ChangePassword = () => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await API.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      })
      setSuccess(true)
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', flex: 1, background: '#f0f4f8', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{
          background: 'white', padding: '16px 32px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#1a2a4a' }}>Change Password</h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Update your account password</p>
        </div>

        <div style={{ padding: '32px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '480px' }}>
            <div style={{
              background: 'white', borderRadius: '16px', padding: '32px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔒</div>
                <h2 style={{ color: '#1a2a4a', margin: 0 }}>Update Password</h2>
                <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>
                  Choose a strong password to keep your account secure
                </p>
              </div>

              {success && (
                <div style={{
                  background: '#dcfce7', border: '1px solid #16a34a',
                  borderRadius: '8px', padding: '12px 16px', marginBottom: '20px',
                  color: '#16a34a', fontWeight: 'bold', textAlign: 'center'
                }}>
                  ✅ Password changed successfully!
                </div>
              )}

              {error && (
                <div style={{
                  background: '#fee2e2', border: '1px solid #dc2626',
                  borderRadius: '8px', padding: '12px 16px', marginBottom: '20px',
                  color: '#dc2626', textAlign: 'center'
                }}>
                  ❌ {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: 'bold' }}>
                    Current Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={form.currentPassword}
                    onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: 'bold' }}>
                    New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={form.newPassword}
                    onChange={e => setForm({ ...form, newPassword: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ marginBottom: '28px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px', fontWeight: 'bold' }}>
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '14px',
                  background: loading ? '#aaa' : 'linear-gradient(135deg, #1a2a4a, #2d4a7a)',
                  color: 'white', border: 'none', borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '15px', fontWeight: 'bold'
                }}>
                  {loading ? 'Updating...' : '🔒 Change Password'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword