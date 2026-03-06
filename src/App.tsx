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
import Home from './pages/Home'
import AnnouncementsPublic from './pages/AnnouncementsPublic'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/announcements-public" element={<AnnouncementsPublic />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

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

          <Route path="/finance" element={
            <ProtectedRoute allowedRoles={['ADMIN', 'FINANCE']}>
              <Finance />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App