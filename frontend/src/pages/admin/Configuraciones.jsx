import { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'

export default function Configuraciones() {
  const { darkMode } = useTheme()
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)

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
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const cardClass = `rounded-2xl border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'}`
  const inputClass = `w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-slate-200 text-slate-800'
  }`
  const labelClass = `block text-xs font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-slate-700'}`
  const tabClass = (tab) => `px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
    activeTab === tab
      ? 'bg-teal-600 text-white'
      : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-slate-600 hover:bg-slate-100'
  }`

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
          {saved ? '✅ Guardado' : '💾 Guardar cambios'}
        </button>
      </div>

      {/* Tabs */}
      <div className={`flex gap-2 mb-6 p-1.5 rounded-2xl w-fit ${darkMode ? 'bg-gray-800' : 'bg-slate-100'}`}>
        <button onClick={() => setActiveTab('general')} className={tabClass('general')}>🏥 General</button>
        <button onClick={() => setActiveTab('sistema')} className={tabClass('sistema')}>⚙️ Sistema</button>
        <button onClick={() => setActiveTab('seguridad')} className={tabClass('seguridad')}>🔒 Seguridad</button>
        <button onClick={() => setActiveTab('apariencia')} className={tabClass('apariencia')}>🎨 Apariencia</button>
      </div>

      {/* TAB GENERAL */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className={cardClass}>
            <h2 className={`font-bold text-lg mb-5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              🏥 Información del Centro de Salud
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Nombre del centro</label>
                <input value={general.nombreCentro} onChange={(e) => setGeneral({ ...general, nombreCentro: e.target.value })} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Dirección</label>
                <input value={general.direccion} onChange={(e) => setGeneral({ ...general, direccion: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Teléfono</label>
                <input value={general.telefono} onChange={(e) => setGeneral({ ...general, telefono: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>RUC</label>
                <input value={general.ruc} onChange={(e) => setGeneral({ ...general, ruc: e.target.value })} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Email institucional</label>
                <input type="email" value={general.email} onChange={(e) => setGeneral({ ...general, email: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Horario apertura</label>
                <input type="time" value={general.horarioApertura} onChange={(e) => setGeneral({ ...general, horarioApertura: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Horario cierre</label>
                <input type="time" value={general.horarioCierre} onChange={(e) => setGeneral({ ...general, horarioCierre: e.target.value })} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Días de atención</label>
                <input value={general.diasAtencion} onChange={(e) => setGeneral({ ...general, diasAtencion: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB SISTEMA */}
      {activeTab === 'sistema' && (
        <div className="space-y-6">
          <div className={cardClass}>
            <h2 className={`font-bold text-lg mb-5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              ⚙️ Configuración de Citas
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Máx. citas por día</label>
                <input type="number" value={sistema.maxCitasPorDia} onChange={(e) => setSistema({ ...sistema, maxCitasPorDia: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Duración de cita (min)</label>
                <input type="number" value={sistema.duracionCita} onChange={(e) => setSistema({ ...sistema, duracionCita: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Días de anticipación máx.</label>
                <input type="number" value={sistema.diasAnticipacion} onChange={(e) => setSistema({ ...sistema, diasAnticipacion: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className={`font-bold text-lg mb-5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              📧 Notificaciones
            </h2>
            <div className="space-y-4">
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
                  <button onClick={() => setSistema({ ...sistema, [key]: !sistema[key] })}
                    className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${sistema[key] ? 'bg-teal-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 ${sistema[key] ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB SEGURIDAD */}
      {activeTab === 'seguridad' && (
        <div className="space-y-6">
          <div className={cardClass}>
            <h2 className={`font-bold text-lg mb-5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              🔒 Configuración de Seguridad
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className={labelClass}>Expiración de sesión (días)</label>
                <input type="number" value={seguridad.sesionExpira} onChange={(e) => setSeguridad({ ...seguridad, sesionExpira: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Intentos máx. de login</label>
                <input type="number" value={seguridad.intentosLogin} onChange={(e) => setSeguridad({ ...seguridad, intentosLogin: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
              <div>
                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-800'}`}>Doble autenticación</p>
                <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Requerir verificación adicional al iniciar sesión</p>
              </div>
              <button onClick={() => setSeguridad({ ...seguridad, dobleAutenticacion: !seguridad.dobleAutenticacion })}
                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${seguridad.dobleAutenticacion ? 'bg-teal-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300 ${seguridad.dobleAutenticacion ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>
          </div>

          <div className={cardClass}>
            <h2 className={`font-bold text-lg mb-5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              🗄️ Base de Datos
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                💾 Exportar backup
              </button>
              <button className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                📤 Importar datos
              </button>
              <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium transition-colors col-span-2">
                🗑️ Limpiar datos de prueba
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB APARIENCIA */}
      {activeTab === 'apariencia' && (
        <div className="space-y-6">
          <div className={cardClass}>
            <h2 className={`font-bold text-lg mb-5 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
              🎨 Apariencia del Sistema
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Tema del sistema</label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {[
                    { name: 'Claro', icon: '☀️', color: 'bg-white border-2 border-teal-500' },
                    { name: 'Oscuro', icon: '🌙', color: 'bg-gray-900 border-2 border-gray-600' },
                    { name: 'Sistema', icon: '💻', color: 'bg-slate-100 border-2 border-slate-300' },
                  ].map((t) => (
                    <button key={t.name} className={`${t.color} rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:scale-105`}>
                      <span className="text-2xl">{t.icon}</span>
                      <span className={`text-xs font-medium ${t.name === 'Oscuro' ? 'text-white' : 'text-slate-700'}`}>{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Color principal</label>
                <div className="flex gap-3 mt-2">
                  {['#0d9488', '#2563eb', '#7c3aed', '#dc2626', '#d97706', '#16a34a'].map((color) => (
                    <button key={color} style={{ backgroundColor: color }}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform" />
                  ))}
                </div>
              </div>

              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-slate-50'}`}>
                <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-slate-800'}`}>Vista previa</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">V</span>
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>VitaCare</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-400'}`}>Centro de Salud Jorge Chávez</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notificación guardado */}
      {saved && (
        <div className="fixed bottom-6 right-6 bg-teal-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          ✅ Configuración guardada correctamente
        </div>
      )}
    </div>
  )
}