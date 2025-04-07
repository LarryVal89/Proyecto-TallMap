'use client'

import { Hero } from './components/Hero'
import { HowItWorks } from './components/HowItWorks'
import dynamic from 'next/dynamic'
import Footer from './components/Footer'

const HomeMap = dynamic(() => import('./components/HomeMap'), { ssr: false })

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <Hero />
      <HowItWorks />
      <div id="talleres" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Encuentra Talleres Cercanos</h2>
          <div className="h-[600px] rounded-xl overflow-hidden">
            <HomeMap />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
} 