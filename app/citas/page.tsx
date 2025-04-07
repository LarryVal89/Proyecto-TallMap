'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Taller {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  tipo: string;
  email: string;
  horario: string;
  descripcion: string;
}

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
}

interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  tipo: string;
}

interface Cita {
  id: number;
  fecha: string;
  estado: string;
  taller: {
    nombre: string;
  };
  servicio: {
    nombre: string;
  };
}

export default function CitasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [nuevaCita, setNuevaCita] = useState({
    tallerId: '',
    servicioId: '',
    vehiculoId: '',
    fecha: '',
    hora: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      cargarCitas();
      cargarTalleres();
      cargarServicios();
      cargarVehiculos();
    }
  }, [status, router]);

  const cargarCitas = async () => {
    try {
      const response = await fetch('/api/citas');
      if (!response.ok) {
        throw new Error('Error al cargar las citas');
      }
      const data = await response.json();
      setCitas(data);
    } catch (error) {
      setError('Error al cargar las citas');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarTalleres = async () => {
    try {
      const response = await fetch('/api/talleres');
      if (!response.ok) {
        throw new Error('Error al cargar los talleres');
      }
      const data = await response.json();
      setTalleres(data);
    } catch (error) {
      setError('Error al cargar los talleres');
      console.error('Error:', error);
    }
  };

  const cargarServicios = async (tallerId: string) => {
    try {
      console.log('Cargando servicios para el taller:', tallerId);
      const response = await fetch(`/api/talleres/${tallerId}/servicios`);
      if (!response.ok) {
        throw new Error('Error al cargar los servicios');
      }
      const data = await response.json();
      console.log('Servicios cargados:', data);
      setServicios(data);
    } catch (error) {
      console.error('Error al cargar los servicios:', error);
      setError('Error al cargar los servicios');
    }
  };

  const cargarVehiculos = async () => {
    try {
      const response = await fetch('/api/vehiculos');
      if (!response.ok) {
        throw new Error('Error al cargar los vehículos');
      }
      const data = await response.json();
      setVehiculos(data);
    } catch (error) {
      setError('Error al cargar los vehículos');
      console.error('Error:', error);
    }
  };

  const handleTallerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tallerId = e.target.value;
    setNuevaCita({ ...nuevaCita, tallerId, servicioId: '' });
    if (tallerId) {
      cargarServicios(tallerId);
    } else {
      setServicios([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const fechaHora = new Date(`${nuevaCita.fecha}T${nuevaCita.hora}`);
      
      const response = await fetch('/api/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tallerId: parseInt(nuevaCita.tallerId),
          servicioId: parseInt(nuevaCita.servicioId),
          vehiculoId: parseInt(nuevaCita.vehiculoId),
          fecha: fechaHora.toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la cita');
      }

      await cargarCitas();
      setShowModal(false);
      setNuevaCita({
        tallerId: '',
        servicioId: '',
        vehiculoId: '',
        fecha: '',
        hora: '',
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al crear la cita');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Citas</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="bg-[#00a19a] text-white px-4 py-2 rounded-lg mb-4 hover:bg-[#008b85]"
      >
        Agendar Nueva Cita
      </button>

      {loading ? (
        <div>Cargando citas...</div>
      ) : citas.length === 0 ? (
        <div>No tienes citas programadas</div>
      ) : (
        <div className="grid gap-4">
          {citas.map((cita) => (
            <div key={cita.id} className="border p-4 rounded-lg">
              <h3 className="font-bold">{cita.taller.nombre}</h3>
              <p>Servicio: {cita.servicio.nombre}</p>
              <p>Fecha: {new Date(cita.fecha).toLocaleDateString()}</p>
              <p>Estado: {cita.estado}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Nueva Cita</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Vehículo</label>
                <select
                  value={nuevaCita.vehiculoId}
                  onChange={(e) => setNuevaCita({ ...nuevaCita, vehiculoId: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Selecciona un vehículo</option>
                  {vehiculos.map((vehiculo) => (
                    <option key={vehiculo.id} value={vehiculo.id}>
                      {vehiculo.marca} {vehiculo.modelo} ({vehiculo.anio})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Taller</label>
                <select
                  value={nuevaCita.tallerId}
                  onChange={handleTallerChange}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Selecciona un taller</option>
                  {talleres.map((taller) => (
                    <option key={taller.id} value={taller.id}>
                      {taller.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Servicio</label>
                <select
                  value={nuevaCita.servicioId}
                  onChange={(e) => setNuevaCita({ ...nuevaCita, servicioId: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                  disabled={!nuevaCita.tallerId}
                >
                  <option value="">Selecciona un servicio</option>
                  {servicios.map((servicio) => (
                    <option key={servicio.id} value={servicio.id}>
                      {servicio.nombre} - ${servicio.precio}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Fecha</label>
                <input
                  type="date"
                  value={nuevaCita.fecha}
                  onChange={(e) => setNuevaCita({ ...nuevaCita, fecha: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Hora</label>
                <input
                  type="time"
                  value={nuevaCita.hora}
                  onChange={(e) => setNuevaCita({ ...nuevaCita, hora: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#00a19a] text-white px-4 py-2 rounded-lg hover:bg-[#008b85] disabled:opacity-50"
                >
                  {loading ? 'Agendando...' : 'Agendar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 