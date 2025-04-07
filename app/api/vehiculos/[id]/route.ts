import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/config';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    // Verificar que el vehículo pertenece al usuario
    const vehiculoExistente = await prisma.vehiculo.findFirst({
      where: {
        id: parseInt(params.id),
        usuarioId: parseInt(session.user.id as string),
      },
    });

    if (!vehiculoExistente) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado o no autorizado' },
        { status: 404 }
      );
    }

    const vehiculo = await prisma.vehiculo.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        marca,
        modelo,
        anio: anioNum,
        tipo,
        placa: placa || null,
        cilindraje: cilindrajeNum,
      },
    });

    return NextResponse.json(vehiculo);
  } catch (error) {
    console.error('Error al actualizar vehículo:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el vehículo', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Verificar que el vehículo pertenece al usuario
    const vehiculoExistente = await prisma.vehiculo.findFirst({
      where: {
        id: parseInt(params.id),
        usuarioId: parseInt(session.user.id as string),
      },
    });

    if (!vehiculoExistente) {
      return NextResponse.json(
        { error: 'Vehículo no encontrado o no autorizado' },
        { status: 404 }
      );
    }

    await prisma.vehiculo.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    return NextResponse.json({ message: 'Vehículo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar vehículo:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el vehículo', details: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
} 