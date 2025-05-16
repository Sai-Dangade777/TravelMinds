import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../service/firebaseConfig';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  
  useEffect(() => {
    GetUserTrips();
  }, []);

  // Used to get all the trips for the logged-in user
  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/');
      return;
    }

    // If user exists, fetch the trips
    const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email));
    try {
      const querySnapshot = await getDocs(q);
      const trips = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        trips.push(doc.data()); // Collect all trips in an array
      });
      setUserTrips(trips); // Update the state with all the trips
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10 items-center w-screen'>
      <h2 className='font-bold text-3xl'>My Trips</h2>
      <div>
        <div className='grid grid-cols-2 mt-5 md:grid-cols-3 gap-5 object-cover'>
          {userTrips.length > 0 ? userTrips.map((trip, index) => (
            <UserTripCardItem key={index} trip={trip} />
          )) : [1, 2, 3, 4, 5, 6].map((item, index) => (
            <div key={index} className='h-[200px] w-full bg-slate-200 animate-pulse rounded-xl'>
              {/* Placeholder skeleton for loading */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyTrips;
