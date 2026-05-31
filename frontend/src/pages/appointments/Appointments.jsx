import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../hooks/useTheme'
import api from '../../services/api'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

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

const TIMES = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00'
]

export default function Appointments() {
  const { user } = useAuth()
  const { darkMode } = useTheme()
  const { toast, showToast, hideToast } = useToast()
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filterDate, setFilterDate] = useState('')
  const [form, setForm] = useState({
    patient: '', doctor: '', date: '', time: '', reason: ''
  })

  const fetchAll = async () => {
    try {
      const params = filterDate ? `?date=${filterDate}` : ''
      const [appsRes, patientsRes, doctorsRes] = await Promise.all([
        api.get(`/appointments${params}`),
        api.get('/patients'),
        api.get('/doctors')
      ])
      setAppointments(appsRes.data)
      setPatients(patientsRes.data)
      setDoctors(doctorsRes.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [filterDate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/appointments', form)
      setShowForm(false)
      setForm({ patient: '', doctor: '', date: '', time: '', reason: '' })
      fetchAll()
      showToast('Cita registrada correctamente', 'success')
    } catch (error) {
      showToast(error.response?.data?.message || 'Error al guardar', 'error')
    }
  }

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status })
      fetchAll()
      showToast(`Cita marcada como ${status}`, 'success')
    } catch (error) {
      showToast('Error al actualizar estado', 'error')
    }
  }

  const handleCancel = async (id) => {
    if (!confirm('¿Cancelar esta cita?')) return
    try {
      await api.put(`/appointments/${id}`, { status: 'cancelada' })
      fetchAll()
      showToast('Cita cancelada', 'warning')
    } catch (error) {
      showToast('Error al cancelar', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta cita permanentemente?')) return
    try {
      await api.delete(`/appointments/${id}`)
      fetchAll()
      showToast('Cita eliminada correctamente', 'success')
    } catch (error) {
      showToast('Error al eliminar', 'error')
    }
  }

  const inputClass = `w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-slate-200 text-slate-800'
    }`

  return (
    <div className={`p-6 min-h-full transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Citas Médicas</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Gestión y programación de citas</p>
        </div>
        {['admin', 'admision'].includes(user?.role) && (
          <button onClick={() => setShowForm(true)}
            className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-md shadow-teal-500/20">
            + Nueva Cita
          </button>
        )}
      </div>

      {/* Filtro */}
      <div className="mb-4 flex items-center gap-3">
        <input type="date" value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className={`border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-slate-200'
            }`}
        />
        {filterDate && (
          <button onClick={() => setFilterDate('')}
            className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>
            Limpiar filtro
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>
        <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
          <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Lista de citas</h2>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{appointments.length} cita(s)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-slate-50 border-slate-100'}`}>
              <tr>
                {['Paciente', 'Médico', 'Fecha', 'Hora', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-slate-50'}`}>
              {loading ? (
                <tr><td colSpan="6" className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>Cargando...</span>
                  </div>
                </td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">📅</span>
                    <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>No hay citas registradas</p>
                  </div>
                </td></tr>
              ) : appointments.map((a) => (
                <tr key={a._id} className={`transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-slate-50'}`}>
                  <td className="px-6 py-4">
                    <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>{a.patient?.name}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{a.patient?.dni}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>{a.doctor?.name}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{a.doctor?.specialty}</p>
                  </td>
                  <td className={`px-6 py-4 text-sm whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                    {new Date(a.date).toLocaleDateString('es-PE')}
                  </td>
                  <td className={`px-6 py-4 text-sm whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                    {a.time}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize whitespace-nowrap ${darkMode ? STATUS_COLORS_DARK[a.status] : STATUS_COLORS[a.status]
                      }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {a.status === 'pendiente' && ['admin', 'admision', 'doctor'].includes(user?.role) && (
                        <button onClick={() => handleStatus(a._id, 'confirmada')}
                          className="text-xs px-2 py-1 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 transition-colors whitespace-nowrap">
                          Confirmar
                        </button>
                      )}
                      {a.status === 'confirmada' && ['admin', 'admision', 'doctor'].includes(user?.role) && (
                        <button onClick={() => handleStatus(a._id, 'atendida')}
                          className="text-xs px-2 py-1 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition-colors whitespace-nowrap">
                          Atendida
                        </button>
                      )}
                      {['admin', 'admision'].includes(user?.role) && a.status !== 'cancelada' && (
                        <button onClick={() => handleCancel(a._id)}
                          className="text-xs px-2 py-1 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border border-yellow-200 transition-colors whitespace-nowrap">
                          Cancelar
                        </button>
                      )}
                      {['admin', 'admision'].includes(user?.role) && (
                        <button onClick={() => handleDelete(a._id)}
                          className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                          title="Eliminar">🗑️</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 w-full max-w-md shadow-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Nueva Cita</h2>
              <button onClick={() => setShowForm(false)}
                className={`text-xl ${darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Paciente</label>
                <select required value={form.patient}
                  onChange={(e) => setForm({ ...form, patient: e.target.value })}
                  className={inputClass}>
                  <option value="">Seleccionar paciente...</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name} — {p.dni}</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Médico</label>
                <select required value={form.doctor}
                  onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                  className={inputClass}>
                  <option value="">Seleccionar médico...</option>
                  {doctors.map(d => <option key={d._id} value={d._id}>{d.name} — {d.specialty}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Fecha</label>
                  <input type="date" required value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className={inputClass} />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Hora</label>
                  <select required value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className={inputClass}>
                    <option value="">Seleccionar...</option>
                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Motivo de consulta</label>
                <textarea required value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  rows={3} placeholder="Describe el motivo..."
                  className={`${inputClass} resize-none`} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className={`flex-1 border py-2.5 rounded-xl text-sm transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}>
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}