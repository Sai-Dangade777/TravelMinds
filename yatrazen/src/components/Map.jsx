import React, { useEffect, useRef, useState } from 'react';

function Map({ locations = [], center, zoom = 12 }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Function to initialize the map
    const initializeMap = () => {
      if (!mapRef.current) return;
      
      try {
        // Default center if none provided
        const mapCenter = center || 
          (locations.length > 0 ? 
            { lat: parseFloat(locations[0].lat), lng: parseFloat(locations[0].lng) } : 
            { lat: 20.5937, lng: 78.9629 }); // Default to India's center
        
        const newMap = new window.google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom: zoom,
          mapTypeId: 'roadmap',
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });
        
        setMap(newMap);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing map:", error);
        setIsLoading(false);
      }
    };

    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
    } else {
      // If not loaded yet, use our helper function
      window.mapReady(initializeMap);
      
      // Also listen for the event as a fallback
      const handleMapsLoaded = () => initializeMap();
      document.addEventListener('google-maps-loaded', handleMapsLoaded, { once: true });
      
      return () => {
        document.removeEventListener('google-maps-loaded', handleMapsLoaded);
      };
    }
  }, [center, zoom]);

  // Update markers when locations or map changes
  useEffect(() => {
    if (!map || !locations || locations.length === 0) return;
    
    try {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      
      // Create new markers
      const newMarkers = locations.map((location) => {
        if (!location || !location.lat || !location.lng) return null;
        
        const position = { 
          lat: parseFloat(location.lat), 
          lng: parseFloat(location.lng) 
        };
        
        const marker = new window.google.maps.Marker({
          position,
          map,
          title: location.name || 'Location',
          animation: window.google.maps.Animation.DROP
        });
        
        // Add info window if details are provided
        if (location.details) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div>
                <h3>${location.name || 'Location'}</h3>
                <p>${location.details}</p>
              </div>
            `
          });
          
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        }
        
        return marker;
      }).filter(Boolean);
      
      setMarkers(newMarkers);
      
      // Fit bounds to show all markers
      if (newMarkers.length > 1) {
        const bounds = new window.google.maps.LatLngBounds();
        newMarkers.forEach(marker => {
          bounds.extend(marker.getPosition());
        });
        map.fitBounds(bounds);
      }
    } catch (error) {
      console.error("Error creating markers:", error);
    }
  }, [map, locations]);

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="h-full w-full rounded-lg" 
        style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.3s' }}
      ></div>
    </div>
  );
}

export default Map;