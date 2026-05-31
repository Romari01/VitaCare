import { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import api from '../../services/api'

export default function Usuarios() {
  const { darkMode } = useTheme()
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRol, setFilterRol] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [page, setPage] = useState(1)
  const perPage = 10
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'admision', phone: '', dni: ''
  })

  const fetchUsuarios = async () => {
    try {
      const { data } = await api.get('/users')
      setUsuarios(data.filter(u => u.role !== 'paciente'))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsuarios() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, form)
      } else {
        await api.post('/auth/register', form)
      }
      handleClose()
      fetchUsuarios()
    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar')
    }
  }

  const handleEdit = (u) => {
    setEditingId(u._id)
    setForm({
      name: u.name || '',
      email: u.email || '',
      password: '',
      role: u.role || 'admision',
      phone: u.phone || '',
      dni: u.dni || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar usuario?')) return
    try {
      await api.delete(`/users/${id}`)
      fetchUsuarios()
    } catch (e) { alert('Error al eliminar') }
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingId(null)
    setForm({ name: '', email: '', password: '', role: 'admision', phone: '', dni: '' })
  }

  const filtered = usuarios.filter(u =>
    (u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())) &&
    (filterRol === '' || u.role === filterRol)
  )

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const rolColor = (role) => {
    if (role === 'admin') return darkMode ? 'bg-purple-900/40 text-purple-300 border border-purple-700' : 'bg-purple-50 text-purple-600 border border-purple-200'
    if (role === 'doctor') return darkMode ? 'bg-blue-900/40 text-blue-300 border border-blue-700' : 'bg-blue-50 text-blue-600 border border-blue-200'
    if (role === 'admision') return darkMode ? 'bg-teal-900/40 text-teal-300 border border-teal-700' : 'bg-teal-50 text-teal-600 border border-teal-200'
    return darkMode ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-600'
  }

  const rolLabel = (role) => {
    if (role === 'admin') return 'Administración'
    if (role === 'doctor') return 'Médico'
    if (role === 'admision') return 'Admisión'
    return role
  }

  const inputClass = `w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-slate-200 text-slate-800'
    }`
  const labelClass = `block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`

  return (
    <div className={`p-6 min-h-full transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Usuarios</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Gestión de personal del sistema.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-md shadow-teal-500/20">
          + Nuevo Usuario
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Administradores', role: 'admin', color: darkMode ? 'bg-purple-900/40 text-purple-300' : 'bg-purple-50 text-purple-600' },
          { label: 'Médicos', role: 'doctor', color: darkMode ? 'bg-blue-900/40 text-blue-300' : 'bg-blue-50 text-blue-600' },
          { label: 'Admisión', role: 'admision', color: darkMode ? 'bg-teal-900/40 text-teal-300' : 'bg-teal-50 text-teal-600' },
        ].map((s) => (
          <div key={s.role}
            onClick={() => setFilterRol(filterRol === s.role ? '' : s.role)}
            className={`rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md ${filterRol === s.role
                ? darkMode ? 'bg-gray-700 border-teal-500' : 'bg-teal-50 border-teal-300'
                : darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'
              }`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.color}`}>
                {usuarios.filter(u => u.role === s.role).length}
              </span>
            </div>
            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>

        {/* Toolbar */}
        <div className={`px-4 py-4 border-b flex items-center justify-between gap-4 flex-wrap ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Mostrar</span>
            <select className={`border rounded-lg px-2 py-1 text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-slate-200 text-slate-700'}`}>
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Usuarios</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Buscador:</span>
            <input type="text" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Buscar..."
              className={`border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-slate-200'
                }`}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`border-b ${darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-slate-50 border-slate-100'}`}>
              <tr>
                {['Nro', 'Nombre', 'Email', 'Rol', 'Teléfono', 'DNI', 'Acciones'].map(h => (
                  <th key={h} className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-slate-50'}`}>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>Cargando...</span>
                  </div>
                </td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">👥</span>
                    <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>No hay usuarios registrados</p>
                  </div>
                </td></tr>
              ) : paginated.map((u, idx) => (
                <tr key={u._id} className={`transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-slate-50'}`}>
                  <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{(page - 1) * perPage + idx + 1}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                        {u.name?.charAt(0)}
                      </div>
                      <span className={`text-sm font-medium whitespace-nowrap ${darkMode ? 'text-white' : 'text-slate-800'}`}>{u.name}</span>
                    </div>
                  </td>
                  <td className={`px-4 py-4 text-sm whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{u.email}</td>
                  <td className="px-4 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ${rolColor(u.role)}`}>
                      {rolLabel(u.role)}
                    </span>
                  </td>
                  <td className={`px-4 py-4 text-sm whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{u.phone || '—'}</td>
                  <td className={`px-4 py-4 text-sm whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{u.dni || '—'}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(u)}
                        className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 flex items-center justify-center transition-colors"
                        title="Editar">✏️</button>
                      <button onClick={() => handleDelete(u._id)}
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
        <div className={`px-4 py-4 border-t flex items-center justify-between flex-wrap gap-3 ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            Mostrando {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} a {Math.min(page * perPage, filtered.length)} de {filtered.length} Usuarios
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
                {editingId ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <button onClick={handleClose}
                className={`text-xl ${darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { label: 'Nombre completo', key: 'name', type: 'text', placeholder: 'Ej: Juan Pérez García' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'correo@gmail.com' },
                { label: 'DNI', key: 'dni', type: 'text', placeholder: 'Ej: 45678901' },
                { label: 'Teléfono', key: 'phone', type: 'text', placeholder: 'Ej: 987654321' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className={labelClass}>{label}</label>
                  <input type={type} placeholder={placeholder} value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className={inputClass} />
                </div>
              ))}
              <div>
                <label className={labelClass}>Rol</label>
                <select value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className={inputClass}>
                  <option value="admin">Administrador</option>
                  <option value="doctor">Doctor</option>
                  <option value="admision">Admisión</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>{editingId ? 'Nueva contraseña (opcional)' : 'Contraseña'}</label>
                <input type="password" placeholder="••••••••" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editingId}
                  className={inputClass} />
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
    </div>
  )
}