import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../hooks/useTheme'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const STATUS_COLORS = {
  pendiente: 'bg-yellow-50 text-yellow-600 border border-yellow-200',
  confirmada: 'bg-green-50 text-green-600 border border-green-200',
  atendida: 'bg-blue-50 text-blue-600 border border-blue-200',
  cancelada: 'bg-red-50 text-red-600 border border-red-200',
}

const STATUS_COLORS_DARK = {
  pendiente: 'bg-yellow-900/30 text-yellow-400 border border-yellow-700',
  confirmada: 'bg-green-900/30 text-green-400 border border-green-700',
  atendida: 'bg-blue-900/30 text-blue-400 border border-blue-700',
  cancelada: 'bg-red-900/30 text-red-400 border border-red-700',
}

function StatCard({ icon, label, value, gradient, dark, onClick }) {
  return (
    <div onClick={onClick}
      className={`rounded-2xl p-5 transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${dark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-slate-100 shadow-sm'
        }`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${gradient}`}>
        {icon}
      </div>
      <p className={`text-3xl font-bold mb-1 ${dark ? 'text-white' : 'text-slate-800'}`}>{value}</p>
      <p className={`text-sm ${dark ? 'text-gray-400' : 'text-slate-500'}`}>{label}</p>
    </div>
  )
}

function PatientDashboard({ user, appointments, dark }) {
  const navigate = useNavigate()
  const pending = appointments.filter(a => a.status === 'pendiente').length
  const confirmed = appointments.filter(a => a.status === 'confirmada').length
  const attended = appointments.filter(a => a.status === 'atendida').length
  const upcoming = appointments
    .filter(a => a.status !== 'cancelada' && new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3)

  const today = new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className={`p-6 min-h-full ${dark ? 'bg-gray-900' : 'bg-slate-50'}`}>

      {/* Header */}
      <div className={`rounded-2xl p-6 mb-6 bg-gradient-to-br from-teal-600 to-teal-700 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <p className="text-teal-200 text-sm mb-1 capitalize">{today}</p>
          <h1 className="text-2xl font-bold text-white mb-1">¡Hola, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-teal-100 text-sm">Centro de Salud Jorge Chávez — Juliaca</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: '🕐', label: 'Pendientes', value: pending, gradient: 'bg-yellow-100' },
          { icon: '✅', label: 'Confirmadas', value: confirmed, gradient: 'bg-green-100' },
          { icon: '🏥', label: 'Atendidas', value: attended, gradient: 'bg-blue-100' },
        ].map(s => (
          <StatCard key={s.label} {...s} dark={dark} onClick={() => navigate('/my-appointments')} />
        ))}
      </div>

      {/* Próximas citas */}
      <div className={`rounded-2xl border p-5 mb-4 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-bold text-lg ${dark ? 'text-white' : 'text-slate-800'}`}>Próximas citas</h2>
          <button onClick={() => navigate('/my-appointments')}
            className="text-xs text-teal-600 hover:text-teal-700 font-medium">
            Ver todas →
          </button>
        </div>
        {upcoming.length === 0 ? (
          <div className="flex flex-col items-center py-8 gap-2">
            <span className="text-4xl">📅</span>
            <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-slate-500'}`}>No tienes citas próximas</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((a) => (
              <div key={a._id} className={`flex items-center gap-4 p-3 rounded-xl ${dark ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {a.doctor?.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${dark ? 'text-white' : 'text-slate-800'}`}>{a.doctor?.name}</p>
                  <p className={`text-xs truncate ${dark ? 'text-gray-400' : 'text-slate-400'}`}>{a.doctor?.specialty}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-xs font-medium ${dark ? 'text-gray-300' : 'text-slate-600'}`}>
                    {new Date(a.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
                  </p>
                  <p className={`text-xs ${dark ? 'text-gray-400' : 'text-slate-400'}`}>{a.time}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize flex-shrink-0 ${dark ? STATUS_COLORS_DARK[a.status] : STATUS_COLORS[a.status]
                  }`}>{a.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info centro */}
      <div className={`rounded-2xl border p-5 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100 shadow-sm'}`}>
        <h2 className={`font-bold text-lg mb-4 ${dark ? 'text-white' : 'text-slate-800'}`}>Centro de Salud</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '📍', label: 'Ubicación', value: 'Jr. Ancash N° 179, Juliaca' },
            { icon: '📞', label: 'Teléfono', value: '(051) 331445' },
            { icon: '🕐', label: 'Horario', value: 'Lun - Sáb: 8:00 - 18:00' },
            { icon: '🏥', label: 'Especialidades', value: '6 especialidades' },
          ].map(i => (
            <div key={i.label} className={`flex items-start gap-3 p-3 rounded-xl ${dark ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
              <span className="text-lg">{i.icon}</span>
              <div>
                <p className={`text-xs ${dark ? 'text-gray-400' : 'text-slate-400'}`}>{i.label}</p>
                <p className={`text-xs font-medium ${dark ? 'text-gray-200' : 'text-slate-700'}`}>{i.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AdminDashboard({ stats, dark, role }) {
  const navigate = useNavigate()
  const today = new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  const gradients = {
    admin: 'from-purple-600 to-purple-700',
    admision: 'from-teal-600 to-teal-700',
    doctor: 'from-blue-600 to-blue-700',
  }

  const roleGreet = {
    admin: 'Panel de Administración',
    admision: 'Panel de Admisión',
    doctor: 'Panel del Doctor',
  }

  return (
    <div className={`p-6 min-h-full ${dark ? 'bg-gray-900' : 'bg-slate-50'}`}>

      {/* Header */}
      <div className={`rounded-2xl p-6 mb-6 bg-gradient-to-br ${gradients[role] || gradients.admin} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-20 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-white/60 text-sm mb-1 capitalize">{today}</p>
            <h1 className="text-2xl font-bold text-white mb-1">{roleGreet[role] || 'Panel de Control'}</h1>
            <p className="text-white/70 text-sm">Centro de Salud Jorge Chávez — Juliaca</p>
          </div>
          <div className={`px-3 py-1.5 rounded-xl bg-white/10 border border-white/20`}>
            <p className="text-white text-xs font-medium">
              🟢 Sistema activo
            </p>
          </div>
        </div>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {[
          { icon: '👥', label: 'Pacientes registrados', value: stats?.totalPatients || 0, gradient: 'bg-blue-100', path: '/patients' },
          { icon: '👨‍⚕️', label: 'Médicos activos', value: stats?.totalDoctors || 0, gradient: 'bg-green-100', path: '/doctors' },
          { icon: '📅', label: 'Citas hoy', value: stats?.todayAppointments || 0, gradient: 'bg-yellow-100', path: '/appointments' },
          { icon: '✅', label: 'Citas atendidas', value: stats?.attendedAppointments || 0, gradient: 'bg-teal-100', path: '/appointments' },
        ].map(s => (
          <StatCard key={s.label} {...s} dark={dark} onClick={() => navigate(s.path)} />
        ))}
      </div>

      {/* Stats secundarias */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: '🕐', label: 'Pendientes', value: stats?.pendingAppointments || 0, gradient: 'bg-orange-100', path: '/appointments' },
          { icon: '📋', label: 'Total citas', value: stats?.totalAppointments || 0, gradient: 'bg-slate-100', path: '/appointments' },
          { icon: '📂', label: 'Historiales', value: stats?.totalRecords || 0, gradient: 'bg-purple-100', path: '/reports' },
        ].map(s => (
          <StatCard key={s.label} {...s} dark={dark} onClick={() => navigate(s.path)} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Últimas citas */}
        <div className={`rounded-2xl border p-5 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-bold text-lg ${dark ? 'text-white' : 'text-slate-800'}`}>Últimas citas</h2>
            <button onClick={() => navigate('/appointments')}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium">
              Ver todas →
            </button>
          </div>
          {!stats?.recentAppointments?.length ? (
            <div className="flex flex-col items-center py-8 gap-2">
              <span className="text-4xl">📅</span>
              <p className={`text-sm ${dark ? 'text-gray-400' : 'text-slate-400'}`}>No hay citas registradas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentAppointments.slice(0, 5).map((a) => (
                <div key={a._id} className={`flex items-center gap-3 p-3 rounded-xl ${dark ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
                  <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {a.patient?.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${dark ? 'text-white' : 'text-slate-800'}`}>{a.patient?.name}</p>
                    <p className={`text-xs truncate ${dark ? 'text-gray-400' : 'text-slate-400'}`}>{a.doctor?.name} — {a.doctor?.specialty}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-slate-500'}`}>
                      {new Date(a.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${dark ? STATUS_COLORS_DARK[a.status] : STATUS_COLORS[a.status]
                      }`}>{a.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Accesos rápidos */}
        <div className={`rounded-2xl border p-5 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100 shadow-sm'}`}>
          <h2 className={`font-bold text-lg mb-4 ${dark ? 'text-white' : 'text-slate-800'}`}>Accesos rápidos</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '👥', label: 'Nuevo Paciente', path: '/patients', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
              { icon: '📅', label: 'Nueva Cita', path: '/appointments', color: 'bg-teal-50 text-teal-600 hover:bg-teal-100' },
              { icon: '👨‍⚕️', label: 'Ver Médicos', path: '/doctors', color: 'bg-green-50 text-green-600 hover:bg-green-100' },
              { icon: '📊', label: 'Ver Informes', path: '/reports', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
              { icon: '🏥', label: 'Consultorios', path: '/consultorios', color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
              { icon: '🕐', label: 'Horarios', path: '/horarios', color: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100' },
            ].map(item => (
              <button key={item.label} onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${item.color}`}>
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Estado del sistema */}
        <div className={`rounded-2xl border p-5 lg:col-span-2 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100 shadow-sm'}`}>
          <h2 className={`font-bold text-lg mb-4 ${dark ? 'text-white' : 'text-slate-800'}`}>Estado del sistema</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Citas confirmadas', value: stats?.confirmedAppointments || 0, total: stats?.totalAppointments || 1, color: 'bg-green-500' },
              { label: 'Citas atendidas', value: stats?.attendedAppointments || 0, total: stats?.totalAppointments || 1, color: 'bg-blue-500' },
              { label: 'Citas pendientes', value: stats?.pendingAppointments || 0, total: stats?.totalAppointments || 1, color: 'bg-yellow-500' },
              { label: 'Citas canceladas', value: stats?.cancelledAppointments || 0, total: stats?.totalAppointments || 1, color: 'bg-red-500' },
            ].map(s => (
              <div key={s.label} className={`p-3 rounded-xl ${dark ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
                <p className={`text-xs mb-2 ${dark ? 'text-gray-400' : 'text-slate-500'}`}>{s.label}</p>
                <p className={`text-2xl font-bold mb-2 ${dark ? 'text-white' : 'text-slate-800'}`}>{s.value}</p>
                <div className={`w-full h-1.5 rounded-full ${dark ? 'bg-gray-600' : 'bg-slate-200'}`}>
                  <div className={`h-full rounded-full ${s.color}`}
                    style={{ width: `${Math.min((s.value / s.total) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { darkMode } = useTheme()
  const [stats, setStats] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === 'paciente') {
          const { data } = await api.get('/appointments')
          setAppointments(data)
        } else {
          const { data } = await api.get('/stats')
          setStats(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  if (loading) return (
    <div className={`p-6 flex items-center justify-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>Cargando...</p>
      </div>
    </div>
  )

  return (
    <div className={`min-h-full transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
      {user?.role === 'paciente'
        ? <PatientDashboard user={user} appointments={appointments} dark={darkMode} />
        : <AdminDashboard stats={stats} dark={darkMode} role={user?.role} />
      }
    </div>
  )
}