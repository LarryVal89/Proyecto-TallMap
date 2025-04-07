import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/config';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const vehiculos = await prisma.vehiculo.findMany({
      where: {
        usuarioId: parseInt(session.user.id as string),
      },
      select: {
        id: true,
        marca: true,
        modelo: true,
        anio: true,
        tipo: true,
        placa: true,
        cilindraje: true,
      },
    });

    return NextResponse.json(vehiculos);
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    return NextResponse.json(
      { error: 'Error al obtener los vehículos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { marca, modelo, anio, tipo, placa, cilindraje } = body;

    // Validación de campos requeridos
    if (!marca || !modelo || !anio || !tipo || !cilindraje) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validación de tipos
    const anioNum = Number(anio);
    const cilindrajeNum = Number(cilindraje);

    if (isNaN(anioNum) || isNaN(cilindrajeNum)) {
      return NextResponse.json(
        { error: 'El año y el cilindraje deben ser números válidos' },
        { status: 400 }
      );
    }

    // Validación de rangos
    if (anioNum < 1900 || anioNum > new Date().getFullYear()) {
      return NextResponse.json(
        { error: 'El año debe estar entre 1900 y el año actual' },
        { status: 400 }
      );
    }

    if (cilindrajeNum < 50 || cilindrajeNum > 5000) {
      return NextResponse.json(
        { error: 'El cilindraje debe estar entre 50 y 5000 cc' },
        { status: 400 }
      );
    }

    // Validación del tipo de vehículo
    const tiposValidos = ['MOTOCICLETA', 'AUTOMOVIL', 'CAMIONETA', 'CAMION'];
    if (!tiposValidos.includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo de vehículo no válido' },
        { status: 400 }
      );
    }

    const vehiculo = await prisma.vehiculo.create({
      data: {
        marca,
        modelo,
        anio: anioNum,
        tipo,
        placa: placa || null,
        cilindraje: cilindrajeNum,
        usuarioId: parseInt(session.user.id as string),
      },
    });

    return NextResponse.json(vehiculo);
  } catch (error) {
    console.error('Error al crear vehículo:', error);
    return NextResponse.json(
      { error: 'Error al crear el vehículo', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
} 