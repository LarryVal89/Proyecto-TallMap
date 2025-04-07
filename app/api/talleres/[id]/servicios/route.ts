import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Obteniendo servicios para el taller:', params.id);
    
    const servicios = await prisma.servicio.findMany({
      where: {
        tallerId: parseInt(params.id),
      },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        precio: true,
        duracion: true,
      },
    });

    console.log('Servicios encontrados:', servicios);
    return NextResponse.json(servicios);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    return NextResponse.json(
      { error: 'Error al obtener los servicios' },
      { status: 500 }
    );
  }
} 