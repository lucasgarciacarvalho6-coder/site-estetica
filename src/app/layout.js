import './globals.css'

export const metadata = {
  title: 'Thaysa Pereira - Farmacêutica Esteta e Cosmetóloga',
  description: 'Clínica de estética avançada, procedimentos faciais, corporais, furo humanizado e cursos VIP.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  )
}