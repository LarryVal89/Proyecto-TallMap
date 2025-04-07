import dynamic from 'next/dynamic';

// Importar el componente Map dinámicamente para evitar errores de SSR
const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  ),
});

export default function MapaPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mapa de Talleres</h1>
        <p className="text-gray-600">Encuentra talleres cerca de tu ubicación</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre o dirección"
            className="input-field flex-1"
          />
          <select className="input-field w-full md:w-auto">
            <option value="">Todos los servicios</option>
            <option value="mecanica">Mecánica general</option>
            <option value="electricidad">Electricidad</option>
            <option value="pintura">Pintura</option>
            <option value="hojalateria">Hojalatería</option>
          </select>
          <button className="btn-primary whitespace-nowrap">
            Buscar
          </button>
        </div>

        <Map />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-2">Filtros</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Abierto ahora
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Con estacionamiento
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Acepta tarjetas
            </label>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-2">Ordenar por</h3>
          <select className="input-field">
            <option value="distancia">Distancia</option>
            <option value="calificacion">Calificación</option>
            <option value="precio">Precio</option>
          </select>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-2">Radio de búsqueda</h3>
          <input
            type="range"
            min="1"
            max="50"
            defaultValue="10"
            className="w-full"
          />
          <p className="text-sm text-gray-600 mt-1">10 km</p>
        </div>
      </div>
    </div>
  );
} 