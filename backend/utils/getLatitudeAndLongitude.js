export async function getCoordinates(city, state) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city + ', ' + state)}&format=json&limit=1`;

  const response = await fetch(url);

  const data = await response.json();

  if (data.length === 0) {
    return { error: "Location not found" };
  }

  return {
    latitude: data[0].lat,
    longitude: data[0].lon
  };
}

