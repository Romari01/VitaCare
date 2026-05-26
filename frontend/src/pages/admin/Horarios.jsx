import { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const HORARIOS_INICIALES = [
  { _id: '1', doctor: 'Dr. Juan Pérez', especialidad: 'Medicina General', dia: 'Lunes', inicio: '08:00', fin: '13:00', consultorio: 'MEDICINA GENERAL 1-1A', estado: 'ACTIVO' },
  { _id: '2', doctor: 'Dra. María López', especialidad: 'Pediatría', dia: 'Martes', inicio: '09:00', fin: '14:00', consultorio: 'PEDIATRIA 1-2A', estado: 'ACTIVO' },
  { _id: '3', doctor: 'Dr. Carlos Quispe', especialidad: 'Cardiología', dia: 'Miércoles', inicio: '14:00', fin: '18:00', consultorio: 'CARDIOLOGIA 2-1A', estado: 'ACTIVO' },
  { _id: '4', doctor: 'Dra. Ana Torres', especialidad: 'Ginecología', dia: 'Jueves', inicio: '08:00', fin: '12:00', consultorio: 'GINECOLOGIA 3-1A', estado: 'INACTIVO' },
]

export default function Horarios() {
  const { darkMode } = useTheme()
  const [horarios, setHorarios] = useState(HORARIOS_INICIALES)
  const [search, setSearch] = useState('')
  const [filterDia, setFilterDia] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState('tabla') // tabla | semana
  const perPage = 10
  const [form, setForm] = useState({
    doctor: '', especialidad: '', dia: '', inicio: '', fin: '', consultorio: '', estado: 'ACTIVO'
  })

  const especialidades = [
    'Medicina General', 'Pediatría', 'Ginecología', 'Cardiología',
    'Traumatología', 'Neurología', 'Oftalmología', 'Dermatología'
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      setHorarios(horarios.map(h => h._id === editingId ? { ...h, ...form } : h))
    } else {
      setHorarios([...horarios, { ...form, _id: Date.now().toString() }])
    }
    handleClose()
  }

  const handleEdit = (h) => {
    setEditingId(h._id)
    setForm({
      doctor: h.doctor || '',
      especialidad: h.especialidad || '',
      dia: h.dia || '',
      inicio: h.inicio || '',
      fin: h.fin || '',
      consultorio: h.consultorio || '',
      estado: h.estado || 'ACTIVO'
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar horario?')) return
    setHorarios(horarios.filter(h => h._id !== id))
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingId(null)
    setForm({ doctor: '', especialidad: '', dia: '', inicio: '', fin: '', consultorio: '', estado: 'ACTIVO' })
  }

  const filtered = horarios.filter(h =>
    (h.doctor?.toLowerCase().includes(search.toLowerCase()) ||
    h.especialidad?.toLowerCase().includes(search.toLowerCase())) &&
    (filterDia === '' || h.dia === filterDia)
  )

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const inputClass = `w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-slate-200 text-slate-800'
  }`
  const labelClass = `block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`

  return (
    <div className={`p-6 min-h-full transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Horarios</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Gestión de horarios de atención médica</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Vista toggle */}
          <div className={`flex gap-1 p-1 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
            <button onClick={() => setViewMode('tabla')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${viewMode === 'tabla' ? 'bg-teal-600 text-white' : darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              📋 Tabla
            </button>
            <button onClick={() => setViewMode('semana')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${viewMode === 'semana' ? 'bg-teal-600 text-white' : darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
              📅 Semana
            </button>
          </div>
          <button onClick={() => setShowForm(true)}
            className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-md shadow-teal-500/20">
            + Nuevo Horario
          </button>
        </div>
      </div>

      {/* Vista Semana */}
      {viewMode === 'semana' && (
        <div className={`rounded-2xl border overflow-hidden shadow-sm mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>
          <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
            <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Vista semanal</h2>
          </div>
          <div className="grid grid-cols-7 divide-x divide-slate-100">
            {DIAS.map(dia => (
              <div key={dia} className={`min-h-32 ${darkMode ? 'divide-gray-700' : ''}`}>
                <div className={`px-3 py-2 text-xs font-semibold text-center border-b ${
                  darkMode ? 'bg-gray-700 text-teal-400 border-gray-600' : 'bg-teal-50 text-teal-700 border-slate-100'
                }`}>{dia}</div>
                <div className="p-2 space-y-1">
                  {horarios.filter(h => h.dia === dia).map(h => (
                    <div key={h._id} className={`text-xs p-2 rounded-lg ${
                      h.estado === 'ACTIVO'
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}>
                      <p className="font-semibold truncate">{h.doctor}</p>
                      <p className="truncate opacity-75">{h.inicio} - {h.fin}</p>
                    </div>
                  ))}
                  {horarios.filter(h => h.dia === dia).length === 0 && (
                    <p className={`text-xs text-center py-4 ${darkMode ? 'text-gray-600' : 'text-slate-300'}`}>—</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vista Tabla */}
      {viewMode === 'tabla' && (
        <div className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>

          {/* Toolbar */}
          <div className={`px-6 py-4 border-b flex items-center justify-between gap-4 flex-wrap ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
            <div className="flex items-center gap-3">
              <select value={filterDia} onChange={(e) => { setFilterDia(e.target.value); setPage(1) }}
                className={`border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-slate-200 text-slate-700'}`}>
                <option value="">Todos los días</option>
                {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Buscador:</span>
              <input type="text" value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Buscar doctor o especialidad..."
                className={`border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-slate-200'}`}
              />
            </div>
          </div>

          <table className="w-full">
            <thead className={`border-b ${darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-slate-50 border-slate-100'}`}>
              <tr>
                {['Nro', 'Doctor', 'Especialidad', 'Día', 'Horario', 'Consultorio', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-slate-50'}`}>
              {paginated.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">🕐</span>
                    <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>No hay horarios registrados</p>
                  </div>
                </td></tr>
              ) : paginated.map((h, idx) => (
                <tr key={h._id} className={`transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-slate-50'}`}>
                  <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{(page - 1) * perPage + idx + 1}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xs flex-shrink-0">
                        {h.doctor?.charAt(0)}
                      </div>
                      <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>{h.doctor}</span>
                    </div>
                  </td>
                  <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{h.especialidad}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${darkMode ? 'bg-gray-700 text-teal-400' : 'bg-teal-50 text-teal-700'}`}>{h.dia}</span>
                  </td>
                  <td className={`px-4 py-4 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>{h.inicio} - {h.fin}</td>
                  <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{h.consultorio}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      h.estado === 'ACTIVO'
                        ? 'bg-teal-50 text-teal-600 border border-teal-200'
                        : 'bg-red-50 text-red-500 border border-red-200'
                    }`}>{h.estado}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(h)}
                        className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 flex items-center justify-center transition-colors text-sm"
                        title="Editar">✏️</button>
                      <button onClick={() => handleDelete(h._id)}
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
              Mostrando {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} a {Math.min(page * perPage, filtered.length)} de {filtered.length} Horarios
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
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl p-6 w-full max-w-md shadow-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {editingId ? 'Editar Horario' : 'Nuevo Horario'}
              </h2>
              <button onClick={handleClose} className={`text-xl ${darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className={labelClass}>Nombre del doctor</label>
                <input required value={form.doctor} onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                  placeholder="Ej: Dr. Juan Pérez" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Especialidad</label>
                <select required value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} className={inputClass}>
                  <option value="">Seleccionar...</option>
                  {especialidades.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Día</label>
                <select required value={form.dia} onChange={(e) => setForm({ ...form, dia: e.target.value })} className={inputClass}>
                  <option value="">Seleccionar...</option>
                  {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Hora inicio</label>
                  <input type="time" required value={form.inicio} onChange={(e) => setForm({ ...form, inicio: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Hora fin</label>
                  <input type="time" required value={form.fin} onChange={(e) => setForm({ ...form, fin: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Consultorio</label>
                <input value={form.consultorio} onChange={(e) => setForm({ ...form, consultorio: e.target.value })}
                  placeholder="Ej: PEDIATRIA 1-1A" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Estado</label>
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
                  {editingId ? 'Guardar cambios' : 'Registrar horario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}