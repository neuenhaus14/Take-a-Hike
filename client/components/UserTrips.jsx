import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Outlet, Link, useLocation, useParams, 
} from 'react-router-dom';

const UserTrips = () => {
  const [myTrips, setMyTrips] = useState([]);
  const location = useLocation();
  const { state } = location;
  const { userId } = useParams();

  const getMyTrips = () => {
    axios.get(`/profile/userTrips/${userId}`)
      .then((trips) => {
        setMyTrips(trips.data);
      });
  };

  useEffect(() => {
    getMyTrips();
  }, []);

  const handleTripSelect = (event) => {
    const selectedTripId = event.target.value;
    // Perform any action you want with the selected trip
    console.log('Selected Trip ID:', selectedTripId);
  };

  return (
    <div className="trips">
      <select onChange={handleTripSelect}>
        <option value="">Select a trip</option>
        {myTrips.map((trip) => (
          <option key={trip.tripId} value={trip.tripId}>
            {trip.tripName}
          </option>
        ))}
      </select>
    </div>
  );
};
export default UserTrips;