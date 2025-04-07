import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { Rol } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Datos recibidos:', body); // Log para debug

    const { email, password, nombre, rol } = body;

    // Validar que el rol sea uno de los valores permitidos
    if (!Object.values(Rol).includes(rol)) {
      return NextResponse.json(
        { error: `Rol inválido. Debe ser uno de: ${Object.values(Rol).join(', ')}` },
        { status: 400 }
      );
    }

    if (!email || !password || !nombre || !rol) {
      console.log('Campos faltantes:', { email, nombre, rol }); // Log para debug
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      );
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario con el rol como enum
    const user = await prisma.usuario.create({
      data: {
        email,
        password: hashedPassword,
        nombre,
        rol: rol as Rol,
        telefono: '' // Valor por defecto para el campo requerido
      }
    });

    console.log('Usuario creado:', { id: user.id, email: user.email, rol: user.rol }); // Log para debug

    // Retornar usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error detallado al registrar usuario:', error);
    
    // Verificar si es un error de Prisma
    if (error.code) {
      return NextResponse.json(
        { error: `Error de base de datos: ${error.code}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Error al crear el usuario: ' + (error.message || 'Error desconocido') },
      { status: 500 }
    );
  }
} 