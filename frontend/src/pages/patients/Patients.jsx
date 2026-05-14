import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function Patients() {
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', dni: '', phone: '', address: '',
    birthDate: '', gender: 'masculino', bloodType: 'O+', allergies: ''
  })

  const fetchPatients = async () => {
    try {
      const { data } = await api.get(`/patients?search=${search}`)
      setPatients(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPatients() }, [search])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/patients', form)
      setShowForm(false)
      setForm({ name: '', dni: '', phone: '', address: '', birthDate: '', gender: 'masculino', bloodType: 'O+', allergies: '' })
      fetchPatients()
    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar paciente?')) return
    await api.delete(`/patients/${id}`)
    fetchPatients()
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pacientes</h1>
          <p className="text-slate-500 text-sm">Gestión de pacientes registrados</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-800 transition-colors"
        >
          + Nuevo Paciente
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o DNI..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Nombre</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">DNI</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Teléfono</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Género</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-8 text-slate-400">Cargando...</td></tr>
            ) : patients.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8 text-slate-400">No hay pacientes registrados</td></tr>
            ) : patients.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
                      {p.name.charAt(0)}
                    </div>
                    <span className="font-medium text-slate-800 text-sm">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{p.dni}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{p.phone || '-'}</td>
                <td className="px-6 py-4">
                  <span className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded-full capitalize">
                    {p.gender}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal formulario */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Nuevo Paciente</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nombre completo</label>
                  <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">DNI</label>
                  <input required value={form.dni} onChange={(e) => setForm({...form, dni: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Teléfono</label>
                  <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Fecha de nacimiento</label>
                  <input type="date" value={form.birthDate} onChange={(e) => setForm({...form, birthDate: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Género</label>
                  <select value={form.gender} onChange={(e) => setForm({...form, gender: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
                    <option value="masculino">Masculino</option>
                    <option value="femenino">Femenino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tipo de sangre</label>
                  <select value={form.bloodType} onChange={(e) => setForm({...form, bloodType: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Dirección</label>
                <input value={form.address} onChange={(e) => setForm({...form, address: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Alergias</label>
                <input value={form.allergies} onChange={(e) => setForm({...form, allergies: e.target.value})}
                  placeholder="Ninguna"
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