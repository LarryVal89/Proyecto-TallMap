import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/config'

// GET /api/citas - Obtener todas las citas
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const citas = await prisma.cita.findMany({
      where: {
        usuarioId: parseInt(session.user.id as string),
      },
      include: {
        taller: {
          select: {
            nombre: true,
          },
        },
        servicio: {
          select: {
            nombre: true,
            precio: true,
            duracion: true,
          },
        },
      },
      orderBy: {
        fecha: 'desc',
      },
    })

    return NextResponse.json(citas)
  } catch (error) {
    console.error('Error al obtener citas:', error)
    return NextResponse.json(
      { error: 'Error al obtener las citas' },
      { status: 500 }
    )
  }
}

// POST /api/citas - Crear una nueva cita
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { tallerId, servicioId, fecha, vehiculoId } = body

    if (!tallerId || !servicioId || !fecha || !vehiculoId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    const cita = await prisma.cita.create({
      data: {
        usuarioId: parseInt(session.user.id as string),
        tallerId: parseInt(tallerId),
        servicioId: parseInt(servicioId),
        vehiculoId: parseInt(vehiculoId),
        fecha: new Date(fecha),
        estado: 'PENDIENTE',
      },
      include: {
        taller: {
          select: {
            nombre: true,
          },
        },
        servicio: {
          select: {
            nombre: true,
            precio: true,
            duracion: true,
          },
        },
      },
    })

    return NextResponse.json(cita)
  } catch (error) {
    console.error('Error al crear cita:', error)
    return NextResponse.json(
      { error: 'Error al crear la cita' },
      { status: 500 }
    )
  }
} 