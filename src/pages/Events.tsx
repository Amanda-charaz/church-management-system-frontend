import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

interface Event {
  id: string
  title: string
  description?: string
  date: string
  time?: string
  location?: string
  createdAt: string
}

const Events = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', location: '' })

  useEffect(() => { fetchEvents() }, [])

  const fetchEvents = async () => {
    try {
      const res = await API.get('/events')
      setEvents(res.data.events || [])
    } catch (err) {
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await API.post('/events', form)
      setForm({ title: '', description: '', date: '', time: '', location: '' })
      setShowForm(false)
      fetchEvents()
    } catch (err) {
      console.error('Error adding event:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this event?')) return
    try {
      await API.delete(`/events/${id}`)
      fetchEvents()
    } catch (err) {
      console.error('Error deleting event:', err)
    }
  }

  const isUpcoming = (date: string) => new Date(date) >= new Date()

  const upcomingEvents = events.filter(e => isUpcoming(e.date))
  const pastEvents = events.filter(e => !isUpcoming(e.date))

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar />
      <div style={{ marginLeft: window.innerWidth < 768 ? '0' : '240px', flex: 1, background: '#f0f4f8', minHeight: '100vh', paddingTop: window.innerWidth < 768 ? '60px' : '0' }}>

        {/* Header */}
        <div style={{
          background: 'white', padding: '16px 32px',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', borderBottom: '1px solid #e5e7eb'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#1a2a4a' }}>Events</h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Church events and services</p>
          </div>
          {(user?.role === 'ADMIN' || user?.role === 'PASTOR') && (
            <button onClick={() => setShowForm(!showForm)} style={{
              padding: '10px 20px', background: '#1a2a4a', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
            }}>+ Add Event</button>
          )}
        </div>

        <div style={{ padding: '32px' }}>

          {/* Add Event Form */}
          {showForm && (
            <div style={{
              background: 'white', borderRadius: '12px', padding: '24px',
              marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ marginTop: 0, color: '#1a2a4a' }}>New Event</h3>
              <form onSubmit={handleAdd}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#374151' }}>Title *</label>
                    <input type="text" required value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#374151' }}>Location</label>
                    <input type="text" value={form.location}
                      onChange={e => setForm({ ...form, location: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#374151' }}>Date *</label>
                    <input type="date" required value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#374151' }}>Time</label>
                    <input type="time" value={form.time}
                      onChange={e => setForm({ ...form, time: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#374151' }}>Description</label>
                  <textarea value={form.description} rows={3}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" style={{
                    padding: '10px 24px', background: '#1a2a4a', color: 'white',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                  }}>Save Event</button>
                  <button type="button" onClick={() => setShowForm(false)} style={{
                    padding: '10px 24px', background: '#e5e7eb', color: '#374151',
                    border: 'none', borderRadius: '8px', cursor: 'pointer'
                  }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>Loading...</div>
          ) : (
            <>
              {/* Upcoming Events */}
              <h2 style={{ color: '#1a2a4a', marginBottom: '16px' }}>📅 Upcoming Events ({upcomingEvents.length})</h2>
              {upcomingEvents.length === 0 ? (
                <div style={{ background: 'white', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#6b7280', marginBottom: '32px' }}>
                  No upcoming events. Add one above!
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '32px' }}>
                  {upcomingEvents.map(event => (
                    <div key={event.id} style={{
                      background: 'white', borderRadius: '12px', padding: '24px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: '4px solid #e67e22'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ margin: '0 0 12px', color: '#1a2a4a', fontSize: '18px' }}>{event.title}</h3>
                        {(user?.role === 'ADMIN' || user?.role === 'PASTOR') && (
                          <button onClick={() => handleDelete(event.id)} style={{
                            padding: '4px 10px', background: '#fee2e2', color: '#dc2626',
                            border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
                          }}>Delete</button>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{ color: '#e67e22', fontSize: '14px', fontWeight: 'bold' }}>
                          📅 {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                        {event.time && <span style={{ color: '#6b7280', fontSize: '14px' }}>🕐 {event.time}</span>}
                        {event.location && <span style={{ color: '#6b7280', fontSize: '14px' }}>📍 {event.location}</span>}
                      </div>
                      {event.description && <p style={{ color: '#374151', lineHeight: '1.6', margin: 0, fontSize: '14px' }}>{event.description}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <>
                  <h2 style={{ color: '#6b7280', marginBottom: '16px' }}>Past Events ({pastEvents.length})</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                    {pastEvents.map(event => (
                      <div key={event.id} style={{
                        background: 'white', borderRadius: '12px', padding: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: '4px solid #9ca3af', opacity: 0.7
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h3 style={{ margin: '0 0 12px', color: '#6b7280', fontSize: '18px' }}>{event.title}</h3>
                          {user?.role === 'ADMIN' && (
                            <button onClick={() => handleDelete(event.id)} style={{
                              padding: '4px 10px', background: '#fee2e2', color: '#dc2626',
                              border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
                            }}>Delete</button>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                            📅 {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                          {event.time && <span style={{ color: '#9ca3af', fontSize: '14px' }}>🕐 {event.time}</span>}
                          {event.location && <span style={{ color: '#9ca3af', fontSize: '14px' }}>📍 {event.location}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Events

