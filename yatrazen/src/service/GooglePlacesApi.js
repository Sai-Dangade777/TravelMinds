export const fetchPlaces = async (location) => {
  const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(location)}&key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results; // Returns an array of places
};