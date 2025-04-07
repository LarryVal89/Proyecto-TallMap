'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Icono personalizado para talleres
const tallerIcon = L.icon({
  iconUrl: '/wrench-marker.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

interface Taller {
  id: number;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  telefono: string;
  servicios: string[];
}

export default function HomeMap() {
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedTaller, setSelectedTaller] = useState<Taller | null>(null);

  useEffect(() => {
    // Obtener ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
          // Ubicación por defecto en Cali
          setUserLocation([3.4516, -76.5320]);
        }
      );
    } else {
      // Ubicación por defecto en Cali
      setUserLocation([3.4516, -76.5320]);
    }

    // Cargar talleres
    fetchTalleres();
  }, []);

  const fetchTalleres = async () => {
    try {
      const response = await fetch('/api/talleres');
      if (response.ok) {
        const data = await response.json();
        setTalleres(data);
      }
    } catch (error) {
      console.error('Error al cargar talleres:', error);
    }
  };

  // Centro del mapa en Cali
  const center: [number, number] = [3.4516, -76.5320];

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Radio de búsqueda */}
        {userLocation && (
          <Circle
            center={userLocation}
            radius={1000}
            pathOptions={{
              color: '#00a19a',
              fillColor: '#00a19a',
              fillOpacity: 0.1,
              weight: 1
            }}
          />
        )}

        {/* Marcador de la ubicación del usuario */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: '<div class="w-4 h-4 bg-[#00a19a] rounded-full border-2 border-white pulse-animation"></div>',
              iconSize: [16, 16],
              iconAnchor: [8, 8],
            })}
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-white">Tu ubicación</p>
                <p className="text-sm text-gray-300">Radio de búsqueda: 1km</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marcadores de talleres */}
        {talleres.map((taller) => (
          <Marker
            key={taller.id}
            position={[taller.latitud, taller.longitud]}
            icon={tallerIcon}
            eventHandlers={{
              click: () => setSelectedTaller(taller),
            }}
          >
            <Popup>
              <div className="p-4 min-w-[250px]">
                <h3 className="font-bold text-lg mb-2 text-white">{taller.nombre}</h3>
                <p className="text-gray-300 mb-1">{taller.direccion}</p>
                <p className="text-gray-300 mb-3">Tel: {taller.telefono}</p>
                <button 
                  onClick={() => window.location.href = `/talleres/${taller.id}`}
                  className="bg-[#00a19a] text-white px-4 py-2 rounded-lg w-full hover:bg-[#008b85] transition-colors font-semibold"
                >
                  Ver detalles
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Estilos para la animación del pulso y el tema oscuro */}
      <style jsx global>{`
        .pulse-animation {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(0, 161, 154, 0.7);
          }
          
          70% {
            transform: scale(1.1);
            box-shadow: 0 0 0 10px rgba(0, 161, 154, 0);
          }
          
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(0, 161, 154, 0);
          }
        }

        .leaflet-container {
          background-color: #121212;
        }

        .leaflet-popup-content-wrapper {
          background-color: #1a1a1a;
          color: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }

        .leaflet-popup-tip {
          background-color: #1a1a1a;
        }

        .leaflet-popup-close-button {
          color: white !important;
        }

        .leaflet-control-zoom a {
          background-color: #1a1a1a !important;
          color: white !important;
          border-color: #333 !important;
        }

        .leaflet-control-zoom a:hover {
          background-color: #333 !important;
        }

        .leaflet-control-attribution {
          background-color: rgba(26, 26, 26, 0.8) !important;
          color: #666 !important;
        }

        .leaflet-control-attribution a {
          color: #00a19a !important;
        }
      `}</style>
    </div>
  );
} 