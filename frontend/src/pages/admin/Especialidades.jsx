import { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import api from '../../services/api'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

const ICONS = ['🩺', '❤️', '👶', '🦴', '🧠', '🌸', '🔬', '👁️', '🦷', '🥗', '🧩', '💊', '🏥', '🩻', '🧬', '💉', '🫀', '🫁', '🦻', '🦿']

export default function Especialidades() {
    const { darkMode } = useTheme()
    const { toast, showToast, hideToast } = useToast()
    const [especialidades, setEspecialidades] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState({ nombre: '', icon: '🩺', descripcion: '', activo: true })

    const fetchEspecialidades = async () => {
        try {
            const { data } = await api.get('/especialidades')
            setEspecialidades(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchEspecialidades() }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editingId) {
                await api.put(`/especialidades/${editingId}`, form)
                showToast('Especialidad actualizada correctamente', 'success')
            } else {
                await api.post('/especialidades', form)
                showToast('Especialidad registrada correctamente', 'success')
            }
            handleClose()
            fetchEspecialidades()
        } catch (error) {
            showToast(error.response?.data?.message || 'Error al guardar', 'error')
        }
    }

    const handleEdit = (esp) => {
        setEditingId(esp._id)
        setForm({ nombre: esp.nombre, icon: esp.icon, descripcion: esp.descripcion, activo: esp.activo })
        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar especialidad?')) return
        try {
            await api.delete(`/especialidades/${id}`)
            fetchEspecialidades()
            showToast('Especialidad eliminada correctamente', 'success')
        } catch (error) {
            showToast('Error al eliminar', 'error')
        }
    }

    const handleToggle = async (esp) => {
        try {
            await api.put(`/especialidades/${esp._id}`, { ...esp, activo: !esp.activo })
            fetchEspecialidades()
            showToast(esp.activo ? 'Especialidad desactivada' : 'Especialidad activada', 'info')
        } catch (error) {
            showToast('Error al actualizar', 'error')
        }
    }

    const handleClose = () => {
        setShowForm(false)
        setEditingId(null)
        setForm({ nombre: '', icon: '🩺', descripcion: '', activo: true })
    }

    const filtered = especialidades.filter(e =>
        e.nombre?.toLowerCase().includes(search.toLowerCase())
    )

    const inputClass = `w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-slate-200 text-slate-800'
        }`
    const labelClass = `block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`

    return (
        <div className={`p-6 min-h-full transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Especialidades</h1>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Gestión de especialidades médicas</p>
                </div>
                <button onClick={() => setShowForm(true)}
                    className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-md shadow-teal-500/20">
                    + Nueva Especialidad
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Total', value: especialidades.length, color: 'teal' },
                    { label: 'Activas', value: especialidades.filter(e => e.activo).length, color: 'green' },
                    { label: 'Inactivas', value: especialidades.filter(e => !e.activo).length, color: 'slate' },
                ].map((s) => (
                    <div key={s.label} className={`rounded-2xl p-4 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>
                        <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{s.label}</p>
                        <p className={`text-2xl font-bold mt-1 ${s.color === 'teal' ? 'text-teal-600' :
                                s.color === 'green' ? 'text-green-600' :
                                    darkMode ? 'text-gray-400' : 'text-slate-400'
                            }`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Buscador */}
            <div className="mb-6">
                <input type="text" placeholder="Buscar especialidad..."
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    className={inputClass} />
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-2">
                    <span className="text-4xl">🩺</span>
                    <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                        {especialidades.length === 0 ? 'No hay especialidades registradas' : 'No se encontraron resultados'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((esp) => (
                        <div key={esp._id} className={`rounded-2xl border p-5 transition-all hover:shadow-md ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'
                            } ${!esp.activo ? 'opacity-60' : ''}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${darkMode ? 'bg-gray-700' : 'bg-teal-50'
                                        }`}>
                                        {esp.icon}
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{esp.nombre}</p>
                                        <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{esp.descripcion}</p>
                                    </div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${esp.activo
                                        ? 'bg-teal-50 text-teal-600 border border-teal-200'
                                        : darkMode ? 'bg-gray-700 text-gray-400 border border-gray-600' : 'bg-slate-100 text-slate-400 border border-slate-200'
                                    }`}>
                                    {esp.activo ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                            <div className={`flex gap-2 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
                                <button onClick={() => handleEdit(esp)}
                                    className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 flex items-center justify-center transition-colors"
                                    title="Editar">✏️</button>
                                <button onClick={() => handleToggle(esp)}
                                    className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${esp.activo
                                            ? 'border-yellow-200 text-yellow-600 hover:bg-yellow-50'
                                            : 'border-teal-200 text-teal-600 hover:bg-teal-50'
                                        }`}>
                                    {esp.activo ? 'Desactivar' : 'Activar'}
                                </button>
                                <button onClick={() => handleDelete(esp._id)}
                                    className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"
                                    title="Eliminar">🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className={`rounded-2xl p-6 w-full max-w-md shadow-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                                {editingId ? 'Editar Especialidad' : 'Nueva Especialidad'}
                            </h2>
                            <button onClick={handleClose}
                                className={`text-xl ${darkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={labelClass}>Nombre</label>
                                <input required value={form.nombre}
                                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                    placeholder="Ej: Cardiología" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Ícono</label>
                                <div className="grid grid-cols-10 gap-1.5">
                                    {ICONS.map(icon => (
                                        <button key={icon} type="button"
                                            onClick={() => setForm({ ...form, icon })}
                                            className={`text-xl p-1.5 rounded-lg transition-all ${form.icon === icon
                                                    ? 'bg-teal-100 ring-2 ring-teal-500 scale-110'
                                                    : darkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-100'
                                                }`}>
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className={labelClass}>Descripción</label>
                                <input value={form.descripcion}
                                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                    placeholder="Ej: Enfermedades del corazón" className={inputClass} />
                            </div>
                            <div className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
                                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>Estado activo</span>
                                <button type="button" onClick={() => setForm({ ...form, activo: !form.activo })}
                                    className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${form.activo ? 'bg-teal-500' : 'bg-gray-300'}`}>
                                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm ${form.activo ? 'left-5' : 'left-0.5'}`} />
                                </button>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={handleClose}
                                    className={`flex-1 border py-2.5 rounded-xl text-sm transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}>
                                    Cancelar
                                </button>
                                <button type="submit"
                                    className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors">
                                    {editingId ? 'Guardar cambios' : 'Agregar'}
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