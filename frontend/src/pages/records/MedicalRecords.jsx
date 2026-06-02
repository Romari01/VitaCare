import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../hooks/useTheme'
import api from '../../services/api'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

export default function MedicalRecords() {
    const { user } = useAuth()
    const { darkMode } = useTheme()
    const { toast, showToast, hideToast } = useToast()
    const [records, setRecords] = useState([])
    const [patients, setPatients] = useState([])
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [page, setPage] = useState(1)
    const perPage = 10
    const [form, setForm] = useState({
        patient: '', doctor: '', diagnosis: '', treatment: '',
        notes: '', weight: '', height: '', bloodPressure: '', temperature: ''
    })

    const fetchAll = async () => {
        try {
            const [recordsRes, patientsRes, doctorsRes] = await Promise.all([
                api.get('/records'),
                api.get('/patients'),
                api.get('/doctors')
            ])
            setRecords(recordsRes.data)
            setPatients(patientsRes.data)
            setDoctors(doctorsRes.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchAll() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingId) {
                await api.put(`/records/${editingId}`, form)
                showToast('Historial actualizado correctamente', 'success')
            } else {
                await api.post('/records', form)
                showToast('Historial registrado correctamente', 'success')
            }
            handleClose()
            fetchAll()
        } catch (error) {
            showToast(error.response?.data?.message || 'Error al guardar', 'error')
        }
    }

    const handleEdit = (record) => {
        setEditingId(record._id)
        setForm({
            patient: record.patient?._id || '',
            doctor: record.doctor?._id || '',
            diagnosis: record.diagnosis || '',
            treatment: record.treatment || '',
            notes: record.notes || '',
            weight: record.weight || '',
            height: record.height || '',
            bloodPressure: record.bloodPressure || '',
            temperature: record.temperature || ''
        })
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar este registro?')) return
        try {
            await api.delete(`/records/${id}`)
            fetchAll()
            showToast('Registro eliminado correctamente', 'success')
        } catch (error) {
            showToast('Error al eliminar', 'error')
        }
    }

    const handleClose = () => {
        setShowForm(false)
        setEditingId(null)
        setSelectedPatient(null)
        setForm({
            patient: '', doctor: '', diagnosis: '', treatment: '',
            notes: '', weight: '', height: '', bloodPressure: '', temperature: ''
        })
    }

    const filtered = records.filter(r =>
        r.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.doctor?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.diagnosis?.toLowerCase().includes(search.toLowerCase())
    )

    const totalPages = Math.ceil(filtered.length / perPage)
    const paginated = filtered.slice((page - 1) * perPage, page * perPage)

    const inputClass = `w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-slate-200 text-slate-800'
        }`
    const labelClass = `block text-xs font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`

    return (
        <div className={`p-6 min-h-full transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Historial Clínico</h1>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Registros médicos de pacientes</p>
                </div>
                {['admin', 'admision', 'doctor'].includes(user?.role) && (
                    <button onClick={() => setShowForm(true)}
                        className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-md shadow-teal-500/20">
                        + Nuevo Registro
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Total Registros', value: records.length, color: 'text-teal-600', bg: darkMode ? 'bg-teal-900/20 border-teal-700' : 'bg-teal-50 border-teal-100' },
                    { label: 'Pacientes con historial', value: [...new Set(records.map(r => r.patient?._id))].length, color: 'text-blue-600', bg: darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-100' },
                    { label: 'Médicos involucrados', value: [...new Set(records.map(r => r.doctor?._id))].length, color: 'text-purple-600', bg: darkMode ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-100' },
                ].map(s => (
                    <div key={s.label} className={`rounded-2xl border p-4 ${s.bg}`}>
                        <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{s.label}</p>
                        <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Buscador */}
            <div className="mb-4">
                <input type="text" placeholder="Buscar por paciente, médico o diagnóstico..."
                    value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                    className={inputClass} />
            </div>

            {/* Tabla */}
            <div className={`rounded-2xl border overflow-hidden shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>
                <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
                    <h2 className={`font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Lista de registros</h2>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{filtered.length} registro(s)</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={`border-b ${darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-slate-50 border-slate-100'}`}>
                            <tr>
                                {['Paciente', 'Médico', 'Diagnóstico', 'Tratamiento', 'Signos Vitales', 'Fecha', 'Acciones'].map(h => (
                                    <th key={h} className={`text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{h}</th>
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
                                        <span className="text-4xl">📋</span>
                                        <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>No hay registros clínicos</p>
                                    </div>
                                </td></tr>
                            ) : paginated.map((r) => (
                                <tr key={r._id} className={`transition-colors ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-slate-50'}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                                {r.patient?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{r.patient?.name}</p>
                                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{r.patient?.historialNumber}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>{r.doctor?.name}</p>
                                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{r.doctor?.specialty}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className={`text-sm max-w-32 truncate ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>{r.diagnosis}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className={`text-sm max-w-32 truncate ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>{r.treatment}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`text-xs space-y-0.5 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                                            {r.temperature && <p>🌡️ {r.temperature}°C</p>}
                                            {r.bloodPressure && <p>❤️ {r.bloodPressure}</p>}
                                            {r.weight && <p>⚖️ {r.weight}kg</p>}
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 text-sm whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                                        {new Date(r.createdAt).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEdit(r)}
                                                className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 flex items-center justify-center transition-colors"
                                                title="Editar">✏️</button>
                                            <button onClick={() => handleDelete(r._id)}
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
                        Mostrando {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} a {Math.min(page * perPage, filtered.length)} de {filtered.length} registros
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
                                    {editingId ? 'Editar Registro' : 'Nuevo Registro Clínico'}
                                </h2>
                                <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>
                                    {editingId ? 'Actualiza los datos del registro' : 'Completa los datos clínicos'}
                                </p>
                            </div>
                            <button onClick={handleClose}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-slate-400 hover:bg-slate-100'
                                    }`}>✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass}>Paciente</label>
                                    <select required value={form.patient}
                                        onChange={(e) => setForm({ ...form, patient: e.target.value })}
                                        className={inputClass}>
                                        <option value="">Seleccionar...</option>
                                        {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Médico</label>
                                    <select required value={form.doctor}
                                        onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                                        className={inputClass}>
                                        <option value="">Seleccionar...</option>
                                        {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Diagnóstico</label>
                                <textarea required value={form.diagnosis}
                                    onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                                    rows={2} placeholder="Describe el diagnóstico..."
                                    className={`${inputClass} resize-none`} />
                            </div>

                            <div>
                                <label className={labelClass}>Tratamiento</label>
                                <textarea required value={form.treatment}
                                    onChange={(e) => setForm({ ...form, treatment: e.target.value })}
                                    rows={2} placeholder="Describe el tratamiento..."
                                    className={`${inputClass} resize-none`} />
                            </div>

                            <div>
                                <label className={labelClass}>Notas adicionales</label>
                                <textarea value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    rows={2} placeholder="Observaciones..."
                                    className={`${inputClass} resize-none`} />
                            </div>

                            <div className={`p-4 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-slate-100 bg-slate-50'}`}>
                                <p className={`text-xs font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>Signos Vitales</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>Temperatura (°C)</label>
                                        <input type="number" step="0.1" value={form.temperature}
                                            onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                                            placeholder="36.5" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Presión arterial</label>
                                        <input value={form.bloodPressure}
                                            onChange={(e) => setForm({ ...form, bloodPressure: e.target.value })}
                                            placeholder="120/80" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Peso (kg)</label>
                                        <input type="number" step="0.1" value={form.weight}
                                            onChange={(e) => setForm({ ...form, weight: e.target.value })}
                                            placeholder="70" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Talla (cm)</label>
                                        <input type="number" value={form.height}
                                            onChange={(e) => setForm({ ...form, height: e.target.value })}
                                            placeholder="170" className={inputClass} />
                                    </div>
                                </div>
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