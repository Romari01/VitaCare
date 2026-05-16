import { useState, useEffect } from 'react'
import api from '../../services/api'

const STATUS_COLORS = {
  pendiente: 'bg-yellow-50 text-yellow-600 border border-yellow-200',
  confirmada: 'bg-teal-50 text-teal-600 border border-teal-200',
  cancelada: 'bg-red-50 text-red-600 border border-red-200',
  atendida: 'bg-blue-50 text-blue-600 border border-blue-200'
}

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const pending = appointments.filter(a => a.status === 'pendiente').length
  const confirmed = appointments.filter(a => a.status === 'confirmada').length
  const attended = appointments.filter(a => a.status === 'atendida').length

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/appointments')
        setAppointments(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Mis Citas</h1>
        <p className="text-slate-500 text-sm mt-1">Historial de tus citas médicas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: '🕐', label: 'Citas pendientes', value: pending, color: 'bg-yellow-50 text-yellow-600' },
          { icon: '✅', label: 'Citas confirmadas', value: confirmed, color: 'bg-teal-50 text-teal-600' },
          { icon: '🏥', label: 'Citas atendidas', value: attended, color: 'bg-blue-50 text-blue-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.color}`}>Total</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{s.value}</p>
            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Mis próximas citas</h2>
          <span className="text-xs text-slate-400">{appointments.length} cita(s) en total</span>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['Médico', 'Especialidad', 'Fecha', 'Hora', 'Estado'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-slate-400 text-sm">Cargando citas...</span>
                </div>
              </td></tr>
            ) : appointments.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">📅</span>
                  <p className="text-slate-500 font-medium">No tienes citas registradas</p>
                  <p className="text-slate-400 text-sm">Usa el botón "Reservar Cita" del menú lateral</p>
                </div>
              </td></tr>
            ) : appointments.map((a) => (
              <tr key={a._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xs">
                      {a.doctor?.name?.charAt(0) || 'D'}
                    </div>
                    <span className="text-sm font-medium text-slate-800">{a.doctor?.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{a.doctor?.specialty}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{new Date(a.date).toLocaleDateString('es-PE')}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-700">{a.time}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[a.status]}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}