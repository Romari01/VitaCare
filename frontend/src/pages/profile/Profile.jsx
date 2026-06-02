import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../hooks/useTheme'
import api from '../../services/api'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

const roleInfo = {
  admin: { label: 'Administrador', color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 text-purple-700 border border-purple-200' },
  admision: { label: 'Admisión', color: 'from-teal-500 to-teal-600', bg: 'bg-teal-50 text-teal-700 border border-teal-200' },
  doctor: { label: 'Doctor', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 text-blue-700 border border-blue-200' },
  paciente: { label: 'Paciente', color: 'from-green-500 to-green-600', bg: 'bg-green-50 text-green-700 border border-green-200' },
}

export default function Profile() {
  const { user, login } = useAuth()
  const { darkMode } = useTheme()
  const { toast, showToast, hideToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassSection, setShowPassSection] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const role = roleInfo[user?.role] || roleInfo.paciente

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      showToast('Las contraseñas nuevas no coinciden', 'error')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.put('/auth/profile', {
        name: form.name,
        email: form.email,
        currentPassword: form.currentPassword || undefined,
        newPassword: form.newPassword || undefined
      })
      login({ ...data, token: user.token })
      showToast('Perfil actualizado correctamente', 'success')
      setForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
      setShowPassSection(false)
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al actualizar', 'error')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = `w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-slate-200 text-slate-800'
    }`
  const labelClass = `block text-xs font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`

  return (
    <div className={`p-6 min-h-full transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>

      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Mi Perfil</h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Gestiona tu información personal</p>
      </div>

      <div className="max-w-2xl space-y-4">

        {/* Card perfil */}
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>

          {/* Banner */}
          <div className={`h-20 bg-gradient-to-br ${role.color} relative overflow-hidden`}>
            <div className="absolute top-2 right-8 w-16 h-16 rounded-full bg-white/10" />
            <div className="absolute bottom-0 left-16 w-24 h-24 rounded-full bg-white/10" />
          </div>

          {/* Info */}
          <div className="px-6 pb-6 pt-4">
            <div className="flex items-center gap-4 mb-5">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                <span className="text-white text-2xl font-bold">{user?.name?.charAt(0)}</span>
              </div>
              <div>
                <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{user?.name}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${role.bg}`}>{role.label}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '✉️', label: 'Email', value: user?.email },
                { icon: '🎭', label: 'Rol', value: role.label },
              ].map(item => (
                <div key={item.label} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
                  <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{item.icon} {item.label}</p>
                  <p className={`text-sm font-medium truncate ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className={`rounded-2xl border shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>
          <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Editar información</h3>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Actualiza tus datos personales</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Nombre completo</label>
                <input value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Tu nombre" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Correo electrónico</label>
                <input type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="correo@gmail.com" className={inputClass} />
              </div>
            </div>

            {/* Cambiar contraseña toggle */}
            <div className={`rounded-xl border ${darkMode ? 'border-gray-700' : 'border-slate-200'}`}>
              <button type="button"
                onClick={() => setShowPassSection(!showPassSection)}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors rounded-xl ${darkMode ? 'text-gray-300 hover:bg-gray-700/50' : 'text-slate-700 hover:bg-slate-50'
                  }`}>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Cambiar contraseña
                </div>
                <svg className={`w-4 h-4 transition-transform ${showPassSection ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showPassSection && (
                <div className={`px-4 pb-4 space-y-3 border-t ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
                  <div className="pt-3">
                    <label className={labelClass}>Contraseña actual</label>
                    <input type="password" value={form.currentPassword}
                      onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                      placeholder="••••••••" className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Nueva contraseña</label>
                      <input type="password" value={form.newPassword}
                        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                        placeholder="••••••••" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Confirmar contraseña</label>
                      <input type="password" value={form.confirmPassword}
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        placeholder="••••••••" className={inputClass} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-teal-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-teal-500/20">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar cambios
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info sistema */}
        <div className={`rounded-2xl border p-5 shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>
          <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Información del sistema</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Sistema', value: 'VitaCare v1.0.0' },
              { label: 'Centro de Salud', value: 'Jorge Chávez' },
              { label: 'Ubicación', value: 'Juliaca, Puno' },
              { label: 'Año', value: '2026' },
            ].map(item => (
              <div key={item.label} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
                <p className={`text-xs mb-0.5 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{item.label}</p>
                <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}