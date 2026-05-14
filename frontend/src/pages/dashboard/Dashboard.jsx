import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${color}`}>
        Total
      </span>
    </div>
    <p className="text-3xl font-bold text-slate-800">{value}</p>
    <p className="text-sm text-slate-500 mt-1">{label}</p>
  </div>
)

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/stats')
        setStats(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <p className="text-slate-400">Cargando estadísticas...</p>
    </div>
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Bienvenido, {user?.name} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Panel de control — Centro de Salud Jorge Chávez
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="👥" label="Pacientes registrados" value={stats?.totalPatients || 0} color="bg-blue-50 text-blue-600" />
        <StatCard icon="👨‍⚕️" label="Médicos activos" value={stats?.totalDoctors || 0} color="bg-green-50 text-green-600" />
        <StatCard icon="📅" label="Citas hoy" value={stats?.todayAppointments || 0} color="bg-yellow-50 text-yellow-600" />
        <StatCard icon="✅" label="Citas atendidas" value={stats?.attendedAppointments || 0} color="bg-purple-50 text-purple-600" />
      </div>

      {/* Segunda fila */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon="🕐" label="Citas pendientes" value={stats?.pendingAppointments || 0} color="bg-orange-50 text-orange-600" />
        <StatCard icon="📋" label="Total citas" value={stats?.totalAppointments || 0} color="bg-slate-100 text-slate-600" />
        <StatCard icon="🏥" label="Historiales clínicos" value={stats?.totalRecords || 0} color="bg-teal-50 text-teal-600" />
      </div>

      {/* Ultimas citas */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Últimas citas</h2>
        {stats?.recentAppointments?.length === 0 ? (
          <p className="text-slate-400 text-sm">No hay citas registradas</p>
        ) : (
          <div className="space-y-3">
            {stats?.recentAppointments?.map((a) => (
              <div key={a._id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
                    {a.patient?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{a.patient?.name}</p>
                    <p className="text-xs text-slate-400">{a.doctor?.name} — {a.doctor?.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">{new Date(a.date).toLocaleDateString('es-PE')}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                    a.status === 'pendiente' ? 'bg-yellow-50 text-yellow-600' :
                    a.status === 'confirmada' ? 'bg-green-50 text-green-600' :
                    a.status === 'atendida' ? 'bg-blue-50 text-blue-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}