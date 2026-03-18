import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', roles: ['ADMIN', 'PASTOR', 'FINANCE'] },
    { path: '/members', label: 'Members', icon: '👥', roles: ['ADMIN', 'PASTOR'] },
    { path: '/visitors', label: 'Visitors', icon: '🙋', roles: ['ADMIN', 'PASTOR'] },
    { path: '/finance', label: 'Finance', icon: '💰', roles: ['ADMIN', 'FINANCE'] },
    { path: '/announcements', label: 'Announcements', icon: '📢', roles: ['ADMIN', 'PASTOR'] },
    { path: '/events', label: 'Events', icon: '📅', roles: ['ADMIN', 'PASTOR'] },
    { path: '/prayer-requests', label: 'Prayer Requests', icon: '🙏', roles: ['ADMIN', 'PASTOR'] },
    { path: '/reports', label: 'Reports', icon: '📊', roles: ['ADMIN', 'PASTOR', 'FINANCE'] }
    

  ]

  const filteredMenu = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  )

  return (
    <div style={{
      width: '240px', minHeight: '100vh', background: '#1a2a4a',
      display: 'flex', flexDirection: 'column', position: 'fixed',
      left: 0, top: 0, fontFamily: 'Georgia, serif'
    }}>
      {/* Church Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid #2d4a7a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: '#f0a500', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '20px'
          }}>✝️</div>
          <div>
            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '13px', letterSpacing: '1px' }}>
              AFM in Zimbabwe
            </div>
            <div style={{ color: '#aac4e0', fontSize: '11px' }}>Church Management</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 0' }}>
        {filteredMenu.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 20px', cursor: 'pointer',
                background: isActive ? '#2d4a7a' : 'transparent',
                borderLeft: isActive ? '4px solid #f0a500' : '4px solid transparent',
                color: isActive ? 'white' : '#aac4e0',
                fontSize: '15px', transition: 'all 0.2s'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          )
        })}
      </nav>

      {/* User Info */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #2d4a7a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#2d4a7a', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 'bold', fontSize: '14px'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ color: 'white', fontSize: '13px', fontWeight: 'bold' }}>{user?.name}</div>
            <div style={{ color: '#aac4e0', fontSize: '11px' }}>{user?.role}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '10px', borderRadius: '8px',
            background: '#dc2626', color: 'white', border: 'none',
            cursor: 'pointer', fontSize: '14px', fontWeight: 'bold'
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar