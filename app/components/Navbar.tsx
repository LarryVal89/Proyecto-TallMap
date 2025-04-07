'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import AuthForms from './AuthForms'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [showAuth, setShowAuth] = useState(false)
  const [authType, setAuthType] = useState<'login' | 'register'>('login')

  const isActive = (path: string) => pathname === path

  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-2xl font-bold text-[#00a19a] hover:text-[#00a19a] transition-colors"
            >
              TallMap
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link 
                href="/talleres" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/talleres') 
                    ? 'text-[#00a19a]' 
                    : 'text-white hover:text-[#00a19a]'
                }`}
              >
                Talleres
              </Link>
              <Link 
                href="/resenas" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/resenas') 
                    ? 'text-[#00a19a]' 
                    : 'text-white hover:text-[#00a19a]'
                }`}
              >
                Reseñas
              </Link>
              {session && (
                <Link 
                  href="/citas" 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/citas') 
                      ? 'text-[#00a19a]' 
                      : 'text-white hover:text-[#00a19a]'
                  }`}
                >
                  Mis Citas
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                {isActive('/perfil') && (
                  <Link
                    href="/perfil"
                    className="text-white hover:text-gray-300"
                  >
                    Perfil
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="bg-[#00a19a] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#008b85] transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setAuthType('login')
                    setShowAuth(true)
                  }}
                  className="bg-[#00a19a] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#008b85] transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    setAuthType('register')
                    setShowAuth(true)
                  }}
                  className="bg-white text-[#00a19a] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAuth && (
        <div className="fixed inset-0 z-50">
          <AuthForms
            type={authType}
            onClose={() => setShowAuth(false)}
            onSwitchType={() => setAuthType(authType === 'login' ? 'register' : 'login')}
          />
        </div>
      )}
    </nav>
  )
} 