import React, { useEffect, useState } from 'react'
import API from '../api/axios'

const AnnouncementsPublic = () => {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    fetchAnnouncements()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a2a4a 0%, #2d4a7a 100%)',
      fontFamily: 'Georgia, serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.1)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <img src="/afm-logo.png" alt="AFM Logo" style={{ width: '50px' }} />
        <div>
          <h1 style={{ color: 'white', margin: 0, fontSize: '20px' }}>Apostolic Faith Mission</h1>
          <p style={{ color: '#aac4e0', margin: 0, fontSize: '13px' }}>Church Announcements</p>
        </div>
      </div>

      {/* Announcements */}
      <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}>
        {loading ? (
          <p style={{ color: 'white', textAlign: 'center' }}>Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p style={{ color: 'white', textAlign: 'center' }}>No announcements yet.</p>
        ) : announcements.map((a: any) => (
          <div key={a.id} style={{
            background: 'white', borderRadius: '12px',
            padding: '24px', marginBottom: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ color: '#1a2a4a', margin: '0 0 8px' }}>{a.title}</h3>
            <p style={{ color: '#6b7280', margin: '0 0 12px' }}>{a.content}</p>
            <span style={{ color: '#aac4e0', fontSize: '13px' }}>
              {new Date(a.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnnouncementsPublic