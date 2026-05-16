import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../hooks/useTheme'
import api from '../../services/api'

export default function Patients() {
  const { user } = useAuth()
  const { darkMode } = useTheme()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)
  const [form, setForm] = useState({
    name: '', dni: '', phone: '', email: '', birthDate: '', gender: '', address: '', origin: 'local'
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingPatient) {
        await api.put(`/patients/${editingPatient._id}`, form)
      } else {
        await api.post('/patients', form)
      }
      setShowForm(false)
      setEditingPatient(null)
      setForm({ name: '', dni: '', phone: '', email: '', birthDate: '', gender: '', address: '', origin: 'local' })
      fetchPatients()
    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar paciente')
    }
  }

  const handleEdit = (patient) => {
    setEditingPatient(patient)
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

  const filtered = patients.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.dni?.includes(search)
  )

  const inputClass = `w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-slate-200 text-slate-800'
  }`

  return (
    <div className={`p-6 min-h-full transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Pacientes</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Gestión de pacientes registrados</p>
        </div>
        {['admin', 'admision'].includes(user?.role) && (
          <button onClick={() => { setShowForm(true); setEditingPatient(null); setForm({ name: '', dni: '', phone: '', email: '', birthDate: '', gender: '', address: '', origin: 'local' }) }}
            className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-md shadow-teal-500/20">
            + Nuevo Paciente
          </button>
        )}
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputClass}
        />
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
                    {p.recordNumber || 'HC-????'}
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
              <button onClick={() => { setShowForm(false); setEditingPatient(null) }}
                className={`text-xl ${darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { label: 'Nombre completo', key: 'name', type: 'text', placeholder: 'Ej: María López García' },
                { label: 'DNI', key: 'dni', type: 'text', placeholder: 'Ej: 45678901' },
                { label: 'Teléfono', key: 'phone', type: 'text', placeholder: 'Ej: 987654321' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'Ej: correo@gmail.com' },
                { label: 'Fecha de nacimiento', key: 'birthDate', type: 'date' },
                { label: 'Dirección', key: 'address', type: 'text', placeholder: 'Ej: Jr. Ancash 179' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>{label}</label>
                  <input type={type} placeholder={placeholder} value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className={inputClass} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Género</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={inputClass}>
                    <option value="">Seleccionar...</option>
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Origen</label>
                  <select value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} className={inputClass}>
                    <option value="local">Local</option>
                    <option value="externo">Externo</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setEditingPatient(null) }}
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