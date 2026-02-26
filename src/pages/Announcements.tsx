import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

interface Announcement {
  id: string
  title: string
  content: string
  createdAt: string
}

const Announcements = () => {
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '' })

  useEffect(() => { fetchAnnouncements() }, [])

  const fetchAnnouncements = async () => {
    try {
      const res = await API.get('/announcements')
      setAnnouncements(res.data.announcements)
    } catch (err) {
      console.error('Error fetching announcements:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await API.post('/announcements', form)
      setForm({ title: '', content: '' })
      setShowForm(false)
      fetchAnnouncements()
    } catch (err) {
      console.error('Error adding announcement:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return
    try {
      await API.delete(`/announcements/${id}`)
      fetchAnnouncements()
    } catch (err) {
      console.error('Error deleting announcement:', err)
    }
  }

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', flex: 1, background: '#f0f4f8', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{
          background: 'white', padding: '16px 32px',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', borderBottom: '1px solid #e5e7eb'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#1a2a4a' }}>Announcements</h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Church announcements and notices</p>
          </div>
          {(user?.role === 'ADMIN' || user?.role === 'PASTOR') && (
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '10px 20px', background: '#1a2a4a', color: 'white',
                border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              + New Announcement
            </button>
          )}
        </div>

        <div style={{ padding: '32px' }}>

          {/* Add Announcement Form */}
          {showForm && (
            <div style={{
              background: 'white', borderRadius: '12px', padding: '24px',
              marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ marginTop: 0, color: '#1a2a4a' }}>New Announcement</h3>
              <form onSubmit={handleAdd}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>
                    Title
                  </label>
                  <input
                    type="text" value={form.title} required
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    style={{
                      width: '100%', padding: '10px', borderRadius: '8px',
                      border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>
                    Content
                  </label>
                  <textarea
                    value={form.content} required rows={4}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    style={{
                      width: '100%', padding: '10px', borderRadius: '8px',
                      border: '1px solid #d1d5db', fontSize: '14px',
                      boxSizing: 'border-box', resize: 'vertical'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" style={{
                    padding: '10px 24px', background: '#1a2a4a', color: 'white',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                  }}>Post Announcement</button>
                  <button type="button" onClick={() => setShowForm(false)} style={{
                    padding: '10px 24px', background: '#e5e7eb', color: '#374151',
                    border: 'none', borderRadius: '8px', cursor: 'pointer'
                  }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* Announcements List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>Loading...</div>
          ) : announcements.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>No announcements found</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {announcements.map(a => (
                <div key={a.id} style={{
                  background: 'white', borderRadius: '12px', padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  borderTop: '4px solid #1a2a4a'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, color: '#1a2a4a', fontSize: '18px' }}>{a.title}</h3>
                    <span style={{ color: '#6b7280', fontSize: '12px' }}>
                      {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ color: '#374151', lineHeight: '1.6', margin: '0 0 16px' }}>{a.content}</p>
                  {(user?.role === 'ADMIN' || user?.role === 'PASTOR') && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {user?.role === 'ADMIN' && (
                        <button
                          onClick={() => handleDelete(a.id)}
                          style={{
                            padding: '6px 12px', background: '#fee2e2', color: '#dc2626',
                            border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
                          }}
                        >Delete</button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Announcements