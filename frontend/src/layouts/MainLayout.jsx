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

const NAV_ICONS = {
  '/dashboard': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  '/configuraciones': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  '/usuarios': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  '/asistentes': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  '/patients': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  '/consultorios': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  '/doctors': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  '/horarios': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  '/appointments': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  '/reports': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  '/especialidades': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  '/my-appointments': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  '/asistente': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  '/profile': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
}

// Categorías del sidebar por rol
const NAV_CATEGORIES = {
  admin: [
    {
      label: 'GENERAL',
      items: ['/dashboard']
    },
    {
      label: 'GESTIÓN MÉDICA',
      items: ['/patients', '/appointments', '/reports']
    },
    {
      label: 'PERSONAL',
      items: ['/doctors', '/usuarios', '/asistentes']
    },
    {
      label: 'INFRAESTRUCTURA',
      items: ['/consultorios', '/horarios', '/especialidades']
    },
    {
      label: 'SISTEMA',
      items: ['/configuraciones', '/profile']
    },
  ],
  admision: [
    {
      label: 'GENERAL',
      items: ['/dashboard']
    },
    {
      label: 'GESTIÓN MÉDICA',
      items: ['/patients', '/appointments', '/reports']
    },
    {
      label: 'INFRAESTRUCTURA',
      items: ['/doctors', '/consultorios', '/horarios', '/especialidades']
    },
    {
      label: 'SISTEMA',
      items: ['/profile']
    },
  ],
  doctor: [
    {
      label: 'GENERAL',
      items: ['/dashboard']
    },
    {
      label: 'GESTIÓN MÉDICA',
      items: ['/patients', '/appointments', '/reports']
    },
    {
      label: 'SISTEMA',
      items: ['/profile']
    },
  ],
  paciente: [
    {
      label: 'GENERAL',
      items: ['/dashboard']
    },
    {
      label: 'MIS CITAS',
      items: ['/my-appointments']
    },
    {
      label: 'SOPORTE',
      items: ['/asistente']
    },
    {
      label: 'SISTEMA',
      items: ['/profile']
    },
  ],
}

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

  // Chatbot
  const [showChat, setShowChat] = useState(false)
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

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
      const { data } = await api.get('/appointments/availability')
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

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return
    const userMsg = { role: 'user', content: chatInput }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setChatInput('')
    setChatLoading(true)

    const systemPrompts = {
      admin: `Eres un asistente de IA para el administrador del sistema VitaCare del Centro de Salud Jorge Chávez de Juliaca. 
Ayudas con: gestión de usuarios y roles, estadísticas del sistema, reportes de atención, configuración del sistema, gestión de médicos, consultorios, horarios y especialidades.
Responde siempre en español, de forma clara, concisa y profesional.`,
      admision: `Eres un asistente de IA para el personal de admisión del sistema VitaCare del Centro de Salud Jorge Chávez de Juliaca.
Ayudas con: registro de pacientes, programación de citas médicas, búsqueda de historial clínico, disponibilidad de doctores, procesos administrativos de admisión.
Responde siempre en español, de forma clara y amigable.`,
      doctor: `Eres un asistente de IA para médicos del sistema VitaCare del Centro de Salud Jorge Chávez de Juliaca.
Ayudas con: agenda del día, consulta de historial de pacientes, información médica de referencia, registro de observaciones clínicas, orientación sobre diagnósticos según síntomas.
Responde siempre en español, de forma profesional y precisa.`,
      paciente: `Eres un asistente de salud virtual del Centro de Salud Jorge Chávez de Juliaca, Perú.
Ayudas a pacientes con: orientación sobre síntomas y especialidad adecuada, información sobre sus citas médicas, consejos de salud preventiva, preparación para consultas médicas.
Las especialidades disponibles son: Medicina General, Nutrición, Psicología, Odontología, Enfermería y Obstetricia.
Responde siempre en español, de forma amigable, clara y empática. No reemplazas a un médico real.`,
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompts[user?.role] || systemPrompts.paciente,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })
      const data = await response.json()
      const reply = data.content?.[0]?.text || 'Lo siento, no pude procesar tu mensaje.'
      setMessages([...newMessages, { role: 'assistant', content: reply }])
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error al conectar con el asistente. Intenta de nuevo.' }])
    } finally {
      setChatLoading(false)
    }
  }

  const allNavItems = [
    { path: '/dashboard', label: 'Inicio', roles: ['admin', 'doctor', 'admision', 'paciente'] },
    { path: '/configuraciones', label: 'Configuraciones', roles: ['admin'] },
    { path: '/usuarios', label: 'Usuarios', roles: ['admin'] },
    { path: '/asistentes', label: 'Asistentes', roles: ['admin'] },
    { path: '/patients', label: 'Pacientes', roles: ['admin', 'admision', 'doctor'] },
    { path: '/consultorios', label: 'Consultorios', roles: ['admin', 'admision'] },
    { path: '/doctors', label: 'Médicos', roles: ['admin', 'admision'] },
    { path: '/horarios', label: 'Horarios', roles: ['admin', 'admision'] },
    { path: '/appointments', label: 'Reservas', roles: ['admin', 'admision', 'doctor'] },
    { path: '/reports', label: 'Historial Clínico', roles: ['admin', 'admision', 'doctor'] },
    { path: '/especialidades', label: 'Especialidades', roles: ['admin', 'admision'] },
    { path: '/my-appointments', label: 'Mis Citas', roles: ['paciente'] },
    { path: '/asistente', label: 'Asistente Virtual', roles: ['paciente'] },
    { path: '/profile', label: 'Mi Perfil', roles: ['admin', 'doctor', 'admision', 'paciente'] },
  ]

  const navItemsMap = Object.fromEntries(allNavItems.map(i => [i.path, i]))
  const categories = NAV_CATEGORIES[user?.role] || []

  const roleInfo = {
    admin: { label: 'Administrador', color: darkMode ? 'bg-purple-900/40 text-purple-300 border border-purple-700' : 'bg-purple-50 text-purple-700 border border-purple-200' },
    doctor: { label: 'Doctor', color: darkMode ? 'bg-blue-900/40 text-blue-300 border border-blue-700' : 'bg-blue-50 text-blue-700 border border-blue-200' },
    admision: { label: 'Admisión', color: darkMode ? 'bg-teal-900/40 text-teal-300 border border-teal-700' : 'bg-teal-50 text-teal-700 border border-teal-200' },
    paciente: { label: 'Paciente', color: darkMode ? 'bg-green-900/40 text-green-300 border border-green-700' : 'bg-green-50 text-green-700 border border-green-200' },
  }

  const chatTitles = {
    admin: '🔑 Asistente Admin',
    admision: '🖥️ Asistente Admisión',
    doctor: '👨‍⚕️ Asistente Médico',
    paciente: '💬 Asistente de Salud',
  }

  return (
    <div className={`flex min-h-screen transition-colors ${darkMode ? 'bg-gray-950' : 'bg-slate-50'}`}>

      {/* SIDEBAR */}
      <aside className={`w-64 flex flex-col transition-colors border-r ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-slate-100'}`}>

        {/* Logo */}
        <div className={`px-5 py-4 border-b ${darkMode ? 'border-gray-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-teal-500/30">
              <span className="text-white font-bold text-base">V</span>
            </div>
            <div>
              <h1 className={`font-bold text-base leading-tight ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                Vita<span className="text-teal-500">Care</span>
              </h1>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>Jorge Chávez</p>
            </div>
          </div>
          <div className={`text-xs font-medium px-2.5 py-1 rounded-lg w-fit ${roleInfo[user?.role]?.color}`}>
            {roleInfo[user?.role]?.label}
          </div>
        </div>

        {/* Nav con categorías */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          {categories.map((cat) => (
            <div key={cat.label} className="mb-3">
              <p className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 ${darkMode ? 'text-gray-600' : 'text-slate-400'}`}>
                {cat.label}
              </p>
              <div className="space-y-0.5">
                {cat.items.map((path) => {
                  const item = navItemsMap[path]
                  if (!item) return null
                  const isActive = location.pathname === item.path
                  return (
                    <div key={path}>
                      <Link to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${isActive
                            ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                            : darkMode
                              ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                          }`}>
                        <span className={`flex-shrink-0 ${isActive ? 'text-white' : darkMode ? 'text-gray-500 group-hover:text-gray-300' : 'text-slate-400 group-hover:text-slate-600'}`}>
                          {NAV_ICONS[item.path]}
                        </span>
                        <span>{item.label}</span>
                        {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-70" />}
                      </Link>

                      {item.path === '/dashboard' && user?.role === 'paciente' && (
                        <button onClick={handleOpenForm}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mt-0.5 group ${showForm
                              ? 'bg-teal-600 text-white'
                              : darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                            }`}>
                          <span className={`flex-shrink-0 ${showForm ? 'text-white' : darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </span>
                          Reservar Cita
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className={`px-3 py-3 border-t space-y-1 ${darkMode ? 'border-gray-800' : 'border-slate-100'}`}>
          <button onClick={toggle}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}>
            <div className={`w-9 h-5 rounded-full relative transition-colors duration-300 flex-shrink-0 ${darkMode ? 'bg-teal-500' : 'bg-slate-200'}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center text-xs shadow-sm ${darkMode ? 'left-4 bg-gray-900' : 'left-0.5 bg-white'}`}>
                {darkMode ? '🌙' : '☀️'}
              </span>
            </div>
            <span>{darkMode ? 'Modo oscuro' : 'Modo claro'}</span>
          </button>

          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${darkMode ? 'bg-gray-800/60' : 'bg-slate-50'}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white text-sm font-bold">{user?.name?.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>{user?.name}</p>
              <p className={`text-xs capitalize ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>{user?.role}</p>
            </div>
          </div>

          <button onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${darkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'
              }`}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className={`flex-1 overflow-auto transition-colors ${darkMode ? 'bg-gray-950' : 'bg-slate-50'}`}>
        {children}
      </main>

      {/* CHATBOT FLOTANTE */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* Ventana del chat */}
        {showChat && (
          <div className={`w-80 rounded-2xl shadow-2xl border overflow-hidden flex flex-col ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'
            }`} style={{ height: '460px' }}>

            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm font-bold">{chatTitles[user?.role]}</p>
                  <p className="text-teal-100 text-xs">VitaCare IA</p>
                </div>
              </div>
              <button onClick={() => setShowChat(false)}
                className="text-white/70 hover:text-white transition-colors">✕</button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className={`text-center py-6 ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
                  <div className="text-3xl mb-2">👋</div>
                  <p className="text-sm font-medium">¡Hola, {user?.name?.split(' ')[0]}!</p>
                  <p className="text-xs mt-1">¿En qué puedo ayudarte hoy?</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${msg.role === 'user'
                      ? 'bg-teal-600 text-white rounded-br-sm'
                      : darkMode ? 'bg-gray-800 text-gray-200 rounded-bl-sm' : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                    }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className={`px-3 py-2 rounded-2xl rounded-bl-sm ${darkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className={`px-3 py-3 border-t ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  placeholder="Escribe tu mensaje..."
                  className={`flex-1 text-sm px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                />
                <button onClick={handleSendChat} disabled={chatLoading || !chatInput.trim()}
                  className="w-9 h-9 bg-teal-600 text-white rounded-xl flex items-center justify-center hover:bg-teal-700 transition-colors disabled:opacity-40">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Botón flotante */}
        <button onClick={() => setShowChat(!showChat)}
          className="w-14 h-14 bg-teal-600 text-white rounded-full shadow-lg shadow-teal-500/40 hover:bg-teal-700 transition-all hover:scale-110 flex items-center justify-center">
          {showChat ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          )}
        </button>
      </div>

      {/* MODAL RESERVAR CITA */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-8 overflow-y-auto">
          <div className="w-full max-w-6xl flex gap-6 pb-8">
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-2xl px-6 py-5 flex items-center justify-between shadow-lg">
                <div>
                  <h2 className="text-white text-xl font-bold">Reservar Cita Médica</h2>
                  <p className="text-teal-200 text-sm mt-0.5">Selecciona especialidad, doctor y horario disponible</p>
                </div>
                <button onClick={() => setShowForm(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">✕</button>
              </div>

              {/* PASO 1 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-5 py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/20 text-white font-bold text-xs flex items-center justify-center border border-white/30">1</span>
                  <span className="text-white font-semibold text-sm">Especialidad médica</span>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-4 gap-3">
                    {specialties.map((s) => (
                      <button key={s.name} type="button" onClick={() => handleSpecialty(s.name)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:-translate-y-0.5 hover:shadow-md ${selectedSpecialty === s.name
                            ? 'border-teal-500 bg-teal-50 shadow-md shadow-teal-100'
                            : 'border-slate-200 hover:border-teal-300 bg-white'
                          }`}>
                        <span className="text-2xl">{s.icon}</span>
                        <span className={`text-xs font-medium text-center leading-tight ${selectedSpecialty === s.name ? 'text-teal-700' : 'text-slate-600'}`}>{s.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* PASO 2 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-5 py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/20 text-white font-bold text-xs flex items-center justify-center border border-white/30">2</span>
                  <span className="text-white font-semibold text-sm">Seleccionar doctor</span>
                </div>
                <div className="p-5">
                  {!selectedSpecialty ? (
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Primero selecciona una especialidad.
                    </div>
                  ) : doctors.length === 0 ? (
                    <p className="text-slate-400 text-sm">No hay doctores disponibles para esta especialidad.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {doctors.map((d) => (
                        <button key={d._id} type="button" onClick={() => setSelectedDoctor(d)}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left hover:shadow-md ${selectedDoctor?._id === d._id
                              ? 'border-teal-500 bg-teal-50 shadow-md shadow-teal-100'
                              : 'border-slate-200 hover:border-teal-300'
                            }`}>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                            {d.name?.charAt(0)}
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${selectedDoctor?._id === d._id ? 'text-teal-700' : 'text-slate-800'}`}>{d.name}</p>
                            <p className="text-xs text-slate-500">{d.specialty}</p>
                          </div>
                          {selectedDoctor?._id === d._id && (
                            <span className="ml-auto text-teal-500">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* PASO 3 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-5 py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/20 text-white font-bold text-xs flex items-center justify-center border border-white/30">3</span>
                  <span className="text-white font-semibold text-sm">Fecha y horario</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={() => setWeekOffset(w => Math.max(0, w - 1))} disabled={weekOffset === 0}
                      className="flex items-center gap-1 text-sm px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                      ‹ Anterior
                    </button>
                    <span className="text-sm font-semibold text-slate-700">{weekLabel}</span>
                    <button onClick={() => setWeekOffset(w => w + 1)}
                      className="flex items-center gap-1 text-sm px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
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
                                <div className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>{DAY_NAMES[i]}</div>
                                <div className={`w-7 h-7 mx-auto mt-1 rounded-full flex items-center justify-center font-bold text-sm ${isToday ? 'bg-teal-600 text-white shadow-md shadow-teal-500/30' : 'text-slate-700'}`}>{d.getDate()}</div>
                              </th>
                            )
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {times.map((time) => (
                          <tr key={time} className="border-t border-slate-50">
                            <td className="text-slate-400 pr-2 py-1 text-right text-xs w-14 font-medium">{time}</td>
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
                                    <button type="button" disabled={!available}
                                      onClick={() => { setSelectedDate(day); setSelectedTime(time) }}
                                      className={`w-full py-1 rounded-lg text-xs font-medium transition-all ${isSelected
                                          ? 'bg-teal-600 text-white shadow-sm'
                                          : available
                                            ? 'bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200'
                                            : 'bg-slate-100 text-slate-300 cursor-not-allowed'
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
                  <div className="flex items-center gap-4 mt-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-teal-50 border border-teal-200" /> Disponible</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-slate-100" /> Ocupado</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-md bg-teal-600" /> Seleccionado</span>
                  </div>
                </div>
              </div>

              {/* PASO 4 */}
              <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <div className="bg-gradient-to-r from-teal-700 to-teal-600 px-5 py-3 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white/20 text-white font-bold text-xs flex items-center justify-center border border-white/30">4</span>
                  <span className="text-white font-semibold text-sm">Motivo de consulta</span>
                </div>
                <div className="p-5">
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    Describe el motivo <span className="text-red-400">*</span>
                  </label>
                  <textarea value={reason} onChange={(e) => setReason(e.target.value)}
                    rows={3} placeholder="Ej: Dolor de cabeza frecuente, chequeo anual..."
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none transition-colors" />
                </div>
              </div>
            </div>

            {/* Panel derecho */}
            <div className="w-72 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-lg p-5 sticky top-4">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center">
                    <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-800">Resumen de cita</h3>
                </div>
                <div className="space-y-3 text-sm mb-5">
                  {[
                    { label: 'Especialidad', val: selectedSpecialty || 'Sin seleccionar' },
                    { label: 'Doctor', val: selectedDoctor?.name || 'Sin seleccionar' },
                    { label: 'Fecha', val: selectedDate ? selectedDate.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Sin seleccionar' },
                    { label: 'Hora', val: selectedTime || 'Sin seleccionar' },
                  ].map((r) => (
                    <div key={r.label} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                      <span className="text-slate-400 text-xs">{r.label}</span>
                      <span className={`font-semibold text-xs text-right ml-2 ${r.val === 'Sin seleccionar' ? 'text-slate-300' : 'text-slate-800'}`}>{r.val}</span>
                    </div>
                  ))}
                </div>
                <div className={`rounded-xl p-4 text-center mb-4 ${selectedSpecialty && selectedDoctor && selectedDate && selectedTime ? 'bg-teal-50 border border-teal-200' : 'bg-slate-50 border border-slate-200'}`}>
                  <p className={`text-xs mb-1 ${selectedSpecialty && selectedDoctor ? 'text-teal-600' : 'text-slate-400'}`}>Modalidad</p>
                  <p className={`text-base font-bold ${selectedSpecialty && selectedDoctor ? 'text-teal-700' : 'text-slate-300'}`}>Presencial</p>
                </div>
                <button onClick={handleSubmit}
                  disabled={submitting || !selectedSpecialty || !selectedDoctor || !selectedDate || !selectedTime || !reason}
                  className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {submitting ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Agendando...</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Confirmar Cita</>
                  )}
                </button>
                <p className="text-xs text-slate-400 text-center mt-3 flex items-center justify-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Cancelación gratuita 24h antes
                </p>
                <button onClick={() => setShowForm(false)}
                  className="w-full mt-3 text-sm text-slate-400 hover:text-slate-600 transition-colors py-2 rounded-xl hover:bg-slate-50">
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