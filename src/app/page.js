'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  Phone, 
  User, 
  CheckCircle2, 
  Check,
  Info,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  GraduationCap,
  BookOpen,
  Award,
  MessageCircle,
  Menu,
  X
} from 'lucide-react'

// Informações Detalhadas dos Procedimentos
const informacoesProcedimentos = [
  {
    id: 'limpeza-de-pele',
    title: '1. Limpeza de pele',
    summary: 'Procedimento destinado à higienização profunda da pele, ajudando a remover impurezas, oleosidade, células mortas e cravos.',
    howItWorks: 'A pele é higienizada e preparada, podendo ser utilizados produtos emolientes e técnicas de extração, seguidos de produtos calmantes e finalização com proteção solar.',
    indicatedFor: 'Pele oleosa, acneica, com cravos e aspecto cansado ou congestionado.',
    benefits: 'Melhora da textura, limpeza dos poros, controle da oleosidade e aparência mais uniforme.'
  },
  {
    id: 'microagulhamento',
    title: '2. Microagulhamento',
    summary: 'Técnica que utiliza pequenas agulhas para produzir microperfurações controladas na pele.',
    howItWorks: 'As microperfurações estimulam uma resposta de reparação da pele e favorecem a produção de colágeno e elastina.',
    indicatedFor: 'Cicatrizes de acne, textura irregular, poros aparentes e manchas.',
    benefits: 'Melhora progressiva da textura e firmeza.',
    warning: 'Não deve ser realizado sobre pele com infecção ativa ou inflamação grave.'
  },
  {
    id: 'dermaplaning',
    title: '3. Dermaplaning',
    summary: 'Esfoliação superficial com lâmina apropriada para remoção de células mortas e pelos finos.',
    howItWorks: 'A lâmina é deslizada suavemente sobre a pele promovendo renovação imediata.',
    indicatedFor: 'Pessoas que buscam luminosidade e pele aveludada.',
    benefits: 'Pele lisa, uniforme e melhor fixação de cosméticos.'
  },
  {
    id: 'design-sobrancelhas',
    title: '4. Design de sobrancelhas',
    summary: 'Modelagem de sobrancelhas de acordo com o visagismo facial.',
    howItWorks: 'Avaliação do formato do rosto, medição, remoção do excesso e alinhamento.',
    benefits: 'Harmonia facial e valorização do olhar.'
  },
  {
    id: 'massagem-relaxante',
    title: '5. Massagem relaxante',
    summary: 'Técnica manual para alívio de tensões e relaxamento corporal.',
    howItWorks: 'Movimentos suaves de deslizamento e amassamento com óleos essenciais.',
    benefits: 'Redução do estresse e alívio de tensões musculares.'
  },
  {
    id: 'drenagem-linfatica',
    title: '6. Drenagem linfática',
    summary: 'Massagem suave direcionada ao sistema linfático.',
    howItWorks: 'Movimentos rítmicos que estimulam a eliminação de líquidos retidos.',
    indicatedFor: 'Retenção de líquidos e edemas.',
    benefits: 'Redução de inchaço e melhora da circulação.'
  },
  {
    id: 'perfuracao-lobulo',
    title: '7. Perfuração de lóbulo auricular',
    summary: 'Furo humanizado no lóbulo da orelha.',
    howItWorks: 'Higienização, marcação precisa e perfuração biossegura com joia em titânio.',
    care: 'Seguir cuidados de assepsia durante a cicatrização.',
    warning: 'Realizado com material estéril de uso único.'
  },
  {
    id: 'clareamento-intimo',
    title: '8. Clareamento íntimo',
    summary: 'Tratamento de hiperpigmentação na região íntima externa.',
    howItWorks: 'Aplicação de ativos clareadores suaves e específicos.',
    objective: 'Uniformização da tonalidade da pele.',
    warning: 'Requer avaliação profissional prévia.'
  },
  {
    id: 'tratamento-espinhas-manchas-melasma',
    title: '9. Tratamento de espinhas, manchas e melasma',
    summary: 'Protocolos personalizados para controle de acne e manchas.',
    howItWorks: 'Avaliação clínica para combinação de peelings e fotoproteção.',
    warning: 'Melasma exige controle rigoroso da exposição solar.'
  },
  {
    id: 'terapia-capilar',
    title: '10. Terapia capilar — fortalecimento e crescimento',
    summary: 'Cuidados intensivos para couro cabeludo e fios.',
    howItWorks: 'Higienização, ativos fortalecedores e estímulo de circulação local.',
    objective: 'Fortalecimento e estímulo do crescimento saudável.'
  },
  {
    id: 'botox',
    title: '11. Botox',
    summary: 'Aplicação de toxina botulínica para linhas de expressão.',
    howItWorks: 'Relaxamento muscular temporário nos pontos aplicados.',
    warning: 'Procedimento injetável exclusivo por profissional habilitada.'
  },
  {
    id: 'preenchimento-labial',
    title: '12. Preenchimento labial',
    summary: 'Aplicação de ácido hialurônico nos lábios.',
    howItWorks: 'Injeção estratégica para contorno, volume e hidratação.',
    warning: 'Exige avaliação e técnica precisa de biossegurança.'
  },
  {
    id: 'lipo-enzimatica',
    title: '13. Lipo enzimática',
    summary: 'Aplicação de enzimas para redução de gordura localizada.',
    howItWorks: 'Ativos injetáveis que auxiliam na quebra do tecido adiposo local.',
    warning: 'Não substitui procedimentos cirúrgicos.'
  }
]

