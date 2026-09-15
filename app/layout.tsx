import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Nunito } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { PwaRegister } from '@/components/pwa-register'
import { assetPath } from '@/lib/asset-path'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  axes: ['opsz'],
})

export const metadata: Metadata = {
  title: 'hobbyBFF — Your next first, together',
  description:
    'Discover a hobby or class you would love to try in Boston, and find a friend to try it with. A playful demo prototype.',
  generator: 'v0.app',
  appleWebApp: { capable: true, title: 'hobbyBFF', statusBarStyle: 'default' },
  icons: { apple: assetPath('/pwa-192.png') },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fbf9ff',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${bricolage.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        <PwaRegister />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
