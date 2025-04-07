import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function GET() {
  try {
    // Crear usuarios
    const usuarios = await prisma.usuario.createMany({
      data: [
        {
          nombre: 'Juan Pérez',
          email: 'juan@example.com',
          telefono: '3001234567',
          password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNuWkW', // password123
          rol: 'CLIENTE'
        },
        {
          nombre: 'María García',
          email: 'maria@example.com',
          telefono: '3002345678',
          password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNuWkW',
          rol: 'CLIENTE'
        },
        {
          nombre: 'Carlos López',
          email: 'carlos@example.com',
          telefono: '3003456789',
          password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNuWkW',
          rol: 'CLIENTE'
        },
        {
          nombre: 'Ana Martínez',
          email: 'ana@example.com',
          telefono: '3004567890',
          password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNuWkW',
          rol: 'CLIENTE'
        },
        {
          nombre: 'Pedro Rodríguez',
          email: 'pedro@example.com',
          telefono: '3005678901',
          password: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNuWkW',
          rol: 'CLIENTE'
        }
      ],
      skipDuplicates: true
    })

    // Crear talleres
    const talleres = await prisma.taller.createMany({
      data: [
        {
          nombre: 'Taller Mecánico Express',
          direccion: 'Calle 10 # 5-20, Cali',
          latitud: 3.4516,
          longitud: -76.5320,
          telefono: '6021234567',
          tipo: 'MOTOS',
          email: 'express@taller.com',
          horario: 'Lunes a Viernes: 8:00 - 18:00',
          descripcion: 'Especialistas en mantenimiento de motos'
        },
        {
          nombre: 'AutoServicio Rápido',
          direccion: 'Carrera 25 # 8-45, Cali',
          latitud: 3.4416,
          longitud: -76.5220,
          telefono: '6022345678',
          tipo: 'AUTOS',
          email: 'autoservicio@taller.com',
          horario: 'Lunes a Sábado: 7:00 - 19:00',
          descripcion: 'Servicio completo para automóviles'
        },
        {
          nombre: 'MotoTaller Cali',
          direccion: 'Avenida 6N # 15-30, Cali',
          latitud: 3.4616,
          longitud: -76.5420,
          telefono: '6023456789',
          tipo: 'MOTOS',
          email: 'mototaller@taller.com',
          horario: 'Lunes a Domingo: 8:00 - 20:00',
          descripcion: 'Especialistas en motos deportivas'
        },
        {
          nombre: 'Taller Automotriz Premium',
          direccion: 'Calle 25 # 10-15, Cali',
          latitud: 3.4316,
          longitud: -76.5120,
          telefono: '6024567890',
          tipo: 'AUTOS',
          email: 'premium@taller.com',
          horario: 'Lunes a Viernes: 9:00 - 17:00',
          descripcion: 'Servicio premium para vehículos de lujo'
        },
        {
          nombre: 'Mecánica Integral',
          direccion: 'Carrera 15 # 20-35, Cali',
          latitud: 3.4716,
          longitud: -76.5520,
          telefono: '6025678901',
          tipo: 'AMBOS',
          email: 'integral@taller.com',
          horario: 'Lunes a Sábado: 8:00 - 18:00',
          descripcion: 'Servicio integral para motos y autos'
        }
      ],
      skipDuplicates: true
    })

    // Obtener IDs de usuarios y talleres
    const usuariosDB = await prisma.usuario.findMany()
    const talleresDB = await prisma.taller.findMany()

    // Crear citas
    const citas = await prisma.cita.createMany({
      data: [
        {
          usuarioId: usuariosDB[0].id,
          tallerId: talleresDB[0].id,
          fecha: new Date('2024-03-20T10:00:00Z'),
          estado: 'CONFIRMADA',
          tipoServicio: 'MANTENIMIENTO',
          descripcion: 'Cambio de aceite y filtro'
        },
        {
          usuarioId: usuariosDB[1].id,
          tallerId: talleresDB[1].id,
          fecha: new Date('2024-03-21T14:00:00Z'),
          estado: 'PENDIENTE',
          tipoServicio: 'REPARACION',
          descripcion: 'Revisión de frenos'
        },
        {
          usuarioId: usuariosDB[2].id,
          tallerId: talleresDB[2].id,
          fecha: new Date('2024-03-22T09:00:00Z'),
          estado: 'COMPLETADA',
          tipoServicio: 'MANTENIMIENTO',
          descripcion: 'Ajuste de carburador'
        }
      ],
      skipDuplicates: true
    })

    // Crear reseñas
    const resenas = await prisma.resena.createMany({
      data: [
        {
          usuarioId: usuariosDB[0].id,
          tallerId: talleresDB[0].id,
          calificacion: 5,
          comentario: 'Excelente servicio, muy profesionales',
          fecha: new Date('2024-03-15')
        },
        {
          usuarioId: usuariosDB[1].id,
          tallerId: talleresDB[1].id,
          calificacion: 4,
          comentario: 'Buen servicio, pero un poco caro',
          fecha: new Date('2024-03-16')
        },
        {
          usuarioId: usuariosDB[2].id,
          tallerId: talleresDB[2].id,
          calificacion: 5,
          comentario: 'Muy satisfecho con el trabajo realizado',
          fecha: new Date('2024-03-17')
        }
      ],
      skipDuplicates: true
    })

    return NextResponse.json({
      message: 'Datos de ejemplo creados exitosamente',
      usuarios,
      talleres,
      citas,
      resenas
    })
  } catch (error) {
    console.error('Error al crear datos de ejemplo:', error)
    return NextResponse.json(
      { error: 'Error al crear datos de ejemplo' },
      { status: 500 }
    )
  }
} 