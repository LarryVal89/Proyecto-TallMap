'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface Taller {
  id: number;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  telefono: string;
  tipo: string;
  distancia?: number;
}

export default function Map() {
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Obtener ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(location);
          
          // Cargar talleres cercanos
          try {
            const response = await fetch(
              `/api/talleres?lat=${location[0]}&lng=${location[1]}&radius=5`
            );
            if (!response.ok) {
              throw new Error('Error al cargar talleres');
            }
            const data = await response.json();
            if (!Array.isArray(data)) {
              throw new Error('Formato de datos inválido');
            }
            setTalleres(data);
            setError(null);
          } catch (error) {
            console.error('Error al cargar talleres:', error);
            setError('Error al cargar talleres. Por favor, intente nuevamente.');
            setTalleres([]);
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Error al obtener ubicación:', error);
          setError('Error al obtener ubicación');
          // Ubicación por defecto: Cali, Colombia
          const defaultLocation: [number, number] = [3.4516, -76.5320];
          setUserLocation(defaultLocation);
          
          // Cargar todos los talleres
          loadAllTalleres();
        }
      );
    } else {
      // Ubicación por defecto: Cali, Colombia
      const defaultLocation: [number, number] = [3.4516, -76.5320];
      setUserLocation(defaultLocation);
      
      // Cargar todos los talleres
      loadAllTalleres();
    }
  }, []);

  const loadAllTalleres = async () => {
    try {
      const response = await fetch('/api/talleres');
      if (!response.ok) {
        throw new Error('Error al cargar talleres');
      }
      const data = await response.json();
      setTalleres(Array.isArray(data) ? data : []);
      setError(null);
    } catch (error) {
      console.error('Error al cargar talleres:', error);
      setError('Error al cargar talleres');
      setTalleres([]);
    } finally {
      setLoading(false);
    }
  };

  // Crear icono personalizado para los talleres
  const tallerIcon = L.icon({
    iconUrl: '/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  // Crear icono personalizado para la ubicación del usuario
  const userIcon = L.icon({
    iconUrl: '/user-location.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  if (!userLocation) {
    return <div className="h-full w-full flex items-center justify-center">Cargando mapa...</div>;
  }

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="rounded-xl"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marcador de ubicación del usuario */}
        <Marker position={userLocation} icon={userIcon}>
          <Popup>Tu ubicación</Popup>
        </Marker>

        {/* Marcadores de talleres */}
        {Array.isArray(talleres) && talleres.map((taller) => (
          <Marker
            key={taller.id}
            position={[taller.latitud, taller.longitud]}
            icon={tallerIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{taller.nombre}</h3>
                <p className="text-gray-600">{taller.direccion}</p>
                <p className="text-gray-600">{taller.telefono}</p>
                <p className="text-gray-600">Tipo: {taller.tipo}</p>
                {taller.distancia && (
                  <p className="text-gray-600">
                    Distancia: {taller.distancia.toFixed(1)} km
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {error && (
        <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white">Cargando talleres...</div>
        </div>
      )}
    </div>
  );
} 