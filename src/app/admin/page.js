'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Users, 
  CalendarDays, 
  LayoutDashboard, 
  CheckCircle2, 
  CalendarCheck, 
  Search, 
  Phone, 
  Plus, 
  RefreshCw, 
  LogOut, 
  ExternalLink
} from 'lucide-react'

const procedimentos = [
  { title: 'Limpeza de pele' },
  { title: 'Microagulhamento' },
  { title: 'Dermaplaning' },
  { title: 'Design de sobrancelha' },
  { title: 'Massagem relaxante' },
  { title: 'Drenagem linfática' },
  { title: 'Perfuração de lóbulo auricular' },
  { title: 'Clareamento íntimo' },
  { title: 'Tratamento de espinhas, manchas e melasma' },
  { title: 'Terapia capilar, fortalecimento e crescimento' },
  { title: 'Botox' },
  { title: 'Preenchimento labial' },
  { title: 'Lipo enzimática' },
  { title: 'Curso de limpeza de pele, dermaplaning e microagulhamento' }
]

const availableTimes = ['09:00', '10:30', '13:30', '15:00', '16:30', '18:00']

const formatDateToISO = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getWeekDays = () => {
  const days = []
  const today = new Date()
  const currentDayOfWeek = today.getDay()
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek
  
  const monday = new Date(today)
  monday.setDate(today.getDate() + distanceToMonday)

  const dayNames = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM']

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    
    const dateStr = formatDateToISO(d)
    const dayNum = String(d.getDate()).padStart(2, '0')
    const monthNum = String(d.getMonth() + 1).padStart(2, '0')

    days.push({
      dateStr,
      dayName: dayNames[i],
      dayNum,
      monthNum,
      fullDisplay: `${dayNum}/${monthNum}`
    })
  }
  return days
}

