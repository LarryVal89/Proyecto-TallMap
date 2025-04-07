'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';

interface Taller {
  id: number;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  telefono: string;
  tipo: string;
  email: string;
  horario: string;
  descripcion: string;
  distancia?: number;
  calificacionPromedio?: number;
}

export default function TalleresPage() {
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState({
    ciudad: '',
    servicio: '',
    calificacion: '',
    distancia: '5'
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Obtener filtros de la URL
    const ciudad = searchParams.get('ciudad') || '';
    const servicio = searchParams.get('servicio') || '';
    const calificacion = searchParams.get('calificacion') || '';
    const distancia = searchParams.get('distancia') || '5';

    setFiltros({ ciudad, servicio, calificacion, distancia });
    cargarTalleres({ ciudad, servicio, calificacion, distancia });
  }, [searchParams]);

  const cargarTalleres = async (filtros: any) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filtros);
      const response = await fetch(`/api/talleres?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar talleres');
      }
      
      const data = await response.json();
      setTalleres(data);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los talleres');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    const queryParams = new URLSearchParams(filtros);
    router.push(`/talleres?${queryParams.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Talleres Disponibles</h1>
      
      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            className="input-field"
            value={filtros.ciudad}
            onChange={(e) => setFiltros({ ...filtros, ciudad: e.target.value })}
          >
            <option value="">Todas las ciudades</option>
            <option value="Cali">Cali</option>
            <option value="Bogota">Bogotá</option>
            <option value="Medellin">Medellín</option>
          </select>

          <select
            className="input-field"
            value={filtros.servicio}
            onChange={(e) => setFiltros({ ...filtros, servicio: e.target.value })}
          >
            <option value="">Todos los servicios</option>
            <option value="MANTENIMIENTO">Mantenimiento</option>
            <option value="REPARACION">Reparación</option>
            <option value="PINTURA">Pintura</option>
          </select>

          <select
            className="input-field"
            value={filtros.calificacion}
            onChange={(e) => setFiltros({ ...filtros, calificacion: e.target.value })}
          >
            <option value="">Todas las calificaciones</option>
            <option value="5">5 estrellas</option>
            <option value="4">4 estrellas o más</option>
            <option value="3">3 estrellas o más</option>
          </select>

          <select
            className="input-field"
            value={filtros.distancia}
            onChange={(e) => setFiltros({ ...filtros, distancia: e.target.value })}
          >
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="20">20 km</option>
            <option value="50">50 km</option>
          </select>
        </div>

        <button
          className="btn-primary mt-4"
          onClick={aplicarFiltros}
        >
          Aplicar Filtros
        </button>
      </div>

      {/* Lista de talleres */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando talleres...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talleres.map((taller) => (
            <div
              key={taller.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{taller.nombre}</h3>
                <p className="text-gray-600 mb-2">{taller.direccion}</p>
                <p className="text-gray-600 mb-2">{taller.telefono}</p>
                <p className="text-gray-600 mb-2">{taller.horario}</p>
                {taller.distancia && (
                  <p className="text-gray-600">
                    Distancia: {taller.distancia.toFixed(1)} km
                  </p>
                )}
                <div className="mt-4">
                  <button
                    className="btn-primary"
                    onClick={() => router.push(`/talleres/${taller.id}`)}
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 