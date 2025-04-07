import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

// GET /api/resenas - Obtener todas las reseñas
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tallerId = searchParams.get('tallerId')

    const where = tallerId ? { tallerId: parseInt(tallerId) } : {}

    const resenas = await prisma.resena.findMany({
      where,
      include: {
        usuario: {
          select: {
            nombre: true,
          },
        },
        taller: {
          select: {
            nombre: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(resenas)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener reseñas' }, { status: 500 })
  }
}

// POST /api/resenas - Crear una nueva reseña
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { calificacion, comentario, usuarioId, tallerId } = body

    // Verificar si el usuario ya ha dejado una reseña para este taller
    const resenaExistente = await prisma.resena.findFirst({
      where: {
        usuarioId: parseInt(usuarioId),
        tallerId: parseInt(tallerId),
      },
    })

    if (resenaExistente) {
      return NextResponse.json(
        { error: 'Ya has dejado una reseña para este taller' },
        { status: 400 }
      )
    }

    // Crear reseña
    const resena = await prisma.resena.create({
      data: {
        calificacion: parseInt(calificacion),
        comentario,
        usuarioId: parseInt(usuarioId),
        tallerId: parseInt(tallerId),
      },
      include: {
        usuario: {
          select: {
            nombre: true,
          },
        },
        taller: {
          select: {
            nombre: true,
          },
        },
      },
    })

    return NextResponse.json(resena)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear la reseña' },
      { status: 500 }
    )
  }
} 