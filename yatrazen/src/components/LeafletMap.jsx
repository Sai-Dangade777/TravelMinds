import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LeafletMap({ locations = [], center = [20.5937, 78.9629], zoom = 12 }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null); // To store the Leaflet map instance

  useEffect(() => {
    // Initialize the map only if it hasn't been initialized yet
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView(center, zoom);

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      mapInstanceRef.current = map; // Store the map instance
    }

    // Add markers for locations
    const map = mapInstanceRef.current;
    const markers = locations.map((location) => {
      if (location.lat && location.lng) {
        return L.marker([location.lat, location.lng])
          .addTo(map)
          .bindPopup(location.name || "Location");
      }
      return null;
    });

    // Cleanup markers on re-render
    return () => {
      markers.forEach((marker) => {
        if (marker) {
          map.removeLayer(marker);
        }
      });
    };
  }, [locations, center, zoom]);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }}></div>;
}

export default LeafletMap;