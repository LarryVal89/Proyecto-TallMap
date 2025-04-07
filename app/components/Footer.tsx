'use client'

import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-[#00a19a] mb-4">TallMap</h3>
            <p className="text-gray-400">
              Tu plataforma confiable para encontrar talleres mecánicos y gestionar tus citas de mantenimiento.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-[#00a19a] mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/talleres" className="text-gray-400 hover:text-white transition-colors">
                  Talleres
                </Link>
              </li>
              <li>
                <Link href="/resenas" className="text-gray-400 hover:text-white transition-colors">
                  Reseñas
                </Link>
              </li>
              <li>
                <Link href="/citas" className="text-gray-400 hover:text-white transition-colors">
                  Mis Citas
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-[#00a19a] mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@tallmap.com</li>
              <li>Teléfono: +123 456 7890</li>
              <li>Dirección: Calle Principal 123, Ciudad</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} TallMap. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
} 