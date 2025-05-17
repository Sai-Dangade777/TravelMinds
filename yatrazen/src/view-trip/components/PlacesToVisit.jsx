import React, { useState } from 'react';
import PlaceCardItem from './PlaceCardItem';
import Map from '../../components/Map';
import { formatPlacesForMap } from '../../utils/mapUtils';

function PlacesToVisit({ trip }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const itinerary = trip?.tripdata?.itinerary || [];
  
  // Get all places for the selected day or all days if "All Days" is selected
  const getAllPlacesForSelectedDay = () => {
    if (selectedDay === null) {
      // Return an empty array for "All Days" - we'll show individual day maps instead
      return [];
    } else if (itinerary[selectedDay]) {
      // Return places for specific day
      return itinerary[selectedDay].places || [];
    }
    return [];
  };

  // Get places for map display
  const dayPlaces = getAllPlacesForSelectedDay();
  
  // Format places for map
  const mapLocations = formatPlacesForMap(dayPlaces);
  
  return (
    <div>
      <h2 className="font-bold text-xl mt-5 mb-2">Places to Visit</h2>
      
      {itinerary.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <button
            className={`px-3 py-1 rounded-full ${selectedDay === null ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setSelectedDay(null)}
          >
            All Days
          </button>
          
          {itinerary.map((day, idx) => (
            <button
              key={idx}
              className={`px-3 py-1 rounded-full ${selectedDay === idx ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setSelectedDay(idx)}
            >
              Day {day.day}
            </button>
          ))}
        </div>
      )}
      
      {/* Show map for selected day (but not for "All Days") */}
      {selectedDay !== null && mapLocations.length > 0 && (
        <div className="mb-6 border rounded-lg p-2 shadow-sm">
          <h3 className="text-sm text-gray-600 mb-2">Day {itinerary[selectedDay]?.day} Map Overview:</h3>
          <div className="h-[400px]">
            <Map locations={mapLocations} />
          </div>
        </div>
      )}
      
      {/* Show individual day sections */}
      {itinerary.map((item, index) => (
        <div 
          key={index} 
          className="mb-8 mt-5"
          style={{ display: selectedDay === null || selectedDay === index ? 'block' : 'none' }}
        >
          <h2 className="font-bold text-lg flex items-center gap-2">
            <span className="bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center">
              {item.day}
            </span> 
            Day {item.day}
          </h2>
          
          {/* Show map for individual days when in "All Days" view */}
          {selectedDay === null && item.places && item.places.length > 0 && (
            <div className="mb-4 mt-2">
              <div className="h-[250px] rounded-lg overflow-hidden">
                <Map locations={formatPlacesForMap(item.places)} />
              </div>
            </div>
          )}
          
          <div className='grid md:grid-cols-2 gap-5'>
            {item.places.map((place, index) => (
              <div key={index} className='my-3'>
                <h2 className='font-medium text-sm text-orange-600'>{place.timeToTravel}</h2>
                <PlaceCardItem place={place} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlacesToVisit;
