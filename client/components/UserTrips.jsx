import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useParams } from 'react-router-dom';
const UserTrips = () => {
    // grab trips and set trips hook
    const [myTrips, setMyTrips] = useState([]);
    //define location so we can access state
    const location = useLocation()
    // destructure state from location, which is passed from UserProfile as a prop
    const { state } = location;
    const { userId } = useParams();
    // console.log('location state,', location);
    // console.log('userId', userId);
    // console.log('prop log', props);
    const getMyTrips = () => {
        axios.get(`/profile/userTrips/${userId}`)
            .then((trips) => {
            console.log('trips', trips);
            setMyTrips(trips.data);
        });
    }
    useEffect(() => {
        getMyTrips();
    }, [])
    return (
        <div className="trips">
           {myTrips.map((trip) => {
                return (
                     <div className="trip-card">
                          <h1>{trip.userId}</h1>
                          <p>{trip.tripId}</p>
                     </div>
                )
           })}
        </div>
    )
}
export default UserTrips;