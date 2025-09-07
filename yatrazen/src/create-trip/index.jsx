import React, {useEffect, useState} from 'react';
import { searchPlaces } from '../service/NominatimApi'; // <-- import the utility
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { SelectBudgetOptions, SelectTravelsList } from '../constants/options';
import { AI_PROMPT } from '../constants/options';
import { chatSession } from '../service/AIModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from "firebase/firestore"; 
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { db } from 'service/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { getLocationImageUrl, batchProcessImages } from '../service/GlobalApi'; // Add this import

const apiKey = import.meta.env.VITE_GOOGLE_PLACE_API_KEY; 

function                                                                                                                                CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();   // for navigating to the view-trip page

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }

  const handleInputChange = (name,value)=>{
    if(name=='noOfDays' && value>5) {
      console.log("Please enter Trip Days less than 5")
      return;
    }
    setFormData({
      ...formData,
      [name] : value
    })
  }

  const handlePlaceInput = async (e) => {
    const value = e.target.value;
    setPlace({ label: value });
    handleInputChange('location', { label: value });
    if (value.length > 2) {
      const results = await searchPlaces(value);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectPlace = (placeObj) => {
    setPlace({ label: placeObj.display_name });
    handleInputChange('location', { label: placeObj.display_name });
    setSearchResults([]);
  };

  useEffect(()=>{
    console.log(formData);
  }, [formData])

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.error('Login Failed:', error),
  })

  const onGenerateTrip=async ()=>{

    const user = localStorage.getItem('user');
    if(!user) {
      setOpenDialog(true)
      return;
    }

    if(formData?.noOfDays>5 && !formData?.location || !formData?.budget || !formData.traveler) {
      toast("Please fill all the details !!")
      return;
    }

    setLoading(true);

    // after user clicks on the generate trip button - update prompt
    const FINAL_PROMPT = AI_PROMPT
    .replace('{location}',formData?.location?.label)
    .replace('{totalDays}',formData?.noOfDays)
    .replace('{traveler}', formData?.traveler)
    .replace('{budget}', formData?.budget)
    .replace('{totalDays}',formData?.noOfDays)

    console.log(FINAL_PROMPT)

    const result = await chatSession.sendMessage(FINAL_PROMPT);

    console.log(result?.response?.text());
    setLoading(false);

    SaveAiTrip(result?.response?.text());

  }

  const SaveAiTrip = async(TripData) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user || !user.email) {
        toast.error("You must be logged in to save trips");
        setLoading(false);
        return;
      }
      
      // Parse trip data
      const cleanedTripData = TripData.replace(/```json\n?|```/g, '').trim();
      const tripDataObj = JSON.parse(cleanedTripData);
      
      // Get a location image URL for the main trip
      let locationImageUrl = null;
      if (formData?.location?.label) {
        try {
          locationImageUrl = await getLocationImageUrl(formData.location.label, 'trip');
        } catch (error) {
          console.error("Error getting location image:", error);
        }
      }
      
      // Process hotels in parallel to get images
      let enhancedHotels = tripDataObj.hotelOptions || [];
      if (enhancedHotels.length > 0) {
        const hotelPromises = enhancedHotels.map(async (hotel) => {
          if (!hotel.hotelImageUrl) {
            try {
              const searchQuery = `${hotel.hotelName} ${hotel.hotelAddress || ''}`;
              const imageUrl = await getLocationImageUrl(searchQuery, 'hotel');
              return { ...hotel, hotelImageUrl: imageUrl };
            } catch (error) {
              console.error(`Error getting image for hotel ${hotel.hotelName}:`, error);
              return hotel;
            }
          }
          return hotel;
        });
        enhancedHotels = await Promise.all(hotelPromises);
      }
      
      // Process places in parallel to get images
      let enhancedItinerary = tripDataObj.itinerary || [];
      if (enhancedItinerary.length > 0) {
        const itineraryPromises = enhancedItinerary.map(async (day) => {
          const places = day.places || [];
          if (places.length > 0) {
            const placesPromises = places.map(async (place) => {
              if (!place.placeImageUrl) {
                try {
                  const imageUrl = await getLocationImageUrl(place.placeName, 'place');
                  return { ...place, placeImageUrl: imageUrl };
                } catch (error) {
                  console.error(`Error getting image for place ${place.placeName}:`, error);
                  return place;
                }
              }
              return place;
            });
            const enhancedPlaces = await Promise.all(placesPromises);
            return { ...day, places: enhancedPlaces };
          }
          return day;
        });
        enhancedItinerary = await Promise.all(itineraryPromises);
      }
      
      // Create enhanced trip data with images
      const enhancedTripData = {
        ...tripDataObj,
        hotelOptions: enhancedHotels,
        itinerary: enhancedItinerary
      };
      
      // Add the image URL to the location data if found
      const enrichedFormData = {
        ...formData,
        location: {
          ...formData.location,
          imageUrl: locationImageUrl || null
        }
      };
      
      const docId = Date.now().toString();
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: enrichedFormData,
        tripdata: enhancedTripData,
        userEmail: user.email,
        id: docId
      });
      
      setLoading(false);
      navigate('/view-trip/' + docId);
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("Failed to save trip. Please try again.");
      setLoading(false);
    }
  }

  const GetUserProfile = (tokenInfo) => {
    console.log("Token Info: ", tokenInfo);
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      console.log("User Info: ", resp.data);  // Added .data to access the response data
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      onGenerateTrip();
    })
  }

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10 items-center w-screen'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences 🚙🌴</h2>
      <p className='mt-3 text-gray-500 text-xl'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences</p>

      <div className='mt-20 flex flex-col gap-10'>
        <div>
          <h2 className='text-xl my-3 font-medium'>What is your destination of choice?</h2>
          <input
            type="text"
            value={place?.label || ''}
            onChange={handlePlaceInput}
            placeholder="Search for a place"
            className="w-full border rounded-md p-2"
          />
          {searchResults.length > 0 && (
            <ul className="border rounded bg-white mt-1 max-h-48 overflow-y-auto">
              {searchResults.map((result) => (
                <li
                  key={result.place_id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectPlace(result)}
                >
                  {result.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip</h2>
          <Input placeholder={'Ex.3'} type="number"
            onChange = {(e)=>handleInputChange('noOfDays',e.target.value)}
          />
        </div>
            
        <div>
          <h2 className='text-xl my-3 font-medium'>What is Your Budget?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectBudgetOptions.map((item,index)=>(
              <div key={index}
               onClick = {()=>handleInputChange('budget',item.title)}
               className={`p-4 border rounded-lg hover:shadow-lg
                ${formData?.budget==item.title && 'shadow-lg border-red-800'}
               `}>
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>Who do you plan on travelling with on your next adventure?</h2>
          <div className='grid grid-cols-3 gap-5 mt-5'>
            {SelectTravelsList.map((item,index)=>(
              <div key={index}
               onClick={()=>handleInputChange('traveler', item.people)}
               className={`p-4 border rounded-lg hover:shadow-lg
                ${formData?.traveler==item.people && 'shadow-lg border-red-800'}
               `}>
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='my-10 justify-end flex'>
        <Button
         disabled={loading}
         onClick={onGenerateTrip}>
          {loading?
          (<AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' />) : ('Generate Trip')}
          </Button>
      </div>
      
      <Dialog open={openDialog} onOpenChange={handleCloseDialog} > 
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
          <img src="/yatrazen.png" className="h-[20px]" alt="" />
            <h2 className='font-bold text-lg mt-7'>Sign In With Google</h2>
            <span>Sign in to the app with google authentication securely</span>
            <Button
              disabled={loading}
              onClick={login}
              className="w-full mt-5 flex gap-4 items-center">
                <FcGoogle  />
                Sign In With Google
              </Button>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>


    </div>
  );
}

export default CreateTrip;
