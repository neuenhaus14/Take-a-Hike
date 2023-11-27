import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Outlet, Link, useLocation, useParams, 
} from 'react-router-dom';

const UserTrips = () => {
  const [savedTrips, setSavedTrips] = useState([]);
  const location = useLocation();
  const { state } = location;
  const { userId } = useParams();
  const [myTrips, setMyTrips] = useState([]);
  const [displayState, setDisplayState] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [displayedTrip, setDisplayedTrip] = useState([]);

  const getMyTrips = () => {
    axios.get(`/profile/userTrips/${userId}`)
      .then((trips) => {
        console.log('successfully fetched saved trips, fetching user created trips now...');
        setSavedTrips(trips.data);
      })
      .then(() => {
        console.log('successfully fetched user created trips!');
        axios.get(`/profile/userCreatedTrips/${userId}`)
          .then((trips) => {
            setMyTrips(trips.data);
          })
          .catch((err) => console.error('something went wrong when fetching user created trips!', err));
      })
      .catch((err) => console.error('something went wrong when fetching saved trips!', err));
  };

  useEffect(() => {
    getMyTrips();
  }, []);

  const handleTripSelect = (event) => {
    const selectedTripId = event.target.value;
    // Perform any action you want with the selected trip
    console.log('Selected Trip ID:', selectedTripId);
    setSelectedTripId(selectedTripId);
    setDisplayState(true);
  };

  const searchTrip = () => {
    axios.get(`/profile/savedTrips/${selectedTripId}`)
      .then((trip) => {
        console.log('successfully fetched trip!', trip);
        setDisplayedTrip(trip.data)
      })
      .catch((err) => console.error('something went wrong when fetching trip!', err));
  };
 
  


  return (
    <div className="userTrips-main">
      <div className="premade-trip">
        <select onChange={handleTripSelect}>
          <option value="">Select a trip</option>
          {savedTrips.map((trip) => (
            <option key={trip.tripId} value={trip.tripId}>
              {trip.tripName}
            </option>
          ))}
        </select>
      </div>
      <div className="usermade-trip">
        <select onChange={handleTripSelect}>
          <option value="">Select a user created trip</option>
          {myTrips.map((trip) => (
            <option key={trip.tripId} value={trip.tripId}>
              {trip.tripName}
            </option>
          ))}
        </select>
        <button type="button" className="submit-selection" onClick={() => searchTrip(selectedTripId)}>
          Show trip details
        </button>
        <div className="trip-info">
          {displayState ? (
           <div>
            okkk

            </div>
          )
            : (<div />)}
        </div>
      </div>
    </div>
  );
};
export default UserTrips;