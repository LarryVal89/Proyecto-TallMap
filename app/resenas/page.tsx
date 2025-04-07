'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface Resena {
  id: number;
  calificacion: number;
  comentario: string;
  fecha: Date;
  usuario: {
    nombre: string;
  };
  taller: {
    nombre: string;
  };
}

export default function ResenasPage() {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [nuevaResena, setNuevaResena] = useState({
    tallerId: '',
    calificacion: 5,
    comentario: ''
  });
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    cargarResenas();
  }, []);

  const cargarResenas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/resenas');
      
      if (!response.ok) {
        throw new Error('Error al cargar reseñas');
      }
      
      const data = await response.json();
      setResenas(data);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar las reseñas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResena = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('/api/resenas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...nuevaResena,
          usuarioId: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al crear la reseña');
      }

      setShowModal(false);
      setNuevaResena({
        tallerId: '',
        calificacion: 5,
        comentario: ''
      });
      cargarResenas();
    } catch (error) {
      console.error('Error:', error);
      setError('Error al crear la reseña');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reseñas de Talleres</h1>
        <button
          className="btn-primary"
          onClick={() => {
            if (!session) {
              router.push('/login');
            } else {
              setShowModal(true);
            }
          }}
        >
          Escribir Reseña
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando reseñas...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          {resenas.map((resena) => (
            <div
              key={resena.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{resena.taller.nombre}</h3>
                  <p className="text-gray-600">Por: {resena.usuario.nombre}</p>
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${
                        i < resena.calificacion ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700">{resena.comentario}</p>
              <p className="text-gray-500 text-sm mt-4">
                {new Date(resena.fecha).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal para nueva reseña */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Escribir Reseña</h2>
            <form onSubmit={handleSubmitResena}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Taller</label>
                <select
                  className="input-field w-full"
                  value={nuevaResena.tallerId}
                  onChange={(e) =>
                    setNuevaResena({ ...nuevaResena, tallerId: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccionar taller</option>
                  {/* Aquí se cargarían los talleres disponibles */}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Calificación</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`text-2xl ${
                        star <= nuevaResena.calificacion
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      onClick={() =>
                        setNuevaResena({ ...nuevaResena, calificacion: star })
                      }
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Comentario</label>
                <textarea
                  className="input-field w-full"
                  rows={4}
                  value={nuevaResena.comentario}
                  onChange={(e) =>
                    setNuevaResena({ ...nuevaResena, comentario: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Publicar Reseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 