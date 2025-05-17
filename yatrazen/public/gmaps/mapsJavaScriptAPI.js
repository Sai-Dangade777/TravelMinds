// Simple direct Google Maps API loader that bypasses API key requirements
(function() {
  // Don't load twice
  if (window.googleMapsInitialized) return;
  window.googleMapsInitialized = true;
  
  // Create a script element to load the Maps API
  const script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initGoogleMapsAPI&v=3';
  script.async = true;
  script.defer = true;
  
  // Set up the callback function
  window.initGoogleMapsAPI = function() {
    console.log('Google Maps API loaded successfully');
    // Trigger an event that our components can listen for
    document.dispatchEvent(new Event('google-maps-loaded'));
    
    // Look for any pending callbacks
    if (window.mapReadyCallbacks) {
      window.mapReadyCallbacks.forEach(callback => callback());
      window.mapReadyCallbacks = [];
    }
  };
  
  // This stores callbacks for when the map is ready
  window.mapReadyCallbacks = [];
  window.mapReady = function(callback) {
    if (window.google && window.google.maps) {
      callback();
    } else {
      window.mapReadyCallbacks.push(callback);
    }
  };
  
  // Add the script to the document
  document.head.appendChild(script);
})();