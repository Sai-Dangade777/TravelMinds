import React, { useState } from 'react';
import HotelCardItem from './HotelCardItem';
import LeafletMap from "@/components/LeafletMap";
import { formatHotelsForMap } from '../../utils/mapUtils';
import SocialShare from '../../components/SocialShare'; // Import the component

function Hotels({ trip }) {
  const [showMap, setShowMap] = useState(false);
  const hotels = trip?.tripdata?.hotelOptions || [];
  const mapLocations = formatHotelsForMap(hotels);

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl mt-5 mb-2">Recommended Hotels</h2>
        <div className="flex gap-2">
          {/* Add Social Share Button */}
          <SocialShare 
            title={`Hotels for my trip to ${trip?.userSelection?.location?.label}`}
            description={`Check out these recommended hotels in ${trip?.userSelection?.location?.label} from my YatraZen trip plan!`}
          />
          <button 
            className="text-sm bg-black text-white px-3 py-1 rounded-md"
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? 'Hide Map' : 'Show on Map'}
          </button>
        </div>
      </div>
      
      {showMap && mapLocations.length > 0 && (
        <div className="mb-4 h-[400px]">
          <LeafletMap locations={mapLocations} />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {hotels.map((hotel, index) => (
          <HotelCardItem key={index} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}

export default Hotels;
