import { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'

const PAGOS_INICIALES = [
  { _id: '1', paciente: 'María López García', dni: '45678901', concepto: 'Consulta Medicina General', monto: 30.00, metodo: 'Efectivo', estado: 'PAGADO', fecha: '2026-05-20', doctor: 'Dr. Juan Pérez' },
  { _id: '2', paciente: 'Carlos Quispe Mamani', dni: '45678902', concepto: 'Consulta Pediatría', monto: 35.00, metodo: 'Transferencia', estado: 'PAGADO', fecha: '2026-05-20', doctor: 'Dra. María López' },
  { _id: '3', paciente: 'Ana Torres Huanca', dni: '45678903', concepto: 'Consulta Cardiología', monto: 50.00, metodo: 'Efectivo', estado: 'PENDIENTE', fecha: '2026-05-19', doctor: 'Dr. Carlos Quispe' },
  { _id: '4', paciente: 'Luis Mamani Flores', dni: '45678904', concepto: 'Consulta Neurología', monto: 45.00, metodo: 'Yape', estado: 'PAGADO', fecha: '2026-05-18', doctor: 'Dra. Ana Torres' },
  { _id: '5', paciente: 'Rosa Chura Quispe', dni: '45678905', concepto: 'Consulta Ginecología', monto: 40.00, metodo: 'Efectivo', estado: 'ANULADO', fecha: '2026-05-17', doctor: 'Dra. Rosa Chura' },
]

export default function Pagos() {
  const { darkMode } = useTheme()
  const [pagos, setPagos] = useState(PAGOS_INICIALES)
  const [search, setSearch] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [filterMetodo, setFilterMetodo] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [page, setPage] = useState(1)
  const perPage = 10
  const [form, setForm] = useState({
    paciente: '', dni: '', concepto: '', monto: '', metodo: 'Efectivo', estado: 'PENDIENTE', fecha: new Date().toISOString().split('T')[0], doctor: ''
  })

  const totalIngresos = pagos.filter(p => p.estado === 'PAGADO').reduce((acc, p) => acc + p.monto, 0)
  const totalPendiente = pagos.filter(p => p.estado === 'PENDIENTE').reduce((acc, p) => acc + p.monto, 0)
  const totalAnulado = pagos.filter(p => p.estado === 'ANULADO').reduce((acc, p) => acc + p.monto, 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      setPagos(pagos.map(p => p._id === editingId ? { ...p, ...form, monto: parseFloat(form.monto) } : p))
    } else {
      setPagos([...pagos, { ...form, monto: parseFloat(form.monto), _id: Date.now().toString() }])
    }
    handleClose()
  }

  const handleEdit = (p) => {
    setEditingId(p._id)
    setForm({
      paciente: p.paciente || '',
      dni: p.dni || '',
      concepto: p.concepto || '',
      monto: p.monto || '',
      metodo: p.metodo || 'Efectivo',
      estado: p.estado || 'PENDIENTE',
      fecha: p.fecha || '',
      doctor: p.doctor || ''
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar pago?')) return
    setPagos(pagos.filter(p => p._id !== id))
  }

  const handleClose = () => {
    setShowForm(false)
    setEditingId(null)
    setForm({ paciente: '', dni: '', concepto: '', monto: '', metodo: 'Efectivo', estado: 'PENDIENTE', fecha: new Date().toISOString().split('T')[0], doctor: '' })
  }

  const filtered = pagos.filter(p =>
    (p.paciente?.toLowerCase().includes(search.toLowerCase()) ||
    p.dni?.includes(search) ||
    p.concepto?.toLowerCase().includes(search.toLowerCase())) &&
    (filterEstado === '' || p.estado === filterEstado) &&
    (filterMetodo === '' || p.metodo === filterMetodo)
  )

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const inputClass = `w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-slate-200 text-slate-800'
  }`
  const labelClass = `block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`

  const estadoClass = (estado) => {
    if (estado === 'PAGADO') return 'bg-teal-50 text-teal-600 border border-teal-200'
    if (estado === 'PENDIENTE') return 'bg-yellow-50 text-yellow-600 border border-yellow-200'
    return 'bg-red-50 text-red-500 border border-red-200'
  }

  return (
    <div className={`p-6 min-h-full transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Pagos</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Gestión de pagos y facturación</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-md shadow-teal-500/20">
          + Nuevo Pago
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total ingresos', value: `S/. ${totalIngresos.toFixed(2)}`, icon: '💰', color: 'bg-teal-50 text-teal-600' },
          { label: 'Pagos pendientes', value: `S/. ${totalPendiente.toFixed(2)}`, icon: '🕐', color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Pagos anulados', value: `S/. ${totalAnulado.toFixed(2)}`, icon: '❌', color: 'bg-red-50 text-red-500' },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${s.color}`}>Total</span>
            </div>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{s.value}</p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>

        {/* Toolbar */}
        <div className={`px-6 py-4 border-b flex items-center justify-between gap-4 flex-wrap ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <select value={filterEstado} onChange={(e) => { setFilterEstado(e.target.value); setPage(1) }}
              className={`border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-slate-200 text-slate-700'}`}>
              <option value="">Todos los estados</option>
              <option value="PAGADO">PAGADO</option>
              <option value="PENDIENTE">PENDIENTE</option>
              <option value="ANULADO">ANULADO</option>
            </select>
            <select value={filterMetodo} onChange={(e) => { setFilterMetodo(e.target.value); setPage(1) }}
              className={`border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-slate-200 text-slate-700'}`}>
              <option value="">Todos los métodos</option>
              <option value="Efectivo">Efectivo</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Yape">Yape</option>
              <option value="Plin">Plin</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Buscador:</span>
            <input type="text" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Buscar paciente, DNI..."
              className={`border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-slate-200'}`}
            />
          </div>
        </div>

        <table className="w-full">
          <thead className={`border-b ${darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-slate-50 border-slate-100'}`}>
            <tr>
              {['Nro', 'Paciente', 'Concepto', 'Doctor', 'Monto', 'Método', 'Fecha', 'Estado', 'Acciones'].map(h => (
                <th key={h} className={`text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-slate-50'}`}>
            {paginated.length === 0 ? (
              <tr><td colSpan="9" className="text-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">💰</span>
                  <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>No hay pagos registrados</p>
                </div>
              </td></tr>
            ) : paginated.map((p, idx) => (
              <tr key={p._id} className={`transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-slate-50'}`}>
                <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{(page - 1) * perPage + idx + 1}</td>
                <td className="px-4 py-4">
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>{p.paciente}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>DNI: {p.dni}</p>
                  </div>
                </td>
                <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{p.concepto}</td>
                <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{p.doctor}</td>
                <td className={`px-4 py-4 text-sm font-bold ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>S/. {p.monto.toFixed(2)}</td>
                <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{p.metodo}</td>
                <td className={`px-4 py-4 text-sm ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{p.fecha}</td>
                <td className="px-4 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${estadoClass(p.estado)}`}>{p.estado}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(p)}
                      className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 flex items-center justify-center transition-colors text-sm"
                      title="Editar">✏️</button>
                    <button onClick={() => handleDelete(p._id)}
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
            Mostrando {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} a {Math.min(page * perPage, filtered.length)} de {filtered.length} Pagos
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
          <div className={`rounded-2xl p-6 w-full max-w-md max-h-screen overflow-y-auto shadow-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                {editingId ? 'Editar Pago' : 'Nuevo Pago'}
              </h2>
              <button onClick={handleClose} className={`text-xl ${darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              {[
                { label: 'Nombre del paciente', key: 'paciente', type: 'text', placeholder: 'Ej: María López García' },
                { label: 'DNI', key: 'dni', type: 'text', placeholder: 'Ej: 45678901' },
                { label: 'Concepto', key: 'concepto', type: 'text', placeholder: 'Ej: Consulta Medicina General' },
                { label: 'Doctor', key: 'doctor', type: 'text', placeholder: 'Ej: Dr. Juan Pérez' },
                { label: 'Monto (S/.)', key: 'monto', type: 'number', placeholder: 'Ej: 30.00' },
                { label: 'Fecha', key: 'fecha', type: 'date', placeholder: '' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className={labelClass}>{label}</label>
                  <input type={type} placeholder={placeholder} value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    required className={inputClass} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Método de pago</label>
                  <select value={form.metodo} onChange={(e) => setForm({ ...form, metodo: e.target.value })} className={inputClass}>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Yape">Yape</option>
                    <option value="Plin">Plin</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Estado</label>
                  <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className={inputClass}>
                    <option value="PENDIENTE">PENDIENTE</option>
                    <option value="PAGADO">PAGADO</option>
                    <option value="ANULADO">ANULADO</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleClose}
                  className={`flex-1 border py-2.5 rounded-xl text-sm transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors">
                  {editingId ? 'Guardar cambios' : 'Registrar pago'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}