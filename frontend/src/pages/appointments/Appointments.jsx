import { useState, useEffect } from 'react'
import api from '../../services/api'

const STATUS_COLORS = {
  pendiente: 'bg-yellow-50 text-yellow-600',
  confirmada: 'bg-green-50 text-green-600',
  cancelada: 'bg-red-50 text-red-600',
  atendida: 'bg-blue-50 text-blue-600'
}

const TIMES = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00'
]

export default function Appointments() {
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
    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar')
    }
  }

  const handleStatus = async (id, status) => {
    await api.put(`/appointments/${id}`, { status })
    fetchAll()
  }

  const handleCancel = async (id) => {
    if (!confirm('¿Cancelar esta cita?')) return
    await api.delete(`/appointments/${id}`)
    fetchAll()
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Citas Médicas</h1>
          <p className="text-slate-500 text-sm">Gestión y programación de citas</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-800 transition-colors"
        >
          + Nueva Cita
        </button>
      </div>

      {/* Filtro por fecha */}
      <div className="mb-4">
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
        {filterDate && (
          <button
            onClick={() => setFilterDate('')}
            className="ml-2 text-sm text-slate-400 hover:text-slate-600"
          >
            Limpiar filtro
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Paciente</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Médico</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Fecha</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Hora</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Estado</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="6" className="text-center py-8 text-slate-400">Cargando...</td></tr>
            ) : appointments.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-8 text-slate-400">No hay citas registradas</td></tr>
            ) : appointments.map((a) => (
              <tr key={a._id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-800 text-sm">{a.patient?.name}</p>
                  <p className="text-xs text-slate-400">{a.patient?.dni}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-700">{a.doctor?.name}</p>
                  <p className="text-xs text-slate-400">{a.doctor?.specialty}</p>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(a.date).toLocaleDateString('es-PE')}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{a.time}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[a.status]}`}>
                    {a.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {a.status === 'pendiente' && (
                      <button
                        onClick={() => handleStatus(a._id, 'confirmada')}
                        className="text-xs text-green-600 hover:text-green-800"
                      >
                        Confirmar
                      </button>
                    )}
                    {a.status === 'confirmada' && (
                      <button
                        onClick={() => handleStatus(a._id, 'atendida')}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Atendida
                      </button>
                    )}
                    <button
                      onClick={() => handleCancel(a._id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Cancelar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Nueva Cita</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Paciente</label>
                <select required value={form.patient} onChange={(e) => setForm({...form, patient: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
                  <option value="">Seleccionar paciente...</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name} — {p.dni}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Médico</label>
                <select required value={form.doctor} onChange={(e) => setForm({...form, doctor: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
                  <option value="">Seleccionar médico...</option>
                  {doctors.map(d => <option key={d._id} value={d._id}>{d.name} — {d.specialty}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Fecha</label>
                  <input type="date" required value={form.date} onChange={(e) => setForm({...form, date: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Hora</label>
                  <select required value={form.time} onChange={(e) => setForm({...form, time: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
                    <option value="">Seleccionar...</option>
                    {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Motivo de consulta</label>
                <textarea required value={form.reason} onChange={(e) => setForm({...form, reason: e.target.value})}
                  rows={3} placeholder="Describe el motivo..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-slate-200 text-slate-600 py-2 rounded-xl text-sm hover:bg-slate-50">
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 bg-primary-600 text-white py-2 rounded-xl text-sm hover:bg-primary-800">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}