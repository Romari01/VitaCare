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
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifyEmail, setVerifyEmail] = useState('')
  const [verifyCode, setVerifyCode] = useState('')
  const [staffStep, setStaffStep] = useState('login')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleStaffLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      if (data.needsVerification) { setVerifyEmail(data.email); setStaffStep('verify'); return }
      login(data)
      navigate(location.state?.from?.pathname || '/dashboard')
    } catch (err) {
      if (err.response?.data?.needsVerification) { setVerifyEmail(err.response.data.email); setStaffStep('verify'); return }
      setError(err.response?.data?.message || 'Credenciales incorrectas')
    } finally { setLoading(false) }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/verify', { email: verifyEmail, code: verifyCode })
      login(data)
      navigate(location.state?.from?.pathname || '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Código incorrecto')
    } finally { setLoading(false) }
  }

  const handleResendCode = async () => {
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/resend-code', { email: verifyEmail })
      setSuccess('Código reenviado a tu correo')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Error al reenviar código')
    } finally { setLoading(false) }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/forgot-password', { email: verifyEmail })
      setSuccess('Código enviado a tu correo')
      setStaffStep('reset')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar código')
    } finally { setLoading(false) }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('Las contraseñas no coinciden'); return }
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/reset-password', { email: verifyEmail, code: verifyCode, newPassword: form.password })
      setSuccess('Contraseña actualizada correctamente')
      setStaffStep('login')
      setVerifyCode('')
      setForm({ ...form, password: '', confirmPassword: '' })
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al resetear contraseña')
    } finally { setLoading(false) }
  }

  const handleCheckPatient = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/check-patient', { identifier })
      if (data.status === 'not_found') { setError('No encontramos tu historial. Acércate al centro de salud.'); return }
      setPatientInfo(data)
      if (data.status === 'has_account') { setPatientStep('login_password') } else { setPatientStep('create_account') }
    } catch (err) {
      setError('Error al verificar')
    } finally { setLoading(false) }
  }

  const handlePatientLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/login', { email: form.email, password: form.password })
      if (data.needsVerification) { setVerifyEmail(data.email); setPatientStep('verify'); return }
      login(data)
      navigate(location.state?.from?.pathname || '/dashboard')
    } catch (err) {
      if (err.response?.data?.needsVerification) { setVerifyEmail(err.response.data.email); setPatientStep('verify'); return }
      setError('Email o contraseña incorrectos')
    } finally { setLoading(false) }
  }

  const handleCreateAccount = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('Las contraseñas no coinciden'); return }
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/register-patient', { dni: patientInfo.dni, email: form.email, phone: form.phone, password: form.password })
      setVerifyEmail(form.email)
      setPatientStep('verify')
      setSuccess('Cuenta creada. Revisa tu correo para verificar.')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear cuenta')
    } finally { setLoading(false) }
  }

  const handlePatientVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/verify', { email: verifyEmail, code: verifyCode })
      login(data)
      navigate(location.state?.from?.pathname || '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Código incorrecto')
    } finally { setLoading(false) }
  }

  const EyeIcon = ({ show }) => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {show
        ? <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></>
        : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
      }
    </svg>
  )

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 transition-all"
  const labelClass = "block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider"

  return (
    <div className="min-h-screen flex">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-900 via-teal-800 to-gray-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-teal-400/30">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <span className="text-white font-bold text-xl">Vita<span className="text-teal-400">Care</span></span>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Gestión médica<br />
            <span className="text-teal-400">inteligente</span>
          </h2>
          <p className="text-white/50 text-lg mb-10">Centro de Salud Jorge Chávez, Juliaca</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { val: '50+', label: 'Pacientes diarios' },
              { val: '6', label: 'Especialidades' },
              { val: '100%', label: 'Digital' },
              { val: '24/7', label: 'Disponible' },
            ].map(s => (
              <div key={s.label} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-bold text-teal-400">{s.val}</div>
                <div className="text-white/40 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-teal-400/20 flex items-center justify-center text-teal-400 font-bold text-sm">CS</div>
              <div>
                <p className="text-white text-sm font-medium">C.S. Jorge Chávez</p>
                <p className="text-white/40 text-xs">Juliaca, Puno</p>
              </div>
              <span className="ml-auto flex items-center gap-1.5 text-xs text-teal-400">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                En línea
              </span>
            </div>
            <p className="text-white/30 text-xs">
              Sistema activo — {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 bg-gray-950 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <span className="text-white font-bold text-xl">Vita<span className="text-teal-400">Care</span></span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Bienvenido</h1>
          <p className="text-white/40 text-sm mb-8">Ingresa a tu cuenta para continuar</p>

          {/* Tabs */}
          {staffStep === 'login' && patientStep === 'check' && (
            <div className="flex bg-white/5 rounded-xl p-1 mb-8 border border-white/10">
              <button onClick={() => { setTab('staff'); setError(''); setSuccess('') }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${tab === 'staff' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25' : 'text-white/40 hover:text-white/60'
                  }`}>
                Personal
              </button>
              <button onClick={() => { setTab('patient'); setError(''); setSuccess('') }}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${tab === 'patient' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/25' : 'text-white/40 hover:text-white/60'
                  }`}>
                Paciente
              </button>
            </div>
          )}

          {/* Mensajes */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm px-4 py-3 rounded-xl mb-5 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          )}

          {/* ===== STAFF LOGIN ===== */}
          {tab === 'staff' && staffStep === 'login' && (
            <form onSubmit={handleStaffLogin} className="space-y-5">
              <div>
                <label className={labelClass}>Correo o N° Historial</label>
                <input type="text" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com o HC-0001" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Contraseña</label>
                <div className="relative">
                  <input type={showStaffPass ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" required className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowStaffPass(!showStaffPass)}
                    className="absolute right-3 top-3 text-white/30 hover:text-white/60 transition-colors">
                    <EyeIcon show={showStaffPass} />
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-teal-500 text-white py-3 rounded-xl font-semibold hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Ingresando...
                  </span>
                ) : 'Ingresar'}
              </button>
              <button type="button"
                onClick={() => { setStaffStep('forgot'); setError(''); setSuccess('') }}
                className="w-full text-white/40 text-sm hover:text-teal-400 transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
            </form>
          )}

          {/* ===== STAFF VERIFICAR ===== */}
          {tab === 'staff' && staffStep === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="text-center py-2">
                <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-white text-lg">Verifica tu cuenta</h3>
                <p className="text-white/40 text-sm mt-1">
                  Enviamos un código a <span className="text-teal-400">{verifyEmail}</span>
                </p>
              </div>
              <div>
                <label className={labelClass}>Código de verificación</label>
                <input type="text" value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="000000" maxLength={6} required
                  className={`${inputClass} text-center text-3xl font-bold tracking-widest`} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-teal-500 text-white py-3 rounded-xl font-semibold hover:bg-teal-400 transition-all disabled:opacity-50">
                {loading ? 'Verificando...' : 'Verificar cuenta'}
              </button>
              <button type="button" onClick={handleResendCode} disabled={loading}
                className="w-full text-white/40 text-sm hover:text-teal-400 transition-colors">
                ¿No recibiste el código? Reenviar
              </button>
              <button type="button" onClick={() => { setStaffStep('login'); setError('') }}
                className="w-full text-white/30 text-sm hover:text-white/50 transition-colors">
                ← Volver
              </button>
            </form>
          )}

          {/* ===== STAFF OLVIDÉ ===== */}
          {tab === 'staff' && staffStep === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="text-center py-2">
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="font-bold text-white text-lg">Recuperar contraseña</h3>
                <p className="text-white/40 text-sm mt-1">Ingresa tu correo y te enviaremos un código</p>
              </div>
              <div>
                <label className={labelClass}>Correo electrónico</label>
                <input type="email" value={verifyEmail}
                  onChange={(e) => setVerifyEmail(e.target.value)}
                  placeholder="correo@ejemplo.com" required className={inputClass} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-teal-500 text-white py-3 rounded-xl font-semibold hover:bg-teal-400 transition-all disabled:opacity-50">
                {loading ? 'Enviando...' : 'Enviar código'}
              </button>
              <button type="button" onClick={() => { setStaffStep('login'); setError('') }}
                className="w-full text-white/30 text-sm hover:text-white/50 transition-colors">
                ← Volver
              </button>
            </form>
          )}

          {/* ===== STAFF RESET ===== */}
          {tab === 'staff' && staffStep === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="text-center py-2">
                <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-bold text-white text-lg">Nueva contraseña</h3>
                <p className="text-white/40 text-sm mt-1">
                  Código enviado a <span className="text-teal-400">{verifyEmail}</span>
                </p>
              </div>
              <div>
                <label className={labelClass}>Código</label>
                <input type="text" value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="000000" maxLength={6} required
                  className={`${inputClass} text-center text-3xl font-bold tracking-widest`} />
              </div>
              <div>
                <label className={labelClass}>Nueva contraseña</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres" required className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-white/30 hover:text-white/60 transition-colors">
                    <EyeIcon show={showPass} />
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Confirmar contraseña</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Repite tu contraseña" required className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-3 text-white/30 hover:text-white/60 transition-colors">
                    <EyeIcon show={showConfirm} />
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-teal-500 text-white py-3 rounded-xl font-semibold hover:bg-teal-400 transition-all disabled:opacity-50">
                {loading ? 'Actualizando...' : 'Actualizar contraseña'}
              </button>
              <button type="button" onClick={() => { setStaffStep('login'); setError('') }}
                className="w-full text-white/30 text-sm hover:text-white/50 transition-colors">
                ← Volver
              </button>
            </form>
          )}

          {/* ===== PACIENTE — check ===== */}
          {tab === 'patient' && patientStep === 'check' && (
            <form onSubmit={handleCheckPatient} className="space-y-5">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/40">
                Ingresa tu N° de historial (HC-0001) o tu DNI para continuar
              </div>
              <div>
                <label className={labelClass}>N° Historial o DNI</label>
                <input value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="HC-0001 o 45678901" required className={inputClass} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-teal-500 text-white py-3 rounded-xl font-semibold hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/25 disabled:opacity-50">
                {loading ? 'Verificando...' : 'Continuar →'}
              </button>
            </form>
          )}

          {/* ===== PACIENTE — login ===== */}
          {tab === 'patient' && patientStep === 'login_password' && (
            <form onSubmit={handlePatientLogin} className="space-y-5">
              <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 text-center">
                <p className="text-teal-400 text-sm font-medium">Hola, {patientInfo?.name}</p>
                <p className="text-white/30 text-xs mt-0.5">Ingresa tus credenciales</p>
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="tu@email.com" required className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Contraseña</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••" required className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-white/30 hover:text-white/60 transition-colors">
                    <EyeIcon show={showPass} />
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-teal-500 text-white py-3 rounded-xl font-semibold hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/25 disabled:opacity-50">
                {loading ? 'Ingresando...' : 'Ingresar'}
              </button>
              <button type="button" onClick={() => { setPatientStep('forgot_patient'); setError('') }}
                className="w-full text-white/40 text-sm hover:text-teal-400 transition-colors">
                ¿Olvidaste tu contraseña?
              </button>
              <button type="button" onClick={() => { setPatientStep('check'); setError('') }}
                className="w-full text-white/30 text-sm hover:text-white/50 transition-colors">
                ← Volver
              </button>
            </form>
          )}

          {/* ===== PACIENTE — crear cuenta ===== */}
          {tab === 'patient' && patientStep === 'create_account' && (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 text-center">
                <p className="text-teal-400 text-sm font-medium">Hola, {patientInfo?.name}</p>
                <p className="text-white/30 text-xs mt-0.5">N° Historial: {patientInfo?.historialNumber}</p>
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="tu@email.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Contraseña</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} required value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres" className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-white/30 hover:text-white/60 transition-colors">
                    <EyeIcon show={showPass} />
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Confirmar contraseña</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} required value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Repite tu contraseña" className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-3 text-white/30 hover:text-white/60 transition-colors">
                    <EyeIcon show={showConfirm} />
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-teal-500 text-white py-3 rounded-xl font-semibold hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/25 disabled:opacity-50">
                {loading ? 'Creando cuenta...' : 'Crear cuenta'}
              </button>
              <button type="button" onClick={() => { setPatientStep('check'); setError('') }}
                className="w-full text-white/30 text-sm hover:text-white/50 transition-colors">
                ← Volver
              </button>
            </form>
          )}

          {/* ===== PACIENTE — verificar ===== */}
          {tab === 'patient' && patientStep === 'verify' && (
            <form onSubmit={handlePatientVerify} className="space-y-5">
              <div className="text-center py-2">
                <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-white text-lg">Verifica tu cuenta</h3>
                <p className="text-white/40 text-sm mt-1">
                  Código enviado a <span className="text-teal-400">{verifyEmail}</span>
                </p>
              </div>
              <div>
                <label className={labelClass}>Código de verificación</label>
                <input type="text" value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="000000" maxLength={6} required
                  className={`${inputClass} text-center text-3xl font-bold tracking-widest`} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-teal-500 text-white py-3 rounded-xl font-semibold hover:bg-teal-400 transition-all disabled:opacity-50">
                {loading ? 'Verificando...' : 'Verificar cuenta'}
              </button>
              <button type="button" onClick={handleResendCode} disabled={loading}
                className="w-full text-white/40 text-sm hover:text-teal-400 transition-colors">
                ¿No recibiste el código? Reenviar
              </button>
            </form>
          )}

          {/* ===== PACIENTE — olvidé ===== */}
          {tab === 'patient' && patientStep === 'forgot_patient' && (
            <form onSubmit={async (e) => {
              e.preventDefault()
              setLoading(true)
              setError('')
              try {
                await api.post('/auth/forgot-password', { email: verifyEmail })
                setSuccess('Código enviado a tu correo')
                setPatientStep('reset_patient')
              } catch (err) {
                setError(err.response?.data?.message || 'Error al enviar código')
              } finally { setLoading(false) }
            }} className="space-y-5">
              <div className="text-center py-2">
                <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="font-bold text-white text-lg">Recuperar contraseña</h3>
                <p className="text-white/40 text-sm mt-1">Ingresa tu correo registrado</p>
              </div>
              <div>
                <label className={labelClass}>Correo electrónico</label>
                <input type="email" value={verifyEmail}
                  onChange={(e) => setVerifyEmail(e.target.value)}
                  placeholder="tu@email.com" required className={inputClass} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-teal-500 text-white py-3 rounded-xl font-semibold hover:bg-teal-400 transition-all disabled:opacity-50">
                {loading ? 'Enviando...' : 'Enviar código'}
              </button>
              <button type="button" onClick={() => { setPatientStep('login_password'); setError('') }}
                className="w-full text-white/30 text-sm hover:text-white/50 transition-colors">
                ← Volver
              </button>
            </form>
          )}

          {/* ===== PACIENTE — reset ===== */}
          {tab === 'patient' && patientStep === 'reset_patient' && (
            <form onSubmit={async (e) => {
              e.preventDefault()
              if (form.password !== form.confirmPassword) { setError('Las contraseñas no coinciden'); return }
              setLoading(true)
              setError('')
              try {
                await api.post('/auth/reset-password', { email: verifyEmail, code: verifyCode, newPassword: form.password })
                setSuccess('Contraseña actualizada correctamente')
                setPatientStep('login_password')
                setVerifyCode('')
                setForm({ ...form, password: '', confirmPassword: '' })
                setTimeout(() => setSuccess(''), 3000)
              } catch (err) {
                setError(err.response?.data?.message || 'Error al actualizar contraseña')
              } finally { setLoading(false) }
            }} className="space-y-4">
              <div className="text-center py-2">
                <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-bold text-white text-lg">Nueva contraseña</h3>
                <p className="text-white/40 text-sm mt-1">
                  Código enviado a <span className="text-teal-400">{verifyEmail}</span>
                </p>
              </div>
              <div>
                <label className={labelClass}>Código</label>
                <input type="text" value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="000000" maxLength={6} required
                  className={`${inputClass} text-center text-3xl font-bold tracking-widest`} />
              </div>
              <div>
                <label className={labelClass}>Nueva contraseña</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres" required className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-3 text-white/30 hover:text-white/60 transition-colors">
                    <EyeIcon show={showPass} />
                  </button>
                </div>
              </div>
              <div>
                <label className={labelClass}>Confirmar contraseña</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    placeholder="Repite tu contraseña" required className={`${inputClass} pr-11`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-3 text-white/30 hover:text-white/60 transition-colors">
                    <EyeIcon show={showConfirm} />
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-teal-500 text-white py-3 rounded-xl font-semibold hover:bg-teal-400 transition-all disabled:opacity-50">
                {loading ? 'Actualizando...' : 'Actualizar contraseña'}
              </button>
              <button type="button" onClick={() => { setPatientStep('login_password'); setError('') }}
                className="w-full text-white/30 text-sm hover:text-white/50 transition-colors">
                ← Volver
              </button>
            </form>
          )}

          <p className="text-center text-xs text-white/20 mt-8">
            © 2026 VitaCare — Centro de Salud Jorge Chávez
          </p>
        </div>
      </div>
    </div>
  )
}