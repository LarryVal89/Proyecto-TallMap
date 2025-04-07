import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Obtener todos los talleres
    const talleres = await prisma.taller.findMany()

    // Lista de servicios con precios base y duración estimada en minutos
    const serviciosBase = [
      {
        nombre: 'Cambio de aceite',
        descripcion: 'Servicio completo de cambio de aceite y filtros',
        precio: 80000,
        duracion: 60 // 1 hora
      },
      {
        nombre: 'Cambio de llantas',
        descripcion: 'Cambio y rotación de llantas',
        precio: 120000,
        duracion: 90 // 1.5 horas
      },
      {
        nombre: 'Alineación y balanceo',
        descripcion: 'Servicio completo de alineación y balanceo de llantas',
        precio: 100000,
        duracion: 120 // 2 horas
      },
      {
        nombre: 'Revisión de frenos',
        descripcion: 'Inspección y mantenimiento del sistema de frenos',
        precio: 90000,
        duracion: 90 // 1.5 horas
      },
      {
        nombre: 'Mantenimiento preventivo',
        descripcion: 'Revisión general y mantenimiento preventivo',
        precio: 150000,
        duracion: 180 // 3 horas
      },
      {
        nombre: 'Revisión técnico-mecánica',
        descripcion: 'Preparación y revisión para la tecnicomecánica',
        precio: 200000,
        duracion: 240 // 4 horas
      },
      {
        nombre: 'Reparación de motor',
        descripcion: 'Diagnóstico y reparación de problemas del motor',
        precio: 500000,
        duracion: 480 // 8 horas
      },
      {
        nombre: 'Diagnóstico computarizado',
        descripcion: 'Análisis completo del sistema electrónico',
        precio: 120000,
        duracion: 60 // 1 hora
      },
      {
        nombre: 'Cambio de batería',
        descripcion: 'Suministro e instalación de batería nueva',
        precio: 250000,
        duracion: 30 // 30 minutos
      },
      {
        nombre: 'Lavado de motor',
        descripcion: 'Limpieza profunda del motor',
        precio: 70000,
        duracion: 120 // 2 horas
      },
      {
        nombre: 'Electricidad automotriz',
        descripcion: 'Reparación de sistemas eléctricos',
        precio: 180000,
        duracion: 180 // 3 horas
      },
      {
        nombre: 'Suspensión y dirección',
        descripcion: 'Mantenimiento del sistema de suspensión',
        precio: 200000,
        duracion: 240 // 4 horas
      },
      {
        nombre: 'Aire acondicionado',
        descripcion: 'Mantenimiento y recarga del aire acondicionado',
        precio: 150000,
        duracion: 120 // 2 horas
      },
      {
        nombre: 'Revisión de inyectores',
        descripcion: 'Limpieza y calibración de inyectores',
        precio: 180000,
        duracion: 180 // 3 horas
      },
      {
        nombre: 'Revisión de luces',
        descripcion: 'Revisión y ajuste del sistema de iluminación',
        precio: 60000,
        duracion: 60 // 1 hora
      }
    ]

    // Crear servicios para cada taller con variación de precios
    for (const taller of talleres) {
      const serviciosTaller = serviciosBase.map(servicio => ({
        nombre: servicio.nombre,
        descripcion: servicio.descripcion,
        // Variar el precio base ±20% para cada taller
        precio: servicio.precio * (1 + (Math.random() * 0.4 - 0.2)),
        duracion: servicio.duracion,
        tallerId: taller.id
      }))

      await prisma.servicio.createMany({
        data: serviciosTaller,
        skipDuplicates: true
      })
    }

    console.log('Servicios creados exitosamente')
    const totalServicios = await prisma.servicio.count()
    console.log(`Total de servicios creados: ${totalServicios}`)

  } catch (error) {
    console.error('Error al crear los servicios:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 