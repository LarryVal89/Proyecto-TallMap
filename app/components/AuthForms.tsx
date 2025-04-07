'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'

interface AuthFormsProps {
  onClose: () => void
  type: 'login' | 'register'
  onSwitchType: () => void
}

const AuthForms = ({ onClose, type, onSwitchType }: AuthFormsProps) => {
  const [isLogin, setIsLogin] = useState(type === 'login')
  const [userType, setUserType] = useState('')
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isLogin) {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          setError('Credenciales inválidas')
        } else {
          onClose()
        }
      } else {
        if (!userType) {
          setError('Por favor selecciona un tipo de usuario')
          return
        }

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            rol: userType === 'taller' ? 'TALLER' : 'USUARIO'
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Error al registrar usuario')
        }

        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          setError('Error al iniciar sesión después del registro')
        } else {
          onClose()
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <div className="flex justify-between mb-8">
          <button 
            className={`px-4 py-2 rounded-lg ${isLogin ? 'bg-[#00a19a] text-white' : 'bg-gray-100'}`}
            onClick={() => {
              setIsLogin(true)
              onSwitchType()
            }}
          >
            Iniciar Sesión
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${!isLogin ? 'bg-[#00a19a] text-white' : 'bg-gray-100'}`}
            onClick={() => {
              setIsLogin(false)
              onSwitchType()
            }}
          >
            Registrarse
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tipo de Usuario</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-lg ${userType === 'conductor' ? 'bg-[#00a19a] text-white' : 'bg-gray-100'}`}
                    onClick={() => setUserType('conductor')}
                  >
                    Conductor
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-lg ${userType === 'taller' ? 'bg-[#00a19a] text-white' : 'bg-gray-100'}`}
                    onClick={() => setUserType('taller')}
                  >
                    Taller
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded-lg"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              className="w-full p-2 border rounded-lg"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00a19a] text-white py-2 rounded-lg hover:bg-[#008b85] transition-colors disabled:opacity-50"
          >
            {loading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuthForms 