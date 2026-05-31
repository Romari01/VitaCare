import { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import api from '../../services/api'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

export default function Doctors() {
  const { darkMode } = useTheme()
  const { toast, showToast, hideToast } = useToast()
  const [doctors, setDoctors] = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', specialty: '', phone: '', email: '', cmp: '' })

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get('/doctors')
      setDoctors(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEspecialidades = async () => {
    try {
      const { data } = await api.get('/especialidades/activas')
      setEspecialidades(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchDoctors()
    fetchEspecialidades()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/doctors/${editingId}`, form)
        showToast('Médico actualizado correctamente', 'success')
      } else {
        await api.post('/doctors', form)
        showToast('Médico registrado correctamente', 'success')
      }
      handleClose()
      fetchDoctors()
    } catch (error) {
      showToast(error.response?.data?.message || 'Error al guardar', 'error')
    }
  }

  const handleEdit = (doctor) => {
    setEditingId(doctor._id)
    setForm({
      name: doctor.name || '',
      specialty: doctor.specialty || '',
      phone: doctor.phone || '',
      email: doctor.email || '',
      cmp: doctor.cmp || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar médico?')) return
    try {
      await api.delete(`/doctors/${id}`)
      fetchDoctors()
      showToast('Médico eliminado correctamente', 'success')
    } catch (error) {
      showToast('Error al eliminar', 'error')
    }
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingId(null)
    setForm({ name: '', specialty: '', phone: '', email: '', cmp: '' })
  }

  const inputClass = `w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-slate-200 text-slate-800'
    }`

  return (
    <div className={`p-6 min-h-full transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Médicos</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Gestión del personal médico</p>
        </div>
        <button onClick={() => { setShowForm(true); fetchEspecialidades() }}
          className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-md shadow-teal-500/20">
          + Nuevo Médico
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>Cargando...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <span className="text-4xl">👨‍⚕️</span>
          <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>No hay médicos registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map((d) => (
            <div key={d._id} className={`rounded-2xl border p-5 transition-all hover:shadow-md ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-teal-500/30' : 'bg-white border-slate-100 hover:border-teal-200'
              }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                    {d.name.charAt(0)}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-slate-800'}`}>{d.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-600 border border-teal-200 font-medium">
                      {d.specialty}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`space-y-1 text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                {d.phone && <p>📞 {d.phone}</p>}
                {d.email && <p>✉️ {d.email}</p>}
                {d.cmp && <p>🏥 CMP: {d.cmp}</p>}
              </div>
              <div className={`flex gap-2 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
                <button onClick={() => handleEdit(d)}
                  className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 flex items-center justify-center transition-colors"
                  title="Editar">✏️</button>
                <button onClick={() => handleDelete(d._id)}
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                  title="Eliminar">🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 w-full max-w-md shadow-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {editingId ? 'Editar Médico' : 'Nuevo Médico'}
              </h2>
              <button onClick={handleClose}
                className={`text-xl ${darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Nombre completo</label>
                <input required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Dr. Juan Pérez" className={inputClass} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Especialidad</label>
                <select required value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className={inputClass}>
                  <option value="">Seleccionar...</option>
                  {especialidades.length > 0 ? (
                    especialidades.map(e => (
                      <option key={e._id} value={e.nombre}>{e.icon} {e.nombre}</option>
                    ))
                  ) : (
                    <option disabled>No hay especialidades registradas</option>
                  )}
                </select>
                {especialidades.length === 0 && (
                  <p className="text-xs text-orange-500 mt-1">
                    ⚠️ Primero registra especialidades en el módulo de Especialidades
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Teléfono</label>
                  <input value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="987654321" className={inputClass} />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>CMP</label>
                  <input value={form.cmp}
                    onChange={(e) => setForm({ ...form, cmp: e.target.value })}
                    placeholder="12345" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Email</label>
                <input type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="doctor@vitacare.com" className={inputClass} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleClose}
                  className={`flex-1 border py-2.5 rounded-xl text-sm transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}>
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors">
                  {editingId ? 'Actualizar' : 'Guardar'}
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