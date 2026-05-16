import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RESPONSES = {
  fiebre: { specialty: 'Medicina General', message: 'La fiebre puede indicar una infección. Te recomendamos con Medicina General para una evaluación completa.' },
  dolor: { specialty: 'Medicina General', message: 'Para dolores generales, Medicina General es el punto de partida ideal.' },
  corazon: { specialty: 'Cardiología', message: 'Los síntomas cardíacos requieren atención especializada. Te recomendamos Cardiología.' },
  niño: { specialty: 'Pediatría', message: 'Para atención de niños y adolescentes, Pediatría es la especialidad indicada.' },
  embarazo: { specialty: 'Ginecología', message: 'Para control prenatal y atención materna, Ginecología es la especialidad correcta.' },
  hueso: { specialty: 'Traumatología', message: 'Para dolores óseos o lesiones, Traumatología es la especialidad adecuada.' },
  cabeza: { specialty: 'Neurología', message: 'Para dolores de cabeza frecuentes, te recomendamos Neurología.' },
  vista: { specialty: 'Oftalmología', message: 'Para problemas de visión, Oftalmología es la especialidad correcta.' },
  piel: { specialty: 'Dermatología', message: 'Para problemas de piel, Dermatología es la especialidad indicada.' },
}

const getResponse = (message) => {
  const lower = message.toLowerCase()
  for (const [key, value] of Object.entries(RESPONSES)) {
    if (lower.includes(key)) return value
  }
  return {
    specialty: 'Medicina General',
    message: 'Para una evaluación inicial, te recomendamos comenzar con Medicina General.'
  }
}

export default function PatientChatbot() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy tu asistente virtual de VitaCare 🏥\n\nPuedo ayudarte a:\n• Orientarte según tus síntomas\n• Encontrar el especialista adecuado\n• Agendar una cita médica\n\n¿En qué puedo ayudarte hoy?'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const response = getResponse(input)
      const botMessage = {
        role: 'assistant',
        content: `${response.message}\n\n🩺 Especialidad recomendada: ${response.specialty}\n\n¿Deseas agendar una cita ahora?`,
        specialty: response.specialty
      }
      setMessages(prev => [...prev, botMessage])
      setLoading(false)
    }, 1000)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Asistente Virtual</h1>
        <p className="text-slate-500 text-sm">Te oriento para encontrar el especialista adecuado</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-100 flex flex-col" style={{ height: '600px' }}>
        {/* Header chatbot */}
        <div className="bg-teal-700 rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center text-xl">🤖</div>
            <div>
              <p className="text-white font-medium text-sm">Dr. VitaBot — Asistente IA</p>
              <p className="text-teal-200 text-xs">● En línea · Disponible 24/7</p>
            </div>
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm ${
                m.role === 'user'
                  ? 'bg-teal-600 text-white rounded-br-none'
                  : 'bg-slate-100 text-slate-800 rounded-bl-none'
              }`}>
                {m.content.split('\n').map((line, j) => (
                  <p key={j} className="mb-0.5">{line}</p>
                ))}
                {m.specialty && (
                  <button
                    onClick={() => navigate('/my-appointments')}
                    className="mt-2 w-full bg-teal-700 text-white text-xs py-1.5 rounded-lg hover:bg-teal-800">
                    📅 Agendar cita ahora
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-none">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sugerencias */}
        <div className="px-4 py-2 border-t border-slate-50 flex gap-2 flex-wrap">
          {['Tengo fiebre', 'Dolor de cabeza', 'Problema cardíaco', 'Mi niño está enfermo'].map((s) => (
            <button key={s} onClick={() => setInput(s)}
              className="text-xs bg-teal-50 text-teal-600 px-3 py-1 rounded-full hover:bg-teal-100 transition-colors">
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-100 flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tus síntomas..."
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
          <button onClick={sendMessage} disabled={!input.trim() || loading}
            className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-800 transition-colors disabled:opacity-50">
            Enviar
          </button>
        </div>

        {/* Aviso */}
        <div className="px-4 pb-3">
          <p className="text-xs text-slate-400 text-center">
            ⚠️ Este asistente ofrece orientación general. No reemplaza la consulta médica.
          </p>
        </div>
      </div>
    </div>
  )
}