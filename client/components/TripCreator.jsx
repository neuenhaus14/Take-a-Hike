import React, { useEffect, useState } from 'react';
import { Outlet, Link, useParams } from 'react-router-dom';
import TrailsList from './TrailsList.jsx';
import axios from 'axios';

const TripCreator= () => {
    // grab userId from params
    const userId = useParams();
    //create a useState for userTrails
    const [userTrails, setUserTrails] = useState([]);
    //function to get trails stored in userTrails
    const getUserTrails = () => {
        //axios call to get trails from userTrails
        axios.get(`/profile/userTrips/${userId}`)
        .then(({data}) => {
            console.log('successfully retrieved user trips!', data)
            setUserTrails[data]
        })
        .catch(err => console.error(err))
    }
    useEffect(() => {
        getUserTrails();
    }, [])

    return (
        <div className="trip-creator-main">
            <h1> Trip Creator</h1>
            <Link to='/trip-creator/trails-list'>Search for a trail</Link>
            <Outlet />
        </div>
    )
}

export default TripCreator