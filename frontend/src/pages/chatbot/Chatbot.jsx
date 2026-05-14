import { useState } from 'react'

const RESPONSES = {
  fiebre: { specialty: 'Medicina General', message: 'La fiebre puede indicar una infección. Te recomendamos con Medicina General para una evaluación completa.' },
  dolor: { specialty: 'Medicina General', message: 'Para dolores generales, Medicina General es el punto de partida ideal.' },
  corazon: { specialty: 'Cardiología', message: 'Los síntomas cardíacos requieren atención especializada. Te recomendamos Cardiología.' },
  niño: { specialty: 'Pediatría', message: 'Para atención de niños y adolescentes, Pediatría es la especialidad indicada.' },
  embarazo: { specialty: 'Ginecología', message: 'Para control prenatal y atención materna, Ginecología es la especialidad correcta.' },
  hueso: { specialty: 'Traumatología', message: 'Para dolores óseos o lesiones, Traumatología es la especialidad adecuada.' },
  cabeza: { specialty: 'Neurología', message: 'Para dolores de cabeza frecuentes o problemas neurológicos, te recomendamos Neurología.' },
  vista: { specialty: 'Oftalmología', message: 'Para problemas de visión o molestias en los ojos, Oftalmología es la especialidad correcta.' },
  piel: { specialty: 'Dermatología', message: 'Para problemas de piel, manchas o erupciones, Dermatología es la especialidad indicada.' },
}

const getResponse = (message) => {
  const lower = message.toLowerCase()
  for (const [key, value] of Object.entries(RESPONSES)) {
    if (lower.includes(key)) return value
  }
  return {
    specialty: 'Medicina General',
    message: 'Para una evaluación inicial de tus síntomas, te recomendamos comenzar con Medicina General.'
  }
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! Soy el asistente virtual de VitaCare. Cuéntame tus síntomas y te orientaré hacia el especialista correcto. 🏥'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const response = getResponse(input)
      const botMessage = {
        role: 'assistant',
        content: `${response.message}\n\n🩺 **Especialidad recomendada:** ${response.specialty}\n\n¿Deseas agendar una cita? Puedes hacerlo desde el módulo de Citas Médicas.`
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
    <div className="p-6 h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Chatbot de Orientación</h1>
        <p className="text-slate-500 text-sm">Describe tus síntomas y te orientamos al especialista correcto</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-100 flex flex-col" style={{ height: '600px' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm ${
                m.role === 'user'
                  ? 'bg-primary-600 text-white rounded-br-none'
                  : 'bg-slate-100 text-slate-800 rounded-bl-none'
              }`}>
                {m.content.split('\n').map((line, j) => (
                  <p key={j} className={line.startsWith('🩺') ? 'font-semibold mt-1' : ''}>
                    {line}
                  </p>
                ))}
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
          {['Tengo fiebre', 'Dolor de cabeza', 'Estoy embarazada', 'Mi niño está enfermo'].map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="text-xs bg-primary-50 text-primary-600 px-3 py-1 rounded-full hover:bg-primary-100 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe tus síntomas..."
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-800 transition-colors disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}