import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PHOTO_REF_URL, getLocationImageUrl } from '../../service/GlobalApi';

function HotelCardItem({ hotel }) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(hotel?.hotelImageUrl || PHOTO_REF_URL);

  // Fetch a better image for the hotel if not already present
  useEffect(() => {
    const fetchImage = async () => {
      if (!hotel?.hotelImageUrl && hotel?.hotelName) {
        try {
          // Create a more specific query string for better hotel images
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
    <Link
      to={`https://www.openstreetmap.org/search?query=${encodeURIComponent(hotel.hotelName + " " + hotel.hotelAddress)}`}
      target='_blank'
      className="text-black no-underline"
    >
      <div className='hover:scale-105 transition-all cursor-pointer text-black'>
        <div className='relative'>
          {isLoading && (
            <div className="rounded-xl h-[200px] w-full bg-gray-200 animate-pulse flex items-center justify-center">
              <span className="text-gray-500">Loading hotel image...</span>
            </div>
          )}
          <img
            src={imageUrl}
            alt={hotel?.hotelName || "Hotel"}
            className={`rounded-xl h-[200px] w-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onLoad={() => setIsLoading(false)}
            onError={(e) => {
              e.target.src = PHOTO_REF_URL;
              setIsLoading(false);
            }}
          />
        </div>
        <div className='my-5 flex flex-col gap-2'>
          <h2 className='font-bold'>{hotel?.hotelName}</h2>
          <h2 className='text-xs text-gray-500 font-medium'>📍 {hotel?.hotelAddress}</h2>
          <h2 className='text-sm font-medium'>💰 {hotel?.price}</h2>
          <h2 className='text-sm font-medium'>⭐ {hotel?.rating} stars</h2>
        </div>
      </div>
    </Link>
  );
}

export default HotelCardItem;