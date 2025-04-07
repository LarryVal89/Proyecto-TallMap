'use client'
import { useState } from 'react'

export default function TallerDashboard() {
  const [activeTab, setActiveTab] = useState('perfil')

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'perfil' ? 'bg-[#00a19a] text-white' : 'bg-gray-100'
              }`}
              onClick={() => setActiveTab('perfil')}
            >
              Perfil
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'servicios' ? 'bg-[#00a19a] text-white' : 'bg-gray-100'
              }`}
              onClick={() => setActiveTab('servicios')}
            >
              Servicios
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'citas' ? 'bg-[#00a19a] text-white' : 'bg-gray-100'
              }`}
              onClick={() => setActiveTab('citas')}
            >
              Citas
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'reseñas' ? 'bg-[#00a19a] text-white' : 'bg-gray-100'
              }`}
              onClick={() => setActiveTab('reseñas')}
            >
              Reseñas
            </button>
          </div>

          {activeTab === 'perfil' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Perfil del Taller</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Nombre del Taller</label>
                  <input type="text" className="w-full p-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Descripción</label>
                  <textarea className="w-full p-2 border rounded-lg" rows={4} />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Fotos del Taller</label>
                  <input type="file" multiple className="w-full p-2 border rounded-lg" />
                </div>
                <button className="bg-[#00a19a] text-white px-4 py-2 rounded-lg hover:bg-[#008b85] transition-colors">
                  Guardar Cambios
                </button>
              </form>
            </div>
          )}

          {activeTab === 'servicios' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Servicios</h2>
              <button className="bg-[#00a19a] text-white px-4 py-2 rounded-lg hover:bg-[#008b85] transition-colors">
                Agregar Servicio
              </button>
              {/* Lista de servicios */}
            </div>
          )}

          {activeTab === 'citas' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Citas Programadas</h2>
              {/* Calendario y lista de citas */}
            </div>
          )}

          {activeTab === 'reseñas' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Reseñas</h2>
              {/* Lista de reseñas */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 