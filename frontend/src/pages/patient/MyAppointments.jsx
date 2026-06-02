import { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import api from '../../services/api'

const STATUS_COLORS = {
  pendiente: 'bg-yellow-50 text-yellow-600 border border-yellow-200',
  confirmada: 'bg-green-50 text-green-600 border border-green-200',
  cancelada: 'bg-red-50 text-red-600 border border-red-200',
  atendida: 'bg-blue-50 text-blue-600 border border-blue-200'
}

const STATUS_COLORS_DARK = {
  pendiente: 'bg-yellow-900/30 text-yellow-400 border border-yellow-700',
  confirmada: 'bg-green-900/30 text-green-400 border border-green-700',
  cancelada: 'bg-red-900/30 text-red-400 border border-red-700',
  atendida: 'bg-blue-900/30 text-blue-400 border border-blue-700'
}

export default function MyAppointments() {
  const { darkMode } = useTheme()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 8

  const pending = appointments.filter(a => a.status === 'pendiente').length
  const confirmed = appointments.filter(a => a.status === 'confirmada').length
  const attended = appointments.filter(a => a.status === 'atendida').length
  const cancelled = appointments.filter(a => a.status === 'cancelada').length

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/appointments')
        setAppointments(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = appointments.filter(a =>
    filterStatus === '' || a.status === filterStatus
  )

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const upcoming = appointments
    .filter(a => a.status !== 'cancelada' && new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 1)[0]

  return (
    <div className={`p-6 min-h-full transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>

      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Mis Citas</h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Historial de tus citas médicas</p>
      </div>

      {/* Próxima cita destacada */}
      {upcoming && (
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-5 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-teal-200 text-xs font-medium mb-2">📅 Próxima cita</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-lg">{upcoming.doctor?.name}</p>
                <p className="text-teal-200 text-sm">{upcoming.doctor?.specialty}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">
                  {new Date(upcoming.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
                </p>
                <p className="text-teal-200 text-sm">{upcoming.time}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Pendientes', value: pending, color: 'text-yellow-600', bg: darkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-100' },
          { label: 'Confirmadas', value: confirmed, color: 'text-green-600', bg: darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-100' },
          { label: 'Atendidas', value: attended, color: 'text-blue-600', bg: darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-100' },
          { label: 'Canceladas', value: cancelled, color: 'text-red-500', bg: darkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-100' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.bg}`}>
            <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['', 'pendiente', 'confirmada', 'atendida', 'cancelada'].map(s => (
          <button key={s} onClick={() => { setFilterStatus(s); setPage(1) }}
            className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors capitalize ${filterStatus === s
                ? 'bg-teal-600 text-white border-teal-600'
                : darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
            {s === '' ? 'Todas' : s}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>
        <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
          <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Historial de citas</h2>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{filtered.length} cita(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-slate-50 border-slate-100'}`}>
              <tr>
                {['Médico', 'Especialidad', 'Fecha', 'Hora', 'Motivo', 'Estado'].map(h => (
                  <th key={h} className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-slate-50'}`}>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>Cargando citas...</span>
                  </div>
                </td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">📅</span>
                    <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>No tienes citas registradas</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>Usa el botón "Reservar Cita" del menú lateral</p>
                  </div>
                </td></tr>
              ) : paginated.map((a) => (
                <tr key={a._id} className={`transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-slate-50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {a.doctor?.name?.charAt(0) || 'D'}
                      </div>
                      <span className={`text-sm font-medium whitespace-nowrap ${darkMode ? 'text-white' : 'text-slate-800'}`}>{a.doctor?.name}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{a.doctor?.specialty}</td>
                  <td className={`px-6 py-4 text-sm whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                    {new Date(a.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className={`px-6 py-4 text-sm whitespace-nowrap font-mono ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{a.time}</td>
                  <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                    <p className="truncate max-w-32">{a.reason || '—'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize whitespace-nowrap ${darkMode ? STATUS_COLORS_DARK[a.status] : STATUS_COLORS[a.status]
                      }`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className={`px-6 py-4 border-t flex items-center justify-between flex-wrap gap-3 ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            Mostrando {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} a {Math.min(page * perPage, filtered.length)} de {filtered.length} citas
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors disabled:opacity-40 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>Anterior</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-teal-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors disabled:opacity-40 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  )
}