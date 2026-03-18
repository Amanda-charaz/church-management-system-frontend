import React, { useEffect, useState } from 'react'
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

interface CellGroup {
  id: string
  name: string
  leader: string
  location: string
  meetingDay: string
  meetingTime: string
}

const CellGroups = () => {
  const { user } = useAuth()
  const [cellGroups, setCellGroups] = useState<CellGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '', leader: '', location: '', meetingDay: '', meetingTime: ''
  })

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  useEffect(() => { fetchCellGroups() }, [])

  const fetchCellGroups = async () => {
    try {
      const res = await API.get('/cellgroups')
      setCellGroups(res.data.cellGroups || [])
    } catch (err) {
      console.error('Error fetching cell groups:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await API.put(`/cellgroups/${editingId}`, form)
      } else {
        await API.post('/cellgroups', form)
      }
      setForm({ name: '', leader: '', location: '', meetingDay: '', meetingTime: '' })
      setShowForm(false)
      setEditingId(null)
      fetchCellGroups()
    } catch (err) {
      console.error('Error saving cell group:', err)
    }
  }

  const handleEdit = (cg: CellGroup) => {
    setForm({
      name: cg.name,
      leader: cg.leader,
      location: cg.location || '',
      meetingDay: cg.meetingDay || '',
      meetingTime: cg.meetingTime || ''
    })
    setEditingId(cg.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this cell group?')) return
    try {
      await API.delete(`/cellgroups/${id}`)
      fetchCellGroups()
    } catch (err) {
      console.error('Error deleting cell group:', err)
    }
  }

  const handleCancel = () => {
    setForm({ name: '', leader: '', location: '', meetingDay: '', meetingTime: '' })
    setShowForm(false)
    setEditingId(null)
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
            <h1 style={{ margin: 0, fontSize: '24px', color: '#1a2a4a' }}>Cell Groups</h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Manage church cell groups</p>
          </div>
          {(user?.role === 'ADMIN' || user?.role === 'PASTOR') && (
            <button onClick={() => setShowForm(!showForm)} style={{
              padding: '10px 20px', background: '#1a2a4a', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
            }}>+ Add Cell Group</button>
          )}
        </div>

        <div style={{ padding: '32px' }}>

          {/* Form */}
          {showForm && (
            <div style={{
              background: 'white', borderRadius: '12px', padding: '24px',
              marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ marginTop: 0, color: '#1a2a4a' }}>
                {editingId ? 'Edit Cell Group' : 'Add New Cell Group'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>Group Name *</label>
                    <input required type="text" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>Leader Name *</label>
                    <input required type="text" value={form.leader}
                      onChange={e => setForm({ ...form, leader: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>Location</label>
                    <input type="text" value={form.location}
                      onChange={e => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g. 123 Main St, Harare"
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>Meeting Day</label>
                    <select value={form.meetingDay}
                      onChange={e => setForm({ ...form, meetingDay: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}>
                      <option value="">Select day</option>
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>Meeting Time</label>
                    <input type="time" value={form.meetingTime}
                      onChange={e => setForm({ ...form, meetingTime: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                  <button type="submit" style={{
                    padding: '10px 24px', background: '#1a2a4a', color: 'white',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                  }}>{editingId ? 'Update' : 'Save'}</button>
                  <button type="button" onClick={handleCancel} style={{
                    padding: '10px 24px', background: '#e5e7eb', color: '#374151',
                    border: 'none', borderRadius: '8px', cursor: 'pointer'
                  }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* Cell Groups Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading...</div>
          ) : cellGroups.length === 0 ? (
            <div style={{
              background: 'white', borderRadius: '12px', padding: '60px',
              textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
              <h3 style={{ color: '#1a2a4a', marginBottom: '8px' }}>No Cell Groups Yet</h3>
              <p style={{ color: '#6b7280' }}>Add your first cell group to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              {cellGroups.map((cg, i) => (
                <div key={cg.id} style={{
                  background: 'white', borderRadius: '16px', padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  borderTop: `4px solid ${i % 3 === 0 ? '#1a2a4a' : i % 3 === 1 ? '#e67e22' : '#16a34a'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ fontSize: '36px' }}>🏠</div>
                    {(user?.role === 'ADMIN' || user?.role === 'PASTOR') && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleEdit(cg)} style={{
                          padding: '4px 10px', background: '#e0f2fe', color: '#0369a1',
                          border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
                        }}>Edit</button>
                        <button onClick={() => handleDelete(cg.id)} style={{
                          padding: '4px 10px', background: '#fee2e2', color: '#dc2626',
                          border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
                        }}>Delete</button>
                      </div>
                    )}
                  </div>
                  <h3 style={{ color: '#1a2a4a', fontSize: '18px', margin: '0 0 8px' }}>{cg.name}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
                      <span>👤</span> <span>{cg.leader}</span>
                    </div>
                    {cg.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
                        <span>📍</span> <span>{cg.location}</span>
                      </div>
                    )}
                    {cg.meetingDay && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '14px' }}>
                        <span>📅</span> <span>{cg.meetingDay}{cg.meetingTime ? ` at ${cg.meetingTime}` : ''}</span>
                      </div>
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

export default CellGroups
