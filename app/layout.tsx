import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Providers } from './providers'
import FloatingProfileButton from './components/FloatingProfileButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TallMap - Encuentra Talleres Mecánicos',
  description: 'Encuentra talleres mecánicos cerca de ti y agenda citas fácilmente',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <FloatingProfileButton />
          <Footer />
        </Providers>
      </body>
    </html>
  )
} 