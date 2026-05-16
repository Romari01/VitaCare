import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL

const specialties = [
  { name: 'Medicina General', icon: '🩺' },
  { name: 'Cardiología', icon: '❤️' },
  { name: 'Pediatría', icon: '👶' },
  { name: 'Traumatología', icon: '🦴' },
  { name: 'Neurología', icon: '🧠' },
  { name: 'Ginecología', icon: '🌸' },
  { name: 'Dermatología', icon: '✨' },
  { name: 'Oftalmología', icon: '👁️' },
]

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30'
]

const consultTypes = ['Primera consulta', 'Control / Seguimiento', 'Urgencia', 'Resultado de examen']
const modalities = ['Presencial', 'Teleconsulta']

function getWeekDays(startDate) {
  const days = []
  const date = new Date(startDate)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1)
  date.setDate(diff)
  for (let i = 0; i < 7; i++) {
    const d = new Date(date)
    d.setDate(date.getDate() + i)
    days.push(d)
  }
  return days
}

export default function BookAppointment() {
  const navigate = useNavigate()
  const [step, setStep] = useState({
    specialty: '', doctor: null, date: null, time: '',
    reason: '', consultType: 'Primera consulta', modality: 'Presencial'
  })
  const [doctors, setDoctors] = useState([])
  const [weekStart, setWeekStart] = useState(new Date())
  const [patientDni, setPatientDni] = useState('')
  const [patientInfo, setPatientInfo] = useState(null)
  const [checking, setChecking] = useState(false)
  const weekDays = getWeekDays(weekStart)
  const dayNames = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']

  const handleSpecialty = async (specialty) => {
    setStep(s => ({ ...s, specialty, doctor: null }))
    try {
      const { data } = await axios.get(`${API}/public/doctors/${encodeURIComponent(specialty)}`)
      setDoctors(data)
    } catch {
      setDoctors([])
    }
  }

  const checkPatient = async () => {
    if (!patientDni) return
    setChecking(true)
    try {
      const { data } = await axios.get(`${API}/public/check-patient/${patientDni}`)
      setPatientInfo(data.found ? data : null)
    } catch {
      setPatientInfo(null)
    } finally {
      setChecking(false)
    }
  }

  const getPrice = () => {
    if (!patientInfo) return { total: 10, detail: 'S/ 5.00 apertura + S/ 5.00 atención' }
    if (patientInfo.origin === 'externo' || !patientInfo.hasHistory) {
      return { total: 10, detail: 'S/ 5.00 apertura + S/ 5.00 atención' }
    }
    return { total: 0, detail: 'Atención gratuita ✅' }
  }

  const formatDate = (date) => {
    if (!date) return 'Sin seleccionar'
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-100">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-bold text-slate-800 text-lg">VitaCare</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} className="text-sm text-slate-600 hover:text-teal-600">Inicio</button>
          <button className="text-sm text-teal-600 font-medium border-b-2 border-teal-600 pb-1">Reservar Cita</button>
          <button onClick={() => navigate('/login')} className="text-sm text-slate-600 hover:text-teal-600">Iniciar Sesión</button>
          <button onClick={() => navigate('/login')} className="bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Registrarse</button>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-teal-700 text-white px-8 py-8">
        <h1 className="text-2xl font-bold">Reservar Cita Médica</h1>
        <p className="text-teal-200 text-sm mt-1">Selecciona especialidad, doctor y horario disponible</p>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* Paso 1 */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
            <div className="bg-teal-700 text-white px-6 py-3 flex items-center gap-3">
              <span className="bg-teal-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <span className="font-medium">Especialidad médica</span>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {specialties.map((s) => (
                <button key={s.name} onClick={() => handleSpecialty(s.name)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    step.specialty === s.name ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-300'
                  }`}>
                  <span className="text-2xl block mb-2">{s.icon}</span>
                  <span className="text-xs text-slate-700 font-medium">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Paso 2 */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
            <div className="bg-teal-700 text-white px-6 py-3 flex items-center gap-3">
              <span className="bg-teal-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <span className="font-medium">Seleccionar doctor</span>
            </div>
            <div className="p-6">
              {!step.specialty ? (
                <p className="text-slate-400 text-sm">Primero selecciona una especialidad.</p>
              ) : doctors.length === 0 ? (
                <p className="text-slate-400 text-sm">No hay doctores disponibles para esta especialidad.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {doctors.map((d) => (
                    <button key={d._id} onClick={() => setStep(s => ({ ...s, doctor: d }))}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        step.doctor?._id === d._id ? 'border-teal-500 bg-teal-50' : 'border-slate-200 hover:border-teal-300'
                      }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold">
                          {d.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{d.name}</p>
                          <p className="text-xs text-slate-500">{d.specialty}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Paso 3 */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
            <div className="bg-teal-700 text-white px-6 py-3 flex items-center gap-3">
              <span className="bg-teal-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span className="font-medium">Fecha y horario</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() - 7); setWeekStart(d) }}
                  className="text-sm text-slate-600 border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-50">
                  ‹ Anterior
                </button>
                <span className="text-sm font-medium text-slate-700">
                  {weekDays[0].toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })} — {weekDays[6].toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
                </span>
                <button onClick={() => { const d = new Date(weekStart); d.setDate(d.getDate() + 7); setWeekStart(d) }}
                  className="text-sm text-slate-600 border border-slate-200 px-3 py-1 rounded-lg hover:bg-slate-50">
                  Siguiente ›
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      {dayNames.map((day, i) => (
                        <th key={day} className="text-center pb-2 text-slate-500 font-medium">
                          <div>{day}</div>
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto mt-1 ${
                            weekDays[i].toDateString() === new Date().toDateString() ? 'bg-teal-700 text-white' : 'text-slate-700'
                          }`}>{weekDays[i].getDate()}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((time) => (
                      <tr key={time}>
                        {weekDays.map((day, i) => {
                          const isPast = day < new Date().setHours(0,0,0,0)
                          const isSelected = step.date?.toDateString() === day.toDateString() && step.time === time
                          return (
                            <td key={i} className="text-center py-0.5 px-0.5">
                              <button disabled={isPast} onClick={() => setStep(s => ({ ...s, date: day, time }))}
                                className={`w-full py-1 rounded text-xs transition-all ${
                                  isPast ? 'text-slate-300 cursor-not-allowed' :
                                  isSelected ? 'bg-teal-700 text-white' :
                                  'bg-teal-50 text-teal-700 hover:bg-teal-100'
                                }`}>{time}</button>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Paso 4 */}
          <div className="bg-white rounded-2xl overflow-hidden border border-slate-100">
            <div className="bg-teal-700 text-white px-6 py-3 flex items-center gap-3">
              <span className="bg-teal-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">4</span>
              <span className="font-medium">Motivo de consulta</span>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Describe el motivo *</label>
                <textarea value={step.reason} onChange={(e) => setStep(s => ({ ...s, reason: e.target.value }))}
                  rows={3} placeholder="Ej: Dolor de cabeza frecuente, chequeo anual..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tipo de consulta</label>
                  <select value={step.consultType} onChange={(e) => setStep(s => ({ ...s, consultType: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                    {consultTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Modalidad</label>
                  <select value={step.modality} onChange={(e) => setStep(s => ({ ...s, modality: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400">
                    {modalities.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-6">
            <h3 className="font-bold text-slate-800 mb-4">🗒️ Resumen de cita</h3>
            <div className="space-y-3 text-sm mb-4">
              {[
                { label: 'Especialidad', value: step.specialty || 'Sin seleccionar' },
                { label: 'Doctor', value: step.doctor?.name || 'Sin seleccionar' },
                { label: 'Fecha', value: formatDate(step.date) },
                { label: 'Hora', value: step.time || 'Sin seleccionar' },
                { label: 'Modalidad', value: step.modality },
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-slate-500">{item.label}</span>
                  <span className={`font-medium text-xs ${item.value === 'Sin seleccionar' ? 'text-slate-400' : 'text-slate-800'}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Verificar DNI */}
            <div className="border-t border-slate-100 pt-4 mb-4">
              <label className="block text-xs font-medium text-slate-700 mb-1">Verificar DNI</label>
              <div className="flex gap-2">
                <input value={patientDni} onChange={(e) => setPatientDni(e.target.value)}
                  placeholder="Tu DNI" onKeyDown={(e) => e.key === 'Enter' && checkPatient()}
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400" />
                <button onClick={checkPatient} disabled={checking}
                  className="bg-teal-700 text-white px-3 py-2 rounded-lg text-xs hover:bg-teal-800">
                  {checking ? '...' : 'OK'}
                </button>
              </div>
              {patientInfo && (
                <p className="text-xs text-green-600 mt-1">✅ {patientInfo.name}</p>
              )}
              {patientDni && !patientInfo && !checking && (
                <p className="text-xs text-orange-500 mt-1">⚠️ Paciente nuevo</p>
              )}
            </div>

            {/* Precio */}
            <div className={`rounded-xl p-4 text-center mb-4 ${getPrice().total === 0 ? 'bg-green-50' : 'bg-teal-50'}`}>
              <p className={`font-bold text-2xl ${getPrice().total === 0 ? 'text-green-600' : 'text-teal-700'}`}>
                {getPrice().total === 0 ? 'Gratuito' : `S/ ${getPrice().total}.00`}
              </p>
              <p className={`text-xs mt-1 ${getPrice().total === 0 ? 'text-green-500' : 'text-teal-500'}`}>
                {getPrice().detail}
              </p>
            </div>

            <button onClick={() => navigate('/login')}
              className="w-full bg-teal-700 text-white py-3 rounded-xl font-medium hover:bg-teal-800 transition-colors">
              📅 Confirmar Cita
            </button>
            <p className="text-center text-xs text-slate-400 mt-3">
              🔒 Necesitas iniciar sesión para confirmar
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}