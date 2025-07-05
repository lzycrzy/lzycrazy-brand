import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PropertyMap = ({ coordinates }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const popupContent = `
      <strong>Property Location</strong><br />
      ${coordinates.neighbourhood || ''}, ${coordinates.city || ''}, ${coordinates.state || ''}
    `;

  const location = coordinates.coordinates
  useEffect(() => {
    if (!location?.latitude || !location?.longitude) return;

    const { latitude, longitude } = location;
    const latLng = [latitude, longitude];

    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(latLng, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current);

      L.marker(latLng)
        .addTo(mapInstance.current)
        .bindPopup(popupContent)
        .openPopup();
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [coordinates]);


  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-semibold text-slate-900">Location</h3>
      <div
        ref={mapRef}
        className="h-72 w-full overflow-hidden rounded-lg border border-slate-200 lg:h-80"
      />
      <div className="flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-500">
          📍 {coordinates.latitude}°N, {coordinates.longitude}°E
        </p>
        <a href="#" className="font-medium text-blue-600 hover:underline">
          View larger map
        </a>
      </div>
    </div>
  );
};

export default PropertyMap;
