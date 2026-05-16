import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

export default function Login() {
  const [tab, setTab] = useState('staff')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showStaffPass, setShowStaffPass] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [patientStep, setPatientStep] = useState('check')
  const [patientInfo, setPatientInfo] = useState(null)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [form, setForm] = useState({
    email: '', phone: '', password: '',
    confirmPassword: '', confirmMethod: 'email'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleStaffLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      login(data)
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from)
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckPatient = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/check-patient', { identifier })
      if (data.status === 'not_found') {
        setError('No encontramos tu historial. Acércate al centro de salud.')
        return
      }
      setPatientInfo(data)
      if (data.status === 'has_account') {
        setPatientStep('login_password')
      } else {
        setPatientStep('create_account')
      }
    } catch (err) {
      setError('Error al verificar')
    } finally {
      setLoading(false)
    }
  }

  const handlePatientLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/login', {
        email: form.email,
        password: form.password
      })
      login(data)
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from)
    } catch (err) {
      setError('Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAccount = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/register-patient', {
        dni: patientInfo.dni,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirmMethod: form.confirmMethod
      })
      login(data)
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-2xl font-bold">V</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">VitaCare</h1>
          <p className="text-slate-500 text-sm">Centro de Salud Jorge Chávez</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
          <button onClick={() => { setTab('staff'); setError('') }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === 'staff' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'
            }`}>
            👨‍⚕️ Personal
          </button>
          <button onClick={() => { setTab('patient'); setError('') }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              tab === 'patient' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500'
            }`}>
            🏥 Paciente
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* STAFF */}
        {tab === 'staff' && (
          <form onSubmit={handleStaffLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com" required
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <div className="relative">
                <input type={showStaffPass ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                <button type="button" onClick={() => setShowStaffPass(!showStaffPass)}
                  className="absolute right-3 top-2.5 text-slate-400 text-xs">
                  {showStaffPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-teal-700 text-white py-2.5 rounded-lg font-medium hover:bg-teal-800 transition-colors disabled:opacity-50">
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        )}

        {/* PACIENTE — verificar historial */}
        {tab === 'patient' && patientStep === 'check' && (
          <form onSubmit={handleCheckPatient} className="space-y-4">
            <div className="text-center mb-2">
              <p className="text-slate-500 text-sm">Ingresa tu N° de historial o DNI</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">N° Historial o DNI</label>
              <input value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                placeholder="HC-0001 o tu DNI" required
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-teal-700 text-white py-2.5 rounded-lg font-medium hover:bg-teal-800 transition-colors disabled:opacity-50">
              {loading ? 'Verificando...' : 'Continuar'}
            </button>
          </form>
        )}

        {/* PACIENTE — ya tiene cuenta */}
        {tab === 'patient' && patientStep === 'login_password' && (
          <form onSubmit={handlePatientLogin} className="space-y-4">
            <div className="bg-teal-50 rounded-xl p-3 mb-2">
              <p className="text-teal-700 text-sm text-center">
                ✅ Hola <strong>{patientInfo?.name}</strong>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                placeholder="tu@email.com" required
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  placeholder="••••••••" required
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-slate-400 text-xs">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-teal-700 text-white py-2.5 rounded-lg font-medium hover:bg-teal-800 transition-colors disabled:opacity-50">
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
            <button type="button" onClick={() => { setPatientStep('check'); setError('') }}
              className="w-full text-slate-400 text-sm hover:text-slate-600">
              ← Volver
            </button>
          </form>
        )}

        {/* PACIENTE — primera vez */}
        {tab === 'patient' && patientStep === 'create_account' && (
          <form onSubmit={handleCreateAccount} className="space-y-3">
            <div className="bg-teal-50 rounded-xl p-3">
              <p className="text-teal-700 text-sm text-center">
                👋 Hola <strong>{patientInfo?.name}</strong>, crea tu cuenta
              </p>
              <p className="text-teal-500 text-xs text-center mt-1">
                N° Historial: {patientInfo?.historialNumber}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Contraseña</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-slate-400 text-xs">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Confirmar contraseña</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} required value={form.confirmPassword}
                  onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                  placeholder="Repite tu contraseña"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-2.5 text-slate-400 text-xs">
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs font-medium text-slate-700 mb-2">¿Cómo quieres recibir la confirmación?</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setForm({...form, confirmMethod: 'email'})}
                  className={`flex-1 py-2 text-xs rounded-lg border transition-all ${
                    form.confirmMethod === 'email' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-500'
                  }`}>
                  📧 Email
                </button>
                <button type="button" onClick={() => setForm({...form, confirmMethod: 'sms'})}
                  className={`flex-1 py-2 text-xs rounded-lg border transition-all ${
                    form.confirmMethod === 'sms' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-200 text-slate-500'
                  }`}>
                  📱 SMS
                </button>
              </div>
            </div>

            {form.confirmMethod === 'email' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  placeholder="tu@email.com"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
            )}

            {form.confirmMethod === 'sms' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Celular</label>
                <input type="tel" required value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  placeholder="987654321"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-teal-700 text-white py-2.5 rounded-lg font-medium hover:bg-teal-800 transition-colors disabled:opacity-50">
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
            <button type="button" onClick={() => { setPatientStep('check'); setError('') }}
              className="w-full text-slate-400 text-sm hover:text-slate-600">
              ← Volver
            </button>
          </form>
        )}

        <p className="text-center text-xs text-slate-400 mt-4">
          VitaCare — Sistema de Gestión Médica v1.0
        </p>
      </div>
    </div>
  )
}