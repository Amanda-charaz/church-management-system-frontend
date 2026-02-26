import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import API from '../api/axios'

interface Finance {
  id: string
  title: string
  amount: number
  type: string
  description: string
  createdAt: string
}

interface Summary {
  totalIncome: number
  totalExpense: number
  balance: number
}

const Finance = () => {
  const [finances, setFinances] = useState<Finance[]>([])
  const [summary, setSummary] = useState<Summary>({ totalIncome: 0, totalExpense: 0, balance: 0 })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', amount: '', type: 'INCOME', description: ''
  })

  useEffect(() => { fetchFinances() }, [])

  const fetchFinances = async () => {
    try {
      const res = await API.get('/finances')
      setFinances(res.data.finances)
      setSummary(res.data.summary)
    } catch (err) {
      console.error('Error fetching finances:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await API.post('/finances', { ...form, amount: parseFloat(form.amount) })
      setForm({ title: '', amount: '', type: 'INCOME', description: '' })
      setShowForm(false)
      fetchFinances()
    } catch (err) {
      console.error('Error adding finance:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return
    try {
      await API.delete(`/finances/${id}`)
      fetchFinances()
    } catch (err) {
      console.error('Error deleting finance:', err)
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
            <h1 style={{ margin: 0, fontSize: '24px', color: '#1a2a4a' }}>Finance</h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Financial management and reports</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '10px 20px', background: '#1a2a4a', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
            }}
          >
            + Add Transaction
          </button>
        </div>

        <div style={{ padding: '32px' }}>

          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
            <div style={{
              background: 'white', borderRadius: '12px', padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #16a34a'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>💵</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#16a34a' }}>
                ${summary.totalIncome.toLocaleString()}
              </div>
              <div style={{ color: '#6b7280' }}>Total Income</div>
            </div>

            <div style={{
              background: 'white', borderRadius: '12px', padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #dc2626'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>💸</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#dc2626' }}>
                ${summary.totalExpense.toLocaleString()}
              </div>
              <div style={{ color: '#6b7280' }}>Total Expenses</div>
            </div>

            <div style={{
              background: 'white', borderRadius: '12px', padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #1a2a4a'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🏦</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a2a4a' }}>
                ${summary.balance.toLocaleString()}
              </div>
              <div style={{ color: '#6b7280' }}>Current Balance</div>
            </div>
          </div>

          {/* Add Transaction Form */}
          {showForm && (
            <div style={{
              background: 'white', borderRadius: '12px', padding: '24px',
              marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ marginTop: 0, color: '#1a2a4a' }}>Add Transaction</h3>
              <form onSubmit={handleAdd}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>Title</label>
                    <input
                      type="text" value={form.title} required
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>Amount</label>
                    <input
                      type="number" value={form.amount} required
                      onChange={e => setForm({ ...form, amount: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>Type</label>
                    <select
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                    >
                      <option value="INCOME">Income</option>
                      <option value="EXPENSE">Expense</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontSize: '14px' }}>Description</label>
                    <input
                      type="text" value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
                <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                  <button type="submit" style={{
                    padding: '10px 24px', background: '#1a2a4a', color: 'white',
                    border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
                  }}>Save</button>
                  <button type="button" onClick={() => setShowForm(false)} style={{
                    padding: '10px 24px', background: '#e5e7eb', color: '#374151',
                    border: 'none', borderRadius: '8px', cursor: 'pointer'
                  }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* Transactions List */}
          <div style={{
            background: 'white', borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Title', 'Type', 'Amount', 'Description', 'Date', 'Actions'].map(h => (
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
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>Loading...</td></tr>
                ) : finances.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>No transactions found</td></tr>
                ) : finances.map(f => (
                  <tr key={f.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '500' }}>{f.title}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                        background: f.type === 'INCOME' ? '#dcfce7' : '#fee2e2',
                        color: f.type === 'INCOME' ? '#16a34a' : '#dc2626'
                      }}>{f.type}</span>
                    </td>
                    <td style={{
                      padding: '12px 16px', fontWeight: 'bold',
                      color: f.type === 'INCOME' ? '#16a34a' : '#dc2626'
                    }}>
                      {f.type === 'INCOME' ? '+' : '-'}${f.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>{f.description || '-'}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                      {new Date(f.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => handleDelete(f.id)}
                        style={{
                          padding: '6px 12px', background: '#fee2e2', color: '#dc2626',
                          border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px'
                        }}
                      >Delete</button>
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

export default Finance