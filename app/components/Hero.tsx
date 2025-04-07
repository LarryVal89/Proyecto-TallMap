'use client'

import { useState } from 'react'
import AuthForms from './AuthForms'

export function Hero() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<'login' | 'register'>('register')

  const scrollToTalleres = () => {
    const talleresSection = document.getElementById('talleres')
    if (talleresSection) {
      talleresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black bg-opacity-60" />
        </div>
        
        <div className="relative h-full flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Encuentra el Taller Perfecto
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Localiza talleres mecánicos de confianza cerca de ti y agenda tu cita en segundos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToTalleres}
                className="bg-[#00a19a] hover:bg-[#00857f] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
              >
                Buscar Talleres
              </button>
              <button
                onClick={() => {
                  setAuthType('register')
                  setShowAuthModal(true)
                }}
                className="bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-8 rounded-lg transition-colors duration-300"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      </section>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <AuthForms
              type={authType}
              onClose={() => setShowAuthModal(false)}
              onSwitchType={() => setAuthType(authType === 'login' ? 'register' : 'login')}
            />
          </div>
        </div>
      )}
    </>
  )
} 