// Catálogo de Procedimentos
const procedimentos = [
  { title: 'Limpeza de pele', desc: 'Remoção profunda de cravos e impurezas com extração cuidadosa e hidratação.', image: '/WhatsApp Image 2026-08-31 at 19.54.17 (3).jpeg', category: 'Facial' },
  { title: 'Microagulhamento', desc: 'Estímulo intenso de colágeno para rejuvenescimento, poros dilatados e firmeza.', image: '/WhatsApp Image 2026-08-31 at 19.54.20 (3).jpeg', category: 'Facial' },
  { title: 'Dermaplaning', desc: 'Remoção de células mortas e pelos finos para toque aveludado e brilho imediato.', image: '/WhatsApp Image 2026-08-31 at 19.54.20 (4).jpeg', category: 'Facial' },
  { title: 'Design de sobrancelha', desc: 'Modelagem e alinhamento do olhar com precisão e simetria facial.', image: '/WhatsApp Image 2026-08-31 at 19.54.20 (4).jpeg', category: 'Facial' },
  { title: 'Massagem relaxante', desc: 'Técnicas manuais para alívio de tensões, estresse e bem-estar corporal.', image: '/WhatsApp Image 2026-08-31 at 19.54.20 (1).jpeg', category: 'Corporal' },
  { title: 'Drenagem linfática', desc: 'Estímulo do sistema linfático para redução de inchaço e retenção de líquidos.', image: '/WhatsApp Image 2026-08-31 at 19.54.20 (1).jpeg', category: 'Corporal' },
  { title: 'Perfuração de lóbulo auricular', desc: 'Furo humanizado biosseguro com anestésico local e joias de titânio.', image: '/WhatsApp Image 2026-08-31 at 19.54.19 (4).jpeg', category: 'Body Piercing' },
  { title: 'Clareamento íntimo', desc: 'Protocolos específicos para uniformização e clareamento de regiões hipercromiadas.', image: '/WhatsApp Image 2026-08-31 at 19.54.18 (3).jpeg', category: 'Corporal' },
  { title: 'Tratamento de espinhas, manchas e melasma', desc: 'Controle de acne, redução de hiperpigmentação e uniformização do tom da pele.', image: '/WhatsApp Image 2026-08-31 at 19.54.20 (3).jpeg', category: 'Facial' },
  { title: 'Terapia capilar, fortalecimento e crescimento', desc: 'Estimulação do couro cabeludo para fortalecimento, nutrição e crescimento capilar.', image: '/WhatsApp Image 2026-08-31 at 19.54.18 (4).jpeg', category: 'Capilar' },
  { title: 'Botox', desc: 'Toxina botulínica para prevenção e suavização de linhas de expressão e rugas.', image: '/WhatsApp Image 2026-08-31 at 19.54.16.jpeg', category: 'Injetáveis' },
  { title: 'Preenchimento labial', desc: 'Aplicação de ácido hialurônico para volume, contorno e hidratação dos lábios.', image: '/WhatsApp Image 2026-08-31 at 19.54.20 (2).jpeg', category: 'Injetáveis' },
  { title: 'Lipo enzimática', desc: 'Aplicação de ativos enzimáticos para redução de gordura localizada.', image: '/WhatsApp Image 2026-08-31 at 19.54.20 (1).jpeg', category: 'Corporal' },
  { title: 'Curso de limpeza de pele, dermaplaning e microagulhamento', desc: 'Capacitação profissional presencial VIP com aulas práticas e certificado.', image: '/WhatsApp Image 2026-08-31 at 19.54.17 (4).jpeg', category: 'Cursos VIP' }
]

