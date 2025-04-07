'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { UserCircleIcon } from '@heroicons/react/24/outline'

export default function FloatingProfileButton() {
  const { data: session } = useSession()

  if (!session) return null

  return (
    <Link
      href="/perfil"
      className="fixed bottom-8 right-8 bg-[#00a19a] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#008b85] transition-colors z-50 flex items-center gap-2"
      title="Ir a mi perfil"
    >
      <UserCircleIcon className="h-6 w-6" />
      <span className="font-medium">Mi Perfil</span>
    </Link>
  )
} 