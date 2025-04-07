'use client'

import { useState } from 'react'

const steps = [
  {
    icon: '🛠️',
    title: 'Busca',
    description: 'Encuentra talleres cercanos según tu ubicación',
    details: 'Usa nuestra tecnología de geolocalización para encontrar los talleres más cercanos a ti.'
  },
  {
    icon: '📍',
    title: 'Ubica',
    description: 'Mapa interactivo con filtros por tipo de servicio',
    details: 'Navega por el mapa y filtra los talleres según el tipo de servicio que necesites.'
  },
  {
    icon: '🤝',
    title: 'Conecta',
    description: 'Comunícate directo con el taller desde la app',
    details: 'Agenda citas, deja reseñas y mantén un historial de tus servicios.'
  }
]

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">¿Cómo funciona?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl transition-all duration-300 cursor-pointer ${
                activeStep === index
                  ? 'bg-[#00a19a] text-white shadow-lg'
                  : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => setActiveStep(index)}
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="mb-4">{step.description}</p>
              {activeStep === index && (
                <p className="text-sm opacity-90">{step.details}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 