// Galeria de Mídias
const mediaItems = [
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.19 (4).jpeg', title: 'Perfuração de Trágus', desc: 'Trabalho biosseguro com joia de alta qualidade.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.19 (2).jpeg', title: 'Piercing Auricular & Joalheria', desc: 'Perfurações precisas e delicadas.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.19 (1).jpeg', title: 'Aplicação de Piercing', desc: 'Estética com segurança e conforto.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.17 (2).jpeg', title: 'Aplicação de Piercing Nasal', desc: 'Detalhes que realçam sua beleza.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.19 (3).jpeg', title: 'Estética Facial Masculina', desc: 'Limpeza de pele profunda e controle de oleosidade.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.20 (2).jpeg', title: 'Preenchimento & Hidratação Labial', desc: 'Contorno natural, volume e maciez.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.20 (3).jpeg', title: 'Renovação Cutânea', desc: 'Tratamento focado na uniformização e brilho.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.20 (4).jpeg', title: 'Luminosidade & Rejuvenescimento', desc: 'Pele saudável, hidratada e revigorada.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.16.jpeg', title: 'Rejuvenescimento do Olhar', desc: 'Atenuação de linhas e aspecto descansado.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.16 (1).jpeg', title: 'Tratamento de Expressão Facial', desc: 'Cuidado específico para linhas e marcas.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.17.jpeg', title: 'Tratamento Facial Avançado', desc: 'Protocolos personalizados para cada tipo de pele.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.17 (1).jpeg', title: 'Nutrição & Revitalização', desc: 'Recuperação do viço natural.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.17 (3).jpeg', title: 'Limpeza de Pele Profunda', desc: 'Remoção de impurezas e hidratação.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.17 (4).jpeg', title: 'Cuidados com a Pele', desc: 'Acompanhamento farmacêutico dedicado.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.18 (1).jpeg', title: 'Tratamento Anti-Idade', desc: 'Suavização do sulco nasogeniano.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.18 (3).jpeg', title: 'Revitalização de Olheiras', desc: 'Clareamento e uniformização da região dos olhos.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.18 (4).jpeg', title: 'Tratamento Capilar / Couro Cabeludo', desc: 'Estimulação de crescimento e densidade.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.18.jpeg', title: 'Protocolo de Limpeza Facial', desc: 'Saúde e equilíbrio para sua pele.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.20 (1).jpeg', title: 'Modelagem Corporal & Firmeza', desc: 'Redução de flacidez e definição da região abdominal.' },
  { type: 'image', src: '/WhatsApp Image 2026-08-31 at 19.54.18 (2).jpeg', title: 'Estética Corporal', desc: 'Melhora no contorno e textura da pele.' },
  { type: 'video', src: '/WhatsApp Video 2026-08-31 at 19.54.25 (1).mp4', title: 'Sua Pele Merece Esse Momento', desc: 'Aplicação de máscaras e cuidados calmantes.' },
  { type: 'video', src: '/WhatsApp Video 2026-08-31 at 19.54.26 (1).mp4', title: 'Desperte a Beleza Que Há em Você', desc: 'Sessão prática de Dermaplaning.' },
  { type: 'video', src: '/WhatsApp Video 2026-08-31 at 19.54.26.mp4', title: 'Se Cuide, Você Merece', desc: 'Tratamento com PDRN EXO e cromoterapia.' }
]

