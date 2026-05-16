import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../hooks/useTheme'
import api from '../../services/api'

const StatCard = ({ icon, label, value, color, dark }) => (
  <div className={`rounded-2xl border p-5 transition-colors ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${color}`}>Total</span>
    </div>
    <p className={`text-3xl font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>{value}</p>
    <p className={`text-sm mt-1 ${dark ? 'text-gray-400' : 'text-slate-500'}`}>{label}</p>
  </div>
)

function PatientDashboard({ user, appointments, dark }) {
  const pending = appointments.filter(a => a.status === 'pendiente').length
  const confirmed = appointments.filter(a => a.status === 'confirmada').length
  const attended = appointments.filter(a => a.status === 'atendida').length

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>
          Bienvenido, {user?.name} 👋
        </h1>
        <p className={`text-sm mt-1 ${dark ? 'text-gray-400' : 'text-slate-500'}`}>
          Panel de control — Centro de Salud Jorge Chávez
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon="🕐" label="Citas pendientes" value={pending} color="bg-yellow-50 text-yellow-600" dark={dark} />
        <StatCard icon="✅" label="Citas confirmadas" value={confirmed} color="bg-green-50 text-green-600" dark={dark} />
        <StatCard icon="🏥" label="Citas atendidas" value={attended} color="bg-blue-50 text-blue-600" dark={dark} />
      </div>

      <div className={`rounded-2xl border p-5 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>
        <h2 className={`text-lg font-bold mb-4 ${dark ? 'text-white' : 'text-slate-800'}`}>Mis próximas citas</h2>
        {appointments.length === 0 ? (
          <p className={`text-sm ${dark ? 'text-gray-500' : 'text-slate-400'}`}>No tienes citas registradas</p>
        ) : (
          <div className="space-y-3">
            {appointments.slice(0, 5).map((a) => (
              <div key={a._id} className={`flex items-center justify-between py-2 border-b last:border-0 ${dark ? 'border-gray-700' : 'border-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm">
                    {a.doctor?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-slate-800'}`}>{a.doctor?.name}</p>
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-slate-400'}`}>{a.doctor?.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs ${dark ? 'text-gray-400' : 'text-slate-500'}`}>
                    {new Date(a.date).toLocaleDateString('es-PE')} — {a.time}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                    a.status === 'pendiente' ? 'bg-yellow-50 text-yellow-600' :
                    a.status === 'confirmada' ? 'bg-green-50 text-green-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>{a.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AdminDashboard({ stats, dark }) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-slate-800'}`}>
          Panel de control 👋
        </h1>
        <p className={`text-sm mt-1 ${dark ? 'text-gray-400' : 'text-slate-500'}`}>
          Centro de Salud Jorge Chávez
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="👥" label="Pacientes registrados" value={stats?.totalPatients || 0} color="bg-blue-50 text-blue-600" dark={dark} />
        <StatCard icon="👨‍⚕️" label="Médicos activos" value={stats?.totalDoctors || 0} color="bg-green-50 text-green-600" dark={dark} />
        <StatCard icon="📅" label="Citas hoy" value={stats?.todayAppointments || 0} color="bg-yellow-50 text-yellow-600" dark={dark} />
        <StatCard icon="✅" label="Citas atendidas" value={stats?.attendedAppointments || 0} color="bg-purple-50 text-purple-600" dark={dark} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon="🕐" label="Citas pendientes" value={stats?.pendingAppointments || 0} color="bg-orange-50 text-orange-600" dark={dark} />
        <StatCard icon="📋" label="Total citas" value={stats?.totalAppointments || 0} color="bg-slate-100 text-slate-600" dark={dark} />
        <StatCard icon="🏥" label="Historiales clínicos" value={stats?.totalRecords || 0} color="bg-teal-50 text-teal-600" dark={dark} />
      </div>

      <div className={`rounded-2xl border p-5 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>
        <h2 className={`text-lg font-bold mb-4 ${dark ? 'text-white' : 'text-slate-800'}`}>Últimas citas</h2>
        {stats?.recentAppointments?.length === 0 ? (
          <p className={`text-sm ${dark ? 'text-gray-500' : 'text-slate-400'}`}>No hay citas registradas</p>
        ) : (
          <div className="space-y-3">
            {stats?.recentAppointments?.map((a) => (
              <div key={a._id} className={`flex items-center justify-between py-2 border-b last:border-0 ${dark ? 'border-gray-700' : 'border-slate-50'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-sm">
                    {a.patient?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${dark ? 'text-white' : 'text-slate-800'}`}>{a.patient?.name}</p>
                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-slate-400'}`}>{a.doctor?.name} — {a.doctor?.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs ${dark ? 'text-gray-400' : 'text-slate-500'}`}>
                    {new Date(a.date).toLocaleDateString('es-PE')}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                    a.status === 'pendiente' ? 'bg-yellow-50 text-yellow-600' :
                    a.status === 'confirmada' ? 'bg-green-50 text-green-600' :
                    a.status === 'atendida' ? 'bg-blue-50 text-blue-600' :
                    'bg-red-50 text-red-600'
                  }`}>{a.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
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
    <div className={`p-6 flex items-center justify-center h-64 ${darkMode ? 'bg-gray-900' : ''}`}>
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>Cargando...</p>
      </div>
    </div>
  )

  return (
    <div className={`min-h-full transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
      {user?.role === 'paciente'
        ? <PatientDashboard user={user} appointments={appointments} dark={darkMode} />
        : <AdminDashboard stats={stats} dark={darkMode} />
      }
    </div>
  )
}