/**
 * Format hotel data for map display
 * @param {Array} hotels - Array of hotel objects
 * @returns {Array} - Formatted hotel locations for map
 */
export const formatHotelsForMap = (hotels = []) => {
  if (!hotels || !Array.isArray(hotels)) return [];
  
  return hotels.map(hotel => {
    if (!hotel || !hotel.geoCoordinates) return null;
    
    return {
      name: hotel.hotelName || 'Hotel',
      lat: hotel.geoCoordinates.latitude,
      lng: hotel.geoCoordinates.longitude,
      details: `${hotel.hotelName}<br>💰 ${hotel.price || 'N/A'}<br>⭐ ${hotel.rating || 'N/A'} stars`
    };
  }).filter(Boolean);
};

/**
 * Format places data for map display
 * @param {Array} places - Array of place objects
 * @returns {Array} - Formatted place locations for map
 */
export const formatPlacesForMap = (places = []) => {
  if (!places || !Array.isArray(places)) return [];
  
  return places.map(place => {
    if (!place || !place.geoCoordinates) return null;
    
    return {
      name: place.placeName || 'Place',
      lat: place.geoCoordinates.latitude,
      lng: place.geoCoordinates.longitude,
      details: `${place.placeName}<br>${place.ticketPricing || ''}`
    };
  }).filter(Boolean);
};