import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/ui/button';
import { FaMapLocationDot } from "react-icons/fa6";
import { PHOTO_REF_URL, getLocationImageUrl } from '../../service/GlobalApi';
import MapModal from '../../components/MapModal';

function HotelCardItem({ hotel }) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(hotel?.hotelImageUrl || PHOTO_REF_URL);
  const [showMap, setShowMap] = useState(false);
  
  // Format location data for map
  const mapLocation = hotel?.geoCoordinates ? {
    name: hotel.hotelName,
    lat: hotel.geoCoordinates.latitude,
    lng: hotel.geoCoordinates.longitude,
    details: `${hotel.hotelName}<br>💰 ${hotel.price || 'N/A'}<br>⭐ ${hotel.rating || 'N/A'} stars`
  } : null;

  // Fetch a better image for the hotel if not already present
  useEffect(() => {
    const fetchImage = async () => {
      if (!hotel?.hotelImageUrl && hotel?.hotelName) {
        try {
          const searchQuery = `${hotel.hotelName} ${hotel.hotelAddress || ''}`;
          const newImageUrl = await getLocationImageUrl(searchQuery, 'hotel');
          if (newImageUrl) {
            setImageUrl(newImageUrl);
          }
        } catch (error) {
          console.error("Error fetching hotel image:", error);
        }
      }
    };
    
    if (hotel?.hotelName) {
      fetchImage();
    }
  }, [hotel]);

  return (
    <>
      {/* Ensure fixed height for entire card with flex column */}
      <div className='hover:scale-105 transition-all h-[400px] flex flex-col border rounded-xl shadow-sm overflow-hidden'>
        {/* Fixed height for image container */}
        <div className='h-[200px] relative w-full flex-shrink-0'>
          {isLoading && (
            <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
              <span className="text-gray-500">Loading hotel image...</span>
            </div>
          )}
          <img
            src={imageUrl}
            alt={hotel?.hotelName || "Hotel"}
            className={`absolute inset-0 w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onLoad={() => setIsLoading(false)}
            onError={(e) => {
              e.target.src = PHOTO_REF_URL;
              setIsLoading(false);
            }}
          />
        </div>
        
        {/* Fixed height content area with flex arrangement */}
        <div className='p-4 flex flex-col flex-grow justify-between'>
          {/* Content section */}
          <div className='space-y-1'>
            <h2 className='font-bold text-base line-clamp-1'>{hotel?.hotelName}</h2>
            <h2 className='text-xs text-gray-500 font-medium line-clamp-1'>📍 {hotel?.hotelAddress}</h2>
            <h2 className='text-sm font-medium'>💰 {hotel?.price}</h2>
            <h2 className='text-sm font-medium'>⭐ {hotel?.rating} stars</h2>
          </div>
          
          {/* Button always at the bottom */}
          <div className='mt-auto pt-2'>
            <Button 
              className='w-full bg-red-500' 
              size="sm"
              onClick={() => setShowMap(true)}
            >
              <FaMapLocationDot className="mr-1" /> Let's Check
            </Button>
          </div>
        </div>
      </div>
      
      {/* Map Modal */}
      <MapModal 
        isOpen={showMap} 
        onClose={() => setShowMap(false)}
        location={mapLocation}
        title={hotel?.hotelName}
      />
    </>
  );
}

export default HotelCardItem;