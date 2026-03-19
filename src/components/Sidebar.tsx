import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Sidebar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) setIsOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '\uD83D\uDCCA', roles: ['ADMIN', 'PASTOR', 'FINANCE'] },
    { path: '/members', label: 'Members', icon: '\uD83D\uDC65', roles: ['ADMIN', 'PASTOR'] },
    { path: '/visitors', label: 'Visitors', icon: '\uD83D\uDE4B', roles: ['ADMIN', 'PASTOR'] },
    { path: '/finance', label: 'Finance', icon: '\uD83D\uDCB0', roles: ['ADMIN', 'FINANCE'] },
    { path: '/announcements', label: 'Announcements', icon: '\uD83D\uDCE2', roles: ['ADMIN', 'PASTOR'] },
    { path: '/events', label: 'Events', icon: '\uD83D\uDCC5', roles: ['ADMIN', 'PASTOR'] },
    { path: '/sermons', label: 'Sermons', icon: '\uD83C\uDFA4', roles: ['ADMIN', 'PASTOR'] },
    { path: '/prayer-requests', label: 'Prayer Requests', icon: '\uD83D\uDE4F', roles: ['ADMIN', 'PASTOR'] },
    { path: '/reports', label: 'Reports', icon: '\uD83D\uDCCB', roles: ['ADMIN', 'PASTOR', 'FINANCE'] },
    { path: '/cell-groups', label: 'Cell Groups', icon: '\uD83C\uDFE0', roles: ['ADMIN', 'PASTOR'] },
    { path: '/change-password', label: 'Change Password', icon: '\uD83D\uDD12', roles: ['ADMIN', 'PASTOR', 'FINANCE'] },
  ]

  const filteredMenu = menuItems.filter(item =>
    user && item.roles.includes(user.role)
  )

  const handleNavClick = (path: string) => {
    navigate(path)
    if (isMobile) setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Top Bar */}
      {isMobile && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1001,
          background: '#1a2a4a', padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/afm-logo.png" alt="AFM" style={{ height: '36px', width: '36px', borderRadius: '50%', objectFit: 'cover' }} onError={(e: any) => e.target.style.display = 'none'} />
            <div>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '12px', letterSpacing: '1px' }}>AFM in Zimbabwe</div>
              <div style={{ color: '#aac4e0', fontSize: '10px' }}>Church Management</div>
            </div>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} style={{
            background: 'none', border: 'none', color: 'white',
            fontSize: '24px', cursor: 'pointer', padding: '4px'
          }}>
            {isOpen ? '\u2715' : '\u2630'}
          </button>
        </div>
      )}

      {/* Overlay */}
      {isMobile && isOpen && (
        <div onClick={() => setIsOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1002
        }} />
      )}

      {/* Sidebar */}
      <div style={{
        width: '240px', minHeight: '100vh', background: '#1a2a4a',
        display: 'flex', flexDirection: 'column', position: 'fixed',
        left: isMobile ? (isOpen ? 0 : '-240px') : 0,
        top: 0, fontFamily: 'Georgia, serif', zIndex: 1003,
        transition: 'left 0.3s ease',
        boxShadow: isMobile && isOpen ? '4px 0 20px rgba(0,0,0,0.3)' : 'none'
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #2d4a7a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/afm-logo.png" alt="AFM" style={{ height: '44px', width: '44px', borderRadius: '50%', objectFit: 'cover' }} onError={(e: any) => e.target.style.display = 'none'} />
            <div>
              <div style={{ color: 'white', fontWeight: 'bold', fontSize: '13px', letterSpacing: '1px' }}>AFM in Zimbabwe</div>
              <div style={{ color: '#aac4e0', fontSize: '11px' }}>Church Management</div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #2d4a7a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#e67e22', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px'
            }}>
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ color: 'white', fontSize: '13px', fontWeight: 'bold' }}>{user?.email}</div>
              <div style={{ color: '#f0a500', fontSize: '11px' }}>{user?.role}</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {filteredMenu.map(item => (
            <button key={item.path} onClick={() => handleNavClick(item.path)} style={{
              width: '100%', padding: '12px 20px', display: 'flex', alignItems: 'center',
              gap: '12px', background: location.pathname === item.path ? '#2d4a7a' : 'transparent',
              border: 'none', color: location.pathname === item.path ? 'white' : '#aac4e0',
              cursor: 'pointer', fontSize: '14px', textAlign: 'left',
              borderLeft: location.pathname === item.path ? '3px solid #e67e22' : '3px solid transparent',
              transition: 'all 0.2s'
            }}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #2d4a7a' }}>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '10px', background: '#e67e22', color: 'white',
            border: 'none', borderRadius: '8px', cursor: 'pointer',
            fontWeight: 'bold', fontSize: '14px'
          }}>Logout</button>
        </div>
      </div>

      {/* Spacer for desktop */}
      {!isMobile && <div style={{ width: '240px', flexShrink: 0 }} />}
    </>
  )
}

export default Sidebar