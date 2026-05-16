import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'
import { useState } from 'react'
import api from '../services/api'

const specialties = [
  { icon: '🩺', name: 'Medicina General' },
  { icon: '❤️', name: 'Cardiología' },
  { icon: '👶', name: 'Pediatría' },
  { icon: '🦴', name: 'Traumatología' },
  { icon: '🧠', name: 'Neurología' },
  { icon: '🌸', name: 'Ginecología' },
  { icon: '🔬', name: 'Dermatología' },
  { icon: '👁️', name: 'Oftalmología' },
]

const times = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30'
]

function getWeekDays(offset = 0) {
  const days = []
  const today = new Date()
  const monday = new Date(today)
  monday.setDate(today.getDate() - today.getDay() + 1 + offset * 7)
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    days.push(d)
  }
  return days
}

const DAY_NAMES = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']

export default function MainLayout({ children }) {
  const { user, logout } = useAuth()
  const { darkMode, toggle } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()

  const [showForm, setShowForm] = useState(false)
  const [doctors, setDoctors] = useState([])
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [reason, setReason] = useState('')
  const [weekOffset, setWeekOffset] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [appointments, setAppointments] = useState([])

  const weekDays = getWeekDays(weekOffset)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const weekLabel = (() => {
    const start = weekDays[0]
    const end = weekDays[6]
    const fmt = (d) => `${d.getDate()}-${d.toLocaleString('es', { month: 'short' })}.`
    return `${fmt(start)} – ${fmt(end)}`
  })()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleOpenForm = async () => {
    try {
      const { data } = await api.get('/appointments')
      setAppointments(data)
    } catch (e) { console.error(e) }
    setShowForm(true)
  }

  const handleSpecialty = async (specialty) => {
    setSelectedSpecialty(specialty)
    setSelectedDoctor(null)
    try {
      const { data } = await api.get('/doctors')
      setDoctors(data.filter(d => d.specialty === specialty))
    } catch (e) { console.error(e) }
  }

  const isTimeAvailable = (day, time) => {
    const dayStr = day.toISOString().split('T')[0]
    const d = new Date(day)
    d.setHours(0, 0, 0, 0)
    if (d < today) return false
    return !appointments.some(a =>
      a.date?.split('T')[0] === dayStr && a.time === time && a.doctor?._id === selectedDoctor?._id
    )
  }

  const handleSubmit = async () => {
    if (!selectedSpecialty || !selectedDoctor || !selectedDate || !selectedTime || !reason) {
      alert('Completa todos los campos')
      return
    }
    setSubmitting(true)
    try {
      const { data: patients } = await api.get('/patients')
      const patient = patients.find(p => p.name === user?.name)
      if (!patient) { alert('No encontramos tu historial de paciente'); return }
      await api.post('/appointments', {
        patient: patient._id,
        doctor: selectedDoctor._id,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        reason
      })
      setShowForm(false)
      setSelectedSpecialty('')
      setSelectedDoctor(null)
      setSelectedDate(null)
      setSelectedTime('')
      setReason('')
      setWeekOffset(0)
      if (location.pathname === '/my-appointments') navigate(0)
    } catch (error) {
      alert(error.response?.data?.message || 'Error al agendar cita')
    } finally {
      setSubmitting(false)
    }
  }

  const allNavItems = [
    { path: '/dashboard', label: 'Inicio', icon: '🏠', roles: ['admin', 'doctor', 'admision', 'paciente'] },
    { path: '/patients', label: 'Pacientes', icon: '👥', roles: ['admin', 'admision', 'doctor'] },
    { path: '/doctors', label: 'Médicos', icon: '👨‍⚕️', roles: ['admin', 'admision'] },
    { path: '/appointments', label: 'Citas', icon: '📅', roles: ['admin', 'admision', 'doctor'] },
    { path: '/my-appointments', label: 'Mis Citas', icon: '📅', roles: ['paciente'] },
    { path: '/reports', label: 'Reportes', icon: '📄', roles: ['admin', 'admision'] },
    { path: '/chatbot', label: 'Chatbot', icon: '🤖', roles: ['admin', 'admision', 'doctor'] },
    { path: '/asistente', label: 'Asistente', icon: '🤖', roles: ['paciente'] },
    { path: '/profile', label: 'Mi Perfil', icon: '👤', roles: ['admin', 'doctor', 'admision', 'paciente'] },
  ]

  const navItems = allNavItems.filter(item => item.roles.includes(user?.role))

  return (
    <div className={`flex min-h-screen transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>

      {/* SIDEBAR */}
      <aside className={`w-64 border-r flex flex-col transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`}>

        {/* Logo */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <div>
              <h1 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>VitaCare</h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>Jorge Chávez</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <div key={item.path}>
              <Link to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-teal-50 text-teal-600'
                    : darkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}>
                <span>{item.icon}</span>
                {item.label}
              </Link>

              {/* Reservar Cita justo después de Inicio, solo paciente */}
              {item.path === '/dashboard' && user?.role === 'paciente' && (
                <button
                  onClick={handleOpenForm}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors mt-1 ${
                    showForm
                      ? 'bg-teal-50 text-teal-600'
                      : darkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}>
                  <span>🗓️</span>
                  Reservar Cita
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* Toggle modo oscuro + usuario + logout */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>

          {/* Toggle dark mode */}
          <button onClick={toggle}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors mb-2 ${
              darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-slate-600 hover:bg-slate-50'
            }`}>
            <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${darkMode ? 'bg-teal-500' : 'bg-gray-300'}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center text-xs ${darkMode ? 'left-5 bg-gray-900' : 'left-0.5 bg-white'}`}>
                {darkMode ? '🌙' : '☀️'}
              </span>
            </div>
            <span>{darkMode ? 'Modo oscuro' : 'Modo claro'}</span>
          </button>

          {/* Usuario */}
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-teal-600 text-sm font-bold">{user?.name?.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-slate-800'}`}>{user?.name}</p>
              <p className={`text-xs capitalize ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>{user?.role}</p>
            </div>
          </div>

          {/* Logout */}
          <button onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className={`flex-1 overflow-auto transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
        {children}
      </main>

      {/* MODAL RESERVAR CITA */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-8 overflow-y-auto">
          <div className="w-full max-w-6xl flex gap-6 pb-8">

            <div className="flex-1 flex flex-col gap-4">

              <div className="bg-teal-700 rounded-2xl px-6 py-5 flex items-center justify-between">
                <div>
                  <h2 className="text-white text-xl font-bold">Reservar Cita Médica</h2>
                  <p className="text-teal-200 text-sm mt-0.5">Selecciona especialidad, doctor y horario disponible</p>
                </div>
                <button onClick={() => setShowForm(false)} className="text-teal-200 hover:text-white text-xl">✕</button>
              </div>

              {/* PASO 1 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <div className="bg-teal-700 px-5 py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white text-teal-700 font-bold text-xs flex items-center justify-center">1</span>
                  <span className="text-white font-semibold">Especialidad médica</span>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-4 gap-3">
                    {specialties.map((s) => (
                      <button key={s.name} type="button" onClick={() => handleSpecialty(s.name)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:-translate-y-0.5 ${
                          selectedSpecialty === s.name
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-slate-200 hover:border-teal-300 bg-white'
                        }`}>
                        <span className="text-2xl">{s.icon}</span>
                        <span className={`text-xs font-medium text-center leading-tight ${
                          selectedSpecialty === s.name ? 'text-teal-700' : 'text-slate-600'
                        }`}>{s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* PASO 2 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <div className="bg-teal-700 px-5 py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white text-teal-700 font-bold text-xs flex items-center justify-center">2</span>
                  <span className="text-white font-semibold">Seleccionar doctor</span>
                </div>
                <div className="p-5">
                  {!selectedSpecialty ? (
                    <p className="text-slate-400 text-sm">Primero selecciona una especialidad.</p>
                  ) : doctors.length === 0 ? (
                    <p className="text-slate-400 text-sm">No hay doctores disponibles para esta especialidad.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {doctors.map((d) => (
                        <button key={d._id} type="button" onClick={() => setSelectedDoctor(d)}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                            selectedDoctor?._id === d._id
                              ? 'border-teal-500 bg-teal-50'
                              : 'border-slate-200 hover:border-teal-300'
                          }`}>
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm flex-shrink-0">
                            {d.name?.charAt(0)}
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${selectedDoctor?._id === d._id ? 'text-teal-700' : 'text-slate-800'}`}>{d.name}</p>
                            <p className="text-xs text-slate-500">{d.specialty}</p>
                          </div>
                          {selectedDoctor?._id === d._id && <span className="ml-auto text-teal-500 text-lg">✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* PASO 3 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <div className="bg-teal-700 px-5 py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white text-teal-700 font-bold text-xs flex items-center justify-center">3</span>
                  <span className="text-white font-semibold">Fecha y horario</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={() => setWeekOffset(w => Math.max(0, w - 1))}
                      disabled={weekOffset === 0}
                      className="text-sm px-3 py-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed">
                      ‹ Anterior
                    </button>
                    <span className="text-sm font-semibold text-slate-700">{weekLabel}</span>
                    <button onClick={() => setWeekOffset(w => w + 1)}
                      className="text-sm px-3 py-1 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                      Siguiente ›
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr>
                          <th className="w-14 py-2" />
                          {weekDays.map((d, i) => {
                            const isToday = d.toDateString() === new Date().toDateString()
                            return (
                              <th key={i} className="text-center py-2 px-1">
                                <div className="text-slate-400 font-medium">{DAY_NAMES[i]}</div>
                                <div className={`w-7 h-7 mx-auto mt-1 rounded-full flex items-center justify-center font-bold text-sm ${isToday ? 'bg-teal-600 text-white' : 'text-slate-700'}`}>
                                  {d.getDate()}
                                </div>
                              </th>
                            )
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {times.map((time) => (
                          <tr key={time} className="border-t border-slate-50">
                            <td className="text-slate-400 pr-2 py-1 text-right text-xs w-14">{time}</td>
                            {weekDays.map((day, i) => {
                              const available = isTimeAvailable(day, time)
                              const isSelected = selectedDate?.toDateString() === day.toDateString() && selectedTime === time
                              const d = new Date(day)
                              d.setHours(0, 0, 0, 0)
                              const isPast = d < today
                              return (
                                <td key={i} className="px-0.5 py-0.5 text-center">
                                  {isPast ? (
                                    <span className="block w-full py-1 text-slate-200 text-xs">—</span>
                                  ) : (
                                    <button type="button"
                                      disabled={!available}
                                      onClick={() => { setSelectedDate(day); setSelectedTime(time) }}
                                      className={`w-full py-1 rounded text-xs font-medium transition-all ${
                                        isSelected
                                          ? 'bg-teal-600 text-white'
                                          : available
                                          ? 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
                                          : 'bg-slate-100 text-slate-300 cursor-not-allowed line-through'
                                      }`}>
                                      {time}
                                    </button>
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-teal-50 border border-teal-200" /> Disponible</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-100" /> Ocupado</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-teal-600" /> Seleccionado</span>
                  </div>
                </div>
              </div>

              {/* PASO 4 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <div className="bg-teal-700 px-5 py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white text-teal-700 font-bold text-xs flex items-center justify-center">4</span>
                  <span className="text-white font-semibold">Motivo de consulta</span>
                </div>
                <div className="p-5">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Describe el motivo <span className="text-red-400">*</span>
                  </label>
                  <textarea value={reason} onChange={(e) => setReason(e.target.value)}
                    rows={3} placeholder="Ej: Dolor de cabeza frecuente, chequeo anual..."
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
                </div>
              </div>
            </div>

            {/* Panel derecho */}
            <div className="w-72 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-4">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">🗓️ Resumen de cita</h3>
                <div className="space-y-3 text-sm mb-6">
                  {[
                    { label: 'Especialidad', val: selectedSpecialty || 'Sin seleccionar' },
                    { label: 'Doctor', val: selectedDoctor?.name || 'Sin seleccionar' },
                    { label: 'Fecha', val: selectedDate ? selectedDate.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Sin seleccionar' },
                    { label: 'Hora', val: selectedTime || 'Sin seleccionar' },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between items-start">
                      <span className="text-slate-400">{r.label}</span>
                      <span className={`font-medium text-right ml-2 ${r.val === 'Sin seleccionar' ? 'text-slate-300' : 'text-slate-800'}`}>
                        {r.val}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={`rounded-xl p-4 text-center mb-4 ${
                  selectedSpecialty && selectedDoctor && selectedDate && selectedTime
                    ? 'bg-teal-50 border border-teal-200'
                    : 'bg-slate-50 border border-slate-200'
                }`}>
                  <p className={`text-xs mb-1 ${selectedSpecialty && selectedDoctor ? 'text-teal-600' : 'text-slate-400'}`}>Modalidad</p>
                  <p className={`text-lg font-bold ${selectedSpecialty && selectedDoctor ? 'text-teal-700' : 'text-slate-300'}`}>Presencial</p>
                </div>
                <button onClick={handleSubmit}
                  disabled={submitting || !selectedSpecialty || !selectedDoctor || !selectedDate || !selectedTime || !reason}
                  className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-teal-700 transition-all shadow-md shadow-teal-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {submitting ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Agendando...</>
                  ) : '🗓️ Confirmar Cita'}
                </button>
                <p className="text-xs text-slate-400 text-center mt-3">🔒 Cancelación gratuita 24h antes</p>
                <button onClick={() => setShowForm(false)}
                  className="w-full mt-3 text-sm text-slate-400 hover:text-slate-600 transition-colors py-2">
                  Cancelar
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}