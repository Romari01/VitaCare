import { useState } from 'react'

export default function Reports() {
  const [loading, setLoading] = useState(null)
  const token = localStorage.getItem('token')
  const API = import.meta.env.VITE_API_URL

  const downloadReport = async (type) => {
    setLoading(type)
    try {
      const response = await fetch(`${API}/reports/${type}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte-${type}-${new Date().toISOString().split('T')[0]}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert('Error al generar el reporte')
    } finally {
      setLoading(null)
    }
  }

  const reports = [
    {
      type: 'patients',
      icon: '👥',
      title: 'Reporte de Pacientes',
      description: 'Lista completa de pacientes registrados con datos personales',
      color: 'bg-blue-50 border-blue-100'
    },
    {
      type: 'appointments',
      icon: '📅',
      title: 'Reporte de Citas',
      description: 'Historial de citas médicas con estado y detalles',
      color: 'bg-green-50 border-green-100'
    }
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Reportes</h1>
        <p className="text-slate-500 text-sm">Exporta reportes en formato PDF</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r) => (
          <div key={r.type} className={`rounded-2xl border p-6 ${r.color}`}>
            <div className="text-4xl mb-3">{r.icon}</div>
            <h2 className="text-lg font-bold text-slate-800 mb-1">{r.title}</h2>
            <p className="text-sm text-slate-500 mb-4">{r.description}</p>
            <button
              onClick={() => downloadReport(r.type)}
              disabled={loading === r.type}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {loading === r.type ? 'Generando...' : '⬇️ Descargar PDF'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}