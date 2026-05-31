import { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import api from '../../services/api'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

export default function Consultorios() {
  const { darkMode } = useTheme()
  const { toast, showToast, hideToast } = useToast()
  const [consultorios, setConsultorios] = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [page, setPage] = useState(1)
  const perPage = 10
  const [form, setForm] = useState({
    nombre: '', ubicacion: '', capacidad: '', telefono: '', especialidad: '', estado: 'ACTIVO'
  })

  const fetchConsultorios = async () => {
    try {
      const { data } = await api.get('/consultorios')
      setConsultorios(data)
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
    fetchConsultorios()
    fetchEspecialidades()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/consultorios/${editingId}`, form)
        showToast('Consultorio actualizado correctamente', 'success')
      } else {
        await api.post('/consultorios', form)
        showToast('Consultorio registrado correctamente', 'success')
      }
      handleClose()
      fetchConsultorios()
    } catch (error) {
      showToast(error.response?.data?.message || 'Error al guardar', 'error')
    }
  }

  const handleEdit = (c) => {
    setEditingId(c._id)
    setForm({
      nombre: c.nombre || '',
      ubicacion: c.ubicacion || '',
      capacidad: c.capacidad || '',
      telefono: c.telefono || '',
      especialidad: c.especialidad || '',
      estado: c.estado || 'ACTIVO'
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar consultorio?')) return
    try {
      await api.delete(`/consultorios/${id}`)
      fetchConsultorios()
      showToast('Consultorio eliminado correctamente', 'success')
    } catch (error) {
      showToast('Error al eliminar', 'error')
    }
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingId(null)
    setForm({ nombre: '', ubicacion: '', capacidad: '', telefono: '', especialidad: '', estado: 'ACTIVO' })
  }

  const filtered = consultorios.filter(c =>
    c.nombre?.toLowerCase().includes(search.toLowerCase()) ||
    c.especialidad?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const inputClass = `w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-slate-200 text-slate-800'
    }`

  return (
    <div className={`p-6 min-h-full transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Consultorios</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Gestión de consultorios del centro de salud</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-md shadow-teal-500/20">
          + Nuevo Consultorio
        </button>
      </div>

      {/* Tabla */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>

        <div className={`px-6 py-4 border-b flex items-center justify-between gap-4 flex-wrap ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
          <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Lista de consultorios</h2>
          <input type="text" value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Buscar..."
            className={`border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-slate-200'
              }`}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-slate-50 border-slate-100'}`}>
              <tr>
                {['Nro', 'Consultorio', 'Ubicación', 'Capacidad', 'Teléfono', 'Especialidad', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-slate-50'}`}>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>Cargando...</span>
                  </div>
                </td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">🏥</span>
                    <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>No hay consultorios registrados</p>
                  </div>
                </td></tr>
              ) : paginated.map((c, idx) => (
                <tr key={c._id} className={`transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-slate-50'}`}>
                  <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{(page - 1) * perPage + idx + 1}</td>
                  <td className={`px-4 py-4 text-sm font-semibold whitespace-nowrap ${darkMode ? 'text-white' : 'text-slate-800'}`}>{c.nombre}</td>
                  <td className={`px-4 py-4 text-sm whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{c.ubicacion}</td>
                  <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{c.capacidad}</td>
                  <td className={`px-4 py-4 text-sm whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{c.telefono || '—'}</td>
                  <td className={`px-4 py-4 text-sm whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{c.especialidad}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ${c.estado === 'ACTIVO'
                        ? 'bg-teal-50 text-teal-600 border border-teal-200'
                        : 'bg-red-50 text-red-500 border border-red-200'
                      }`}>{c.estado}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(c)}
                        className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 flex items-center justify-center transition-colors"
                        title="Editar">✏️</button>
                      <button onClick={() => handleDelete(c._id)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                        title="Eliminar">🗑️</button>
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
            Mostrando {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} a {Math.min(page * perPage, filtered.length)} de {filtered.length} consultorios
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors disabled:opacity-40 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-teal-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors disabled:opacity-40 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 w-full max-w-md shadow-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {editingId ? 'Editar Consultorio' : 'Nuevo Consultorio'}
              </h2>
              <button onClick={handleClose}
                className={`text-xl ${darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Nombre del consultorio</label>
                <input required value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej: CONSULTORIO MEDICINA" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Ubicación</label>
                  <input required value={form.ubicacion}
                    onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                    placeholder="Ej: 1-1A" className={inputClass} />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Capacidad</label>
                  <input type="number" value={form.capacidad}
                    onChange={(e) => setForm({ ...form, capacidad: e.target.value })}
                    placeholder="Ej: 10" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Teléfono</label>
                <input value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  placeholder="Ej: 051-331445" className={inputClass} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Especialidad</label>
                <select value={form.especialidad}
                  onChange={(e) => setForm({ ...form, especialidad: e.target.value })}
                  className={inputClass}>
                  <option value="">Seleccionar...</option>
                  {especialidades.map(e => (
                    <option key={e._id} value={e.nombre}>{e.icon} {e.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Estado</label>
                <select value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  className={inputClass}>
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleClose}
                  className={`flex-1 border py-2.5 rounded-xl text-sm transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}>
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors">
                  {editingId ? 'Guardar cambios' : 'Registrar'}
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