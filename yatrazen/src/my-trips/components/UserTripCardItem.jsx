import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TRIP_PHOTO_URL, getLocationImageUrl } from '../../service/GlobalApi';

function UserTripCardItem({trip}) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(trip?.userSelection?.location?.imageUrl || TRIP_PHOTO_URL);

  // Fetch a better image for the trip location if not already present
  useEffect(() => {
    const fetchImage = async () => {
      if (!trip?.userSelection?.location?.imageUrl && trip?.userSelection?.location?.label) {
        try {
          const locationName = trip.userSelection.location.label;
          const newImageUrl = await getLocationImageUrl(locationName, 'trip');
          if (newImageUrl) {
            setImageUrl(newImageUrl);
          }
        } catch (error) {
          console.error("Error fetching trip image:", error);
        }
      }
    };
    
    fetchImage();
  }, [trip]);

  return (
    <Link to={'/view-trip/'+trip?.id}>
        <div className='hover:scale-110 transition-all'>
            {isLoading && (
              <div className='rounded-xl w-[200px] h-[150px] md:h-[200px] md:w-[300px] bg-gray-200 animate-pulse flex items-center justify-center'>
                <span className="text-gray-500">Loading trip image...</span>
              </div>
            )}
            <img 
              className={`object-cover rounded-xl w-[200px] h-[150px] md:h-[200px] md:w-[300px] ${isLoading ? 'hidden' : 'block'}`}
              src={imageUrl}
              alt={trip?.userSelection?.location?.label || "Trip image"}
              onLoad={() => setIsLoading(false)}
              onError={(e) => {
                e.target.src = TRIP_PHOTO_URL;
                setIsLoading(false);
              }}
            />
            <div>
                <h2 className='font-bold text-lg text-black'>{trip?.userSelection?.location?.label}</h2>
                <h2 className='text-sm font-bold text-gray-500'>{trip?.userSelection?.noOfDays} Days trip with {trip?.userSelection?.budget} Budget</h2>
            </div>
        </div>
    </Link>
  )
}

export default UserTripCardItem