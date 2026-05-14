import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Patients from './pages/patients/Patients'
import Doctors from './pages/doctors/Doctors'
import Appointments from './pages/appointments/Appointments'
import Reports from './pages/reports/Reports'
import Chatbot from './pages/chatbot/Chatbot'
import MainLayout from './layouts/MainLayout'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/patients" element={<MainLayout><Patients /></MainLayout>} />
        <Route path="/doctors" element={<MainLayout><Doctors /></MainLayout>} />
        <Route path="/appointments" element={<MainLayout><Appointments /></MainLayout>} />
        <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
        <Route path="/chatbot" element={<MainLayout><Chatbot /></MainLayout>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  )
}

export default App