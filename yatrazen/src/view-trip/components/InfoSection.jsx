import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { IoIosSend } from "react-icons/io";
import { TRIP_PHOTO_URL, getLocationImageUrl } from '../../service/GlobalApi';

function InfoSection({ trip }) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(trip?.userSelection?.location?.imageUrl || TRIP_PHOTO_URL);

  // Fetch a better image for the location if not already present
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
    
    if (trip?.userSelection?.location?.label) {
      fetchImage();
    }
  }, [trip]);

  return (
    <div>
      <div className="relative h-[340px] w-full">
        {isLoading && (
          <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse rounded-xl flex items-center justify-center">
            <span className="text-gray-500">Loading image...</span>
          </div>
        )}
        <img
          src={imageUrl}
          alt="Trip Image"
          className={`absolute inset-0 w-full h-full object-cover rounded-xl ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            e.target.src = TRIP_PHOTO_URL;
            setIsLoading(false);
          }}
        />
      </div>
      <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-2'>
          <h2 className='font-bold text-2xl'>{trip?.userSelection?.location?.label}</h2>
          <div className='hidden sm:flex gap-5'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 font-bold text-xs md:text-md'>📅 {trip?.userSelection?.noOfDays} Day</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 font-bold text-xs md:text-md'>💰 {trip?.userSelection?.budget} Budget</h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 font-bold text-xs md:text-md'>🥂 No. Of Travelers: {trip?.userSelection?.traveler} </h2>
          </div>
        </div>
        <Button><IoIosSend /></Button>
      </div>
    </div>
  );
}

export default InfoSection;
