import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import Visitors from './pages/Visitors'
import Finance from './pages/Finance'
import Announcements from './pages/Announcements'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes - All logged in users */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* ADMIN and PASTOR only */}
          <Route path="/members" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'PASTOR']}>
              <Members />
            </ProtectedRoute>
          } />

          <Route path="/visitors" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'PASTOR']}>
              <Visitors />
            </ProtectedRoute>
          } />

          <Route path="/announcements" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'PASTOR']}>
              <Announcements />
            </ProtectedRoute>
          } />

          {/* ADMIN and FINANCE only */}
          <Route path="/finance" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'FINANCE']}>
              <Finance />
            </ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App