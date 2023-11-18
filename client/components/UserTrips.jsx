import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useParams } from 'react-router-dom';
const UserTrips = (props) => {
    //define location so we can access state
    const location = useLocation()
    // destructure state from location, which is passed from UserProfile as a prop
    const { state } = location;
    const { userId } = useParams();
    console.log('location state,', location);
    console.log('userId', userId);
    console.log('prop log', props);
    const [myTrips, setMyTrips] = useState([]);
    return (
        <div className="trips">
            <h1> test</h1>
        </div>
    )
}
export default UserTrips;