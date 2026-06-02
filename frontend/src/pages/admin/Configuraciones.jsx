import { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

export default function Configuraciones() {
  const { darkMode, toggle } = useTheme()
  const { toast, showToast, hideToast } = useToast()
  const [activeTab, setActiveTab] = useState('general')

  const [general, setGeneral] = useState({
    nombreCentro: 'Centro de Salud Jorge Chávez',
    direccion: 'Jr. Ancash N° 179, Juliaca',
    telefono: '(051) 331445',
    email: 'csjorgechavez@gmail.com',
    horarioApertura: '08:00',
    horarioCierre: '17:00',
    diasAtencion: 'Lunes - Sábado',
    ruc: '20406438342',
  })

  const [sistema, setSistema] = useState({
    maxCitasPorDia: '50',
    duracionCita: '30',
    diasAnticipacion: '30',
    recordatorioEmail: true,
    recordatorioSMS: false,
    registroAutomatico: true,
  })

  const [seguridad, setSeguridad] = useState({
    sesionExpira: '7',
    intentosLogin: '5',
    dobleAutenticacion: false,
  })

  const handleSave = () => {
    showToast('Configuración guardada correctamente', 'success')
  }

  const cardClass = `rounded-2xl border p-6 shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`
  const inputClass = `w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-slate-200 text-slate-800'
  }`
  const labelClass = `block text-xs font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`

  const tabs = [
    { id: 'general', label: 'General', icon: '🏥' },
    { id: 'sistema', label: 'Sistema', icon: '⚙️' },
    { id: 'seguridad', label: 'Seguridad', icon: '🔒' },
    { id: 'apariencia', label: 'Apariencia', icon: '🎨' },
  ]

  const Toggle = ({ value, onChange }) => (
    <button onClick={onChange}
      className={`w-12 h-6 rounded-full relative transition-colors duration-300 flex-shrink-0 ${
        value ? 'bg-teal-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
      }`}>
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-sm ${value ? 'left-6' : 'left-0.5'}`} />
    </button>
  )

  return (
    <div className={`p-6 min-h-full transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Configuraciones</h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Configuración general del sistema VitaCare</p>
        </div>
        <button onClick={handleSave}
          className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors shadow-md shadow-teal-500/20 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Guardar cambios
        </button>
      </div>

      {/* Tabs */}
      <div className={`flex gap-1.5 mb-6 p-1.5 rounded-2xl w-fit ${darkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-slate-600 hover:bg-slate-200'
            }`}>
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB GENERAL */}
      {activeTab === 'general' && (
        <div className="space-y-4 max-w-2xl">
          <div className={cardClass}>
            <h2 className={`font-bold text-base mb-5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              <span className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center text-lg">🏥</span>
              Información del Centro de Salud
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Nombre del centro</label>
                <input value={general.nombreCentro}
                  onChange={(e) => setGeneral({ ...general, nombreCentro: e.target.value })}
                  className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Dirección</label>
                <input value={general.direccion}
                  onChange={(e) => setGeneral({ ...general, direccion: e.target.value })}
                  className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Teléfono</label>
                <input value={general.telefono}
                  onChange={(e) => setGeneral({ ...general, telefono: e.target.value })}
                  className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>RUC</label>
                <input value={general.ruc}
                  onChange={(e) => setGeneral({ ...general, ruc: e.target.value })}
                  className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Email institucional</label>
                <input type="email" value={general.email}
                  onChange={(e) => setGeneral({ ...general, email: e.target.value })}
                  className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Horario apertura</label>
                <input type="time" value={general.horarioApertura}
                  onChange={(e) => setGeneral({ ...general, horarioApertura: e.target.value })}
                  className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Horario cierre</label>
                <input type="time" value={general.horarioCierre}
                  onChange={(e) => setGeneral({ ...general, horarioCierre: e.target.value })}
                  className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Días de atención</label>
                <input value={general.diasAtencion}
                  onChange={(e) => setGeneral({ ...general, diasAtencion: e.target.value })}
                  className={inputClass} />
              </div>
            </div>
          </div>

          {/* Info card */}
          <div className={`rounded-2xl border p-4 flex items-start gap-3 ${
            darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-100'
          }`}>
            <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className={`text-xs ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              Esta información aparecerá en los reportes y documentos generados por el sistema.
            </p>
          </div>
        </div>
      )}

      {/* TAB SISTEMA */}
      {activeTab === 'sistema' && (
        <div className="space-y-4 max-w-2xl">
          <div className={cardClass}>
            <h2 className={`font-bold text-base mb-5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              <span className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center text-lg">📅</span>
              Configuración de Citas
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Máx. citas por día</label>
                <input type="number" value={sistema.maxCitasPorDia}
                  onChange={(e) => setSistema({ ...sistema, maxCitasPorDia: e.target.value })}
                  className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Duración de cita (min)</label>
                <input type="number" value={sistema.duracionCita}
                  onChange={(e) => setSistema({ ...sistema, duracionCita: e.target.value })}
                  className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Días de anticipación máx.</label>
                <input type="number" value={sistema.diasAnticipacion}
                  onChange={(e) => setSistema({ ...sistema, diasAnticipacion: e.target.value })}
                  className={inputClass} />
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className={`font-bold text-base mb-5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              <span className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center text-lg">📧</span>
              Notificaciones
            </h2>
            <div className="space-y-3">
              {[
                { key: 'recordatorioEmail', label: 'Recordatorio por email', desc: 'Enviar recordatorio de cita por correo electrónico' },
                { key: 'recordatorioSMS', label: 'Recordatorio por SMS', desc: 'Enviar recordatorio de cita por mensaje de texto' },
                { key: 'registroAutomatico', label: 'Registro automático', desc: 'Permitir que los pacientes se registren automáticamente' },
              ].map(({ key, label, desc }) => (
                <div key={key} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>{label}</p>
                    <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{desc}</p>
                  </div>
                  <Toggle value={sistema[key]} onChange={() => setSistema({ ...sistema, [key]: !sistema[key] })} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB SEGURIDAD */}
      {activeTab === 'seguridad' && (
        <div className="space-y-4 max-w-2xl">
          <div className={cardClass}>
            <h2 className={`font-bold text-base mb-5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              <span className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center text-lg">🔒</span>
              Configuración de Seguridad
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass}>Expiración de sesión (días)</label>
                <input type="number" value={seguridad.sesionExpira}
                  onChange={(e) => setSeguridad({ ...seguridad, sesionExpira: e.target.value })}
                  className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Intentos máx. de login</label>
                <input type="number" value={seguridad.intentosLogin}
                  onChange={(e) => setSeguridad({ ...seguridad, intentosLogin: e.target.value })}
                  className={inputClass} />
              </div>
            </div>
            <div className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>Doble autenticación</p>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Requerir verificación adicional al iniciar sesión</p>
              </div>
              <Toggle value={seguridad.dobleAutenticacion} onChange={() => setSeguridad({ ...seguridad, dobleAutenticacion: !seguridad.dobleAutenticacion })} />
            </div>
          </div>

          <div className={cardClass}>
            <h2 className={`font-bold text-base mb-5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              <span className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center text-lg">🗄️</span>
              Base de Datos
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exportar backup
              </button>
              <button className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Importar datos
              </button>
              <button className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Limpiar datos de prueba
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB APARIENCIA */}
      {activeTab === 'apariencia' && (
        <div className="space-y-4 max-w-2xl">
          <div className={cardClass}>
            <h2 className={`font-bold text-base mb-5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              <span className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center text-lg">🎨</span>
              Apariencia del Sistema
            </h2>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Tema del sistema</label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { name: 'Claro', icon: '☀️', active: !darkMode },
                    { name: 'Oscuro', icon: '🌙', active: darkMode },
                    { name: 'Sistema', icon: '💻', active: false },
                  ].map((t) => (
                    <button key={t.name} onClick={t.name !== 'Sistema' ? toggle : undefined}
                      className={`rounded-xl p-4 flex flex-col items-center gap-2 border-2 transition-all hover:scale-105 ${
                        t.active
                          ? 'border-teal-500 bg-teal-50'
                          : darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-slate-200 bg-slate-50'
                      }`}>
                      <span className="text-2xl">{t.icon}</span>
                      <span className={`text-xs font-medium ${
                        t.active ? 'text-teal-600' : darkMode ? 'text-gray-300' : 'text-slate-600'
                      }`}>{t.name}</span>
                      {t.active && <span className="text-xs text-teal-500 font-medium">Activo</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Color principal</label>
                <div className="flex gap-3 mt-2">
                  {[
                    { color: '#0d9488', active: true },
                    { color: '#2563eb', active: false },
                    { color: '#7c3aed', active: false },
                    { color: '#dc2626', active: false },
                    { color: '#d97706', active: false },
                    { color: '#16a34a', active: false },
                  ].map(({ color, active }) => (
                    <button key={color} style={{ backgroundColor: color }}
                      className={`w-9 h-9 rounded-full border-2 shadow-md hover:scale-110 transition-transform ${
                        active ? 'border-white ring-2 ring-teal-500' : 'border-white'
                      }`} />
                  ))}
                </div>
              </div>

              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
                <p className={`text-xs font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}>Vista previa</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-md">
                    <span className="text-white font-bold">V</span>
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                      Vita<span className="text-teal-500">Care</span>
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>Centro de Salud Jorge Chávez</p>
                  </div>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full bg-teal-50 text-teal-600 border border-teal-200 font-medium">
                    Administrador
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}