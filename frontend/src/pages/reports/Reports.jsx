import { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import api from '../../services/api'
import Toast from '../../components/Toast'
import useToast from '../../hooks/useToast'

export default function Reports() {
  const { darkMode } = useTheme()
  const { toast, showToast, hideToast } = useToast()
  const [loading, setLoading] = useState(null)
  const [stats, setStats] = useState(null)
  const token = localStorage.getItem('token')
  const API = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [patientsRes, appointmentsRes, doctorsRes] = await Promise.all([
        api.get('/patients'),
        api.get('/appointments'),
        api.get('/doctors')
      ])
      const appointments = appointmentsRes.data
      setStats({
        totalPatients: patientsRes.data.length,
        totalAppointments: appointments.length,
        totalDoctors: doctorsRes.data.length,
        atendidas: appointments.filter(a => a.status === 'atendida').length,
        pendientes: appointments.filter(a => a.status === 'pendiente').length,
        canceladas: appointments.filter(a => a.status === 'cancelada').length,
        confirmadas: appointments.filter(a => a.status === 'confirmada').length,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const downloadPDF = async (type) => {
    setLoading(`pdf-${type}`)
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
      showToast('Reporte PDF descargado correctamente', 'success')
    } catch (error) {
      showToast('Error al generar el reporte PDF', 'error')
    } finally {
      setLoading(null)
    }
  }

  const downloadExcel = async (type) => {
    setLoading(`excel-${type}`)
    try {
      const response = await fetch(`${API}/reports/${type}/excel`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `reporte-${type}-${new Date().toISOString().split('T')[0]}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
      showToast('Reporte Excel descargado correctamente', 'success')
    } catch (error) {
      showToast('Error al generar el reporte Excel', 'error')
    } finally {
      setLoading(null)
    }
  }

  const reports = [
    {
      type: 'patients',
      icon: '👥',
      title: 'Reporte de Pacientes',
      description: 'Lista completa con DNI, N° historial, teléfono, email, género, origen y fecha de registro',
      color: darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-100',
      iconBg: 'bg-blue-100 text-blue-600',
    },
    {
      type: 'appointments',
      icon: '📅',
      title: 'Reporte de Citas',
      description: 'Historial completo con paciente, doctor, especialidad, consultorio, fecha, hora y estado',
      color: darkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-100',
      iconBg: 'bg-green-100 text-green-600',
    },
    {
      type: 'doctors',
      icon: '👨‍⚕️',
      title: 'Reporte de Médicos',
      description: 'Lista de médicos con especialidad, CMP y datos de contacto',
      color: darkMode ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-100',
      iconBg: 'bg-purple-100 text-purple-600',
    },
    {
      type: 'specialties',
      icon: '🩺',
      title: 'Reporte por Especialidad',
      description: 'Total de citas atendidas por cada especialidad médica',
      color: darkMode ? 'bg-teal-900/20 border-teal-700' : 'bg-teal-50 border-teal-100',
      iconBg: 'bg-teal-100 text-teal-600',
    },
    {
      type: 'summary',
      icon: '📊',
      title: 'Resumen del Mes',
      description: 'Estadísticas generales: pacientes, citas atendidas, canceladas y pendientes del mes actual',
      color: darkMode ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-100',
      iconBg: 'bg-orange-100 text-orange-600',
    },
  ]

  const cardClass = `rounded-2xl border p-5 transition-all hover:shadow-md`

  return (
    <div className={`p-6 min-h-full transition-colors ${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>

      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Informes</h1>
        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
          Exporta informes en formato PDF o Excel
        </p>
      </div>

      {/* Stats rápidas */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Pacientes', value: stats.totalPatients, color: 'text-blue-600', bg: darkMode ? 'bg-blue-900/20' : 'bg-blue-50' },
            { label: 'Total Citas', value: stats.totalAppointments, color: 'text-green-600', bg: darkMode ? 'bg-green-900/20' : 'bg-green-50' },
            { label: 'Atendidas', value: stats.atendidas, color: 'text-teal-600', bg: darkMode ? 'bg-teal-900/20' : 'bg-teal-50' },
            { label: 'Médicos', value: stats.totalDoctors, color: 'text-purple-600', bg: darkMode ? 'bg-purple-900/20' : 'bg-purple-50' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-4 border ${s.bg} ${darkMode ? 'border-gray-700' : 'border-white'}`}>
              <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{s.label}</p>
              <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reportes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r) => (
          <div key={r.type} className={`${cardClass} ${r.color}`}>
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${r.iconBg}`}>
                {r.icon}
              </div>
              <div className="flex-1">
                <h2 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{r.title}</h2>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{r.description}</p>
              </div>
            </div>

            {/* Botones descarga */}
            <div className="flex gap-2">
              <button
                onClick={() => downloadPDF(r.type)}
                disabled={loading === `pdf-${r.type}`}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${darkMode
                    ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}>
                {loading === `pdf-${r.type}` ? (
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
                PDF
              </button>

              <button
                onClick={() => downloadExcel(r.type)}
                disabled={loading === `excel-${r.type}`}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 ${darkMode
                    ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}>
                {loading === `excel-${r.type}` ? (
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                Excel
              </button>
            </div>
          </div>
        ))}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </div>
  )
}