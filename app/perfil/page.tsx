'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  tipo: string;
  placa?: string;
  cilindraje: number;
}

interface NuevoVehiculoForm {
  marca: string;
  modelo: string;
  anio: string;
  tipo: string;
  placa: string;
  cilindraje: string;
}

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | null>(null);
  const [nuevoVehiculo, setNuevoVehiculo] = useState<NuevoVehiculoForm>({
    marca: '',
    modelo: '',
    anio: '',
    tipo: '',
    placa: '',
    cilindraje: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      cargarVehiculos();
    }
  }, [status, router]);

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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = editingVehiculo 
        ? `/api/vehiculos/${editingVehiculo.id}`
        : '/api/vehiculos';
      
      const method = editingVehiculo ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          marca: nuevoVehiculo.marca,
          modelo: nuevoVehiculo.modelo,
          anio: parseInt(nuevoVehiculo.anio),
          tipo: nuevoVehiculo.tipo,
          placa: nuevoVehiculo.placa || null,
          cilindraje: parseInt(nuevoVehiculo.cilindraje),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el vehículo');
      }

      await cargarVehiculos();
      setShowModal(false);
      setEditingVehiculo(null);
      setNuevoVehiculo({
        marca: '',
        modelo: '',
        anio: '',
        tipo: '',
        placa: '',
        cilindraje: '',
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al guardar el vehículo');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (vehiculo: Vehiculo) => {
    setEditingVehiculo(vehiculo);
    setNuevoVehiculo({
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      anio: vehiculo.anio.toString(),
      tipo: vehiculo.tipo,
      placa: vehiculo.placa || '',
      cilindraje: vehiculo.cilindraje.toString(),
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este vehículo?')) {
      return;
    }

    try {
      const response = await fetch(`/api/vehiculos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el vehículo');
      }

      await cargarVehiculos();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al eliminar el vehículo');
      console.error('Error:', error);
    }
  };

  if (status === 'loading') {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Información Personal</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <p><span className="font-semibold">Nombre:</span> {session?.user?.nombre}</p>
          <p><span className="font-semibold">Email:</span> {session?.user?.email}</p>
          <p><span className="font-semibold">Rol:</span> {session?.user?.rol}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Mis Vehículos</h2>
          <button
            onClick={() => {
              setEditingVehiculo(null);
              setNuevoVehiculo({
                marca: '',
                modelo: '',
                anio: '',
                tipo: '',
                placa: '',
                cilindraje: '',
              });
              setShowModal(true);
            }}
            className="bg-[#00a19a] text-white px-4 py-2 rounded-lg hover:bg-[#008b85]"
          >
            Agregar Vehículo
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div>Cargando vehículos...</div>
        ) : vehiculos.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            No tienes vehículos registrados
          </div>
        ) : (
          <div className="grid gap-4">
            {vehiculos.map((vehiculo) => (
              <div key={vehiculo.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-xl mb-2">
                      {vehiculo.marca} {vehiculo.modelo}
                    </h3>
                    <p><span className="font-semibold">Año:</span> {vehiculo.anio}</p>
                    <p><span className="font-semibold">Tipo:</span> {vehiculo.tipo}</p>
                    <p><span className="font-semibold">Cilindraje:</span> {vehiculo.cilindraje} cc</p>
                    {vehiculo.placa && (
                      <p><span className="font-semibold">Placa:</span> {vehiculo.placa}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(vehiculo)}
                      className="text-[#00a19a] hover:text-[#008b85]"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(vehiculo.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingVehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Marca</label>
                <input
                  type="text"
                  value={nuevoVehiculo.marca}
                  onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, marca: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Modelo</label>
                <input
                  type="text"
                  value={nuevoVehiculo.modelo}
                  onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, modelo: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Año</label>
                <input
                  type="number"
                  value={nuevoVehiculo.anio}
                  onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, anio: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Tipo</label>
                <select
                  value={nuevoVehiculo.tipo}
                  onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, tipo: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="MOTOCICLETA">Motocicleta</option>
                  <option value="AUTOMOVIL">Automóvil</option>
                  <option value="CAMIONETA">Camioneta</option>
                  <option value="CAMION">Camión</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Cilindraje (cc)</label>
                <input
                  type="number"
                  value={nuevoVehiculo.cilindraje}
                  onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, cilindraje: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  required
                  min="50"
                  max="5000"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Placa (opcional)</label>
                <input
                  type="text"
                  value={nuevoVehiculo.placa}
                  onChange={(e) => setNuevoVehiculo({ ...nuevoVehiculo, placa: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingVehiculo(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#00a19a] text-white px-4 py-2 rounded-lg hover:bg-[#008b85]"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 