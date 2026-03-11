import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

interface PrayerRequest {
  id: string
  name?: string
  request: string
  status: string
  createdAt: string
}

const PrayerRequests = () => {
  const { user } = useAuth()
  const [requests, setRequests] = useState<PrayerRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => { fetchRequests() }, [])

  const fetchRequests = async () => {
    try {
      const res = await API.get('/prayer')
      setRequests(res.data.requests || [])
    } catch (err) {
      console.error('Error fetching prayer requests:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await API.put(`/prayer/${id}`, { status })
      fetchRequests()
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this prayer request?')) return
    try {
      await API.delete(`/prayer/${id}`)
      fetchRequests()
    } catch (err) {
      console.error('Error deleting:', err)
    }
  }

  const filtered = filter === 'ALL' ? requests : requests.filter(r => r.status === filter)

  const counts = {
    ALL: requests.length,
    PENDING: requests.filter(r => r.status === 'PENDING').length,
    PRAYED: requests.filter(r => r.status === 'PRAYED').length,
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
          <h1 style={{ margin: 0, fontSize: '24px', color: '#1a2a4a' }}>🙏 Prayer Requests</h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Manage and pray over church prayer requests</p>
        </div>

        <div style={{ padding: '32px' }}>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
            {[
              { label: 'Total Requests', count: counts.ALL, color: '#1a2a4a', bg: '#e8edf5' },
              { label: 'Pending Prayer', count: counts.PENDING, color: '#d97706', bg: '#fef3c7' },
              { label: 'Prayed For', count: counts.PRAYED, color: '#16a34a', bg: '#dcfce7' },
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: '12px', padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)', textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', fontWeight: 'bold', color: stat.color }}>{stat.count}</div>
                <div style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {['ALL', 'PENDING', 'PRAYED'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '8px 20px', borderRadius: '20px', border: 'none',
                cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
                background: filter === f ? '#1a2a4a' : '#e5e7eb',
                color: filter === f ? 'white' : '#374151'
              }}>{f} ({counts[f as keyof typeof counts]})</button>
            ))}
          </div>

          {/* Requests List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>Loading...</div>
          ) : filtered.length === 0 ? (
            <div style={{ background: 'white', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#6b7280' }}>
              No prayer requests found.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filtered.map(req => (
                <div key={req.id} style={{
                  background: 'white', borderRadius: '12px', padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  borderLeft: `4px solid ${req.status === 'PRAYED' ? '#16a34a' : '#d97706'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontWeight: 'bold', color: '#1a2a4a', fontSize: '16px' }}>
                        {req.name || 'Anonymous'}
                      </span>
                      <span style={{ marginLeft: '12px', fontSize: '12px', color: '#6b7280' }}>
                        {new Date(req.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <span style={{
                      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
                      background: req.status === 'PRAYED' ? '#dcfce7' : '#fef3c7',
                      color: req.status === 'PRAYED' ? '#16a34a' : '#d97706'
                    }}>{req.status}</span>
                  </div>
                  <p style={{ color: '#374151', lineHeight: 1.7, margin: '0 0 16px', fontSize: '15px' }}>
                    {req.request}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {req.status === 'PENDING' && (
                      <button onClick={() => handleStatusUpdate(req.id, 'PRAYED')} style={{
                        padding: '8px 16px', background: '#dcfce7', color: '#16a34a',
                        border: 'none', borderRadius: '8px', cursor: 'pointer',
                        fontSize: '13px', fontWeight: 'bold'
                      }}>✅ Mark as Prayed</button>
                    )}
                    {req.status === 'PRAYED' && (
                      <button onClick={() => handleStatusUpdate(req.id, 'PENDING')} style={{
                        padding: '8px 16px', background: '#fef3c7', color: '#d97706',
                        border: 'none', borderRadius: '8px', cursor: 'pointer',
                        fontSize: '13px', fontWeight: 'bold'
                      }}>🔄 Mark as Pending</button>
                    )}
                    {user?.role === 'ADMIN' && (
                      <button onClick={() => handleDelete(req.id)} style={{
                        padding: '8px 16px', background: '#fee2e2', color: '#dc2626',
                        border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
                      }}>Delete</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PrayerRequestsv