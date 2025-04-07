'use client'
import { useState } from 'react'

export default function UsuarioDashboard() {
  const [activeTab, setActiveTab] = useState('vehiculos')

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'vehiculos' ? 'bg-[#00a19a] text-white' : 'bg-gray-100'
              }`}
              onClick={() => setActiveTab('vehiculos')}
            >
              Mis Vehículos
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'citas' ? 'bg-[#00a19a] text-white' : 'bg-gray-100'
              }`}
              onClick={() => setActiveTab('citas')}
            >
              Mis Citas
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'reseñas' ? 'bg-[#00a19a] text-white' : 'bg-gray-100'
              }`}
              onClick={() => setActiveTab('reseñas')}
            >
              Mis Reseñas
            </button>
          </div>

          {activeTab === 'vehiculos' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Mis Vehículos</h2>
              <button className="bg-[#00a19a] text-white px-4 py-2 rounded-lg hover:bg-[#008b85] transition-colors">
                Agregar Vehículo
              </button>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Marca</label>
                    <input type="text" className="w-full p-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Modelo</label>
                    <input type="text" className="w-full p-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Año</label>
                    <input type="number" className="w-full p-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Cilindraje</label>
                    <input type="number" className="w-full p-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Tipo</label>
                    <select className="w-full p-2 border rounded-lg">
                      <option value="moto">Moto</option>
                      <option value="carro">Carro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Placa</label>
                    <input type="text" className="w-full p-2 border rounded-lg" />
                  </div>
                </div>
                <button className="bg-[#00a19a] text-white px-4 py-2 rounded-lg hover:bg-[#008b85] transition-colors">
                  Guardar Vehículo
                </button>
              </form>
            </div>
          )}

          {activeTab === 'citas' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Mis Citas</h2>
              <button className="bg-[#00a19a] text-white px-4 py-2 rounded-lg hover:bg-[#008b85] transition-colors">
                Agendar Nueva Cita
              </button>
              {/* Calendario y lista de citas */}
            </div>
          )}

          {activeTab === 'reseñas' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Mis Reseñas</h2>
              {/* Lista de reseñas */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 