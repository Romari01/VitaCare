import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', specialty: '', phone: '', email: '', cmp: ''
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

  useEffect(() => { fetchDoctors() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/doctors', form)
      setShowForm(false)
      setForm({ name: '', specialty: '', phone: '', email: '', cmp: '' })
      fetchDoctors()
    } catch (error) {
      alert(error.response?.data?.message || 'Error al guardar')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar médico?')) return
    await api.delete(`/doctors/${id}`)
    fetchDoctors()
  }

  const specialties = ['Medicina General', 'Pediatría', 'Ginecología', 'Cardiología', 'Traumatología', 'Neurología', 'Oftalmología', 'Dermatología']

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Médicos</h1>
          <p className="text-slate-500 text-sm">Gestión del personal médico</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-800 transition-colors"
        >
          + Nuevo Médico
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-slate-400">Cargando...</p>
        ) : doctors.length === 0 ? (
          <p className="text-slate-400">No hay médicos registrados</p>
        ) : doctors.map((d) => (
          <div key={d._id} className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                  {d.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-slate-800 text-sm">{d.name}</p>
                  <p className="text-xs text-slate-400">{d.specialty}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(d._id)} className="text-red-400 hover:text-red-600 text-xs">
                ✕
              </button>
            </div>
            <div className="space-y-1 text-xs text-slate-500">
              {d.phone && <p>📞 {d.phone}</p>}
              {d.email && <p>✉️ {d.email}</p>}
              {d.cmp && <p>🏥 CMP: {d.cmp}</p>}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">Nuevo Médico</h2>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nombre completo</label>
                <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Especialidad</label>
                <select required value={form.specialty} onChange={(e) => setForm({...form, specialty: e.target.value})}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400">
                  <option value="">Seleccionar...</option>
                  {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Teléfono</label>
                  <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">CMP</label>
                  <input value={form.cmp} onChange={(e) => setForm({...form, cmp: e.target.value})}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
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