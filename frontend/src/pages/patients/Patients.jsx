import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../hooks/useTheme'
import api from '../../services/api'

const RENIEC_TOKEN = 'sk_15690.FFtrHeVvhixdTKHznI2jUrXwYyvmBI6C'

export default function Patients() {
  const { user } = useAuth()
  const { darkMode } = useTheme()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [loadingDni, setLoadingDni] = useState(false)
  const [dniStatus, setDniStatus] = useState(null)
  const [form, setForm] = useState({
    name: '', dni: '', phone: '', email: '',
    birthDate: '', gender: '', address: '', origin: 'local'
  })

  const fetchPatients = async () => {
    try {
      const { data } = await api.get('/patients')
      setPatients(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPatients() }, [])

  const handleDniSearch = async (e) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    if (!['admin', 'admision'].includes(user?.role)) return

    const dni = form.dni.trim()
    if (dni.length !== 8) {
      alert('El DNI debe tener 8 dígitos')
      return
    }

    setLoadingDni(true)
    setDniStatus(null)

    try {
      // 1. Buscar en nuestra base de datos
      const { data: allPatients } = await api.get('/patients')
      const existing = allPatients.find(p => String(p.dni).trim() === String(dni).trim())

      if (existing) {
        setForm({
          name: existing.name || '',
          dni: existing.dni || '',
          phone: existing.phone || '',
          email: existing.email || '',
          birthDate: existing.birthDate?.split('T')[0] || '',
          gender: existing.gender || '',
          address: existing.address || '',
          origin: existing.origin || 'local'
        })
        setDniStatus('found')
        return
      }

      // 2. Buscar en RENIEC via backend para evitar CORS
      try {
        const { data: reniecData } = await api.get(`/public/reniec/${dni}`)
        if (reniecData?.nombres) {
          const nombreCompleto = `${reniecData.nombres} ${reniecData.apellidoPaterno} ${reniecData.apellidoMaterno}`.trim()
          setForm(f => ({
            ...f,
            name: nombreCompleto,
            gender: reniecData.sexo === 'M' ? 'masculino'
              : reniecData.sexo === 'F' ? 'femenino' : '',
          }))
          setDniStatus('reniec')
          return
        }
      } catch (reniecErr) {
        console.log('RENIEC no disponible:', reniecErr.message)
      }

      // 3. No encontrado
      setDniStatus('new')

    } catch (err) {
      console.error('Error búsqueda DNI:', err)
      setDniStatus('new')
    } finally {
      setLoadingDni(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPatient) {
        await api.put(`/patients/${editingPatient._id}`, form)
      } else {
        await api.post('/patients', form)
      }
      handleCloseForm()
      fetchPatients()
    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar paciente')
    }
  }

  const handleEdit = (patient) => {
    setEditingPatient(patient)
    setDniStatus(null)
    setForm({
      name: patient.name || '',
      dni: patient.dni || '',
      phone: patient.phone || '',
      email: patient.email || '',
      birthDate: patient.birthDate?.split('T')[0] || '',
      gender: patient.gender || '',
      address: patient.address || '',
      origin: patient.origin || 'local'
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este paciente?')) return
    try {
      await api.delete(`/patients/${id}`)
      fetchPatients()
    } catch (error) {
      alert('Error al eliminar')
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingPatient(null)
    setDniStatus(null)
    setForm({ name: '', dni: '', phone: '', email: '', birthDate: '', gender: '', address: '', origin: 'local' })
  }

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.dni?.includes(search)
  )

  const inputClass = `w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-slate-200 text-slate-800'
  }`
  const labelClass = `block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`

  return (
    <div className={`p-6 min-h-full transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Pacientes</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Gestión de pacientes registrados</p>
        </div>
        {['admin', 'admision'].includes(user?.role) && (
          <button onClick={() => { setShowForm(true); setEditingPatient(null); setDniStatus(null); setForm({ name: '', dni: '', phone: '', email: '', birthDate: '', gender: '', address: '', origin: 'local' }) }}
            className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-md shadow-teal-500/20">
            + Nuevo Paciente
          </button>
        )}
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input type="text" placeholder="Buscar por nombre o DNI..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className={inputClass} />
      </div>

      {/* Tabla */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>
        <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
          <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Lista de pacientes</h2>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{filtered.length} paciente(s)</span>
        </div>
        <table className="w-full">
          <thead className={`border-b ${darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-slate-50 border-slate-100'}`}>
            <tr>
              {['Paciente', 'DNI', 'Teléfono', 'N° Historial', 'Origen', 'Acciones'].map(h => (
                <th key={h} className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{h}</th>
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
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">👥</span>
                  <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>No se encontraron pacientes</p>
                </div>
              </td></tr>
            ) : filtered.map((p) => (
              <tr key={p._id} className={`transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-slate-50'}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xs">
                      {p.name?.charAt(0)}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>{p.name}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{p.email}</p>
                    </div>
                  </div>
                </td>
                <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{p.dni}</td>
                <td className={`px-6 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{p.phone}</td>
                <td className="px-6 py-4">
                  <span className="text-xs px-2 py-1 rounded-full bg-teal-50 text-teal-700 font-medium border border-teal-200">
                    {p.historialNumber || p.recordNumber || 'HC-????'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    p.origin === 'externo'
                      ? 'bg-purple-50 text-purple-600 border border-purple-200'
                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                  }`}>
                    {p.origin === 'externo' ? 'Externo' : 'Local'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {['admin', 'admision'].includes(user?.role) && (
                      <>
                        <button onClick={() => handleEdit(p)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                          Editar
                        </button>
                        <button onClick={() => handleDelete(p._id)}
                          className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 w-full max-w-lg max-h-screen overflow-y-auto shadow-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {editingPatient ? 'Editar Paciente' : 'Nuevo Paciente'}
              </h2>
              <button onClick={handleCloseForm}
                className={`text-xl ${darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">

              {/* DNI */}
              <div>
                <label className={labelClass}>
                  DNI
                  {['admin', 'admision'].includes(user?.role) && !editingPatient && (
                    <span className={`ml-2 text-xs font-normal ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                      — Presiona Enter para buscar
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ej: 45678901"
                    value={form.dni}
                    maxLength={8}
                    onChange={(e) => {
                      const newDni = e.target.value
                      if (newDni === '') {
                        setForm({ name: '', dni: '', phone: '', email: '', birthDate: '', gender: '', address: '', origin: 'local' })
                      } else {
                        setForm({ ...form, dni: newDni })
                      }
                      setDniStatus(null)
                    }}
                    onKeyDown={handleDniSearch}
                    className={inputClass}
                  />
                  {loadingDni && (
                    <div className="absolute right-3 top-2.5">
                      <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {dniStatus === 'found' && (
                  <div className="mt-2 text-xs text-teal-600 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">
                    ✅ Paciente encontrado — datos cargados automáticamente
                  </div>
                )}
                {dniStatus === 'reniec' && (
                  <div className="mt-2 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                    🏛️ Datos obtenidos de RENIEC — completa los datos restantes
                  </div>
                )}
                {dniStatus === 'new' && (
                  <div className="mt-2 text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
                    🆕 DNI no encontrado — ingresa los datos manualmente
                  </div>
                )}
              </div>

              {/* Nombre */}
              <div>
                <label className={labelClass}>Nombre completo</label>
                <input type="text" placeholder="Ej: María López García"
                  value={form.name} required
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass} />
              </div>

              {/* Teléfono y Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Teléfono</label>
                  <input type="text" placeholder="987654321" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" placeholder="correo@gmail.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass} />
                </div>
              </div>

              {/* Fecha y Género */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Fecha de nacimiento</label>
                  <input type="date" value={form.birthDate}
                    onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Género</label>
                  <select value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className={inputClass}>
                    <option value="">Seleccionar...</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className={labelClass}>Dirección</label>
                <input type="text" placeholder="Ej: Jr. Ancash 179" value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className={inputClass} />
              </div>

              {/* Origen */}
              <div>
                <label className={labelClass}>Origen</label>
                <select value={form.origin}
                  onChange={(e) => setForm({ ...form, origin: e.target.value })}
                  className={inputClass}>
                  <option value="local">Local</option>
                  <option value="externo">Externo</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleCloseForm}
                  className={`flex-1 border py-2.5 rounded-xl text-sm transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors">
                  {editingPatient ? 'Guardar cambios' : 'Registrar Paciente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}