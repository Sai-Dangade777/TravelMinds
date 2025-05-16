import React from 'react';
import PlaceCardItem from './PlaceCardItem';

function PlacesToVisit({ trip }) {
    console.log(trip?.tripdata?.itinerary);
    
  return (
    <div>
      <h2 className="font-bold text-xl mt-5 mb-2">Places to Visit</h2>
      <div>
        {trip?.tripdata?.itinerary?.map((item, index) => (
          <div key={index} className="mb-2 mt-5">
            <h2 className="font-bold text-lg">➡️Day {item.day} </h2>
            <div className='grid md:grid-cols-2 gap-5'>
            {item.places.map((place, index)=>(
                <div key={index} className='my-3'>
                    <h2 className='font-medium text-sm text-orange-600'>{place.timeToTravel}</h2>
                    <PlaceCardItem place={place} />
                </div>
            ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacesToVisit;
