import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../hooks/useTheme'

const SUGGESTIONS = {
  paciente: ['Tengo fiebre', 'Dolor de cabeza', 'Estoy embarazada', 'Mi niño está enfermo', '¿Cómo agendo una cita?'],
  admin: ['¿Cuántos pacientes hay?', '¿Cómo gestiono usuarios?', '¿Cómo genero reportes?', 'Ayuda con el sistema'],
  admision: ['¿Cómo registro un paciente?', '¿Cómo programo una cita?', '¿Cómo busco un historial?'],
  doctor: ['¿Cómo veo mi agenda?', '¿Cómo registro observaciones?', 'Información sobre diagnósticos'],
}

const SYSTEM_PROMPTS = {
  admin: `Eres un asistente de IA para el administrador del sistema VitaCare del Centro de Salud Jorge Chávez de Juliaca, Perú. Ayudas con: gestión de usuarios y roles, estadísticas del sistema, reportes de atención, configuración del sistema, gestión de médicos, consultorios, horarios y especialidades. Responde siempre en español, de forma clara y profesional.`,
  admision: `Eres un asistente de IA para el personal de admisión del sistema VitaCare del Centro de Salud Jorge Chávez de Juliaca, Perú. Ayudas con: registro de pacientes, programación de citas médicas, búsqueda de historial clínico, disponibilidad de doctores, procesos administrativos de admisión. Responde siempre en español, de forma clara y amigable.`,
  doctor: `Eres un asistente de IA para médicos del sistema VitaCare del Centro de Salud Jorge Chávez de Juliaca, Perú. Ayudas con: agenda del día, consulta de historial de pacientes, información médica de referencia, registro de observaciones clínicas, orientación sobre diagnósticos según síntomas. Responde siempre en español, de forma profesional y precisa.`,
  paciente: `Eres un asistente de salud virtual del Centro de Salud Jorge Chávez de Juliaca, Perú. Ayudas a pacientes con: orientación sobre síntomas y especialidad adecuada, información sobre sus citas médicas, consejos de salud preventiva, preparación para consultas médicas. Las especialidades disponibles son: Medicina General, Nutrición, Psicología, Odontología, Enfermería y Obstetricia. Responde siempre en español, de forma amigable, clara y empática. No reemplazas a un médico real.`,
}

const CHAT_TITLES = {
  admin: '🔑 Asistente Administrador',
  admision: '🖥️ Asistente Admisión',
  doctor: '👨‍⚕️ Asistente Médico',
  paciente: '💬 Asistente de Salud',
}

export default function Chatbot() {
  const { user } = useAuth()
  const { darkMode } = useTheme()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const suggestions = SUGGESTIONS[user?.role] || SUGGESTIONS.paciente
  const systemPrompt = SYSTEM_PROMPTS[user?.role] || SYSTEM_PROMPTS.paciente
  const chatTitle = CHAT_TITLES[user?.role] || CHAT_TITLES.paciente

  useEffect(() => {
    setMessages([{
      role: 'assistant',
      content: `¡Hola, ${user?.name?.split(' ')[0]}! 👋 Soy tu asistente virtual de VitaCare. ¿En qué puedo ayudarte hoy?`
    }])
  }, [user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const msg = text || input
    if (!msg.trim() || loading) return

    const userMsg = { role: 'user', content: msg }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })
      const data = await response.json()
      const reply = data.content?.[0]?.text || 'Lo siento, no pude procesar tu mensaje.'
      setMessages([...newMessages, { role: 'assistant', content: reply }])
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error al conectar con el asistente. Intenta de nuevo.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className={`p-6 min-h-full transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>

      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{chatTitle}</h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
          {user?.role === 'paciente'
            ? 'Describe tus síntomas y te orientamos al especialista correcto'
            : 'Tu asistente inteligente para gestionar el sistema'}
        </p>
      </div>

      <div className="max-w-3xl">
        <div className={`rounded-2xl border overflow-hidden shadow-sm flex flex-col ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-100'
          }`} style={{ height: '600px' }}>

          {/* Header del chat */}
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-5 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">{chatTitle}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse" />
                <p className="text-teal-100 text-xs">VitaCare IA — En línea</p>
              </div>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                )}
                <div className={`max-w-sm lg:max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                    ? 'bg-teal-600 text-white rounded-br-sm'
                    : darkMode ? 'bg-gray-700 text-gray-200 rounded-bl-sm' : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                  }`}>
                  {m.content.split('\n').map((line, j) => (
                    <p key={j} className={j > 0 ? 'mt-1' : ''}>{line}</p>
                  ))}
                </div>
                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 ml-2 mt-1">
                    <span className="text-white text-xs font-bold">{user?.name?.charAt(0)}</span>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0 mr-2">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className={`px-4 py-3 rounded-2xl rounded-bl-sm ${darkMode ? 'bg-gray-700' : 'bg-slate-100'}`}>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sugerencias */}
          <div className={`px-4 py-2 border-t flex gap-2 flex-wrap ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
            {suggestions.map(s => (
              <button key={s} onClick={() => sendMessage(s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${darkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-teal-200 text-teal-600 hover:bg-teal-50'
                  }`}>
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className={`p-4 border-t flex gap-2 ${darkMode ? 'border-gray-700' : 'border-slate-100'}`}>
            <input type="text" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje..."
              className={`flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 transition-colors ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'border-slate-200 text-slate-800'
                }`} />
            <button onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="bg-teal-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-teal-700 transition-colors disabled:opacity-40 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Enviar
            </button>
          </div>
        </div>

        {/* Info */}
        <p className={`text-xs text-center mt-3 ${darkMode ? 'text-gray-500' : 'text-slate-400'}`}>
          🤖 Asistente impulsado por Claude AI — VitaCare {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}