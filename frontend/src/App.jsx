import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import Login from './pages/auth/Login'
import Landing from './pages/landing/Landing'
import Dashboard from './pages/dashboard/Dashboard'
import Patients from './pages/patients/Patients'
import Doctors from './pages/doctors/Doctors'
import Appointments from './pages/appointments/Appointments'
import Reports from './pages/reports/Reports'
import Chatbot from './pages/chatbot/Chatbot'
import Profile from './pages/profile/Profile'
import MainLayout from './layouts/MainLayout'
import MyAppointments from './pages/patient/MyAppointments'
import PatientChatbot from './pages/patient/PatientChatbot'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Landing page — antes del login */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Todos los roles */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout><Dashboard /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <MainLayout><Profile /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Solo paciente */}
        <Route path="/my-appointments" element={
          <ProtectedRoute roles={['paciente']}>
            <MainLayout><MyAppointments /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/asistente" element={
          <ProtectedRoute roles={['paciente']}>
            <MainLayout><PatientChatbot /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Admin, admision, doctor */}
        <Route path="/appointments" element={
          <ProtectedRoute roles={['admin', 'admision', 'doctor']}>
            <MainLayout><Appointments /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/patients" element={
          <ProtectedRoute roles={['admin', 'admision', 'doctor']}>
            <MainLayout><Patients /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/doctors" element={
          <ProtectedRoute roles={['admin', 'admision']}>
            <MainLayout><Doctors /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute roles={['admin', 'admision']}>
            <MainLayout><Reports /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/chatbot" element={
          <ProtectedRoute roles={['admin', 'admision', 'doctor']}>
            <MainLayout><Chatbot /></MainLayout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  )
}

export default App