import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import API from '../api/axios'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts'

const COLORS = ['#1a2a4a', '#e67e22', '#16a34a', '#dc2626', '#7c3aed']

const Analytics = () => {
  const [members, setMembers] = useState<any[]>([])
  const [visitors, setVisitors] = useState<any[]>([])
  const [finances, setFinances] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [mRes, vRes, fRes, aRes, eRes] = await Promise.all([
        API.get('/members'),
        API.get('/visitors'),
        API.get('/finances'),
        API.get('/announcements'),
        API.get('/events')
      ])
      setMembers(mRes.data.members || [])
      setVisitors(vRes.data.visitors || [])
      setFinances(fRes.data.finances || [])
      setAnnouncements(aRes.data.announcements || [])
      setEvents(eRes.data.events || [])
    } catch (err) {
      console.error('Error fetching analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  // Finance calculations
  const totalIncome = finances.filter(f => f.type === 'INCOME').reduce((sum, f) => sum + Number(f.amount), 0)
  const totalExpense = finances.filter(f => f.type === 'EXPENSE').reduce((sum, f) => sum + Number(f.amount), 0)
  const balance = totalIncome - totalExpense

  // Members by department
  const deptMap: { [key: string]: number } = {}
  members.forEach(m => {
    const dept = m.department || 'General'
    deptMap[dept] = (deptMap[dept] || 0) + 1
  })
  const deptData = Object.entries(deptMap).map(([name, value]) => ({ name, value }))

  // Monthly finance data
  const monthlyData: { [key: string]: { month: string, income: number, expense: number } } = {}
  finances.forEach(f => {
    const date = new Date(f.date || f.createdAt)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    if (!monthlyData[key]) monthlyData[key] = { month: label, income: 0, expense: 0 }
    if (f.type === 'INCOME') monthlyData[key].income += Number(f.amount)
    else monthlyData[key].expense += Number(f.amount)
  })
  const financeChartData = Object.values(monthlyData).slice(-6)

  // Monthly members joined
  const memberMonthly: { [key: string]: number } = {}
  members.forEach(m => {
    const date = new Date(m.createdAt)
    const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    memberMonthly[label] = (memberMonthly[label] || 0) + 1
  })
  const memberChartData = Object.entries(memberMonthly).slice(-6).map(([month, count]) => ({ month, count }))

  // Visitor monthly
  const visitorMonthly: { [key: string]: number } = {}
  visitors.forEach(v => {
    const date = new Date(v.createdAt)
    const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
    visitorMonthly[label] = (visitorMonthly[label] || 0) + 1
  })
  const visitorChartData = Object.entries(visitorMonthly).slice(-6).map(([month, count]) => ({ month, count }))

  const stats = [
    { label: 'Total Members', value: members.length, icon: '👥', color: '#1a2a4a', sub: `${members.filter(m => m.approved).length} approved` },
    { label: 'Total Visitors', value: visitors.length, icon: '🙋', color: '#e67e22', sub: 'All time' },
    { label: 'Total Income', value: `$${totalIncome.toLocaleString()}`, icon: '💰', color: '#16a34a', sub: 'All time' },
    { label: 'Balance', value: `$${balance.toLocaleString()}`, icon: '📊', color: balance >= 0 ? '#16a34a' : '#dc2626', sub: `Expenses: $${totalExpense.toLocaleString()}` },
    { label: 'Announcements', value: announcements.length, icon: '📢', color: '#7c3aed', sub: 'Total posted' },
    { label: 'Events', value: events.length, icon: '📅', color: '#0369a1', sub: `${events.filter(e => new Date(e.date) >= new Date()).length} upcoming` },
  ]

  if (loading) return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <p>Loading analytics...</p>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', flex: 1, background: '#f0f4f8', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{
          background: 'white', padding: '16px 32px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#1a2a4a' }}>Analytics Dashboard</h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Church growth and financial overview</p>
        </div>

        <div style={{ padding: '32px' }}>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {stats.map((stat, i) => (
              <div key={i} style={{
                background: 'white', borderRadius: '12px', padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderLeft: `4px solid ${stat.color}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                    <div style={{ color: '#374151', fontSize: '14px', fontWeight: 'bold', marginTop: '4px' }}>{stat.label}</div>
                    <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '2px' }}>{stat.sub}</div>
                  </div>
                  <div style={{ fontSize: '32px' }}>{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>

            {/* Finance Chart */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: '0 0 20px', color: '#1a2a4a', fontSize: '16px' }}>💰 Income vs Expenses (Last 6 Months)</h3>
              {financeChartData.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>No finance data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={financeChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Expenses" fill="#dc2626" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Members by Department */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: '0 0 20px', color: '#1a2a4a', fontSize: '16px' }}>👥 Members by Department</h3>
              {deptData.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>No member data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={deptData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={11}>
                      {deptData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Charts Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>

            {/* Member Growth */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: '0 0 20px', color: '#1a2a4a', fontSize: '16px' }}>📈 Member Growth (Last 6 Months)</h3>
              {memberChartData.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>No member data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={memberChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" name="New Members" stroke="#1a2a4a" strokeWidth={2} dot={{ fill: '#e67e22', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Visitor Growth */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: '0 0 20px', color: '#1a2a4a', fontSize: '16px' }}>🙋 Visitor Trend (Last 6 Months)</h3>
              {visitorChartData.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '40px' }}>No visitor data yet</div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={visitorChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" name="Visitors" stroke="#e67e22" strokeWidth={2} dot={{ fill: '#1a2a4a', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics