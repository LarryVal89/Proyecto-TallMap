// script.js
document.addEventListener("DOMContentLoaded", function () {
    // Crear el mapa
    var map = L.map('map').setView([19.4326, -99.1332], 13); // Coordenadas de ejemplo (CDMX)

    // Agregar capa de mapa (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Agregar un marcador
    L.marker([19.4326, -99.1332]).addTo(map)
        .bindPopup("<b>¡Aquí está un taller!</b><br>Ubicación del taller.")
        .openPopup();
});
