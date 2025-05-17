import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/ui/button';
import { FaMapLocationDot } from "react-icons/fa6";
import { PLACE_PHOTO_URL, getLocationImageUrl } from '../../service/GlobalApi';
import MapModal from '../../components/MapModal';

function PlaceCardItem({ place }) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(place?.placeImageUrl || PLACE_PHOTO_URL);
  const [showMap, setShowMap] = useState(false);
  
  // Format location data for map
  const mapLocation = place?.geoCoordinates ? {
    name: place.placeName,
    lat: place.geoCoordinates.latitude,
    lng: place.geoCoordinates.longitude,
    details: `${place.placeName}<br>${place.ticketPricing || ''}`
  } : null;

  // Fetch image logic...
  useEffect(() => {
    const fetchImage = async () => {
      if (!place?.placeImageUrl && place?.placeName) {
        try {
          const newImageUrl = await getLocationImageUrl(place.placeName, 'place');
          if (newImageUrl) {
            setImageUrl(newImageUrl);
          }
        } catch (error) {
          console.error("Error fetching place image:", error);
        }
      }
    };
    
    if (place?.placeName) {
      fetchImage();
    }
  }, [place]);

  return (
    <>
      <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer text-black'>
        <div className='w-[130px] h-[130px] relative flex-shrink-0'>
          {isLoading && (
            <div className='absolute inset-0 w-full h-full rounded-xl bg-gray-200 animate-pulse flex items-center justify-center'>
              <span className="text-gray-500 text-xs">Loading...</span>
            </div>
          )}
          <img
            src={imageUrl}
            alt={place.placeName}
            className={`absolute inset-0 w-full h-full rounded-xl object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onLoad={() => setIsLoading(false)}
            onError={(e) => {
              e.target.src = PLACE_PHOTO_URL;
              setIsLoading(false);
            }}
          />
        </div>
        <div>
          <h2 className='font-bold text-lg'>{place.placeName}</h2>
          <p className='text-sm text-gray-500'>{place.placeDetails}</p>
          <h2 className='mt-2 font-medium'>💵 {place.ticketPricing}</h2>
          <Button 
            className='mt-1 bg-red-500' 
            size="sm"
            onClick={() => setShowMap(true)}
          >
            <FaMapLocationDot className="mr-1" /> Let's Check
          </Button>
        </div>
      </div>
      
      {/* Map Modal */}
      <MapModal 
        isOpen={showMap} 
        onClose={() => setShowMap(false)}
        location={mapLocation}
        title={place.placeName}
      />
    </>
  );
}

export default PlaceCardItem;