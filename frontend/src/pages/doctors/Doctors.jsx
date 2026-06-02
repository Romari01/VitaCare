import { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import api from '../../services/api'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

const SPECIALTY_COLORS = {
  'Medicina General': 'from-blue-400 to-blue-600',
  'Nutricion': 'from-green-400 to-green-600',
  'Psicologia': 'from-purple-400 to-purple-600',
  'Odontologia': 'from-cyan-400 to-cyan-600',
  'Enfermeria': 'from-pink-400 to-pink-600',
  'Obstetricia': 'from-rose-400 to-rose-600',
  'Cardiología': 'from-red-400 to-red-600',
  'Pediatría': 'from-orange-400 to-orange-600',
  'Ginecología': 'from-fuchsia-400 to-fuchsia-600',
  'Traumatología': 'from-amber-400 to-amber-600',
  'Neurología': 'from-indigo-400 to-indigo-600',
  'Oftalmología': 'from-sky-400 to-sky-600',
  'Dermatología': 'from-lime-400 to-lime-600',
}

const SPECIALTY_BADGE = {
  'Medicina General': 'bg-blue-50 text-blue-600 border border-blue-200',
  'Nutricion': 'bg-green-50 text-green-600 border border-green-200',
  'Psicologia': 'bg-purple-50 text-purple-600 border border-purple-200',
  'Odontologia': 'bg-cyan-50 text-cyan-600 border border-cyan-200',
  'Enfermeria': 'bg-pink-50 text-pink-600 border border-pink-200',
  'Obstetricia': 'bg-rose-50 text-rose-600 border border-rose-200',
  'Cardiología': 'bg-red-50 text-red-600 border border-red-200',
  'Pediatría': 'bg-orange-50 text-orange-600 border border-orange-200',
  'Ginecología': 'bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-200',
  'Traumatología': 'bg-amber-50 text-amber-600 border border-amber-200',
  'Neurología': 'bg-indigo-50 text-indigo-600 border border-indigo-200',
  'Oftalmología': 'bg-sky-50 text-sky-600 border border-sky-200',
  'Dermatología': 'bg-lime-50 text-lime-600 border border-lime-200',
}

export default function Doctors() {
  const { darkMode } = useTheme()
  const { toast, showToast, hideToast } = useToast()
  const [doctors, setDoctors] = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [filterSpecialty, setFilterSpecialty] = useState('')
  const [form, setForm] = useState({
    name: '', dni: '', specialty: '', phone: '', email: '', cmp: ''
  })

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
      dni: doctor.dni || '',
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
    setForm({ name: '', dni: '', specialty: '', phone: '', email: '', cmp: '' })
  }

  const specialties = [...new Set(doctors.map(d => d.specialty).filter(Boolean))]

  const filtered = doctors.filter(d =>
    (d.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty?.toLowerCase().includes(search.toLowerCase()) ||
      d.dni?.includes(search)) &&
    (filterSpecialty === '' || d.specialty === filterSpecialty)
  )

  const inputClass = `w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-slate-200 text-slate-800'
    }`
  const labelClass = `block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`

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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`rounded-2xl border p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>
          <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Total Médicos</p>
          <p className="text-3xl font-bold text-teal-600 mt-1">{doctors.length}</p>
        </div>
        <div className={`rounded-2xl border p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>
          <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Especialidades</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{specialties.length}</p>
        </div>
        {specialties.slice(0, 2).map(sp => (
          <div key={sp} className={`rounded-2xl border p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>
            <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{sp}</p>
            <p className="text-3xl font-bold text-purple-600 mt-1">{doctors.filter(d => d.specialty === sp).length}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <input type="text" placeholder="Buscar médico o DNI..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className={`flex-1 min-w-48 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-slate-200'
            }`} />
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilterSpecialty('')}
            className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${filterSpecialty === ''
                ? 'bg-teal-600 text-white border-teal-600'
                : darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
            Todos
          </button>
          {specialties.map(sp => (
            <button key={sp} onClick={() => setFilterSpecialty(sp)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${filterSpecialty === sp
                  ? 'bg-teal-600 text-white border-teal-600'
                  : darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>
              {sp}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>Cargando...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-2">
          <span className="text-4xl">👨‍⚕️</span>
          <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>No hay médicos registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => (
            <div key={d._id} className={`rounded-2xl border overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'
              }`}>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${SPECIALTY_COLORS[d.specialty] || 'from-teal-400 to-teal-600'
                    } flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0`}>
                    {d.name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-bold text-sm truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>{d.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SPECIALTY_BADGE[d.specialty] || 'bg-teal-50 text-teal-600 border border-teal-200'
                      }`}>
                      {d.specialty}
                    </span>
                  </div>
                </div>

                <div className={`space-y-1.5 text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  {d.dni && (
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
                      </svg>
                      DNI: {d.dni}
                    </div>
                  )}
                  {d.cmp && (
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      CMP: {d.cmp}
                    </div>
                  )}
                  {d.phone && (
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {d.phone}
                    </div>
                  )}
                  {d.email && (
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">{d.email}</span>
                    </div>
                  )}
                </div>

                <div className={`flex gap-2 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
                  <button onClick={() => handleEdit(d)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar
                  </button>
                  <button onClick={() => handleDelete(d._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar
                  </button>
                </div>
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
              <div>
                <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  {editingId ? 'Editar Médico' : 'Nuevo Médico'}
                </h2>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>
                  {editingId ? 'Actualiza los datos del médico' : 'Completa los datos para registrar'}
                </p>
              </div>
              <button onClick={handleClose}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-slate-400 hover:bg-slate-100'
                  }`}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={labelClass}>Nombre completo</label>
                <input required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Dr. Juan Pérez" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>DNI</label>
                  <input value={form.dni}
                    onChange={(e) => setForm({ ...form, dni: e.target.value })}
                    placeholder="45678901" maxLength={8} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>CMP</label>
                  <input value={form.cmp}
                    onChange={(e) => setForm({ ...form, cmp: e.target.value })}
                    placeholder="12345" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Especialidad</label>
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
                  <p className="text-xs text-orange-500 mt-1">⚠️ Primero registra especialidades</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Teléfono</label>
                  <input value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="987654321" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="doctor@vitacare.com" className={inputClass} />
                </div>
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