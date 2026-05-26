import { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'

export default function Consultorios() {
  const { darkMode } = useTheme()
  const [consultorios, setConsultorios] = useState([
    { _id: '1', nombre: 'PEDIATRIA', ubicacion: '1-1A', capacidad: 10, telefono: '', especialidad: 'Pediatría', estado: 'ACTIVO' },
    { _id: '2', nombre: 'FISIOTERAPIA', ubicacion: '3-1A', capacidad: 20, telefono: '3773663', especialidad: 'Traumatología', estado: 'ACTIVO' },
    { _id: '3', nombre: 'ODONTOLOGIA', ubicacion: '2-1A', capacidad: 5, telefono: '83773883', especialidad: 'Odontología', estado: 'ACTIVO' },
  ])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [page, setPage] = useState(1)
  const perPage = 10
  const [form, setForm] = useState({
    nombre: '', ubicacion: '', capacidad: '', telefono: '', especialidad: '', estado: 'ACTIVO'
  })

  const especialidades = [
    'Medicina General', 'Pediatría', 'Ginecología', 'Cardiología',
    'Traumatología', 'Neurología', 'Oftalmología', 'Dermatología',
    'Odontología', 'Nutrición', 'Psicología', 'Fisioterapia'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      setConsultorios(consultorios.map(c => c._id === editingId ? { ...c, ...form } : c))
    } else {
      setConsultorios([...consultorios, { ...form, _id: Date.now().toString() }])
    }
    handleClose()
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

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar consultorio?')) return
    setConsultorios(consultorios.filter(c => c._id !== id))
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

  const inputClass = `w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-slate-200 text-slate-800'
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

        {/* Toolbar */}
        <div className={`px-6 py-4 border-b flex items-center justify-between gap-4 flex-wrap ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Mostrar</span>
            <select className={`border rounded-lg px-2 py-1 text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-slate-200 text-slate-700'}`}>
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Consultorios</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Buscador:</span>
            <input type="text" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Buscar..."
              className={`border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-slate-200'}`}
            />
          </div>
        </div>

        <table className="w-full">
          <thead className={`border-b ${darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-slate-50 border-slate-100'}`}>
            <tr>
              {['Nro', 'Consultorio', 'Ubicación', 'Capacidad', 'Teléfono', 'Especialidad', 'Estado', 'Acciones'].map(h => (
                <th key={h} className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-slate-50'}`}>
            {paginated.length === 0 ? (
              <tr><td colSpan="8" className="text-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">🏥</span>
                  <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>No hay consultorios registrados</p>
                </div>
              </td></tr>
            ) : paginated.map((c, idx) => (
              <tr key={c._id} className={`transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-slate-50'}`}>
                <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{(page - 1) * perPage + idx + 1}</td>
                <td className={`px-4 py-4 text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{c.nombre}</td>
                <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{c.ubicacion}</td>
                <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{c.capacidad}</td>
                <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{c.telefono || '—'}</td>
                <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{c.especialidad}</td>
                <td className="px-4 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    c.estado === 'ACTIVO'
                      ? 'bg-teal-50 text-teal-600 border border-teal-200'
                      : 'bg-red-50 text-red-500 border border-red-200'
                  }`}>{c.estado}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(c)}
                      className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 flex items-center justify-center transition-colors text-sm"
                      title="Editar">✏️</button>
                    <button onClick={() => handleDelete(c._id)}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors text-sm"
                      title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className={`px-6 py-4 border-t flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            Mostrando {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} a {Math.min(page * perPage, filtered.length)} de {filtered.length} Consultorios
          </span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors disabled:opacity-40 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-teal-600 text-white' : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors disabled:opacity-40 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
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
              <button onClick={handleClose} className={`text-xl ${darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Nombre del consultorio</label>
                <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej: LABORATORIO DE RAYOS X" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Ubicación</label>
                  <input required value={form.ubicacion} onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
                    placeholder="Ej: 3A2" className={inputClass} />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Capacidad</label>
                  <input type="number" required value={form.capacidad} onChange={(e) => setForm({ ...form, capacidad: e.target.value })}
                    placeholder="Ej: 10" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Teléfono</label>
                <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  placeholder="Ej: 051-331445" className={inputClass} />
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Especialidad</label>
                <select required value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} className={inputClass}>
                  <option value="">Seleccionar...</option>
                  {especialidades.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Estado</label>
                <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className={inputClass}>
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleClose}
                  className={`flex-1 border py-2.5 rounded-xl text-sm transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors">
                  {editingId ? 'Guardar cambios' : 'Registrar consultorio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}