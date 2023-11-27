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
  const [weatherForecast, setWeatherForecast] = useState([]);

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
    // const selectedTripId = event.target.value; 
    // Perform any action you want with the selected trip
    console.log('Selected Trip ID:', selectedTripId);
    setSelectedTripId(event.target.value);
  };
  const getWeatherForecast = () => {
    axios.get(`/api/joinedWeatherCreateTrips/${userId}/${selectedTripId}`)
      .then((weatherObj) => {
        console.log('successfully fetched weather forecast :D!', weatherObj);
        const { unique_id } = weatherObj.data[0];
        console.log('unique_id', unique_id);
        axios.get(`/api/weatherForecast/${unique_id}`)
          .then((forecast) => {
            console.log('successfully fetched weather forecast!', forecast);
            setWeatherForecast(forecast.data);
          })
          .catch((err) => console.error('something went wrong when fetching weather forecast!', err));
      });
  };
  useEffect(() => {
    console.log('weatherForecast', weatherForecast);
  }, [weatherForecast]);

  const searchTrip = () => {
    axios.get(`/profile/savedTrips/${selectedTripId}`)
      .then((trip) => {
        console.log('successfully fetched trip!', trip);
        setDisplayState(true);
        setDisplayedTrip(trip.data);
      })
      .catch((err) => console.error('something went wrong when fetching trip!', err));
  };

  const searchUserCreatedTrip = () => {
    axios.get(`/profile/savedUserCreatedTrips/${selectedTripId}`)
      .then((fetchedTrip) => {
        console.log('successfully fetched trip!', fetchedTrip);
        getWeatherForecast();
        setDisplayState(true);
        setDisplayedTrip(fetchedTrip.data);
      });
  };

  return (
    <div className="userTrips-main">
      <form className="saved-userTrips-form box">
        <div className="premade-trip">
          <select className="trips-select is-info" onChange={handleTripSelect}>
            <option value="">Select a trip</option>
            {savedTrips.map((trip) => (
              <option key={trip.tripId} value={trip.tripId}>
                {trip.tripName}
              </option>
            ))}
          </select>
          <button type="button" className="submit-selection" onClick={() => searchTrip(selectedTripId)}>
            Show trip details
          </button>
        </div>
        <div className="usermade-trip">
          <select className="trips-select is-info" onChange={handleTripSelect}>
            <option value="">Select a user created trip</option>
            {myTrips.map((trip) => (
              <option key={trip.tripId} value={trip.tripId}>
                {trip.tripName}
              </option>
            ))}
          </select>
          <button type="button" className="submit-selection" onClick={() => searchUserCreatedTrip(selectedTripId)}>
            Show trip details
          </button>
        </div>
        <br />
        <br />
        {displayState ? (
          <figure className="displayed-trip-card">
            <div className="trip-header">
              <h2 className="trip-name">Trip name: {displayedTrip.tripName}</h2>
            </div>
            <div className="trip-body-div">
              <h5 className="trip-description">Trip description: {displayedTrip.tripDescription || 'n/a'}</h5>
              <h5 className="trip-start-date">Trip start date: {displayedTrip.beginDate || 'n/a'}</h5>
              <h5 className="trip-end-date">Trip end date: {displayedTrip.endDate || 'n/a'}</h5>
            </div>
          </figure>
        )
          : (<div />)}
      </form>
      {/* <div className="trip-info">
        
      </div> */}
    </div>
  );
};
export default UserTrips;