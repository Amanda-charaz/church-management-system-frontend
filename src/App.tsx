import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import Visitors from './pages/Visitors'
import Finance from './pages/Finance'
import Announcements from './pages/Announcements'
import Events from './pages/Events'
import PrayerRequests from './pages/PrayerRequests'
import PrayerRequest from './pages/PrayerRequest'
import JoinChurch from './pages/JoinChurch'
import Reports from './pages/Reports'


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/prayer-request" element={<PrayerRequest />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
          <Route path="/visitors" element={<ProtectedRoute><Visitors /></ProtectedRoute>} />
          <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
          <Route path="/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/prayer-requests" element={<ProtectedRoute><PrayerRequests /></ProtectedRoute>} />
          <Route path="/join-church" element={<JoinChurch />} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

         
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