export default function AdminPage() {
  const [appointments, setAppointments] = useState([])
  const [searchPatient, setSearchPatient] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeAdminTab, setActiveAdminTab] = useState('agenda')

  const [adminNewApp, setAdminNewApp] = useState({
    fullName: '',
    phone: '',
    serviceName: 'Limpeza de pele',
    appointmentDate: formatDateToISO(new Date()),
    appointmentTime: '09:00',
  })

  useEffect(() => {
    const checkUserAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)

      if (session?.user) {
        fetchAppointments()
      }
    }

    checkUserAndFetch()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        fetchAppointments()
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const fetchAppointments = async () => {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setAppointments(data)
    }
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert('Erro ao efetuar login: ' + error.message)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Concluído' ? 'Confirmado' : 'Concluído'
    const { error } = await supabase
      .from('agendamentos')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) {
      fetchAppointments()
    }
  }

  const handleDeleteAppointment = async (id) => {
    if (confirm('Tem certeza que deseja cancelar este atendimento?')) {
      const { error } = await supabase
        .from('agendamentos')
        .delete()
        .eq('id', id)

      if (!error) {
        fetchAppointments()
      }
    }
  }

  const handleAdminAddAppointment = async (e) => {
    e.preventDefault()
    if (!adminNewApp.fullName || !adminNewApp.appointmentDate) return

    const { error } = await supabase
      .from('agendamentos')
      .insert([
        {
          full_name: adminNewApp.fullName,
          phone: adminNewApp.phone || '(00) 00000-0000',
          service_name: adminNewApp.serviceName,
          appointment_date: adminNewApp.appointmentDate,
          appointment_time: adminNewApp.appointmentTime,
          status: 'Confirmado'
        }
      ])

    if (error) {
      alert('Erro ao criar agendamento.')
    } else {
      setAdminNewApp({ ...adminNewApp, fullName: '', phone: '' })
      fetchAppointments()
    }
  }

  const currentWeekDays = getWeekDays()
  const weekDateStrings = currentWeekDays.map(d => d.dateStr)
  const currentWeekAppointments = appointments.filter(app => weekDateStrings.includes(app.appointment_date))

  const filteredAppointments = appointments.filter(a => 
    a.full_name?.toLowerCase().includes(searchPatient.toLowerCase()) ||
    a.phone?.includes(searchPatient) ||
    a.service_name?.toLowerCase().includes(searchPatient.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-gray-600">
        Carregando sistema...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-100/50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 bg-white p-8 rounded-3xl shadow-xl border border-rose-200">
          <img src="/logo.png" alt="Thaysa Pereira" className="h-20 w-auto mx-auto object-contain" />
          <div>
            <h3 className="text-2xl font-extrabold text-gray-900">Painel Administrativo</h3>
            <p className="text-xs text-rose-600 font-semibold mt-1">Autenticação Segura via Supabase</p>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input
              type="email"
              required
              placeholder="E-mail cadastrado"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-rose-200 text-sm font-medium text-gray-800 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
            />
            <input
              type="password"
              required
              placeholder="Sua senha de acesso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-rose-200 text-sm font-medium text-gray-800 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
            />
            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all"
            >
              Autenticar e Entrar
            </button>
          </form>
          <a
            href="/"
            className="text-xs text-gray-500 hover:text-rose-600 transition-colors block"
          >
            ← Voltar ao site do cliente
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-sans">
      
      {/* MENU LATERAL ADMIN */}
      <aside className="w-full lg:w-64 bg-rose-50/90 text-gray-800 flex flex-col justify-between p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-rose-200/80 flex-shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Thaysa Pereira" className="h-10 w-auto object-contain" />
            <div>
              <h2 className="font-extrabold text-gray-900 text-sm leading-tight">Thaysa Pereira</h2>
              <span className="text-[10px] text-rose-600 block tracking-wider uppercase font-bold">Painel de Gestão</span>
            </div>
          </div>

          <nav className="flex lg:flex-col gap-2 text-xs font-bold overflow-x-auto pb-2 lg:pb-0">
            <button
              onClick={() => setActiveAdminTab('visao')}
              className={`flex-1 lg:w-full flex items-center justify-center lg:justify-between px-4 py-3 rounded-2xl transition-all flex-shrink-0 ${
                activeAdminTab === 'visao' ? 'bg-rose-600 text-white shadow-md' : 'hover:bg-rose-100/80 text-gray-600'
              }`}
            >
              <span className="flex items-center gap-2"><LayoutDashboard className="w-4 h-4" /> Visão geral</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('pacientes')}
              className={`flex-1 lg:w-full flex items-center justify-center lg:justify-between px-4 py-3 rounded-2xl transition-all flex-shrink-0 ${
                activeAdminTab === 'pacientes' ? 'bg-rose-600 text-white shadow-md' : 'hover:bg-rose-100/80 text-gray-600'
              }`}
            >
              <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Pacientes</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                activeAdminTab === 'pacientes' ? 'bg-white text-rose-600' : 'bg-rose-200 text-rose-800'
              }`}>
                {appointments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveAdminTab('agenda')}
              className={`flex-1 lg:w-full flex items-center justify-center lg:justify-between px-4 py-3 rounded-2xl transition-all flex-shrink-0 ${
                activeAdminTab === 'agenda' ? 'bg-rose-600 text-white shadow-md' : 'hover:bg-rose-100/80 text-gray-600'
              }`}
            >
              <span className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Agenda</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                activeAdminTab === 'agenda' ? 'bg-white text-rose-600' : 'bg-rose-200 text-rose-800'
              }`}>
                {currentWeekAppointments.length}
              </span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-rose-200 flex items-center justify-between text-xs font-semibold">
          <a
            href="/"
            className="text-gray-600 hover:text-rose-600 flex items-center gap-1 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Ir ao Site
          </a>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sair
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL DO ADMIN */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-white overflow-y-auto">
        
        {/* ABA 01: VISÃO GERAL */}
        {activeAdminTab === 'visao' && (
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block">PAINEL EXECUTIVO</span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900">Visão Geral do Consultório</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-rose-50/80 p-5 rounded-2xl border border-rose-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-600">Total de Pacientes</span>
                  <Users className="w-5 h-5 text-rose-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">{appointments.length}</p>
                <span className="text-[10px] text-gray-500 mt-1 block">Atendimentos cadastrados</span>
              </div>

              <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-800">Concluídos</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-900">
                  {appointments.filter(a => a.status === 'Concluído').length}
                </p>
                <span className="text-[10px] text-emerald-700 mt-1 block">Sessões finalizadas</span>
              </div>

              <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-800">Confirmados</span>
                  <CalendarCheck className="w-5 h-5 text-amber-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-900">
                  {appointments.filter(a => a.status !== 'Concluído').length}
                </p>
                <span className="text-[10px] text-amber-700 mt-1 block">Aguardando atendimento</span>
              </div>
            </div>

            <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-200 space-y-4">
              <h3 className="font-extrabold text-gray-900 text-base sm:text-lg">Próximos Agendamentos</h3>
              {appointments.length === 0 ? (
                <p className="text-xs text-gray-500 italic">Nenhum atendimento na lista.</p>
              ) : (
                <div className="space-y-3">
                  {appointments.slice(0, 5).map(app => (
                    <div key={app.id} className="bg-white p-3.5 sm:p-4 rounded-xl border border-rose-100 flex items-center justify-between gap-4 shadow-sm">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900">{app.full_name}</h4>
                        <p className="text-[11px] sm:text-xs text-gray-500">{app.service_name} • {app.appointment_date.split('-').reverse().join('/')} às {app.appointment_time}</p>
                      </div>
                      <span className={`text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        app.status === 'Concluído' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {app.status || 'CONFIRMADO'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA 02: PACIENTES */}
        {activeAdminTab === 'pacientes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block">GESTÃO DE CLIENTES</span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900">Lista de Pacientes</h1>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar paciente ou procedimento..."
                  value={searchPatient}
                  onChange={(e) => setSearchPatient(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-rose-200 text-xs focus:outline-none focus:border-rose-500 bg-rose-50/30"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-rose-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700 min-w-[600px]">
                  <thead className="bg-rose-50 text-rose-900 font-bold border-b border-rose-200">
                    <tr>
                      <th className="p-3 sm:p-4">Paciente</th>
                      <th className="p-3 sm:p-4">Telefone / WhatsApp</th>
                      <th className="p-3 sm:p-4">Procedimento</th>
                      <th className="p-3 sm:p-4">Data & Horário</th>
                      <th className="p-3 sm:p-4">Status</th>
                      <th className="p-3 sm:p-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-100">
                    {filteredAppointments.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-gray-400 italic">
                          Nenhum paciente localizado.
                        </td>
                      </tr>
                    ) : (
                      filteredAppointments.map((app) => (
                        <tr key={app.id} className="hover:bg-rose-50/40 transition-colors">
                          <td className="p-3 sm:p-4 font-bold text-gray-900">{app.full_name}</td>
                          <td className="p-3 sm:p-4">
                            {app.phone ? (
                              <a 
                                href={`https://wa.me/55${app.phone.replace(/\D/g, '')}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-emerald-600 font-bold hover:underline flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3" /> {app.phone}
                              </a>
                            ) : '-'}
                          </td>
                          <td className="p-3 sm:p-4 font-medium">{app.service_name}</td>
                          <td className="p-3 sm:p-4 font-bold text-gray-900">
                            {app.appointment_date.split('-').reverse().join('/')} às {app.appointment_time}
                          </td>
                          <td className="p-3 sm:p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              app.status === 'Concluído' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {app.status || 'CONFIRMADO'}
                            </span>
                          </td>
                          <td className="p-3 sm:p-4 text-right space-x-2">
                            <button
                              onClick={() => handleToggleStatus(app.id, app.status)}
                              className="text-rose-600 font-bold hover:underline"
                            >
                              {app.status === 'Concluído' ? 'Reabrir' : 'Concluir'}
                            </button>
                            <button
                              onClick={() => handleDeleteAppointment(app.id)}
                              className="text-red-500 font-bold hover:underline"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ABA 03: AGENDA */}
        {activeAdminTab === 'agenda' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block">AGENDA SEMANAL</span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900">
                  {currentWeekDays[0].fullDisplay} — {currentWeekDays[6].fullDisplay}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  <strong>{currentWeekAppointments.length}</strong> atendimento(s) nesta semana ({appointments.length} total salvos).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={fetchAppointments}
                  className="px-3 py-2 rounded-xl border border-rose-300 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors shadow-sm flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Atualizar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              
              {/* COLUNAS SEMANAIS */}
              <div className="xl:col-span-3 bg-rose-50/50 p-3 sm:p-4 rounded-3xl border border-rose-200/80 overflow-x-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3 min-w-[700px] md:min-w-0">
                  {currentWeekDays.map((day) => {
                    const dayApps = appointments.filter(a => a.appointment_date === day.dateStr)

                    return (
                      <div key={day.dateStr} className="bg-white rounded-2xl p-3 flex flex-col justify-start min-h-[260px] border border-rose-100 shadow-sm">
                        <div className="border-b border-rose-100 pb-2 mb-3 text-center">
                          <span className="text-[11px] font-extrabold text-rose-600 uppercase block">{day.dayName}</span>
                          <span className="text-2xl font-extrabold text-gray-900 leading-none">{day.dayNum}</span>
                          <span className="text-[10px] text-gray-400 block">{day.monthNum}</span>
                        </div>

                        <div className="space-y-3 flex-1">
                          {dayApps.length === 0 ? (
                            <span className="text-xs text-gray-400 block text-center py-8 italic">Livre</span>
                          ) : (
                            dayApps.map((app) => (
                              <div 
                                key={app.id}
                                className="bg-rose-50/80 p-3 rounded-2xl border border-rose-200 text-left flex flex-col justify-between space-y-2 shadow-sm hover:shadow-md transition-all"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="text-xs font-extrabold text-gray-900">{app.appointment_time}</span>
                                    {app.phone && (
                                      <a 
                                        href={`https://wa.me/55${app.phone.replace(/\D/g, '')}`} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="text-emerald-600 hover:text-emerald-700 font-extrabold text-[10px]"
                                      >
                                        WhatsApp
                                      </a>
                                    )}
                                  </div>

                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block ${
                                    app.status === 'Concluído' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-200 text-rose-900'
                                  }`}>
                                    {app.status || 'CONFIRMADO'}
                                  </span>

                                  <h4 className="font-extrabold text-xs text-gray-900 capitalize leading-snug break-words">{app.full_name}</h4>
                                  <p className="text-[11px] text-gray-600 leading-tight break-words">{app.service_name}</p>
                                </div>

                                <div className="pt-2 border-t border-rose-200 flex items-center justify-between gap-1 text-[10px]">
                                  <button
                                    onClick={() => handleToggleStatus(app.id, app.status)}
                                    className="text-rose-700 hover:text-rose-900 font-bold"
                                  >
                                    {app.status === 'Concluído' ? 'Reabrir' : 'CONCLUIR'}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAppointment(app.id)}
                                    className="text-red-500 hover:text-red-700 font-bold"
                                  >
                                    CANCELAR
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* PAINEL LATERAL DE NOVO ATENDIMENTO */}
              <div className="bg-rose-50/80 text-gray-900 p-5 sm:p-6 rounded-3xl border border-rose-200/80 shadow-md flex flex-col justify-between space-y-6">
                <form onSubmit={handleAdminAddAppointment} className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block">NOVO ATENDIMENTO</span>
                    <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">Agendar na Agenda</h3>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">PACIENTE</label>
                    <input
                      type="text"
                      required
                      placeholder="Nome do paciente"
                      value={adminNewApp.fullName}
                      onChange={(e) => setAdminNewApp({ ...adminNewApp, fullName: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-rose-200 text-xs text-gray-800 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">TELEFONE / WHATSAPP</label>
                    <input
                      type="tel"
                      placeholder="(35) 00000-0000"
                      value={adminNewApp.phone}
                      onChange={(e) => setAdminNewApp({ ...adminNewApp, phone: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-rose-200 text-xs text-gray-800 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">DATA</label>
                      <input
                        type="date"
                        required
                        value={adminNewApp.appointmentDate}
                        onChange={(e) => setAdminNewApp({ ...adminNewApp, appointmentDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs text-gray-800 outline-none focus:border-rose-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">HORÁRIO</label>
                      <select
                        value={adminNewApp.appointmentTime}
                        onChange={(e) => setAdminNewApp({ ...adminNewApp, appointmentTime: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-rose-200 text-xs text-gray-800 outline-none focus:border-rose-500"
                      >
                        {availableTimes.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">SERVIÇO</label>
                    <select
                      value={adminNewApp.serviceName}
                      onChange={(e) => setAdminNewApp({ ...adminNewApp, serviceName: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-rose-200 text-xs text-gray-800 outline-none focus:border-rose-500"
                    >
                      {procedimentos.map((p, i) => (
                        <option key={i} value={p.title}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 mt-4"
                  >
                    <Plus className="w-4 h-4" /> Adicionar à Agenda
                  </button>
                </form>

                <div className="border-t border-rose-200 pt-4 text-[10px] text-gray-500 space-y-1">
                  <strong className="text-rose-700 block mb-1">Atendimento do Consultório</strong>
                  <p>SEG-SEX: 08:00 às 18:00</p>
                  <p>SÁB: Atendimentos agendados</p>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  )
}