const availableTimes = ['09:00', '10:30', '13:30', '15:00', '16:30', '18:00']

const formatDateToISO = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getAvailableDates = () => {
  const dates = []
  const today = new Date()
  let added = 0

  while (added < 6) {
    today.setDate(today.getDate() + 1)
    if (today.getDay() !== 0) {
      const dayName = today.toLocaleDateString('pt-BR', { weekday: 'short' })
      const dayNum = today.getDate()
      const monthName = today.toLocaleDateString('pt-BR', { month: 'short' })
      const fullDateStr = formatDateToISO(today)

      dates.push({
        fullDate: fullDateStr,
        dayName: dayName.replace('.', ''),
        dayNum,
        monthName: monthName.replace('.', ''),
      })
      added++
    }
  }
  return dates
}

export default function Home() {
  const availableDates = getAvailableDates()

  // ESTADOS DE NAVEGAÇÃO RESPONSIVA
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // ESTADO DOS AGENDAMENTOS (BUSCANDO DIRETAMENTE DO SUPABASE)
  const [appointments, setAppointments] = useState([])
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    serviceName: 'Limpeza de pele',
    appointmentDate: availableDates[0]?.fullDate || '',
    appointmentTime: '09:00',
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [openAccordion, setOpenAccordion] = useState(null)

  // Carregar agendamentos do Supabase ao abrir o site
  useEffect(() => {
    fetchAppointmentsFromSupabase()
  }, [])

  const fetchAppointmentsFromSupabase = async () => {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*')

    if (!error && data) {
      setAppointments(data)
    }
  }

  // Verifica se o horário já está ocupado na tabela do Supabase
  const isSlotBooked = (dateStr, timeStr) => {
    return appointments.some(
      (app) => app.appointment_date === dateStr && app.appointment_time === timeStr
    )
  }

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id)
  }

  // Salvar agendamento diretamente no Supabase
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSlotBooked(formData.appointmentDate, formData.appointmentTime)) {
      alert('Atenção: Este horário já foi reservado. Por favor escolha outro.')
      return
    }

    const { error } = await supabase
      .from('agendamentos')
      .insert([
        {
          full_name: formData.fullName,
          phone: formData.phone || '(00) 00000-0000',
          service_name: formData.serviceName,
          appointment_date: formData.appointmentDate,
          appointment_time: formData.appointmentTime,
          status: 'Confirmado'
        }
      ])

    if (error) {
      alert('Erro ao realizar o agendamento: ' + error.message)
    } else {
      setIsSubmitted(true)
      fetchAppointmentsFromSupabase() // Atualiza os horários ocupados em tempo real
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans relative overflow-x-hidden">
      
      {/* CABEÇALHO RESPONSIVO */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-rose-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Thaysa Pereira" className="h-10 sm:h-12 w-auto object-contain" />
            <div>
              <span className="text-base sm:text-lg font-bold text-gray-900 block leading-tight">Thaysa Pereira</span>
              <span className="text-[10px] sm:text-xs text-rose-600 font-semibold uppercase tracking-wider">Farmacêutica Esteta</span>
            </div>
          </div>

          {/* MENU DESKTOP */}
          <nav className="hidden lg:flex items-center gap-5 font-medium text-sm text-gray-600">
            <a href="#procedimentos" className="hover:text-rose-600 transition-colors">Procedimentos</a>
            <a href="#galeria" className="hover:text-rose-600 transition-colors">Galeria</a>
            <a href="#cursos" className="hover:text-rose-600 transition-colors flex items-center gap-1 font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200">
              <GraduationCap className="w-4 h-4" /> Cursos VIP
            </a>
            <a href="#informacoes" className="hover:text-rose-600 transition-colors flex items-center gap-1">
              <Info className="w-4 h-4 text-rose-600" /> Informações
            </a>
            <div className="flex items-center gap-2">
              <a href="#agendar" className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-full transition-all shadow-md">
                Agendar Horário
              </a>
              <a 
                href="https://wa.me/5535991914285?text=Olá%20Dra.%20Thaysa,%20gostaria%20de%20tirar%20uma%20dúvida!" 
                target="_blank" 
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-full transition-all shadow-md flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" /> Fale Conosco
              </a>
            </div>
          </nav>

          {/* BOTÃO HAMBÚRGUER MOBILE */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-rose-600 transition-colors focus:outline-none"
            aria-label="Abrir Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* MENU SLIDE MOBILE */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-rose-100 px-6 py-4 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
            <a 
              href="#procedimentos" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-medium text-gray-700 hover:text-rose-600 py-1"
            >
              Procedimentos
            </a>
            <a 
              href="#galeria" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-medium text-gray-700 hover:text-rose-600 py-1"
            >
              Galeria
            </a>
            <a 
              href="#cursos" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-bold text-rose-600 py-1 flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4" /> Cursos VIP
            </a>
            <a 
              href="#informacoes" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block font-medium text-gray-700 hover:text-rose-600 py-1 flex items-center gap-2"
            >
              <Info className="w-4 h-4 text-rose-600" /> Informações
            </a>
            <div className="pt-2 space-y-2">
              <a 
                href="#agendar" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-rose-600 text-white font-bold py-3 rounded-xl text-center block shadow-md"
              >
                Agendar Horário
              </a>
              <a 
                href="https://wa.me/5535991914285?text=Olá%20Dra.%20Thaysa,%20gostaria%20de%20tirar%20uma%20dúvida!" 
                target="_blank" 
                rel="noreferrer"
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-center flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-5 h-5" /> Fale Conosco
              </a>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-rose-50 via-pink-50/50 to-slate-50 py-12 md:py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="mb-6">
            <img src="/logo.png" alt="Thaysa Pereira" className="h-24 sm:h-32 md:h-36 w-auto drop-shadow-md" />
          </div>
          <span className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 text-xs md:text-sm font-bold tracking-wider px-4 py-1.5 rounded-full uppercase mb-6 border border-rose-200">
            <Sparkles className="w-4 h-4 text-rose-600" /> Especialista em estética
          </span>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4 sm:mb-6">
            Realce sua beleza natural com <span className="text-rose-600">cuidados delicados</span>, ciência e elegância
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mb-8 leading-relaxed">
            Procedimentos faciais, injetáveis de alta precisão, estética corporal, furo humanizado e capacitação técnica ministrada por profissional Farmacêutica Cosmetóloga.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full justify-center max-w-md">
            <a href="#agendar" className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-8 rounded-full shadow-lg transition-all text-center">
              Reservar Meu Horário
            </a>
            <a 
              href="https://wa.me/5535991914285?text=Olá%20Dra.%20Thaysa,%20gostaria%20de%20tirar%20uma%20dúvida!" 
              target="_blank" 
              rel="noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-full shadow-md transition-all text-center flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" /> Fale Conosco
            </a>
          </div>
        </div>
      </section>

      {/* CATÁLOGO DE PROCEDIMENTOS */}
      <section id="procedimentos" className="py-16 md:py-20 px-4 bg-white border-t border-rose-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-rose-600 font-bold text-xs md:text-sm tracking-widest uppercase mb-2 block">
              Catálogo de Serviços & Cursos
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 uppercase tracking-wide">
              Nossos Procedimentos
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-rose-600 mx-auto mt-3 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {procedimentos.map((proc, idx) => (
              <div 
                key={idx}
                className="bg-slate-50 rounded-2xl overflow-hidden border border-rose-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-900">
                  <img 
                    src={proc.image} 
                    alt={proc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {proc.category}
                  </span>
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors">
                      {proc.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
                      {proc.desc}
                    </p>
                  </div>
                  <a
                    href="#agendar"
                    onClick={() => setFormData({ ...formData, serviceName: proc.title })}
                    className="w-full bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-bold py-2.5 rounded-xl border border-rose-200 transition-all text-center text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    Agendar Este Procedimento
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" className="py-16 md:py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-rose-600 font-bold text-xs md:text-sm tracking-widest uppercase mb-2 block">Portfólio Real</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 uppercase tracking-wide">
              Galeria de Resultados
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-rose-600 mx-auto mt-3 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {mediaItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-2 border-rose-100 flex flex-col group"
              >
                <div className="relative w-full h-64 sm:h-80 bg-gray-900 overflow-hidden flex items-center justify-center">
                  {item.type === 'video' ? (
                    <video controls muted loop preload="metadata" className="w-full h-full object-cover">
                      <source src={item.src} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                </div>
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between text-center bg-white">
                  <h3 className="text-base sm:text-lg font-bold text-rose-600 mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CURSOS VIP */}
      <section id="cursos" className="py-16 md:py-20 px-4 bg-gradient-to-b from-white via-rose-50/30 to-white border-t border-rose-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 border border-rose-200">
              <GraduationCap className="w-4 h-4 text-rose-600" /> Capacitação Profissional VIP
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 uppercase tracking-wide">
              Curso Prático de Estética
            </h2>
            <div className="w-20 sm:w-24 h-1 bg-rose-600 mx-auto mt-3 rounded-full"></div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border-2 border-rose-200 shadow-xl space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-100 pb-8 text-center md:text-left">
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                  Curso de Limpeza de Pele, Dermaplaning e Microagulhamento
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Treinamento VIP presencial com aulas práticas direcionadas para a área da estética facial.
                </p>
              </div>
              <a
                href="#agendar"
                onClick={() => setFormData({ ...formData, serviceName: 'Curso de limpeza de pele, dermaplaning e microagulhamento' })}
                className="w-full md:w-auto bg-rose-600 hover:bg-rose-700 text-white font-extrabold px-8 py-4 rounded-2xl transition-all shadow-lg text-center flex-shrink-0"
              >
                Garantir Minha Vaga
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-rose-50/60 p-6 rounded-2xl border border-rose-200">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-rose-600" />
                  <h4 className="font-extrabold text-gray-900 text-sm sm:text-base">Módulo 1 — Limpeza de Pele</h4>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-700 font-medium">
                  <li>✓ Avaliação dos tipos de pele</li>
                  <li>✓ Higienização e esfoliação</li>
                  <li>✓ Emoliência e extração</li>
                  <li>✓ Máscaras e tonificação</li>
                </ul>
              </div>

              <div className="bg-rose-50/60 p-6 rounded-2xl border border-rose-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-rose-600" />
                  <h4 className="font-extrabold text-gray-900 text-sm sm:text-base">Módulo 2 — Dermaplaning</h4>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-700 font-medium">
                  <li>✓ Conceito e finalidade</li>
                  <li>✓ Avaliação da pele</li>
                  <li>✓ Preparação e técnica prática</li>
                  <li>✓ Cuidados pré e pós</li>
                </ul>
              </div>

              <div className="bg-rose-50/60 p-6 rounded-2xl border border-rose-200">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-rose-600" />
                  <h4 className="font-extrabold text-gray-900 text-sm sm:text-base">Módulo 3 — Microagulhamento</h4>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-700 font-medium">
                  <li>✓ Princípios da técnica</li>
                  <li>✓ Indicações e avaliação</li>
                  <li>✓ Biossegurança estrita</li>
                  <li>✓ Orientação ao cliente</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFORMAÇÕES DETALHADAS */}
      <section id="informacoes" className="py-16 md:py-20 px-4 bg-rose-50/50 border-t border-rose-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-rose-600 font-bold text-xs md:text-sm tracking-widest uppercase mb-2 block flex items-center justify-center gap-1">
              <Info className="w-4 h-4" /> Guia Técnico e Orientações
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 uppercase tracking-wide">
              Informações Detalhadas dos Procedimentos
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-rose-600 mx-auto mt-3 rounded-full"></div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {informacoesProcedimentos.map((info) => {
              const isOpen = openAccordion === info.id
              return (
                <div 
                  key={info.id}
                  className="bg-white rounded-2xl border border-rose-200 shadow-sm overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleAccordion(info.id)}
                    className="w-full p-4 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-rose-50/50 transition-colors"
                  >
                    <div>
                      <h3 className="text-base sm:text-xl font-bold text-gray-900">{info.title}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1">{info.summary}</p>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-rose-600 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="p-4 sm:p-6 pt-0 border-t border-gray-100 space-y-4 text-xs sm:text-sm text-gray-700 bg-slate-50/50">
                      {info.howItWorks && <div><strong className="text-rose-700 block mb-1">Como funciona:</strong><p>{info.howItWorks}</p></div>}
                      {info.indicatedFor && <div><strong className="text-rose-700 block mb-1">Indicado para:</strong><p>{info.indicatedFor}</p></div>}
                      {info.benefits && <div><strong className="text-rose-700 block mb-1">Benefícios:</strong><p>{info.benefits}</p></div>}
                      {info.warning && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 sm:p-4 rounded-xl flex items-start gap-3">
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-xs">{info.warning}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* SEÇÃO DE AGENDAMENTO CLIENTE */}
      <section id="agendar" className="py-16 md:py-20 px-4 bg-rose-50/60 border-t border-rose-100">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-rose-100">
          
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-rose-600 font-bold text-xs md:text-sm tracking-widest uppercase block mb-1">
              Sistema de Reserva Oficial
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900">
              Escolha Seu Dia e Horário Exclusivo
            </h2>
          </div>

          {isSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-6 sm:p-8 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-600 mx-auto" />
              <h3 className="text-xl sm:text-2xl font-bold">Agendamento Confirmado com Sucesso!</h3>
              <p className="text-xs sm:text-base max-w-lg mx-auto">
                Obrigado, <strong>{formData.fullName}</strong>. Seu horário para <strong>{formData.serviceName}</strong> foi reservado no dia{' '}
                <strong>{formData.appointmentDate.split('-').reverse().join('/')}</strong> às <strong>{formData.appointmentTime}</strong>.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="bg-rose-600 text-white font-bold px-6 py-2.5 rounded-full hover:bg-rose-700 transition-all text-xs sm:text-sm mt-4"
              >
                Reservar Outro Horário
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-rose-600" /> Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-rose-600" /> Telefone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(35) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">Procedimento Desejado</label>
                <select
                  value={formData.serviceName}
                  onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all text-xs sm:text-sm bg-white"
                >
                  {procedimentos.map((p, i) => (
                    <option key={i} value={p.title}>{p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-rose-600" /> Selecione o Dia Disponível
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                  {availableDates.map((d) => {
                    const isSelected = formData.appointmentDate === d.fullDate
                    return (
                      <button
                        type="button"
                        key={d.fullDate}
                        onClick={() => setFormData({ ...formData, appointmentDate: d.fullDate })}
                        className={`p-2 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-rose-600 text-white border-rose-600 shadow-md scale-105'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300 hover:bg-rose-50/50'
                        }`}
                      >
                        <span className="text-[10px] sm:text-xs uppercase font-semibold opacity-80">{d.dayName}</span>
                        <span className="text-lg sm:text-xl font-extrabold">{d.dayNum}</span>
                        <span className="text-[10px] sm:text-xs uppercase">{d.monthName}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-rose-600" /> Horários Disponíveis
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                  {availableTimes.map((time) => {
                    const booked = isSlotBooked(formData.appointmentDate, time)
                    const isSelected = formData.appointmentTime === time && !booked

                    return (
                      <button
                        type="button"
                        key={time}
                        disabled={booked}
                        onClick={() => setFormData({ ...formData, appointmentTime: time })}
                        className={`py-2 px-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                          booked
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300 hover:bg-rose-50/50'
                        }`}
                      >
                        {booked ? `${time}` : time}
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3.5 sm:py-4 rounded-2xl shadow-lg transition-all text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" /> Finalizar e Reservar Meu Horário
              </button>

            </form>
          )}

        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="bg-gray-900 text-white py-10 px-4 text-center border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs sm:text-sm text-gray-300 font-medium">
            &copy; Thaysa Pereira - Farmacêutica Esteta e Cosmetóloga. Todos os direitos reservados.
          </p>
        </div>
      </footer>

    </main>
  )
}