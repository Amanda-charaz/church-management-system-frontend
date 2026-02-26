import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

interface Visitor {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  visitDate: string
  followUp: boolean
  notes: string
}

const Visitors = () => {
  const { user } = useAuth()
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', email: '', notes: ''
  })

  useEffect(() => { fetchVisitors() }, [])

  const fetchVisitors = async () => {
    try {
      const res = await API.get('/visitors')
      setVisitors(res.data.visitors)
    } catch (err) {
      console.error('Error fetching visitors:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await API.post('/visitors', form)
      setForm({ firstName: '', lastName: '', phone: '', email: '', notes: '' })
      setShowForm(false)
      fetchVisitors()
    } catch (err) {
      console.error('Error adding visitor:', err)
    }
  }

  const handleFollowUp = async (id: string, current: boolean) => {
    try {
      await API.put(`/visitors/${id}`, { followUp: !current })
      fetchVisitors()
    } catch (err) {
      console.error('Error updating visitor:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this visitor?')) return
    try {
      await API.delete(`/visitors/${id}`)
      fetchVisitors()
    } catch (err) {
      console.error('Error deleting visitor:', err)
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
            <h1 style={{ margin: 0, fontSize: '24px', color: '#1a2a4a' }}>Visitors</h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Track and follow up with visitors</p>
          </div>
          {(user?.role === 'ADMIN' || user?.role === 'PASTOR') && (
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '10px 20px', background: '#1a2a4a', color: 'white',
                border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              + Add Visitor
            </button>
          )}
        </div>

        <div style={{ padding: '32px' }}>

          {/* Add Visitor Form */}
          {showForm && (
            <div style={{
              background: 'white', borderRadius: '12px', padding: '24px',
              marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ marginTop: 0, color: '#1a2a4a' }}>Add New Visitor</h3>
              <form onSubmit={handleAdd}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { label: 'First Name', key: 'firstName', type: 'text' },
                    { label: 'Last Name', key: 'lastName', type: 'text' },
                    { label: 'Phone', key: 'phone', type: 'text' },
                    { label: 'Email', key: 'email', type: 'email' },
                    { label: 'Notes', key: 'notes', type: 'text' },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        value={form[field.key as keyof typeof form]}
                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                        style={{
                          width: '100%', padding: '10px', borderRadius: '8px',
                          border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                  <button type="submit" style={{
                    padding: '10px 24px', background: '#1a2a4a', color: 'white',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                  }}>Save Visitor</button>
                  <button type="button" onClick={() => setShowForm(false)} style={{
                    padding: '10px 24px', background: '#e5e7eb', color: '#374151',
                    border: 'none', borderRadius: '8px', cursor: 'pointer'
                  }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* Visitors List */}
          <div style={{
            background: 'white', borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Name', 'Phone', 'Email', 'Visit Date', 'Follow Up', 'Notes', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left',
                      color: '#6b7280', fontSize: '13px', fontWeight: '600',
                      borderBottom: '1px solid #e5e7eb'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>Loading...</td></tr>
                ) : visitors.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>No visitors found</td></tr>
                ) : visitors.map(visitor => (
                  <tr key={visitor.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '50%',
                          background: '#f0a500', color: 'white',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                        }}>
                          {visitor.firstName.charAt(0)}
                        </div>
                        <span style={{ fontWeight: '500' }}>{visitor.firstName} {visitor.lastName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>{visitor.phone || '-'}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>{visitor.email || '-'}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                      {new Date(visitor.visitDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => handleFollowUp(visitor.id, visitor.followUp)}
                        style={{
                          padding: '4px 10px', borderRadius: '20px', fontSize: '12px', border: 'none',
                          cursor: 'pointer',
                          background: visitor.followUp ? '#dcfce7' : '#fee2e2',
                          color: visitor.followUp ? '#16a34a' : '#dc2626'
                        }}
                      >
                        {visitor.followUp ? '✅ Done' : '⏳ Pending'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>{visitor.notes || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {user?.role === 'ADMIN' && (
                        <button
                          onClick={() => handleDelete(visitor.id)}
                          style={{
                            padding: '6px 12px', background: '#fee2e2', color: '#dc2626',
                            border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
                          }}
                        >Delete</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Visitors