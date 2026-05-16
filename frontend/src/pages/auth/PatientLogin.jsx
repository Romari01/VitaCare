import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

export default function PatientLogin() {
  const [step, setStep] = useState('dni')
  const [dni, setDni] = useState('')
  const [dniInfo, setDniInfo] = useState(null)
  const [form, setForm] = useState({ email: '', phone: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const checkDni = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/check-dni', { dni })
      setDniInfo(data)
      if (data.status === 'has_account') {
        setStep('has_account')
      } else if (data.status === 'has_history') {
        setStep('create_password')
      } else {
        setStep('no_history')
      }
    } catch (err) {
      setError('Error al verificar DNI')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/register-patient', {
        dni,
        email: form.email,
        phone: form.phone,
        password: form.password
      })
      login(data)
      const from = location.state?.from?.pathname || '/book'
      navigate(from)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">V</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">VitaCare</h1>
          <p className="text-slate-500 text-sm mt-1">Centro de Salud Jorge Chávez</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* PASO 1 — DNI */}
        {step === 'dni' && (
          <form onSubmit={checkDni} className="space-y-4">
            <div className="text-center mb-2">
              <p className="text-slate-600 text-sm">Ingresa tu DNI para continuar</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">DNI</label>
              <input value={dni} onChange={(e) => setDni(e.target.value)}
                placeholder="Ingresa tu DNI" required maxLength={8}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-teal-700 text-white py-2.5 rounded-lg font-medium hover:bg-teal-800 transition-colors disabled:opacity-50">
              {loading ? 'Verificando...' : 'Continuar'}
            </button>
            <p className="text-center text-xs text-slate-400">
              ¿Eres personal del centro?{' '}
              <button type="button" onClick={() => navigate('/login')} className="text-teal-600 hover:underline">
                Iniciar sesión
              </button>
            </p>
          </form>
        )}

        {/* PASO 2 — Tiene historial, crear cuenta */}
        {step === 'create_password' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="bg-teal-50 rounded-xl p-3 mb-2">
              <p className="text-teal-700 text-sm text-center">
                ✅ Hola <strong>{dniInfo?.name}</strong>, encontramos tu historial. Crea tu cuenta.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
                placeholder="tu@email.com"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Número de celular</label>
              <input type="tel" required value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                placeholder="987654321"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Crear contraseña</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}
                placeholder="Mínimo 6 caracteres"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar contraseña</label>
              <input type="password" required value={form.confirmPassword} onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                placeholder="Repite tu contraseña"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-teal-700 text-white py-2.5 rounded-lg font-medium hover:bg-teal-800 transition-colors disabled:opacity-50">
              {loading ? 'Creando cuenta...' : 'Crear cuenta y continuar'}
            </button>
            <button type="button" onClick={() => setStep('dni')}
              className="w-full text-slate-400 text-sm hover:text-slate-600">
              ← Volver
            </button>
          </form>
        )}

        {/* PASO 3 — Ya tiene cuenta */}
        {step === 'has_account' && (
          <div className="text-center space-y-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-blue-700 text-sm font-medium">✅ Ya tienes una cuenta</p>
              <p className="text-blue-500 text-xs mt-1">Inicia sesión con tu email y contraseña</p>
            </div>
            <button onClick={() => navigate('/login')}
              className="w-full bg-teal-700 text-white py-2.5 rounded-lg font-medium hover:bg-teal-800 transition-colors">
              Ir al login
            </button>
            <button type="button" onClick={() => setStep('dni')}
              className="w-full text-slate-400 text-sm hover:text-slate-600">
              ← Volver
            </button>
          </div>
        )}

        {/* PASO 4 — No tiene historial */}
        {step === 'no_history' && (
          <div className="text-center space-y-4">
            <div className="bg-orange-50 rounded-xl p-6">
              <span className="text-4xl block mb-3">🏥</span>
              <p className="text-orange-700 font-medium text-sm mb-2">
                No encontramos tu historial clínico
              </p>
              <p className="text-orange-500 text-xs">
                Para registrarte debes acercarte al Centro de Salud Jorge Chávez con tu DNI para que el personal pueda crear tu historial clínico.
              </p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 text-left">
              <p className="text-xs font-medium text-slate-700 mb-1">📍 Dirección:</p>
              <p className="text-xs text-slate-500">Jr. Ancash N° 179, Juliaca</p>
              <p className="text-xs font-medium text-slate-700 mt-2 mb-1">📞 Teléfono:</p>
              <p className="text-xs text-slate-500">(051) 331445</p>
              <p className="text-xs font-medium text-slate-700 mt-2 mb-1">🕐 Horario:</p>
              <p className="text-xs text-slate-500">Lunes a Viernes 8:00am — 5:00pm</p>
            </div>
            <button type="button" onClick={() => setStep('dni')}
              className="w-full text-slate-400 text-sm hover:text-slate-600">
              ← Volver
            </button>
          </div>
        )}

      </div>
    </div>
  )
}