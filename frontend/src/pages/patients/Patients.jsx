import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../hooks/useTheme'
import api from '../../services/api'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

export default function Patients() {
  const { user } = useAuth()
  const { darkMode } = useTheme()
  const { toast, showToast, hideToast } = useToast()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterOrigin, setFilterOrigin] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [loadingDni, setLoadingDni] = useState(false)
  const [dniStatus, setDniStatus] = useState(null)
  const [page, setPage] = useState(1)
  const perPage = 10
  const [form, setForm] = useState({
    name: '', dni: '', phone: '', email: '',
    birthDate: '', gender: '', address: '', origin: 'local',
    historialAuto: true, historialNumber: ''
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
    if (dni.length !== 8) { showToast('El DNI debe tener 8 dígitos', 'warning'); return }
    setLoadingDni(true)
    setDniStatus(null)
    try {
      const { data: allPatients } = await api.get('/patients')
      const existing = allPatients.find(p => String(p.dni).trim() === String(dni).trim())
      if (existing) {
        setForm({ name: existing.name || '', dni: existing.dni || '', phone: existing.phone || '', email: existing.email || '', birthDate: existing.birthDate?.split('T')[0] || '', gender: existing.gender || '', address: existing.address || '', origin: existing.origin || 'local', historialAuto: true, historialNumber: existing.historialNumber || '' })
        setDniStatus('found'); return
      }
      try {
        const { data: reniecData } = await api.get(`/public/reniec/${dni}`)
        if (reniecData?.nombres) {
          const nombreCompleto = `${reniecData.nombres} ${reniecData.apellidoPaterno} ${reniecData.apellidoMaterno}`.trim()
          setForm(f => ({ ...f, name: nombreCompleto, gender: reniecData.sexo === 'M' ? 'masculino' : reniecData.sexo === 'F' ? 'femenino' : '' }))
          setDniStatus('reniec'); return
        }
      } catch (e) { console.log('RENIEC no disponible') }
      setDniStatus('new')
    } catch (err) {
      setDniStatus('new')
    } finally {
      setLoadingDni(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form }
      delete payload.historialAuto
      if (form.historialAuto && !editingPatient) delete payload.historialNumber
      if (editingPatient) {
        await api.put(`/patients/${editingPatient._id}`, payload)
        showToast('Paciente actualizado correctamente', 'success')
      } else {
        await api.post('/patients', payload)
        showToast('Paciente registrado correctamente', 'success')
      }
      handleCloseForm()
      fetchPatients()
    } catch (error) {
      showToast(error.response?.data?.message || 'Error al guardar paciente', 'error')
    }
  }

  const handleEdit = (patient) => {
    setEditingPatient(patient)
    setDniStatus(null)
    setForm({ name: patient.name || '', dni: patient.dni || '', phone: patient.phone || '', email: patient.email || '', birthDate: patient.birthDate?.split('T')[0] || '', gender: patient.gender || '', address: patient.address || '', origin: patient.origin || 'local', historialAuto: false, historialNumber: patient.historialNumber || '' })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este paciente?')) return
    try {
      await api.delete(`/patients/${id}`)
      fetchPatients()
      showToast('Paciente eliminado correctamente', 'success')
    } catch (error) {
      showToast('Error al eliminar', 'error')
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingPatient(null)
    setDniStatus(null)
    setForm({ name: '', dni: '', phone: '', email: '', birthDate: '', gender: '', address: '', origin: 'local', historialAuto: true, historialNumber: '' })
  }

  const filtered = patients.filter(p =>
    (p.name?.toLowerCase().includes(search.toLowerCase()) || p.dni?.includes(search)) &&
    (filterOrigin === '' || p.origin === filterOrigin)
  )

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const inputClass = `w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-slate-200 text-slate-800'
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
          <button onClick={() => { setShowForm(true); setEditingPatient(null); setDniStatus(null); setForm({ name: '', dni: '', phone: '', email: '', birthDate: '', gender: '', address: '', origin: 'local', historialAuto: true, historialNumber: '' }) }}
            className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-md shadow-teal-500/20">
            + Nuevo Paciente
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Pacientes', value: patients.length, color: 'text-teal-600', bg: darkMode ? 'bg-teal-900/20 border-teal-700' : 'bg-teal-50 border-teal-100' },
          { label: 'Pacientes Locales', value: patients.filter(p => p.origin === 'local').length, color: 'text-blue-600', bg: darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-100' },
          { label: 'Pacientes Externos', value: patients.filter(p => p.origin === 'externo').length, color: 'text-purple-600', bg: darkMode ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-100' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.bg}`}>
            <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex-1 min-w-48">
          <input type="text" placeholder="Buscar por nombre o DNI..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className={inputClass} />
        </div>
        <div className="flex gap-2">
          {['', 'local', 'externo'].map(o => (
            <button key={o} onClick={() => { setFilterOrigin(o); setPage(1) }}
              className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors ${filterOrigin === o
                  ? 'bg-teal-600 text-white border-teal-600'
                  : darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>
              {o === '' ? 'Todos' : o === 'local' ? 'Locales' : 'Externos'}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>
        <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
          <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Lista de pacientes</h2>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{filtered.length} paciente(s)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-slate-50 border-slate-100'}`}>
              <tr>
                {['Paciente', 'DNI', 'Teléfono', 'N° Historial', 'Origen', 'Acciones'].map(h => (
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
              ) : paginated.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">👥</span>
                    <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>No se encontraron pacientes</p>
                  </div>
                </td></tr>
              ) : paginated.map((p) => (
                <tr key={p._id} className={`transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-slate-50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {p.name?.charAt(0)}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{p.name}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{p.email || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-sm whitespace-nowrap font-mono ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{p.dni}</td>
                  <td className={`px-6 py-4 text-sm whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{p.phone || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-teal-50 text-teal-700 font-medium border border-teal-200 whitespace-nowrap font-mono">
                      {p.historialNumber || 'HC-????'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${p.origin === 'externo'
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
                            className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 flex items-center justify-center transition-colors"
                            title="Editar">✏️</button>
                          <button onClick={() => handleDelete(p._id)}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                            title="Eliminar">🗑️</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className={`px-6 py-4 border-t flex items-center justify-between flex-wrap gap-3 ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            Mostrando {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} a {Math.min(page * perPage, filtered.length)} de {filtered.length} pacientes
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

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 w-full max-w-lg max-h-screen overflow-y-auto shadow-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                  {editingPatient ? 'Editar Paciente' : 'Nuevo Paciente'}
                </h2>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>
                  {editingPatient ? 'Actualiza los datos del paciente' : 'Completa los datos para registrar'}
                </p>
              </div>
              <button onClick={handleCloseForm}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-slate-400 hover:bg-slate-100'}`}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={labelClass}>
                  DNI
                  {['admin', 'admision'].includes(user?.role) && !editingPatient && (
                    <span className={`ml-2 text-xs font-normal ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>— Presiona Enter para buscar</span>
                  )}
                </label>
                <div className="relative">
                  <input type="text" placeholder="Ej: 45678901" value={form.dni} maxLength={8}
                    onChange={(e) => {
                      const newDni = e.target.value
                      if (newDni === '') {
                        setForm({ name: '', dni: '', phone: '', email: '', birthDate: '', gender: '', address: '', origin: 'local', historialAuto: true, historialNumber: '' })
                      } else {
                        setForm({ ...form, dni: newDni })
                      }
                      setDniStatus(null)
                    }}
                    onKeyDown={handleDniSearch}
                    className={inputClass} />
                  {loadingDni && (
                    <div className="absolute right-3 top-2.5">
                      <div className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                {dniStatus === 'found' && <div className="mt-2 text-xs text-teal-600 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2">✅ Paciente encontrado — datos cargados automáticamente</div>}
                {dniStatus === 'reniec' && <div className="mt-2 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">🏛️ Datos obtenidos de RENIEC — completa los datos restantes</div>}
                {dniStatus === 'new' && <div className="mt-2 text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">🆕 DNI no encontrado — ingresa los datos manualmente</div>}
              </div>

              <div>
                <label className={labelClass}>N° Historial</label>
                {!editingPatient && (
                  <div className="flex gap-2 mb-2">
                    <button type="button" onClick={() => setForm({ ...form, historialAuto: true, historialNumber: '' })}
                      className={`flex-1 text-xs py-2 rounded-lg border transition-colors ${form.historialAuto ? 'bg-teal-600 text-white border-teal-600' : darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      Automático
                    </button>
                    <button type="button" onClick={() => setForm({ ...form, historialAuto: false })}
                      className={`flex-1 text-xs py-2 rounded-lg border transition-colors ${!form.historialAuto ? 'bg-teal-600 text-white border-teal-600' : darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                      Manual
                    </button>
                  </div>
                )}
                {(!form.historialAuto || editingPatient) && (
                  <input type="text" placeholder="Ej: HC-0001" value={form.historialNumber || ''}
                    onChange={(e) => setForm({ ...form, historialNumber: e.target.value })}
                    className={inputClass} />
                )}
                {form.historialAuto && !editingPatient && (
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>El sistema generará el número automáticamente</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Nombre completo</label>
                <input type="text" placeholder="Ej: María López García" value={form.name} required
                  onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Teléfono</label>
                  <input type="text" placeholder="987654321" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input type="email" placeholder="correo@gmail.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Fecha de nacimiento</label>
                  <input type="date" value={form.birthDate}
                    onChange={(e) => setForm({ ...form, birthDate: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Género</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={inputClass}>
                    <option value="">Seleccionar...</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Dirección</label>
                <input type="text" placeholder="Ej: Jr. Ancash 179" value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Origen</label>
                <select value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} className={inputClass}>
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

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}