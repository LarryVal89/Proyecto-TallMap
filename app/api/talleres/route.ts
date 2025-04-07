import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET /api/talleres - Obtener todos los talleres
export async function GET() {
  try {
    const talleres = await prisma.taller.findMany({
      select: {
        id: true,
        nombre: true,
        direccion: true,
        telefono: true,
        tipo: true,
        email: true,
        horario: true,
        descripcion: true,
      },
    });

    return NextResponse.json(talleres);
  } catch (error) {
    console.error('Error al obtener talleres:', error);
    return NextResponse.json(
      { error: 'Error al obtener los talleres' },
      { status: 500 }
    );
  }
}

// POST /api/talleres - Crear un nuevo taller
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, descripcion, direccion, latitud, longitud, telefono, email, horario, servicios } = body;

    // Crear taller con servicios
    const taller = await prisma.taller.create({
      data: {
        nombre,
        descripcion,
        direccion,
        latitud,
        longitud,
        telefono,
        email,
        horario,
        servicios: {
          create: servicios,
        },
      },
      include: {
        servicios: true,
      },
    });

    return NextResponse.json(taller);
  } catch (error) {
    console.error('Error al crear el taller:', error);
    return NextResponse.json(
      { error: 'Error al crear el taller' },
      { status: 500 }
    );
  }
} 