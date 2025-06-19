import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const PropertyMap = ({ coordinates }) => {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(coordinates, 13)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapInstance.current)

      L.marker(coordinates)
        .addTo(mapInstance.current)
        .bindPopup('Property Location<br>Sector 104, Noida')
        .openPopup()
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [coordinates])

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-semibold text-slate-900">Location</h3>
      <div ref={mapRef} className="h-72 lg:h-80 w-full rounded-lg overflow-hidden border border-slate-200" />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-xs">
        <p className="text-slate-500">
          📍 {coordinates[0].toFixed(2)}°N, {coordinates[1].toFixed(2)}°E
        </p>
        <a href="#" className="text-blue-600 hover:underline font-medium">View larger map</a>
      </div>
    </div>
  )
}

export default PropertyMap